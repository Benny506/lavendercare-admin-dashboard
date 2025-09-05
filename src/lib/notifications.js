// await sendNotifications({
//     tokens: [user[0].notification_token],
//     sound: scheduleData?.sound || null,
//     title: `⏰ ${schedule_nature} reminder: ${scheduleData.schedule_title}`,
//     body: `You're to be at ${locationData.title} in the next ${offset}mins`,
//     data: {
//         locationData, scheduleData
//     }
// });

import { requestApi } from "./requestApi";

export const sendNotifications = async ({ tokens, title, body, data }) => {
    try {

        const { responseStatus, result, errorMsg } = await requestApi({
            url: 'https://tzsbbbxpdlupybfrgdbs.supabase.co/functions/v1/send-notification',
            method: 'POST',
            data: {
                tokens, 
                title, 
                body, 
                data
            }
        })

        if(errorMsg){
            console.log(errorMsg)
        }

        console.log("Notification result", result)
        return;
        
    } catch (error) {
        console.log(error)
        return;
    }
};