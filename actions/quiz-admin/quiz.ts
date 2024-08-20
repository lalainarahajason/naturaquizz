"use server"

import { revalidatePath } from 'next/cache'
import { CurrentUser } from "@/lib/auth";
import { db } from '@/lib/db';
import { quizSchema, QuizFormValues } from '@/schemas/quiz';
import { auth } from '@/auth';

import * as z from "zod";

export const createQuiz  = async ( data: QuizFormValues ) => {

    const session = await auth();
    
    // if user is not admin abort
    if (!session || session.user.role !== 'ADMIN') {
        return {
            error: "Vous n'avez pas le droit de faire cette action"
        }
    }

    try {

        const validateData = quizSchema.safeParse(data);

        if (!validateData.success) {
            return {
                error: validateData.error.errors
            }
        }

        await db.quiz.create({
            data: {
              title: data.title,
              slug: data.title, // Ajout d'un slug par défaut s'il est optionnel
              description: data.description,
              image: data.image,
              author: { connect: { id: session.user.id } }, // Ajout de l'auteur si nécessaire
            }
        });

        return {
            success: "Quiz enregistré avec succès"
        };
          
    } catch (error) {
        return {
            error : "Erreur inattendue"
        }
    }

    

}