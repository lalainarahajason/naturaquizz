import * as z from "zod";

export const quizSchema = z.object({
    title: z.string().min(1, 'Le titre est requis'),
    questions: z.array(z.object({
      question: z.string().min(1, 'La question est requise'),
      image: z.string().optional(),
      timer: z.number().int().min(1).max(300).default(60),
      answers: z.array(z.object({
        text: z.string().min(1, 'Le texte de la réponse est requis'),
        isCorrect: z.boolean(),
        order: z.number().int().min(0)
      })).min(2, 'Au moins deux réponses sont requises')
    })).min(1, 'Au moins une question est requise')
    
  })
