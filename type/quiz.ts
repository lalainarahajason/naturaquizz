import { UseFormReturn } from "react-hook-form";
import { Quiz } from "@prisma/client";
import { QuizFormValues } from "@/schemas/quiz";

export type AdminSidebarEditProps = {
    form: UseFormReturn<QuizFormValues>;
    imageUrl: string | null;
    isPending: boolean;
    initialData: Quiz | null | undefined;
    handleImageUpload: (result: any) => Promise<void>;
    handleImageDelete: () => Promise<void>;
    onSubmit: (data: QuizFormValues) => Promise<void>;
}