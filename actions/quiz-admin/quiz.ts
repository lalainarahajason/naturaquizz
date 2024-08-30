"use server"

import { revalidatePath } from 'next/cache'
import { CurrentUser } from "@/lib/auth";
import { db } from '@/lib/db';
import { quizSchema, QuizFormValues, questionSchema, QuestionFormValues } from '@/schemas/quiz';
import { auth } from '@/auth';

import * as z from "zod";
import { Quiz } from '@prisma/client';
import { form } from '@/translations/strings';

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

export const updateQuiz = async (formData:QuizFormValues, initialData?:Quiz|null) : Promise<{error?:string, success?:string, quiz?:QuizFormValues}> => {

    if(!isAdmin()) {
        // if user is not admin abort
        return {
            error: "Vous n'avez pas le droit de faire cette action"
        }
    }

    const {id} = initialData ? initialData : formData;

    console.log("id", id)

    // check if quiz exists
    const quiz = await db.quiz.findFirst({
        where:{ id }
    })

    if(!quiz) {
        return {
            error: "Quiz non trouvé"
        }
    }

    console.log("udate new quiz")

    // update quiz
    const updatedQuiz = await db.quiz.update({
        where: { id },
        data: {
            title: formData.title,
            description: formData.description,
            image: formData.image as string,
        }
    });

    console.log(formData)

    // update questions
    if(formData.questions) {

        console.log("create new question")

        await db.question.deleteMany({
            where: { quizId: id }
        })

        // update a question of the quiz
        const createQuestion = await db.question.create({
            data:{
                question: formData.title,
                quizId: formData.id as string,
                answers: {
                   create: formData.questions?.map(question => {
                          return {
                            text: question.question,
                            isCorrect: question.answers[0].isCorrect,
                            order: question.answers[0].order
                          }
                   })
                }
            }
        })

        console.log(createQuestion)
    }

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
export const getQuizs = async(): Promise<Quiz[]> => {

    // Get all quiz
    const quizs = await db.quiz.findMany({
        select:{
            id: true,
            title: true,
            description: true,
            image: true,
            questions:true
        },
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