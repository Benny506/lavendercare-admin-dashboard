import { useSelector } from "react-redux";
import { getUserDetailsState } from "../redux/slices/userDetailsSlice";

export default function usePermissions(){
    const permissions = useSelector(state => getUserDetailsState(state).permissions)
    const permKeys = permissions?.map(p => p?.permission_key)

    const hasPermission = ({ requiredPerms }) => requiredPerms.some(key => permKeys.includes(key));

    return {
        hasPermission
    }
}