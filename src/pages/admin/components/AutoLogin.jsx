import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import AppLoading from "./appLoading/AppLoading"
import { useDispatch } from "react-redux"
import { setUserDetails } from "../../../redux/slices/userDetailsSlice"
import supabase, { getAdminDetails } from "../../../database/dbInit"
import { setAdminState } from "../../../redux/slices/adminState"

export default function AutoLogin({ children }){
    const dispatch = useDispatch()

    const navigate = useNavigate()
    const { pathname } = useLocation()

    const [user, setUser] = useState(null)
    const [appLoading, setAppLoading] = useState(true)

    // 1. Restore session & subscribe to auth changes
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if(session?.user){
                setUser(session?.user)
            
            } else{
                autoLoginError()
            }
        })

        // const { subscription } = supabase.auth.onAuthStateChange(
        //     (_event, session) => {
        //         setSession(session)
        //     }
        // )

        // return () => subscription.unsubscribe()

    }, [])

    // 2. Fetch related data once we have the user
    useEffect(() => {
        if (!user) return;

        // console.log(user)

        async function loadProfile() {

            const { data: infoData, error: infoError } = await getAdminDetails({ id: user.id })

            if (infoError) {
                autoLoginError()
                console.error('Error loading profile:', infoError)

            } else {

                const { profile, mothers, vendors, providers } = infoData

                dispatch(setUserDetails({
                    profile: {
                        ...user,
                        ...profile
                    },
                }))
                dispatch(setAdminState({ mothers, vendors, providers }))                

                setAppLoading(false)
            }
        }

        loadProfile()
    }, [user]) 
    
    const autoLoginError = () => {
        if(!pathname.includes('admin/create-account')){
            navigate('/', { replace: true })
        }

        setAppLoading(false)

        console.log("Auto-login failure")

        return;
    }

    if(appLoading) return <AppLoading tempLoading={true} />

    return (
        <div>
            { children }
        </div>
    )
}