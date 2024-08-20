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

import { useState } from "react";

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

function AnswersFieldArray({
  control,
  questionIndex,
}: {
  control: Control<QuizFormValues>;
  questionIndex: number;
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `questions.${questionIndex}.answers`,
  });

  return (
    <div className="space-y-2">
      {fields.map((field, answerIndex) => (
        <div key={field.id} className="flex items-center space-x-2">
          <FormField
            control={control}
            name={`questions.${questionIndex}.answers.${answerIndex}.text`}
            render={({ field }) => (
              <FormItem className="flex-grow">
                <FormControl>
                  <Input {...field} placeholder="Texte de la réponse" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name={`questions.${questionIndex}.answers.${answerIndex}.isCorrect`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="button"
            variant="destructive"
            onClick={() => remove(answerIndex)}
          >
            Supprimer
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        onClick={() =>
          append({ text: "", isCorrect: false, order: fields.length })
        }
      >
        Ajouter une réponse
      </Button>
    </div>
  );
}

function QuizzAdminForm() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const form = useForm<QuizFormValues>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      title: "",
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

  const onSubmit = async (data: QuizFormValues) => {
    console.log(data);
    const response = await createQuiz(data);
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    questionIndex: number
  ) => {
    const file = e.target.files ? e.target.files[0] : null;
    // Implement Cloudinary upload logic here
    // Update form data with the uploaded image URL
    console.log(file);
  };

  return (
    <Card className="w-[600px]">
      <CardHeader className="uppercase text-center font-bold">
        Ajouter un quizz
      </CardHeader>
      <CardContent>
        <RoleGate allowedRole="ADMIN">
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

              {questionFields.map((field, questionIndex) => (
                <div key={field.id} className="space-y-4 border-t pt-4">
                  <FormField
                    control={form.control}
                    name={`questions.${questionIndex}.question`}
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
                    name={`questions.${questionIndex}.image`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image</FormLabel>
                        <FormControl>
                          <Input
                            type="file"
                            onChange={(e) =>
                              handleImageUpload(e, questionIndex)
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`questions.${questionIndex}.timer`}
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
                  {/* Gestion des réponses */}
                  <div>
                    <FormLabel>Réponses</FormLabel>
                    <AnswersFieldArray
                      control={form.control}
                      questionIndex={questionIndex}
                    />
                  </div>
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
