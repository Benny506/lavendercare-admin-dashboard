import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAdminState } from "../../../redux/slices/adminState";
import { formatNumberWithCommas } from "../../../lib/utils";
import { GoDotFill } from "react-icons/go";
import useApiReqs from "../../../hooks/useApiReqs";
import { appLoadStart, appLoadStop } from "../../../redux/slices/appLoadingSlice";
import { toast } from "react-toastify";
import supabase, { getAdminDetails } from "../../../database/dbInit";
import PathHeader from "../components/PathHeader";
import { getUserDetailsState } from "../../../redux/slices/userDetailsSlice";

function Dashboard() {
  const dispatch = useDispatch()

  const profile = useSelector(state => getUserDetailsState(state).profile)

  const [info, setInfo] = useState({
    totalProviders: 0,
    totalVendors: 0,
    totalMothers: 0,
    pendingProvidersCount: 0,
    pendingServicesCount: 0
  })
  const [apiReqs, setApiReqs] = useState({ isLoading: false, errorMsg: null, data: null })

  useEffect(() => {
    setApiReqs({
      isLoading: true,
      errorMsg: null,
      data: {
        type: 'initialize'
      }
    })
  }, [])

  useEffect(() => {
    const { isLoading, data } = apiReqs

    if(isLoading) dispatch(appLoadStart());
    else dispatch(appLoadStop());

    if(isLoading && data){
      const { type } = data

      if(type == 'initialize'){
        initialize()
      }
    }
  }, [apiReqs])

  // const mothers = useSelector(state => getAdminState(state).mothers)
  // const vendors = useSelector(state => getAdminState(state).vendors)
  // const providers = useSelector(state => getAdminState(state).providers)
  // const vendorServices = useSelector(state => getAdminState(state).vendorServices)

  const initialize = async () => {
    try {

      const { count: totalMothers, error: totalMothersError } = await supabase
        .from("user_profiles")
        .select("*", { count: "exact", head: true })

      const { count: totalProviders, error: totalProvidersError } = await supabase
        .from("provider_profiles")
        .select("*", { count: "exact", head: true })        

      const { count: totalVendors, error: totalVendorsError } = await supabase
        .from("provider_profiles")
        .select("*", { count: "exact", head: true })       
        
      const { count: pendingProviders, error: pendingProvidersError } = await supabase
        .from("provider_profiles")
        .select("*", { count: "exact", head: true })               
        .eq('credentials_approved', false)

      const { count: pendingServices, error: pendingServicesError } = await supabase
        .from("vendor_services")
        .select("*", { count: "exact", head: true })               
        .eq('status', 'rejected')  
        
      if(totalMothersError || totalProvidersError || totalVendorsError || pendingProvidersError || pendingServicesError){
        console.log("T_mothers_error", totalMothersError)
        console.log("T_providers_error", totalProvidersError)
        console.log("T_vendors_error", totalVendorsError)
        console.log("T_pendingProviders_error", pendingProvidersError)
        console.log("T_pendingServices_error", pendingServicesError)
      }

      setInfo({
        totalProviders: totalProviders ?? 0,
        totalVendors: totalVendors ?? 0,
        totalMothers: totalMothers ?? 0,
        pendingProvidersCount: pendingProviders ?? 0,
        pendingServicesCount: pendingServices ?? 0        
      })
      
    } catch (error) {
      console.log(error)
      return toast.error("Error retrieving dashboard information")
    
    } finally{
      setApiReqs({ isLoading: false, data: null, errorMsg: null })
    }
  }

  const { totalMothers, totalProviders, totalVendors, pendingProvidersCount, pendingServicesCount } = info

  return (
    <div className="w-full">
      <h3 className="text-[24px] font-[800] pt-[24px]">Welcome back, {profile?.username}</h3>

      <PathHeader 
        paths={[
          { text: 'Dashboard' }
        ]}
      />

      <div className="flex flex-col gap-6">
        {/*  */}
        <div className="flex flex-col md:flex-row justify-between gap-3 pt-[24px]">
          <div className="bg-white w-full rounded-lg p-2 lg:p-4">
            <p className="text-(--gray-500)">Total users</p>

            <div className="flex items-center  gap-2">
              <svg
                width="36"
                height="36"
                viewBox="0 0 36 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="36" height="36" rx="18" fill="#F4F4F4" />
                <g clip-path="url(#clip0_854_58532)">
                  <path
                    d="M18.5002 16.0017C18.5002 14.3517 17.1502 13.0017 15.5002 13.0017C13.8502 13.0017 12.5002 14.3517 12.5002 16.0017C12.5002 17.6517 13.8502 19.0017 15.5002 19.0017C17.1502 19.0017 18.5002 17.6517 18.5002 16.0017ZM15.5002 17.0017C14.9502 17.0017 14.5002 16.5517 14.5002 16.0017C14.5002 15.4517 14.9502 15.0017 15.5002 15.0017C16.0502 15.0017 16.5002 15.4517 16.5002 16.0017C16.5002 16.5517 16.0502 17.0017 15.5002 17.0017ZM22.0002 19.0017C23.1102 19.0017 24.0002 18.1117 24.0002 17.0017C24.0002 15.8917 23.1102 15.0017 22.0002 15.0017C20.8902 15.0017 19.9902 15.8917 20.0002 17.0017C20.0002 18.1117 20.8902 19.0017 22.0002 19.0017ZM17.9902 8.01172C12.4702 8.01172 7.99023 12.4917 7.99023 18.0117C7.99023 23.5317 12.4702 28.0117 17.9902 28.0117C23.5102 28.0117 27.9902 23.5317 27.9902 18.0117C27.9902 12.4917 23.5102 8.01172 17.9902 8.01172ZM11.8402 23.1217C12.5202 22.5817 14.1102 22.0117 15.5002 22.0117C15.5702 22.0117 15.6502 22.0217 15.7302 22.0217C15.9702 21.3817 16.4002 20.7317 17.0302 20.1617C16.4702 20.0617 15.9402 20.0017 15.5002 20.0017C14.2002 20.0017 12.1102 20.4517 10.7702 21.4317C10.2702 20.3917 9.99023 19.2317 9.99023 18.0017C9.99023 13.5917 13.5802 10.0017 17.9902 10.0017C22.4002 10.0017 25.9902 13.5917 25.9902 18.0017C25.9902 19.2017 25.7202 20.3417 25.2402 21.3717C24.2402 20.7817 22.8802 20.5017 22.0002 20.5017C20.4802 20.5017 17.5002 21.3117 17.5002 23.2017V25.9817C15.2302 25.8517 13.2102 24.7717 11.8402 23.1217Z"
                    fill="#8B8B8A"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_854_58532">
                    <rect
                      width="24"
                      height="24"
                      fill="white"
                      transform="translate(6 6)"
                    />
                  </clipPath>
                </defs>
              </svg>

              <h2 className="text-[40px] font-[800]">
                { formatNumberWithCommas(totalMothers) }
              </h2>
            </div>
          </div>

          <div className="bg-white w-full rounded-lg p-2 lg:p-4">
            <p className="text-(--gray-500)"> Total Providers</p>

            <div className="flex items-center  gap-2">
              <svg
                width="36"
                height="36"
                viewBox="0 0 36 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="36" height="36" rx="18" fill="#F4F4F4" />
                <path
                  d="M29.25 25.5H28.5V18C28.5 17.6022 28.342 17.2206 28.0607 16.9393C27.7794 16.658 27.3978 16.5 27 16.5H21.75V10.5C21.75 10.1022 21.592 9.72064 21.3107 9.43934C21.0294 9.15804 20.6478 9 20.25 9H11.25C10.8522 9 10.4706 9.15804 10.1893 9.43934C9.90804 9.72064 9.75 10.1022 9.75 10.5V25.5H9C8.80109 25.5 8.61032 25.579 8.46967 25.7197C8.32902 25.8603 8.25 26.0511 8.25 26.25C8.25 26.4489 8.32902 26.6397 8.46967 26.7803C8.61032 26.921 8.80109 27 9 27H29.25C29.4489 27 29.6397 26.921 29.7803 26.7803C29.921 26.6397 30 26.4489 30 26.25C30 26.0511 29.921 25.8603 29.7803 25.7197C29.6397 25.579 29.4489 25.5 29.25 25.5ZM18 25.5H13.5V21H18V25.5ZM18 15.75H16.5V17.25C16.5 17.4489 16.421 17.6397 16.2803 17.7803C16.1397 17.921 15.9489 18 15.75 18C15.5511 18 15.3603 17.921 15.2197 17.7803C15.079 17.6397 15 17.4489 15 17.25V15.75H13.5C13.3011 15.75 13.1103 15.671 12.9697 15.5303C12.829 15.3897 12.75 15.1989 12.75 15C12.75 14.8011 12.829 14.6103 12.9697 14.4697C13.1103 14.329 13.3011 14.25 13.5 14.25H15V12.75C15 12.5511 15.079 12.3603 15.2197 12.2197C15.3603 12.079 15.5511 12 15.75 12C15.9489 12 16.1397 12.079 16.2803 12.2197C16.421 12.3603 16.5 12.5511 16.5 12.75V14.25H18C18.1989 14.25 18.3897 14.329 18.5303 14.4697C18.671 14.6103 18.75 14.8011 18.75 15C18.75 15.1989 18.671 15.3897 18.5303 15.5303C18.3897 15.671 18.1989 15.75 18 15.75ZM27 25.5H21.75V18H27V25.5Z"
                  fill="#8B8B8A"
                />
              </svg>

              <h2 className="text-[40px] font-[1000]">
                { formatNumberWithCommas(totalProviders) }
              </h2>
            </div>
          </div>

          <div className="bg-white w-full rounded-lg p-2 lg:p-4">
            <p className="text-(--gray-500)">Total Vendors Onboarded</p>

            <div className="flex items-center  gap-2">
              <svg
                width="36"
                height="36"
                viewBox="0 0 36 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="36" height="36" rx="18" fill="#F4F4F4" />
                <path
                  opacity="0.2"
                  d="M27 15V16.5C27 17.2956 26.6839 18.0587 26.1213 18.6213C25.5587 19.1839 24.7956 19.5 24 19.5C23.2044 19.5 22.4413 19.1839 21.8787 18.6213C21.3161 18.0587 21 17.2956 21 16.5V15H15V16.5C15 17.2956 14.6839 18.0587 14.1213 18.6213C13.5587 19.1839 12.7956 19.5 12 19.5C11.2044 19.5 10.4413 19.1839 9.87868 18.6213C9.31607 18.0587 9 17.2956 9 16.5V15L10.3444 10.2937C10.389 10.1376 10.4832 10.0001 10.6127 9.90206C10.7422 9.804 10.9001 9.75064 11.0625 9.75H24.9375C25.1004 9.75003 25.2589 9.80311 25.389 9.90122C25.519 9.99932 25.6136 10.1371 25.6584 10.2937L27 15Z"
                  fill="#8B8B8A"
                />
                <path
                  d="M27.7209 14.7947L26.3766 10.0875C26.2861 9.77523 26.0971 9.50059 25.8378 9.30459C25.5784 9.10858 25.2626 9.00174 24.9375 9H11.0625C10.7374 9.00174 10.4216 9.10858 10.1622 9.30459C9.90287 9.50059 9.71386 9.77523 9.62344 10.0875L8.27906 14.7947C8.25984 14.8614 8.25006 14.9305 8.25 15V16.5C8.25 17.0822 8.38554 17.6563 8.6459 18.1771C8.90625 18.6978 9.28426 19.1507 9.75 19.5V26.25C9.75 26.4489 9.82902 26.6397 9.96967 26.7803C10.1103 26.921 10.3011 27 10.5 27H25.5C25.6989 27 25.8897 26.921 26.0303 26.7803C26.171 26.6397 26.25 26.4489 26.25 26.25V19.5C26.7157 19.1507 27.0937 18.6978 27.3541 18.1771C27.6145 17.6563 27.75 17.0822 27.75 16.5V15C27.7499 14.9305 27.7402 14.8614 27.7209 14.7947ZM11.0625 10.5H24.9375L26.0081 14.25H9.99469L11.0625 10.5ZM20.25 15.75V16.5C20.25 17.0967 20.0129 17.669 19.591 18.091C19.169 18.5129 18.5967 18.75 18 18.75C17.4033 18.75 16.831 18.5129 16.409 18.091C15.9871 17.669 15.75 17.0967 15.75 16.5V15.75H20.25ZM10.7869 18.3937C10.4691 18.1903 10.2076 17.9103 10.0265 17.5794C9.84527 17.2484 9.7502 16.8773 9.75 16.5V15.75H14.25V16.5C14.2499 16.8869 14.15 17.2673 13.9599 17.6043C13.7699 17.9413 13.4962 18.2236 13.1652 18.424C12.8342 18.6244 12.4571 18.736 12.0704 18.7481C11.6837 18.7602 11.3004 18.6724 10.9575 18.4931C10.9053 18.4525 10.8479 18.4191 10.7869 18.3937ZM24.75 25.5H11.25V20.175C11.4969 20.2248 11.7481 20.2499 12 20.25C12.5822 20.25 13.1563 20.1145 13.6771 19.8541C14.1978 19.5937 14.6507 19.2157 15 18.75C15.3493 19.2157 15.8022 19.5937 16.3229 19.8541C16.8437 20.1145 17.4178 20.25 18 20.25C18.5822 20.25 19.1563 20.1145 19.6771 19.8541C20.1978 19.5937 20.6507 19.2157 21 18.75C21.3493 19.2157 21.8022 19.5937 22.3229 19.8541C22.8437 20.1145 23.4178 20.25 24 20.25C24.2519 20.2499 24.5031 20.2248 24.75 20.175V25.5ZM26.25 16.5C26.2497 16.8774 26.1545 17.2486 25.9731 17.5795C25.7918 17.9104 25.5301 18.1904 25.2122 18.3937C25.1519 18.4191 25.0952 18.4522 25.0434 18.4922C24.7006 18.6716 24.3173 18.7596 23.9305 18.7477C23.5437 18.7357 23.1666 18.6242 22.8355 18.424C22.5044 18.2237 22.2305 17.9414 22.0404 17.6044C21.8502 17.2673 21.7502 16.887 21.75 16.5V15.75H26.25V16.5Z"
                  fill="#8B8B8A"
                />
              </svg>

              <h2 className="text-[40px] font-[800]">
                { formatNumberWithCommas(totalVendors) }
              </h2>
            </div>
          </div>

          <div className="bg-white w-full rounded-lg p-2 lg:p-4">
            <p className="text-(--gray-500)">Monthly Revenue</p>

            <div className="flex items-center  gap-2">
              <svg
                width="36"
                height="36"
                viewBox="0 0 36 36"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect width="36" height="36" rx="18" fill="#F4F4F4" />
                <path
                  opacity="0.2"
                  d="M27 18C27 19.78 26.4722 21.5201 25.4832 23.0001C24.4943 24.4802 23.0887 25.6337 21.4442 26.3149C19.7996 26.9961 17.99 27.1743 16.2442 26.8271C14.4984 26.4798 12.8947 25.6226 11.636 24.364C10.3774 23.1053 9.5202 21.5016 9.17294 19.7558C8.82567 18.01 9.0039 16.2004 9.68509 14.5558C10.3663 12.9113 11.5198 11.5057 12.9999 10.5168C14.4799 9.52784 16.22 9 18 9C20.387 9 22.6761 9.94821 24.364 11.636C26.0518 13.3239 27 15.6131 27 18Z"
                  fill="#8B8B8A"
                />
                <path
                  d="M18 8.25C16.0716 8.25 14.1866 8.82183 12.5832 9.89317C10.9798 10.9645 9.73013 12.4873 8.99218 14.2688C8.25422 16.0504 8.06114 18.0108 8.43735 19.9021C8.81355 21.7934 9.74215 23.5307 11.1057 24.8943C12.4693 26.2579 14.2066 27.1865 16.0979 27.5627C17.9892 27.9389 19.9496 27.7458 21.7312 27.0078C23.5127 26.2699 25.0355 25.0202 26.1068 23.4168C27.1782 21.8134 27.75 19.9284 27.75 18C27.7473 15.415 26.7192 12.9366 24.8913 11.1087C23.0634 9.28084 20.585 8.25273 18 8.25ZM18 26.25C16.3683 26.25 14.7733 25.7661 13.4165 24.8596C12.0598 23.9531 11.0024 22.6646 10.378 21.1571C9.75358 19.6496 9.5902 17.9908 9.90853 16.3905C10.2269 14.7902 11.0126 13.3202 12.1664 12.1664C13.3202 11.0126 14.7902 10.2268 16.3905 9.90852C17.9909 9.59019 19.6497 9.75357 21.1571 10.378C22.6646 11.0024 23.9531 12.0598 24.8596 13.4165C25.7661 14.7733 26.25 16.3683 26.25 18C26.2475 20.1873 25.3775 22.2843 23.8309 23.8309C22.2843 25.3775 20.1873 26.2475 18 26.25ZM21.75 19.875C21.75 20.5712 21.4734 21.2389 20.9812 21.7312C20.4889 22.2234 19.8212 22.5 19.125 22.5H18.75V23.25C18.75 23.4489 18.671 23.6397 18.5303 23.7803C18.3897 23.921 18.1989 24 18 24C17.8011 24 17.6103 23.921 17.4697 23.7803C17.329 23.6397 17.25 23.4489 17.25 23.25V22.5H15.75C15.5511 22.5 15.3603 22.421 15.2197 22.2803C15.079 22.1397 15 21.9489 15 21.75C15 21.5511 15.079 21.3603 15.2197 21.2197C15.3603 21.079 15.5511 21 15.75 21H19.125C19.4234 21 19.7095 20.8815 19.9205 20.6705C20.1315 20.4595 20.25 20.1734 20.25 19.875C20.25 19.5766 20.1315 19.2905 19.9205 19.0795C19.7095 18.8685 19.4234 18.75 19.125 18.75H16.875C16.1788 18.75 15.5111 18.4734 15.0188 17.9812C14.5266 17.4889 14.25 16.8212 14.25 16.125C14.25 15.4288 14.5266 14.7611 15.0188 14.2688C15.5111 13.7766 16.1788 13.5 16.875 13.5H17.25V12.75C17.25 12.5511 17.329 12.3603 17.4697 12.2197C17.6103 12.079 17.8011 12 18 12C18.1989 12 18.3897 12.079 18.5303 12.2197C18.671 12.3603 18.75 12.5511 18.75 12.75V13.5H20.25C20.4489 13.5 20.6397 13.579 20.7803 13.7197C20.921 13.8603 21 14.0511 21 14.25C21 14.4489 20.921 14.6397 20.7803 14.7803C20.6397 14.921 20.4489 15 20.25 15H16.875C16.5766 15 16.2905 15.1185 16.0795 15.3295C15.8685 15.5405 15.75 15.8266 15.75 16.125C15.75 16.4234 15.8685 16.7095 16.0795 16.9205C16.2905 17.1315 16.5766 17.25 16.875 17.25H19.125C19.8212 17.25 20.4889 17.5266 20.9812 18.0188C21.4734 18.5111 21.75 19.1788 21.75 19.875Z"
                  fill="#8B8B8A"
                />
              </svg>

              <div className="flex text-[12px] items-center gap-2">
                {/* <h2 className="text-[40px] font-[800]">$504</h2>
                <span className="py-[2px] px-[10px] rounded-full bg-(--success) text-(--success_text)">10%</span>
                <span className="text-black/50">Last month</span> */}
              </div>
            </div>
          </div>
        </div>

        {/* pending approvals */}
        <div className="bg-white p-4 rounded-sm">
          <p className="font-[500] text-[21px]">Pending approvals</p>

          <div className="flex flex-col md:flex-row justify-between pt-4 gap-3">
            {
              [
                { title: 'providers', iconColor: '#34B26A', count: pendingProvidersCount },
                { title: 'vendor services', iconColor: '#6461FC', count: pendingServicesCount },
                { title: 'content', iconColor: '#CB30E0', count: 0 },
                { title: 'tickets', iconColor: '#FF383C', count: 0 },
              ]
              .map((s, i) => {
                const { title, iconColor, count } = s

                return(
                  <div 
                    key={i}
                    className="bg-[#d3d3d3]/50 w-full min-h-[80px] rounded-lg px-3 py-2 flex flex-col items-start justify-between gap-5"
                  >
                    <div className="flex items-center gap-1">
                      <GoDotFill size={20} color={iconColor} />
                      <p>
                        { title }
                      </p>              
                    </div>

                    <p className="text-black text-lg font-regular mx-1">
                      { count }
                    </p>
                  </div>
                )
              })
            }
          </div>
        </div>

        {/* recent activity */}
        <div>
          <p className="font-[500] text-[18px] pb-3">Recent activity</p>

          <div className="flex justify-center items-center w-full h-[300px] bg-white rounded-lg">
            <div>
              <div className="w-max mx-auto">
                <svg
                  width="42"
                  height="43"
                  viewBox="0 0 42 43"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clip-path="url(#clip0_878_85163)">
                    <path
                      d="M35 5.75H33.25V2.25H29.75V5.75H12.25V2.25H8.75V5.75H7C5.075 5.75 3.5 7.325 3.5 9.25V37.25C3.5 39.175 5.075 40.75 7 40.75H35C36.925 40.75 38.5 39.175 38.5 37.25V9.25C38.5 7.325 36.925 5.75 35 5.75ZM35 37.25H7V18H35V37.25ZM35 14.5H7V9.25H35V14.5Z"
                      fill="#4F2B90"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_878_85163">
                      <rect
                        width="42"
                        height="42"
                        fill="white"
                        transform="translate(0 0.5)"
                      />
                    </clipPath>
                  </defs>
                </svg>
              </div>

              <p className="font-[600] text-center pt-1">No data to display</p>
              <p className="text-sm text-(--gray-500) pt-2">
                Recent appointments will appear here
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
