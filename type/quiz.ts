import { UseFormReturn } from "react-hook-form";
import { Question, Quiz } from "@prisma/client";
import { QuestionFormValues, QuizFormValues } from "@/schemas/quiz";

export type AdminSidebarEditProps = {
    form: UseFormReturn<QuizFormValues>;
    imageUrl: string | null;
    isPending: boolean;
    initialData: Quiz | null | undefined;
    handleImageUpload: (result: any) => Promise<void>;
    handleImageDelete: () => Promise<void>;
    onSubmit: (data: QuizFormValues) => Promise<void>;
}

export type QuestionSidebarEditProps = {
    form: UseFormReturn<QuestionFormValues>;
    imageUrl: string | null;
    isPending: boolean;
    initialData: Partial<Question> | null | undefined;
    handleImageUpload: (result: any) => Promise<void>;
    handleImageDelete: () => Promise<void>;
    onSubmit: (data: QuestionFormValues) => Promise<void>;
}

export type InitialDataQuestionProps = {
    question?: string;
    image?: string;
    timer?: number;
    answers?: {
      text: string;
      isCorrect: boolean;
      order: number;
    }[];
    quizId?: string;
};