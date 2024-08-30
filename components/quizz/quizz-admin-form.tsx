"use client";

import { useForm, useFieldArray, Control } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { quizSchema, QuizFormValues } from "@/schemas/quiz";

import { RoleGate } from "@/components/auth/role-gate";
import { createQuiz, getQuizById, updateQuiz } from "@/actions/quiz-admin/quiz";

import { deleteImage } from "@/actions/quiz-admin/image";
import { CldUploadButton } from "next-cloudinary";
import Image from "next/image";

import { useEffect, useState, useTransition } from "react";

import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getPublicIdFromUrl } from "@/lib/utils";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import { Card, CardHeader, CardContent } from "@/components/ui/card";

import { Check, Trash2Icon, Loader2 } from "lucide-react";
import { Quiz } from "@prisma/client";
import Link from "next/link";

type initialDataType = {
  title?: string;
  description?: string;
  image?: string;
};

function QuizzAdminForm({
  initialData,
  mode = "create",
}: {
  initialData?: Quiz | null;
  mode: string;
}) {
  const [imageUrl, setImageUrl] = useState<string | null>(
    initialData?.image || null
  );
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

  useEffect(() => {
    if (initialData) {
      form.reset({
        title: initialData.title,
        description: initialData.description,
        image: initialData.image as string,
      });

      setImageUrl(initialData.image || null);
      // get public image id from image url
      const publicId = getPublicIdFromUrl(initialData.image as string);
      console.log(publicId);
      setPublicImageId(publicId);
    }
  }, [initialData, form]);

  const onSubmit = async (data: QuizFormValues) => {
    if (imageUrl) {
      data.image = imageUrl;
    }

    startTransition(() => {
      const action =
        mode === "create" ? createQuiz(data) : updateQuiz(data, initialData);

      action.then((result) => {
        if (result.error) {
          toast(result.error as string);
        }

        if (result.success) {
          form.reset();
          setImageUrl(null);
          toast(result.success);
        }

        if (mode === "edit") {
          // get quiz by id
          getQuizById(initialData?.id as string).then((data) => {
            if (data) {
              form.reset({
                title: data.title,
                description: data.description,
                image: data.image as string,
              });
              setImageUrl(data.image);
            }
          });
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
        deleteImage(publicImageId).then((data) => {
          if (data.error) {
            toast(data.error);
          }
          if (data.success) {
            setImageUrl(null);
            form.setValue("image", "");
            toast(data.success);
          }
        });
      });
    }
  };

  return (
    <>
      <RoleGate allowedRole="ADMIN">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-flow-row lg:grid-flow-col items-start gap-4"
          >
            <Card className="w-full lg:w-[600px]">
              <CardHeader className="uppercase text-center font-bold">
                {!initialData ? (
                  <>Ajouter un quiz</>
                ) : (
                  <>{`Quiz :  ${initialData.title} `}</>
                )}
              </CardHeader>
              <CardContent className="space-y-8">
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

                <div className="flex justify-between">
                  {!initialData && (
                    <Button
                      variant="link"
                      type="button"
                      className={
                        isPending ? "pointer-events-none opacity-50" : ""
                      }
                      onClick={() => form.reset()}
                    >
                      Reset
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
            <Card className="w-full lg:w-[380px]">
              <CardHeader className="border-b">Publier</CardHeader>
              <CardContent>
                <div className="grid grid-flow-col gap-4 py-4">
                  {/** Retour à la liste */}
                  {initialData && (
                    <Button
                      type="button"
                      variant="outline"
                      className={
                        isPending ? "pointer-events-none opacity-50" : ""
                      }
                    >
                      <Link href="/admin/quiz/liste">Tous les quiz</Link>
                    </Button>
                  )}

                  {/** Mettre à jour */}
                  <Button disabled={isPending} variant="success" type="submit">
                    {isPending && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {!isPending && <Check className="mr-2 h-4 w-4" />}
                    {!initialData ? "Créer le Quiz" : "Mettre à jour"}
                  </Button>
                </div>
                <div className="grid gap-4">
                  {/*** Image du quiz */}
                  {imageUrl && (
                    <div className="flex flex-col gap-4">
                      <div className="w-full h-[200px] grid relative">
                        <Image
                          src={imageUrl}
                          fill={true}
                          style={{ objectFit: "cover" }}
                          className="mt-2 max-w-xs w-full"
                          alt=""
                          priority={false}
                        />
                      </div>
                    </div>
                  )}
                  <FormMessage />
                  <div className="flex justify-between items-center">
                    <FormField
                      control={form.control}
                      name="image"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Image</FormLabel>
                          <FormControl>
                            <CldUploadButton
                              className="bg-primary text-white rounded-md text-xs px-4 py-2 ml-4"
                              uploadPreset="aaospnok"
                              onSuccess={handleImageUpload}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <Button
                        onClick={handleImageDelete}
                        className={
                          isPending ? "pointer-events-none opacity-50" : "mt-2"
                        }
                        variant="destructive"
                        type="button"
                        size="icon"
                      >
                        {isPending && (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        )}
                        {!isPending && <Trash2Icon className="h-4" />}
                      </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </form>
        </Form>
      </RoleGate>
    </>
  );
}

export default QuizzAdminForm;
