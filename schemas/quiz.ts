import * as z from "zod";

export const answerSchema = z.object({
  id: z.string().optional(),
  text: z.string().min(1, "Answer text is required"),
  isCorrect: z.boolean(),
  order: z.number().min(0),
});

export const questionSchema = z.object({
  question: z.string(),
  image: z.string().optional(),
  timer: z.number().int().default(60),
  answers: z.array(answerSchema).min(2, "At least 2 answers"), // Nous utilisons z.any() car nous n'avons pas le détail du schéma Answer
  quizId: z.string().optional(),
});


export const quizSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, "Le titre est requis"),
  description: z.string().min(1, "La description est requise"),
  slug: z.string().optional(),
  image: z.string().optional(),
  questions: z.array(questionSchema).optional()
});

export type QuestionWithAnswers = {
  question: string;
  timer: number;
  quizId: string|undefined;
  image: string|undefined;
  answers: {
    text: string;
    isCorrect: boolean;
    order: number;
  }[];
};

export type QuestionWithAnswersUpdate = QuestionWithAnswers & {
  id: string;
}

export type QuizFormValues = z.infer<typeof quizSchema>;
export type QuestionFormValues = z.infer<typeof questionSchema>;
