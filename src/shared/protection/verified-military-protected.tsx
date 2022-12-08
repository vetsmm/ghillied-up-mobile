import React from "react";
import {useSelector} from "react-redux";
import {IRootState} from "../../store";

interface VerifiedMilitaryProtectedProps {
    children: React.ReactNode;
    unverifiedComponent?: React.ReactNode;
}
export const VerifiedMilitaryProtected: React.FC<VerifiedMilitaryProtectedProps> = ({children, unverifiedComponent}) => {
    const isVerifiedOrAdmin = useSelector((state: IRootState) => state.authentication.isVerifiedMilitary || state.authentication.isAdmin);

    if (isVerifiedOrAdmin) {
        return <>{children}</>;
    }

    return <>{unverifiedComponent}</>;
}

export default VerifiedMilitaryProtected;