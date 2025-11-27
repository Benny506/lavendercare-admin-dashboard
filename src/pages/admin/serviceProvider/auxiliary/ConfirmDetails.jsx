import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import Modal from '../../components/ui/Modal'
import supabase from '../../../../database/dbInit'
import { appLoadStart, appLoadStop } from '../../../../redux/slices/appLoadingSlice'
import { getUserDetailsState, setUserDetails } from '../../../../redux/slices/userDetailsSlice'
import Modal2 from '../../components/ui/Modal2'
import VendorServices from './VendorServices'
import { useNavigate } from 'react-router-dom'

const ConfirmDetails = ({ 
  isOpen, 
  hide,
  goBackBtnFunc,
  info,
  vendor,
  setVendorServices = () => {},
  vendorServices = [],
  continueBtnFunc
}) => {

  const dispatch = useDispatch()

  const navigate = useNavigate()

  const profile = useSelector(state => getUserDetailsState(state).profile)
  const services = useSelector(state => getUserDetailsState(state).services)

  const [apiReqs, setApiReqs] = useState({ isLoading: false, data: null, errorMsg: null })

  useEffect(() => {
    const { isLoading, data } = apiReqs

    if(isLoading) dispatch(appLoadStart());
    else dispatch(appLoadStop());

    if(isLoading && data){
      const { type, requestInfo } = data

      if(type == 'createService'){
        createService({ requestInfo })
      }
    }
  }, [apiReqs])

  const createService = async ({ requestInfo }) => {
    try {

      const { data, error } = await supabase
        .from('services')
        .insert({
          ...requestInfo,
          vendor_id: vendor?.id,
          status: 'approved',
          admin_id: profile?.id
        })
        .select()
        .single()

      if(error){
        console.log(error)
        throw new Error()
      }

      const updatedServices = [data, ...(services || [])]
      const updatedVendorServices = [data, ...(vendorServices || [])]

      setVendorServices(updatedVendorServices)

      setApiReqs({ isLoading: false, data: null, errorMsg: null })

      dispatch(appLoadStop())
      dispatch(setUserDetails({ services: updatedServices }))

      continueBtnFunc()

      toast.success("Service added")

      toast.info("Now create session types for this service!")

      navigate('/admin/service-provider/single-vendor/service-details', { state: { service: data, vendor } })
      
    } catch (error) {
      console.log(error)
      return createServiceFailure({ errorMsg: 'Something went wrong! Try again' })
    }
  }
  const createServiceFailure = ({ errorMsg }) => {
    setApiReqs({ isLoading: false, errorMsg, data: null })
    toast.error(errorMsg)

    return;
  }

  if(!isOpen) return <></>

  const handleConfirm = () => {
    try {
      const { details } = info
      const { serviceInfo, availability } = details

      if(!serviceInfo || !availability){
        toast.error("Some fields were not field, go back and confirm")
        return
      }

      const requestInfo = {
        ...serviceInfo,
        availability
      }

      setApiReqs({ 
        isLoading: true,
        errorMsg: null,
        data: {
          type: 'createService',
          requestInfo
        }
      })

    } catch (error) {
      toast.error("Uh-oh, something went wrong! Try again.")
      return
    }
  }

  return (
    <Modal2
      image="/assets/brush-square.svg"
      title="Confirm details"
      description="Ensure all your service details are complete before clicking confirm."
      primaryButton="Confirm"
      primaryButtonFunc={handleConfirm}
      onClose={hide}
      secondaryButton="Check details"
      secondaryButtonFunc={goBackBtnFunc}
      styles={{
        wrapper: "max-w-xs md:max-w-md",
        image: "mt-10",
        description: "text-center text-gray-500 mt-2 mb-20",
        footer: "flex flex-col gap-3 mt-6 w-full",
        primaryButton: "w-full px-5 py-3 bg-purple-700 text-gray-50 rounded-4xl font-semibold mb-1",
        secondaryButton: "w-full px-5 py-3 bg-purple-50 text-purple-700 rounded-4xl font-semibold"
      }}
    />
  )
}

export default ConfirmDetails