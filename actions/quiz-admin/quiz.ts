"use server"

import { revalidatePath } from 'next/cache'
import { CurrentUser } from "@/lib/auth";
import { db } from '@/lib/db';
import { quizSchema, QuizFormValues } from '@/schemas/quiz';
import { auth } from '@/auth';

import * as z from "zod";
import { Quiz } from '@prisma/client';

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

export const getQuizById = async (id: string): Promise<Quiz|null> => {

    if(!id) return null;

    try {

        const quiz = await db.quiz.findUnique({
            where: { id }
        });

        if(!quiz) return null;
    
        return quiz;

    } catch (error) {
        return null
    }

    
}

export const updateQuiz = async (data:QuizFormValues, initialData?:Quiz|null) : Promise<{error?:string, success?:string, quiz?:QuizFormValues}> => {

    if(!isAdmin() || !initialData) {
        // if user is not admin abort
        return {
            error: "Vous n'avez pas le droit de faire cette action"
        }
    }

    const {id} = initialData;

    // check if quiz exists
    const quiz = await db.quiz.findFirst({
        where:{ id }
    })

    if(!quiz) {
        return {
            error: "Quiz non trouvé"
        }
    }

    // update quiz
    const updatedQuiz = await db.quiz.update({
        where: { id },
        data: {
            title: data.title,
            description: data.description,
            image: data.image as string
        }
    });

    return {
        success: "quiz mis à jours avec succès"
    }
}

/**
 * Delete a quiz by id
 * @param id, quiz id
 * @returns 
 */
export const deleteQuiz = async (id: string):Promise<{success?:string, error?:string} > => {
    
        if(!isAdmin()) {
            // if user is not admin abort
            return {
                error: "Vous n'avez pas le droit de faire cette action"
            }
        }
    
        // delete quiz
        await db.quiz.delete({
            where: { id }
        });
    
        return {
            success: "Quiz supprimé avec succès"
        }
}

/**
 * Get all quiz
 * @returns 
 */
export const getQuizs = async() => {

    // Get all quiz
    const quizs = await db.quiz.findMany({
        orderBy:{
            createdAt: 'desc'
        }
    });
    return quizs
}

const isAdmin = async () => {
    const session = await auth();
    return !session || session.user.role !== 'ADMIN';
}