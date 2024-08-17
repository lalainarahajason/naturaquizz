"use client"
import { useSearchParams } from "next/navigation";
import { CardWrapper } from "@/components/auth/card-wrapper";
import { useCallback, useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";

import { newVerification } from "@/actions/new-verification";

import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";

export const NewVerificationForm = () => {

    const [error, setError] = useState<string | undefined>();
    const [success, setSuccess] = useState<string | undefined>();

    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    
    const onSubmit = useCallback(() => {

        if(!token) {
            setError("Missing token");
            return;
        }

        if(!token) return;
        
        newVerification(token)
        .then(data => {
            setError(data?.error)
            setSuccess(data?.success)
        })
        .catch(() => {
            setError("Something went wrong")
        });

    }, [token])

    useEffect(() => {
        onSubmit()
    }, [onSubmit])

    return (
        <CardWrapper
            headerLabel="Confirming your verification"
            backButtonHref="/auth/login"
            backButtonLabel="Back to login"
        >
            <div className="flex flex-col items-center w-full justify-center">
                {!success && !error && (
                    <BeatLoader />
                )}
                
                <FormSuccess message={success} />
                <FormError message={error} />
            </div>
        </CardWrapper>
    )
}