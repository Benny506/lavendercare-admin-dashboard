import { useNavigate } from "react-router-dom";
import Image from "../components/ui/Image";

export default function NotFound(){

    const navigate = useNavigate()

    return(
        <div className="flex min-h-screen bg-purple-100 bg-img2 items-center justify-center">
            <div className="flex flex-col items-center px-8 pt-8 pb-6 cursor-pointer gap-2">
                <Image src="/assets/logo.svg" alt="LavenderCare Logo" className="w-50"/>                
                
                {/* <Image src="/assets/error.svg" alt="404" className="w-50"/>                 */}

                <p className="m-0 p-0 text-center">
                    The page you're looking for does not exist
                </p>

                <button
                    onClick={() => navigate('/')}
                    className="bg-purple-600 cursor-pointer px-4 py-2 text-base fw-500 text-white rounded-lg"
                >
                    Back to login
                </button>
            </div>
        </div>
    )
}