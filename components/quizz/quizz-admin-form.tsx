"use client";

import { useForm } from "react-hook-form";
import { useEffect, useState, useTransition } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { quizSchema, QuizFormValues } from "@/schemas/quiz";

import { RoleGate } from "@/components/auth/role-gate";
import { createQuiz, getQuizById, updateQuiz } from "@/actions/quiz-admin/quiz";
import { deleteImage } from "@/actions/quiz-admin/image";

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

import { Quiz } from "@prisma/client";

import Sidebar from "./quiz-admin-sidebar";

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

            {/** Sidebar */}
            <Sidebar
              form={form}
              imageUrl={imageUrl}
              isPending={isPending}
              initialData={initialData}
              handleImageUpload={handleImageUpload}
              handleImageDelete={handleImageDelete}
              onSubmit={onSubmit}
            />
          </form>
        </Form>
      </RoleGate>
    </>
  );
}

export default QuizzAdminForm;
