import React, { useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import ZeroItems from '../../components/ZeroItems';
import { useReactToPrint } from 'react-to-print';
import { getAlertLevelBadge, getRiskLevelBadge } from '../../../../lib/utils_Jsx';
import ErrorMsg2 from '../../components/ErrorMsg2';
import { isoToDateTime } from '../../../../lib/utils';
import { getAdminState, setAdminState } from '../../../../redux/slices/adminState';
import supabase from '../../../../database/dbInit';
import { FaArrowLeft, FaCheckCircle } from 'react-icons/fa';
import Modal from '../../components/ui/Modal';
import { appLoadStart, appLoadStop } from '../../../../redux/slices/appLoadingSlice';

const TestInfoModal = ({ show, onClose, data }) => {
    const dispatch = useDispatch()

    const containerRef = useRef(null)

    const highRiskAlerts = useSelector(state => getAdminState(state).highRiskAlerts)

    const [apiReqs, setApiReqs] = useState({ isLoading: false, errorMsg: null })
    const [testQuestions, setTestQuestions] = useState([])

    const exportElementToPdf = useReactToPrint({
        contentRef: containerRef
    });   
    
    useEffect(() => {
        const { isLoading, data } = apiReqs

        if(isLoading) dispatch(appLoadStart());
        else dispatch(appLoadStop())

        if(isLoading && data){
            const { type, requestInfo } = data

            if(type === 'markAsViewed'){
                markAsViewed({ requestInfo })
            }

            if(type === 'fetchTestResults'){
                fetchTestResults({ requestInfo })
            }
        }

    }, [apiReqs])    

    useEffect(() => {
        if(data){
            // fetchTestResults({ answer: data?.answer })
            setApiReqs({
                isLoading: true,
                errorMsg: null,
                data: {
                    type: 'fetchTestResults',
                    requestInfo: {
                        answer: data?.answer
                    }
                }
            })            
        }
    }, [data])

    const screening_id = data?.id
    const highRiskAlertNotViewed = (highRiskAlerts || [])?.filter(risk_alert => (risk_alert?.screening_id === screening_id) && (risk_alert?.viewed === false))[0]

    const markAsViewed = async () => {
        try {

            if(!highRiskAlertNotViewed) return;        

            const { data, error } = await supabase
                .from('high_risk_alerts')
                .update({ viewed: true })
                .eq("screening_id", screening_id)

            if(error){
                console.log(error)
                throw new Error()
            }

            const updatedHighRiskAlerts = (highRiskAlerts || [])?.map(risk_alert => {
                if(risk_alert?.screening_id == screening_id){
                    return {
                        ...risk_alert,
                        viewed: true
                    }
                }

                return risk_alert
            })

            dispatch(setAdminState({
                highRiskAlerts: updatedHighRiskAlerts
            }))

            setApiReqs({ isLoading: false, errorMsg: null })

            toast.success("Marked as viewed")
            
        } catch (error) {
            console.log(error)
            return markAsViewedFailure({ errorMsg: 'Something went wrong! Try again' })
        }
    }
    const markAsViewedFailure = ({ errorMsg }) => {
        setApiReqs({ isLoading: false, errorMsg })
        toast.error(errorMsg)

        return;
    }

    const fetchTestResults = async ({ requestInfo }) => {
        try {

            const { answer } = requestInfo
            
            const questionIds = answer?.map(ans => ans.question_id)

            const { data: questions, error } = await supabase
                .from('questions')
                .select('*')
                .in("id", questionIds)

            if(error){
                console.log(error)
                throw new Error()
            }

            const groupedQuestions = questions.map((ques => {
                const _answer = answer.filter(ans => ans.question_id == ques.id).map(ans => ans.answer)[0]

                return {
                    ...ques,
                    answer: _answer
                }
            }))

            setTestQuestions(groupedQuestions)

            setApiReqs({ isLoading: false, errorMsg: null })
            
        } catch (error) {
            console.log(error)
            return fetchReportDataFailure({ errorMsg: 'Something went wrong! Try again.' })
        }
    }
    const fetchReportDataFailure = ({ errorMsg }) => {
        setApiReqs({ isLoading: false, errorMsg: null })
        toast.error(errorMsg)

        return
    }

    const closeModal = () => {
        setTestQuestions([])
        onClose && onClose()

        return;
    }

    const handleViewed = () => {
        return setApiReqs({
            isLoading: true,
            errorMsg: null,
            data: {
                type: 'markAsViewed',
                requestInfo: {}
            }
        })
    }    

    if (!show || !data) return null;
    
    const { test_date, user_id, score, risk_level } = data

    const answerInfo = data?.answer

    return (
        <Modal
            onClose={onClose}
            isOpen={show}
        >
            <div className="">
                {/* Header */}
                <div className="flex items-start justify-between p-6 pb-4">
                    <div>
                        <button 
                            onClick={closeModal}
                            className="flex mb-2 cursor-pointer items-center text-purple-600 font-medium"
                        >
                            <FaArrowLeft className="w-5 h-5 mr-2" />
                            Back
                        </button>

                        <div className='flex flex-col gap-1'>
                            <button onClick={exportElementToPdf} className="cursor-pointer bg-purple-100 text-purple-600 px-6 py-2 rounded-lg font-medium">
                                Download PDF
                            </button>    

                            {
                                highRiskAlertNotViewed
                                &&
                                    <button onClick={handleViewed} className="cursor-pointer bg-purple-600 text-white px-6 py-2 rounded-lg font-medium">
                                        Mark as viewed
                                    </button>                                                                                            
                            }
                        </div>
                    </div>
                    
                    <div>
                        <p className='text-base m-0 p-0 mb-1 text-end text-right fw-500 text-000'>
                            { isoToDateTime({ isoString: new Date(test_date).toISOString() }) }
                        </p>
                        <p className='text-base m-0 p-0  mb-1 text-end text-right fw-500 text-000'>
                            Score: { score }
                        </p>
                        <div className='text-base m-0 p-0 text-end text-right fw-500 text-000'>
                            Risk level (Score): { getRiskLevelBadge(risk_level) }
                        </div>                                                        
                    </div>
                </div>       

                <div ref={containerRef} style={{ overflowY: 'auto' }}>
                    <div className="flex flex-col">

                        <div className='p-6'>
                            {
                                apiReqs.errorMsg
                                ?
                                    <ErrorMsg2 
                                        errorMsg={apiReqs.errorMsg}
                                    />
                                :
                                testQuestions?.length > 0
                                ?
                                    <div>
                                        {
                                            testQuestions.map((ques, i) => {
                                                const { prompt, type, options, answer, id } = ques

                                                const answerInfoForQues = (answerInfo || []).filter(info => info?.question_id == id)[0]

                                                return(
                                                    <div
                                                        key={i}
                                                        className='mb-6'
                                                    >
                                                        <div className='flex items-start gap-1 mb-3'>
                                                            <p className='m-0 p-0 text-xl txt-000 fw-900 txt-15'>
                                                                {i+1}.
                                                            </p>

                                                            <p className='m-0 p-0 text-xl txt-000 fw-500 txt-15'>
                                                                { prompt }
                                                            </p>
                                                        </div>

                                                        <div>
                                                            {
                                                                options?.map((opt, optIndex) => {
                                                                    const { label, value } = opt

                                                                    const isAnswer = value == answer ? true : false

                                                                    return(
                                                                        <div
                                                                            key={optIndex}
                                                                            className='mb-1 flex items-center gap-4'
                                                                        >
                                                                            <p className='max:w-3/5 m-0 p-0 text-sm txt-000 fw-500 txt-15'>
                                                                                {label}
                                                                            </p>

                                                                            {
                                                                                isAnswer
                                                                                &&
                                                                                    <>
                                                                                        <FaCheckCircle 
                                                                                            size={20}
                                                                                            color='#6F3DCB'
                                                                                        />

                                                                                        {
                                                                                            answerInfoForQues?.alert_level
                                                                                            &&
                                                                                                <>
                                                                                                    { getAlertLevelBadge(answerInfoForQues?.alert_level) }
                                                                                                    
                                                                                                    {
                                                                                                        answerInfoForQues?.risk_percent >= 0
                                                                                                        && 
                                                                                                            <p className='px-3 py-1 rounded-full text-sm font-medium'>
                                                                                                                Answer risk - { answerInfoForQues?.risk_percent } %
                                                                                                            </p>                                                                                                    
                                                                                                    }                                                                                                             
                                                                                                </>
                                                                                        }                                                                                       
                                                                                    </>
                                                                            }
                                                                        </div>
                                                                    )
                                                                })
                                                            }
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                :
                                    <ZeroItems
                                        zeroText={"Questions will appear here"}
                                    />                                
                            }
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default TestInfoModal;