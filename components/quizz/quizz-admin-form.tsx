"use client";

import { useForm, useFieldArray, Control } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { quizSchema, QuizFormValues } from "@/schemas/quiz";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

import { RoleGate } from "@/components/auth/role-gate";
import { createQuiz } from "@/actions/quiz-admin/quiz";

import { deleteImage } from "@/actions/quiz-admin/image";

import { CldUploadButton } from 'next-cloudinary';

import { useState } from "react";

import { toast } from "sonner";

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import { Card, CardHeader, CardContent } from "@/components/ui/card";

function QuizzAdminForm() {

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [publicImageId, setPublicImageId] = useState<string | null>(null);

  const form = useForm<QuizFormValues>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      title: "",
      description: "",
      image: ""
    },
  });

  const onSubmit = async (data: QuizFormValues) => {
    if (imageUrl) {
      data.image = imageUrl;
    }
    const response = await createQuiz(data);
    console.log(publicImageId)
    if (response.success) {
      form.reset();
      setImageUrl(null);
      toast(response.success)
    } else {
      // Handle error
      toast(response.error as string)
    }
  };

  const handleImageUpload = async (result: any) => {
    if(result.event === 'success') {
      setImageUrl(result.info.secure_url);
      setPublicImageId(result.info.public_id);
    }
  };

  const handleImageDelete = async () => {

    if (imageUrl) {
      const deleteResult = await deleteImage(publicImageId);
      
      if (deleteResult.success) {
        setImageUrl(null);
        form.setValue('image', '');
      } else {
        console.error('Delete failed:', deleteResult.error);
      }
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
                      <Input {...field} />
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
                      <Textarea {...field} />
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
                      <div>
                        <img src={imageUrl} alt="Quiz" className="mt-2 max-w-xs" />
                        <Button 
                          onClick={handleImageDelete} 
                          className="mt-2" 
                          variant="destructive"
                          type="button"
                          >
                          Supprimer l'image
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
                  onClick={() => form.reset()}
                >
                  Reset
                </Button>
                <Button variant="success" type="submit">
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
