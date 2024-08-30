"use client";

import { useState, useTransition, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";

import { QuestionFormValues, QuizFormValues } from "@/schemas/quiz";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Card, CardHeader, CardContent } from "@/components/ui/card";

import { RoleGate } from "@/components/auth/role-gate";

import { PlusCircleIcon, Trash2Icon, Loader2 } from "lucide-react";
import QuestionSidebar from "@/components/quizz/question-admin-sidebar";

import { InitialDataQuestionProps } from "@/type/quiz";
import { Quiz } from "@prisma/client";
import { getQuizs, updateQuiz } from "@/actions/quiz-admin/quiz";

import { toast } from "sonner";

function AddQuestion({
  initialData,
  mode = "create",
}: {
  initialData?: InitialDataQuestionProps;
  mode: string;
}) {
  const [imageUrl, setImageUrl] = useState<string | null>(
    initialData?.image || null
  );

  const [publicImageId, setPublicImageId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [quizsList, setQuizsList] = useState<QuizFormValues[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<string>("");

  const form = useForm<QuestionFormValues>({
    defaultValues: {
      quizId: initialData?.quizId || "",
      question: initialData?.question || "",
      image: initialData?.image || "",
      timer: initialData?.timer || 60,
      answers: initialData?.answers || [
        { text: "", isCorrect: false, order: 0 },
      ],
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  /**
   * React-hook-form field array methods
   */
  const {
    fields: answers,
    append: appendAnswer,
    remove: removeAnswer,
  } = useFieldArray({
    control,
    name: "answers",
  });

  /**
   * Add a new answer to the form
   */
  const handleAddAnswer = () => {
    appendAnswer({ text: "", isCorrect: false, order: answers.length });
  };

  const handleImageUpload = async () => {};

  const handleImageDelete = async () => {};

  const onSubmit = async (data:QuestionFormValues):Promise<void> => {

    startTransition(() => {
        // update question of a quiz
        const updatedQuiz = quizsList.find((quiz) => quiz.id === data.quizId);

        console.log(updatedQuiz)

        if (updatedQuiz) {

          updatedQuiz?.questions?.push({
            question: data.question,
            timer: data.timer,
            quizId:"",
            image: "",
            answers: data.answers,
          });
          
          console.log("===")
          console.log(updatedQuiz)

          updateQuiz(updatedQuiz)
          .then(result => {
            if(result.success) {
              form.reset();
              setImageUrl(null);
              toast(result.success)
            } else {
              toast(result.error as string)
            }
          })
        }
    })

  };

  useEffect(() => {
    /**
     * Get list of quizs
     */
    getQuizs()
      .then((result) => {
        if (result) {
          setQuizsList(result as QuizFormValues[]);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <RoleGate allowedRole="ADMIN">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-flow-row lg:grid-flow-col items-start gap-4"
        >
          <Card className="w-full lg:w-[600px]">
            <CardHeader className="uppercase text-center font-bold">
              Ajouter une question 
              
            </CardHeader>
            <CardContent className="grid grid-flow-row gap-4">
              {/** Quiz(s) */}
              {quizsList && (
                <FormField
                  control={form.control}
                  name="quizId"
                  render={({ field }) => (
                    <FormItem>
                      <Select 
                        onValueChange={(value)=> {
                          field.onChange(value)
                          setSelectedQuiz(() => {
                            return quizsList.find(quiz => quiz.id === value)?.title || ""
                          })
                          
                        }} 
                        defaultValue={field.value}>

                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Choisir un quiz" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Quizs</SelectLabel>
                            {quizsList.map((quiz) => (
                              <SelectItem key={quiz.id} value={quiz.id as string}>
                                {quiz.title}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                ></FormField>
              )}

              {/** Question */}
              <FormField
                name="question"
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Question</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={isPending} />
                    </FormControl>
                    <FormMessage>{errors.question?.message}</FormMessage>
                  </FormItem>
                )}
              />

              {/** Answers */}
              <FormLabel>Réponses</FormLabel>
              {answers.map((answer, index) => (
                <div
                  key={answer.id}
                  className="flex flex-wrap gap-4 justify-between items-center"
                >
                  <FormField
                    name={`answers.${index}.text`}
                    control={control}
                    render={({ field }) => (
                      <FormItem className="lg:flex-1">
                        <FormControl>
                          <Input
                            {...field}
                            disabled={isPending}
                            className="w-full"
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    name={`answers.${index}.isCorrect`}
                    control={control}
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isPending}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button
                    variant="destructive"
                    onClick={() => removeAnswer(index)}
                    size="icon"
                  >
                    <Trash2Icon />
                  </Button>
                </div>
              ))}
              <div className="flex justify-between">
                <Button
                  type="button"
                  className="gap-4"
                  onClick={handleAddAnswer}
                >
                  <PlusCircleIcon />
                  Ajouter une réponse
                </Button>
              </div>
            </CardContent>
          </Card>
          {/** Sidebar */}
          <QuestionSidebar
            form={form}
            imageUrl={imageUrl}
            isPending={isPending}
            initialData={initialData}
            handleImageUpload={handleImageUpload}
            handleImageDelete={handleImageDelete}
            onSubmit={onSubmit}
            selectedQuiz={selectedQuiz}
          />
        </form>
      </Form>
    </RoleGate>
  );
}

export default AddQuestion;
