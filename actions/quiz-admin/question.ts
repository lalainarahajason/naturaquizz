"use server";

import { db } from "@/lib/db";
import { QuestionFormValues } from "@/schemas/quiz";
import { auth } from "@/auth";

// Create a single question
export const createQuestion = async (question:QuestionFormValues) => {

    if (!isAdmin()) {
        // if user is not admin abort
        return {
            error: "Vous n'avez pas le droit de faire cette action"
        };
    }

    const {answers, ...questionData} = question;

    // create new question
    const newQuestion = await db.question.create({
        data: questionData
    });

    // create answer
    await db.answer.createMany({
        data: answers.map((answer, index) => ({...answer, questionId: newQuestion.id, order: index+1 }))
    })

    return {
        success : "question created with success"
    }
}

export const isAdmin = async () => {
    const session = await auth();
    return !session || session.user.role !== 'ADMIN';
}