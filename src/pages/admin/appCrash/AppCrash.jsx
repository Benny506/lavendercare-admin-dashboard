import { useNavigate } from "react-router-dom";
import Image from "../components/ui/Image";

export default function AppCrash(){

    const navigate = useNavigate()

    const reloadPage = () => {
        navigate('/', { replace: true })
        window.location.reload();

        return;
    }

    return(
        <div className="flex min-h-screen bg-purple-100 bg-img2 items-center justify-center">
            <div className="flex flex-col items-center px-8 pt-8 pb-6 cursor-pointer gap-2">
                <Image src="/assets/logo.svg" alt="LavenderCare Logo" className="w-25"/>                
                
                <Image src="/assets/error.svg" alt="Error" className="w-50"/>                

                <p className="m-0 p-0 text-center">
                    Uh-Oh. Didn't see that coming. 
                    <br />
                    We just experienced an unexpected unhandled error.
                    <br />
                </p>

                <button
                    onClick={reloadPage}
                    className="bg-purple-600 rounded-lg px-4 py-2 text-base fw-500 text-white"
                >
                    Reload
                </button>
            </div>
        </div>
    )
}