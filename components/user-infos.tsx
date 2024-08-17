import { ExtendedUser } from "@/next-auth";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface UserInfosProps {
    user?: ExtendedUser,
    label: string
}

export const UserInfos = ({
    user,
    label
}: UserInfosProps) => {
    return (
        <Card className="w-[600px] shadow-sm">
            <CardHeader>
                <p className="text-2xl font-semibold text-center">
                    {label}
                </p>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <p className="text-sm font-medium">
                        ID
                    </p>
                    <p className="truncate text-xs max-w-[180px] font-mono p-2 bg-slate-100 rounded-md">{ user?.id }</p>
                </div>
                <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <p className="text-sm font-medium">
                        Name
                    </p>
                    <p className="text-xs max-w-[180px] font-mono p-2 bg-slate-100 rounded-md">{ user?.name }</p>
                </div>
                <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <p className="text-sm font-medium">
                        Email
                    </p>
                    <p className="truncate text-xs max-w-[180px] font-mono p-2 bg-slate-100 rounded-md">{ user?.email }</p>
                </div>
                <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <p className="text-sm font-medium">
                        Role
                    </p>
                    <p className="text-xs max-w-[180px] font-mono p-2 bg-slate-100 rounded-md">{ user?.role }</p>
                </div>
                <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                    <p className="text-sm font-medium">
                        Two Factor Authentication
                    </p>
                    <Badge variant={user?.isTwoFactorEnabled ? "success" : "default"}>
                        { user?.isTwoFactorEnabled ? "ON" : "OFF" }
                    </Badge>
                </div>
            </CardContent>
        </Card>
    );
}