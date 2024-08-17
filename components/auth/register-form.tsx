
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, RegisterSchema } from "@/schemas";
import { CardWrapper } from "@/components/auth/card-wrapper";
import { useTransition, useState } from "react";

import { useTranslation } from "@/context/translation-context";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form"

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";

import { register } from "@/actions/register";

export const RegisterForm = () => {

  const { translate } = useTranslation();



  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string|undefined>("")
  const [success, setSuccess] = useState<string|undefined>("")

  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: z.infer<typeof RegisterSchema>) => {

    setError("")
    setSuccess("")

    startTransition(() => {
      register(values)
      .then((data) => {
        if(data.error) {
          setError(data.error)
        } else {
          setSuccess(data.success);
          form.reset();
        }
      })
    })
    
  }

  return (
    <CardWrapper
      headerLabel={translate('create-account', 'form')}
      backButtonHref="/auth/login"
      backButtonLabel={translate('already-have-account', 'form')}
      showSocial
    >
      <Form {...form}>
        <form 
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
          >
            <div className="space-y-4">
              {/** Name field */}
              <FormField 
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{translate('name', 'form')}</FormLabel>
                    <FormControl>
                      <Input 
                        {...field}
                        placeholder={ translate('your-name', 'form') }
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/** Email field */}
              <FormField 
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{ translate('email', 'form') }</FormLabel>
                    <FormControl>
                      <Input 
                        {...field}
                        placeholder="johdoe@example.com"
                        type="email"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/** Password field */}
              <FormField 
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{ translate('password', 'form') }</FormLabel>
                    <FormControl>
                      <Input 
                        {...field}
                        placeholder="*******"
                        type="password"
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormError message={error} />
            <FormSuccess message={success} />
            <Button type="submit" className="w-full" disabled={isPending}>{ translate('create-account', 'form') }</Button>
          </form>
      </Form>
    </CardWrapper>
  );
};
