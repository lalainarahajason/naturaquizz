"use client";

import { UserRole } from "@prisma/client";
import { useCurrentRole } from "@/hooks/use-current-role";
import { FormError } from "@/components/form-error";
 

interface RoleGetProps {
    children? : React.ReactNode,
    allowedRole: UserRole
}

export const RoleGate = ({
    children,
    allowedRole
}: RoleGetProps) => {

    const role = useCurrentRole();

    if(role !== allowedRole) {
        return (
            <FormError message="You are not allowed to access this page" /> 
        )
    }

    return (
        <>{children}</>
    );
}