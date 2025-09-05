import { BsChevronLeft, BsChevronRight } from "react-icons/bs"

export default function Pagination({
    pageItems=[],
    pageListIndex,
    pageList,
    totalPageListIndex,
    currentPage,
    decrementPageListIndex=()=>{},
    incrementPageListIndex=()=>{},
    setCurrentPage=()=>{}
}){
    return(
        <div>
            {
                pageItems.length > 0
                &&
                    <div className="mt-6 flex items-center justify-center">
                        {/* <button 
                            disabled={pageListIndex > 0 ? false : true}
                            onClick={decrementPageListIndex} 
                            style={{
                                opacity: pageListIndex > 0 ? 1 : 0.5
                            }}
                            className="cursor-not-allowed flex items-center text-gray-600 hover:text-gray-800 font-bold"
                        >
                            <BsChevronLeft className="mr-2" /> 
                            <span className="hidden md:inline">Previous</span>
                        </button>                         */}

                        <div className="flex flex-wrap justify-center gap-2">
                            {pageList?.map((p, i) => {

                                const isActivePAge = p-1 === currentPage

                                const handlePClick = () => {
                                    if (p === '...'){
                                        
                                        if(i == 0){
                                            decrementPageListIndex()
                                        
                                        } else{
                                            incrementPageListIndex()
                                        }

                                        return;
                                    }

                                    setCurrentPage(p-1)

                                    return;
                                }

                                return (
                                    <button
                                        key={i}
                                        onClick={handlePClick}
                                        className={`w-8 h-8 cursor-pointer rounded-full ${isActivePAge ? "bg-[#6F3DCB] text-white" : "text-gray-600"} flex items-center justify-center`}
                                    >
                                        {p}
                                    </button>
                                )}
                            )}
                        </div>
                        {/* <button 
                            // disabled={pageListIndex < totalPageListIndex ? false : true}
                            onClick={incrementPageListIndex} 
                            style={{
                                opacity: pageListIndex < totalPageListIndex ? 1 : 0.5
                            }}
                            className="cursor-pointer flex items-center text-gray-600 hover:text-gray-800 font-bold"
                        >
                            <span className="hidden md:inline">Next</span> <BsChevronRight className="ml-2" />
                        </button>                         */}
                    </div>                  
            }
        </div>
    )
}