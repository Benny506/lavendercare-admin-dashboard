import { requestApi } from "./requestApi"

export const sendEmail = async ({ from_email = 'no-reply@lavendercare.co', to_email, data, template_id, subject }) => {
    try {

        const { responseStatus, errorMsg, result } = await requestApi({
            url: 'https://tzsbbbxpdlupybfrgdbs.supabase.co/functions/v1/send-email-via-mailsender',
            method: 'POST',
            data: {
                // from_email, 
                to_email, 
                data, 
                template_id, 
                subject
            }
        })

        if(errorMsg){
            console.log(errorMsg)
            throw new Error()
        }

        return { sent: true }
        
    } catch (error) {
        console.log(error)
        return { sent: false }
    }
}