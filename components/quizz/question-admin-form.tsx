"use client";

import { useState, useTransition, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useParams } from "next/navigation";
import {
  QuestionFormValues,
  QuizFormValues,
  QuestionWithAnswers,
  QuestionWithAnswersUpdate,
} from "@/schemas/quiz";

import { deleteImage } from "@/actions/quiz-admin/image";
import { getQuestionById } from "@/actions/quiz-admin/question";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";

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

import { getQuizs } from "@/actions/quiz-admin/quiz";
import { createQuestion, updateQuestion } from "@/actions/quiz-admin/question";

import { toast } from "sonner";
import { cn, getPublicIdFromUrl } from "@/lib/utils";
import QuizsList from "./quiz-list";

function QuestionAdminForm({ mode = "create" }: { mode: string }) {
  const params = useParams<{ id: string }>();
  const [selectedQuiz, setSelectedQuiz] = useState<string>("");
  const [isPending, startTransition] = useTransition();

  const [quizsList, setQuizsList] = useState<QuizFormValues[]>([]);
  const [initialData, setInitialData] = useState<QuestionFormValues | null>(
    null
  );
  const [state, setState] = useState<{
    imageUrl: string | null;
    publicImageId: string | null;
    quizsList: QuizFormValues[];
    selectedQuiz: string;
  }>({
    imageUrl: null,
    publicImageId: null,
    quizsList: [],
    selectedQuiz: "",
  });

  const [error, setError] = useState<{ type: string; message: string } | null>(
    null
  );

  const form = useForm<QuestionFormValues>({
    defaultValues: {
      quizId: "",
      question: "",
      note: "",
      image: "",
      timer: 60,
      answers: [{ text: "", isCorrect: false, order: 0 }],
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

  const handleImageUpload = async (result: any) => {
    if (result.event === "success") {
      setState((prevState) => ({
        ...prevState,
        imageUrl: result.info.secure_url,
        publicImageId: result.info.public_id,
      }));
    }
  };

  const handleImageDelete = async () => {
    if (state.imageUrl) {
      startTransition(() => {
        deleteImage(state.publicImageId).then((data) => {
          if (data.error) {
            toast(data.error);
          }
          if (data.success) {
            setState((prevState) => ({
              ...prevState,
              imageUrl: null,
            }));
            form.setValue("image", "");
            toast(data.success);
          }
        });
      });
    }
  };

  const onSubmit = async (data: QuestionFormValues): Promise<void> => {
    if (isPending) return;

    startTransition(() => {
      // update question of a quiz
      const currentQuiz = quizsList.find((quiz) => quiz.id === data.quizId);

      if (!currentQuiz) {
        setError({
          type: "error",
          message: "⚠️ Veuillez choisir un quiz",
        });
      }

      if (currentQuiz) {
        const question = {
          quizId: data.quizId || undefined,
          question: data.question,
          note: data.note as string,
          image: state.imageUrl as string,
          timer: data.timer,
          answers: data.answers,
        };

        // mode create or edit
        if (mode === "edit") {
          const questionWithAnswers: QuestionWithAnswersUpdate = {
            ...question,
            id: params.id,
          };

          updateQuestion(questionWithAnswers).then((result) => {
            if (result.success) {
              // update form
              form.reset({
                quizId: result.question?.quizId || undefined,
                question: result.question?.question,
                note: result.question?.note as string,
                image: result.question?.image as string,
                timer: result.question?.timer,
                answers: result.question?.answers,
              });

              toast(result.success);
            } else {
              toast(result.error as string);
            }
          });
        } else {
          createQuestion(question).then((result) => {
            if (result.success) {
              form.reset();
              setState((prevState) => ({
                ...prevState,
                imageUrl: null,
              }));
              toast(result.success);
            } else {
              toast(result.error as string);
            }
          });
        }
      }
    });
  };

  useEffect(() => {

    const fetchQuestionById = async () => {
      const result = await getQuestionById(params.id);

      if (result) {

        setInitialData({
          question: result.question,
          timer: result.timer,
          note: result.note as string,
          answers: result.answers,
          quizId: result.quizId as string,
          image: result.image || undefined,
        });

        if (result.image) {
          const publicImageId = getPublicIdFromUrl(result.image);
          setState((prevState) => ({
            ...prevState,
            imageUrl: result.image,
            publicImageId,
          }));
        }

        // update form default values
        form.reset({
          question: result.question,
          timer: result.timer,
          answers: result.answers,
          quizId: result.quizId as string,
          image: result.image as string,
          note: result.note as string,
        });

        setSelectedQuiz(result.quizId as string);
      }
    };

    const fetchQuizs = async (): Promise<void> => {
      try {
        const result = await getQuizs();

        console.log("result");
        console.log(result)
        console.log(result.length)
        console.log("tzt end result")

        if (result.length) {
          setQuizsList(result as QuizFormValues[]);
        } else {
          toast(`quiz error`);
          setError({
            type: "warning",
            message: "Attention, aucun quiz trouvé dans la base",
          });
        }
      } catch (error) {
        console.error("Failed to fetch quizzes:", error);
        toast("Failed to fetch quizzes");
        setError({
          type: "error",
          message: "Failed to fetch quizzes. Please try again later.",
        });
      }
    };

    if (params.id) {
      fetchQuestionById();
    }
    fetchQuizs();
  }, [params.id, form]);

  return (
    <RoleGate allowedRole="ADMIN">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-flow-row lg:grid-flow-col items-start gap-4"
        >
          <Card className="w-full lg:w-[600px]">
            <CardHeader className="text-center">
              {mode === "edit" && (
                <div className="uppercase font-bold">
                  Question : {initialData?.question}
                </div>
              )}

              {mode != "edit" && (
                <div className="uppercase font-bold">Ajouter une question</div>
              )}

              {error && (
                <div
                  className={cn(
                    "rounded-sm mb-4 text-sm p-3",
                    error.type === "error"
                      ? "bg-red-50 text-red-700"
                      : "bg-blue-100/20 text-blue-900"
                  )}
                >
                  {error.message}
                </div>
              )}
            </CardHeader>
            <CardContent className="grid grid-flow-row gap-4">
              {/** Quiz(s) */}

              <div className="text-center text-gray-900 bg-gray-200/40 p-3">
                  {initialData?.quizId}
                </div>

              {quizsList && (
                <FormField
                  control={form.control}
                  name="quizId"
                  render={({ field }) => (
                    <FormItem>
                      <Select
                        onValueChange={(value) => {
                          
                          field.onChange(value);
                          setSelectedQuiz(() => {
                            setError(null);
                            console.log(value)
                            return (
                              quizsList.find((quiz) => quiz.id === value)
                                ?.title || ""
                            );
                          });
                        }}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Choisir un quiz" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Quizs</SelectLabel>
                            {quizsList.map((quiz) => (
                              <SelectItem
                                key={quiz.id}
                                value={quiz.id as string}
                              >
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
                  key={index}
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

              {/** Note */}
              <FormField
                name="note"
                control={control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Note explicative pour la réponse</FormLabel>
                    <FormControl>
                      <Textarea {...field} disabled={isPending} />
                    </FormControl>
                    <FormMessage>{errors.question?.message}</FormMessage>
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>
          {/** Sidebar */}
          <QuestionSidebar
            form={form}
            imageUrl={state.imageUrl}
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

export default QuestionAdminForm;
