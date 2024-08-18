"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { quizSchema } from "@/schemas/quiz";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import * as z from "zod";

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
  const form = useForm({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      title: "",
      slug: "",
      category: "",
      questions: [
        {
          question: "",
          image: "",
          timer: 60,
          answers: [{ text: "", isCorrect: false, order: 0 }],
        },
      ],
    },
  });

  const { fields: questionFields, append: appendQuestion } = useFieldArray({
    control: form.control,
    name: "questions",
  });

  const onSubmit = async (data: z.infer<typeof quizSchema>) => {
    console.log(data);
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    questionIndex: number
  ) => {
    const file = e.target.files ? e.target.files[0] : null;
    // Implement Cloudinary upload logic here
    // Update form data with the uploaded image URL
  };

  return (
    <Card className="w-[600px]">
      <CardHeader>Grand titre du quiz (édition)</CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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

            {questionFields.map((field, index) => (
              <div key={field.id} className="space-y-4">
                <FormField
                  control={form.control}
                  name={`questions.${index}.question`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Question</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`questions.${index}.image`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          onChange={(e) => handleImageUpload(e, index)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`questions.${index}.timer`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Temps (en secondes)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseInt(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {/* Add fields for answers here */}
              </div>
            ))}

            <div className="flex justify-between">
                <Button
                variant="secondary"
                type="button"
                onClick={() =>
                    appendQuestion({
                    question: "",
                    image: "",
                    timer: 60,
                    answers: [{ text: "", isCorrect: false, order: 0 }],
                    })
                }
                >
                Ajouter une question
                </Button>
                <Button variant="success" type="submit">Créer le Quiz</Button>
            </div>
            
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default QuizzAdminForm;
