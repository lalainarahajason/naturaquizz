"use client";

import { useForm, useFieldArray, Control } from "react-hook-form";



import { zodResolver } from "@hookform/resolvers/zod";
import { quizSchema, QuizFormValues } from "@/schemas/quiz";

import { RoleGate } from "@/components/auth/role-gate";
import { createQuiz } from "@/actions/quiz-admin/quiz";

import { deleteImage } from "@/actions/quiz-admin/image";
import { CldUploadButton } from "next-cloudinary";
import Image from "next/image";

import { useState, useTransition } from "react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import { Card, CardHeader, CardContent } from "@/components/ui/card";

import {
  Check,
  Trash2Icon,
  Loader2
} from "lucide-react";

function QuizzAdminForm() {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [publicImageId, setPublicImageId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const form = useForm<QuizFormValues>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      title: "",
      description: "",
      image: "",
    },
  });

  const onSubmit = async (data: QuizFormValues) => {
    if (imageUrl) {
      data.image = imageUrl;
    }

    startTransition(() => {

      createQuiz(data).then((data) => {

        if (data.error) {
          toast(data.error as string);
        }

        if (data.success) {
          form.reset();
          setImageUrl(null);
          toast(data.success);
        }
      });
    });
  };

  const handleImageUpload = async (result: any) => {
    if (result.event === "success") {
      setImageUrl(result.info.secure_url);
      setPublicImageId(result.info.public_id);
    }
  };

  const handleImageDelete = async () => {
    if (imageUrl) {

      startTransition(() => {
        deleteImage(publicImageId)
        .then(data => {
          if(data.error) {
              toast(data.error);
          }
          if(data.success) {
            setImageUrl(null);
            form.setValue("image", "");
            toast(data.success);
          }
        })
      })
    }
  };

  return (
    <Card className="w-[600px]">
      <CardHeader className="uppercase text-center font-bold">
        Ajouter un quiz
      </CardHeader>
      <CardContent>
        <RoleGate allowedRole="ADMIN">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/*** Titre du quiz */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Titre du Quiz</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isPending} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/*** Description du quiz */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description du Quiz</FormLabel>
                    <FormControl>
                      <Textarea {...field} disabled={isPending} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/*** Image du quiz */}
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Image du Quiz</FormLabel>
                    <FormControl>
                      <CldUploadButton
                        className="bg-primary text-white rounded-md text-xs px-4 py-2 ml-4"
                        uploadPreset="aaospnok"
                        onSuccess={handleImageUpload}
                      />
                    </FormControl>
                    {imageUrl && (
                      <div className="h-300 flex justify-between p-3 border border-[#eeeeee]">
                        <Image
                          src={imageUrl}
                          width="500"
                          height="300"
                          style={{objectFit:"cover"}}
                          className="mt-2 max-w-xs"
                          alt=""
                        />
                        <Button
                          onClick={handleImageDelete}
                          className={isPending ? 'pointer-events-none opacity-50' : 'mt-2'}
                          variant="destructive"
                          type="button"
                          size="icon"
                        >
                          {isPending && (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          )}
                          {!isPending && (
                            <Trash2Icon className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex justify-between">
                <Button
                  variant="link"
                  type="button"
                  className={isPending ? 'pointer-events-none opacity-50'  :''}
                  onClick={() => form.reset()}
                >
                  Reset
                </Button>
                <Button disabled={isPending} variant="success" type="submit">
                  {isPending && (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  )}
                  {!isPending && (
                    <Check className="mr-2 h-4 w-4" />
                  )}
                  Créer le Quiz
                </Button>
              </div>
            </form>
          </Form>
        </RoleGate>
      </CardContent>
    </Card>
  );
}

export default QuizzAdminForm;
