import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { useEffect } from "react"
import { getUserDetailsState } from "../../../redux/slices/userDetailsSlice"

export default function ProtectedRoute({ children }){
    
    const navigate = useNavigate() 
    
    const userProfile = useSelector(state => getUserDetailsState(state).profile)

    useEffect(() => {
        if(!userProfile?.id){
            navigate('/', { replace: true })
        }
    }, [userProfile])

    if(!userProfile?.id) return <></>

    return(
        <> 
            { children }
        </>
    )
}