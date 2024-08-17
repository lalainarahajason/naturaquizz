"use client";

import { Admin } from "@/actions/admin";
import { RoleGate } from "@/components/auth/role-gate";
import { FormSuccess } from "@/components/form-success";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useCurrentRole } from "@/hooks/use-current-role";
import { UserRole } from "@prisma/client";
import { toast } from "sonner";

const AdminCard = () => {
    const role = useCurrentRole();

    const onServerActionClick = () => {
        Admin()
        .then( data => {

            if(data.error) {
                toast.error(data.error)
            } else {
                toast.success(data.success)
            }
        })
    }

    const onApiRoleClick = () => {
        fetch('/api/admin')
        .then( (response) => {
            console.log(response)
            if(response.ok) {
                toast.success("Allowed api route");
            }else {
                toast.error("Forbidden api route");
            }
            
        })
    }

    return (
        <Card className="w-[600px]">
            <CardHeader>
                <p className="text-2xl font-semibold text-center">
                    Admin
                </p>
            </CardHeader>
            <CardContent className="space-y-4">
                <RoleGate allowedRole={UserRole.ADMIN}>
                    <FormSuccess
                        message="You are an admin"
                     />
                </RoleGate>
            </CardContent>
            <div className="flex flex-row items-center justify-between border-t p-3">
                <p className="text-sm font-medium">
                    Admin only api-route 
                </p>
                <Button onClick={onApiRoleClick}>Click to test</Button>
            </div>
            <div className="flex flex-row items-center justify-between border-t p-3">
                <p className="text-sm font-medium">
                    Admin only server action
                </p>
                <Button onClick={onServerActionClick}>Click to test</Button>
            </div>
        </Card>
    )
}

export default AdminCard;