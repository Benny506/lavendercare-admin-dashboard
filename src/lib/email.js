import supabase from "../database/dbInit";
import { requestApi } from "./requestApi"

export const statusUpdateMail = async ({
    to_email,
    receiver_id,
    subject,
    extra_text,
    title,
    provider_name
}) => {

    let receiver_email = to_email

    if(!receiver_email && receiver_id){
        const { data, error } = await supabase.rpc("get_user_email", { 
            p_user_id: receiver_id, 
            // p_user_id: '9c291b48-308d-4c2b-9bf6-1570b60e8dfd', //test: Id belongs to olomufeh@gmail.com
        })
        
        if(error){
            console.log(error)
        }

        receiver_email = data
    }

    if(!receiver_email) return;

    await sendEmail({
        // to_email: selectedProvider?.email,
        to_email: receiver_email,
        subject,
        data: {
            title,
            provider_name,
            extra_text
        },
        template_id: '351ndgwm9nrlzqx8'
    })
}

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

        if (errorMsg) {
            console.log(errorMsg)
            throw new Error()
        }

        return { sent: true }

    } catch (error) {
        console.log(error)
        return { sent: false }
    }
}