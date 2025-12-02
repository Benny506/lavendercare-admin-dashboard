import { ErrorMessage, Formik } from 'formik';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import * as yup from 'yup'
import ErrorMsg1 from '../../components/ErrorMsg1';
import HourSelect from '../../components/HourSelect';
import Modal from '../../components/ui/Modal';
import { timeToAMPM_FromHour } from '../../../../lib/utils';


function reorderDays(obj) {
    const order = [
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
    ];

    const sortedObj = {};

    order.forEach(day => {
        if (obj.hasOwnProperty(day)) {
            sortedObj[day] = obj[day];
        }
    });

    return sortedObj;
}


const SetServiceHours = ({
    info = {
        monday: { opening: '', closing: '' },
        tuesday: { opening: '', closing: '' },
        wednesday: { opening: '', closing: '' },
        thursday: { opening: '', closing: '' },
        friday: { opening: '', closing: '' },
        saturday: { opening: '', closing: '' },
        sunday: { opening: '', closing: '' }
    },
    isOpen,
    hide = () => { },
    goBackBtnFunc = () => { },
    continueBtnFunc = () => { },
}) => {

    const [days, setDays] = useState(info)

    const [selectedDay, setSelectedDay] = useState('monday')

    const onContinue = () => {
        const dayKeys = Object.keys(days)

        let hasValue = false

        for (let i = 0; i < dayKeys.length; i++) {
            const day = days[dayKeys[i]]

            if (day.opening && day.closing) {
                hasValue = true
                break
            }
        }

        if (!hasValue) {
            toast.info("Select at least one availability")
            return;
        }

        continueBtnFunc(days)
    }

    const reorderedDays = reorderDays(days)

    return (
        <>
            {isOpen && (
                <Modal
                    isOpen={isOpen}
                    title="Set Availability"
                    onClose={hide}
                >
                    <h2 className={`text-lg font-semibold text-center text-gray-800`}>
                        Availability
                    </h2>

                    <div className='border border-gray-100 rounded-md flex w-full'>
                        <div className='border-r border-gray-100 py-4 pb-2 px-2  space-y-4 flex flex-wrap flex-col items-center lg:mb-0 mb-4 font-semibold text-sm'>
                            {Object.keys(reorderedDays).map((day, index) => {

                                const active = day === selectedDay ? true : false

                                const handleDayClick = () => setSelectedDay(day)

                                return (
                                    <div key={day} onClick={handleDayClick} className={`w-full text-center py-3 ${active ? "text-gray-50 bg-purple-500" : "cursor-pointer hover:bg-gray-100"} p-2 rounded-lg`}>
                                        <p className='capitalize'>{day}</p>
                                    </div>
                                )
                            }
                            )}
                        </div>

                        <div>
                            <Formik
                                validationSchema={yup.object().shape({
                                    start_hour: yup.string()
                                        .required("Start hour is required"),
                                    end_hour: yup.string()
                                        .required("End hour is required")
                                        .test("is-greater", "End hour must be later than start hour", function (value) {
                                            const { start_hour } = this.parent;
                                            if (!start_hour || !value) return false;

                                            // Convert to minutes for easy comparison
                                            const [sh, sm] = start_hour.split(":").map(Number);
                                            const [eh, em] = value.split(":").map(Number);

                                            const startTotal = sh * 60 + sm;
                                            const endTotal = eh * 60 + em;

                                            return endTotal > startTotal;
                                        })
                                })}
                                initialValues={{
                                    start_hour: '', end_hour: ''
                                }}
                                onSubmit={(values, { resetForm }) => {
                                    const { start_hour, end_hour } = values

                                    const [sh, sm] = start_hour.split(":").map(Number);
                                    const [eh, em] = end_hour.split(":").map(Number);

                                    setDays(prev => ({
                                        ...prev,
                                        [selectedDay]: { opening: sh, closing: eh }
                                    }))

                                    resetForm()
                                }}
                            >
                                {({ handleBlur, handleChange, handleSubmit, isValid, dirty, values }) => (
                                    <div className='py-7 flex flex-col items-start justify-center px-4 gap-4'>
                                        <div className=''>
                                            {
                                                days[selectedDay]?.opening
                                                    ?
                                                    <p className=''>
                                                        {timeToAMPM_FromHour({ hour: days[selectedDay]?.opening })} - {timeToAMPM_FromHour({ hour: days[selectedDay]?.closing })}
                                                    </p>
                                                    :
                                                    <p className=''>
                                                        Not set
                                                    </p>
                                            }
                                        </div>

                                        <div className=''>
                                            <label className=''>Opening at</label>
                                            <br />
                                            <HourSelect
                                                name="start_hour"
                                                value={values.start_hour}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                required
                                            />
                                            <ErrorMessage name='start_hour'>
                                                {errorMsg => <ErrorMsg1 errorMsg={errorMsg} />}
                                            </ErrorMessage>
                                        </div>

                                        <div className=''>
                                            <label className=''>Closing at</label>
                                            <br />
                                            <HourSelect
                                                name="end_hour"
                                                value={values.end_hour}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                required
                                            />
                                            <ErrorMessage name='end_hour'>
                                                {errorMsg => <ErrorMsg1 errorMsg={errorMsg} />}
                                            </ErrorMessage>
                                        </div>

                                        <button
                                            onClick={handleSubmit}
                                            className={'bg-purple-600 text-white px-3 py-1 rounded-lg'}
                                        >
                                            Set
                                        </button>
                                    </div>
                                )}
                            </Formik>
                        </div>
                    </div>

                    <div className={`flex justify-center w-full gap-3 mt-10`}>
                        {goBackBtnFunc && (
                            <button
                                onClick={goBackBtnFunc}
                                className={`w-1/2 cursor-pointer px-4 py-2 bg-gray-200 text-gray-600 rounded-4xl`}
                            >
                                Go back
                            </button>
                        )}
                        {continueBtnFunc && (
                            <button
                                onClick={onContinue}
                                className={`cursor-pointer w-1/2 px-4 py-2 bg-purple-700 text-white rounded-4xl`}
                            >
                                Continue
                            </button>
                        )}
                    </div>
                </Modal>
            )
            }
        </>
    )
}

export default SetServiceHours  