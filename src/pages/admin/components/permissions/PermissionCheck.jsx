// PermissionCheck.jsx
import React, { useEffect, useState } from "react";
import AccessDenied from "./AccessDenied";
import { useSelector } from "react-redux";
import { getUserDetailsState } from "../../../../redux/slices/userDetailsSlice";

const PermissionCheck = ({ permission_required, children }) => {
    const permissions = useSelector(
        state => getUserDetailsState(state).permissions
    );

    const [hasPermission, setHasPermission] = useState(null);

    useEffect(() => {
        if (!permissions) {
            setHasPermission(false);
            return;
        }

        const userKeys = permissions.map(p => p.permission_key);

        if (Array.isArray(permission_required)) {
            // Check if user has at least one of the required permissions
            const allowed = permission_required.some(key => userKeys.includes(key));
            setHasPermission(allowed);
        } else {
            setHasPermission(userKeys.includes(permission_required));
        }
    }, [permission_required, permissions]);

    if (hasPermission === null) {
        return <></>; // could also show a spinner here
    }

    return hasPermission ? children : <AccessDenied />;
};

export default PermissionCheck;
