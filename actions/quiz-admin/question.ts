"use server";

import { db } from "@/lib/db";
import { QuestionFormValues, QuestionWithAnswersUpdate } from "@/schemas/quiz";
import { auth } from "@/auth";
import { Question } from "@prisma/client";
import { QuestionWithAnswers } from "@/schemas/quiz";
import { getQuizById } from "./quiz";

// Create a single question
export const createQuestion = async (question: QuestionFormValues) => {

  if (!isAdmin()) {
    // if user is not admin abort
    return {
      error: "Vous n'avez pas le droit de faire cette action",
    };
  }

  const { answers, ...questionData } = question;

  console.log(questionData)

  // create new question
  const newQuestion = await db.question.create({
    data: questionData,
  });

  // create answer
  await db.answer.createMany({
    data: answers.map((answer, index) => ({
      ...answer,
      questionId: newQuestion.id,
      order: index + 1,
    })),
  });

  return {
    success: "question created with success",
  };
};

/**
 * Get all questions
 *
 * This function retrieves all questions from the database, including their associated answers.
 * It checks if the current user is an admin before executing the query.
 * If the user is not an admin, it throws an error.
 *
 * @returns {Promise<{ questions: QuestionWithAnswers[]; totalQuestions: number } | null>} - An array of questions, or an object with an error message if an error occurs.
 */
export const getQuestions = async (offset: number = 0, limit: number = 5, searchQuery: { field: string | "", s: string | "" } = { field: "", s: "" }) => {
  
  if (!isAdmin) {
    throw new Error("Action impossible");
  }

  const selectedFields = {
    id: true,
    question: true,
    image: true,
    timer: true,
    note: true,
    quizId: true,
    answers: {
      select: {
        id: true,
        text: true,
        isCorrect: true,
        order: true,
      },
    }
  }

  const query: {
    skip: number;
    take: number;
    select: typeof selectedFields;
    where?: {
      [key: string]: {
        contains: string;
        mode: "insensitive";
      };
    };
  } = {
    skip: offset,
    take: limit,
    select: selectedFields,
  }

  if (searchQuery.field && searchQuery.s) {
    query.where = {
      [searchQuery.field]: {
        contains: searchQuery.s,
        mode: "insensitive",
      },
    }
  }

  const questions = await db.question.findMany(query);

  // Optionally, fetch the total count of questions for pagination
  const totalQuestions = await db.question.count({
    where: query.where
  });

  console.log(totalQuestions)

  return { questions, totalQuestions };
};
/**
 * Retrieves a question by its ID, including its associated answers.
 *
 * This function checks if the current user is an admin before executing the query.
 * If the user is not an admin, it throws an error.
 *
 * @param questionId - The ID of the question to retrieve.
 * @returns {Promise<QuestionWithAnswers|null>} - The question with the specified ID, or an object with an error message if an error occurs.
 */
export const getQuestionById = async (questionId: string) => {
  if (!isAdmin) {
    throw new Error("Action impossible");
  }

  const question = db.question.findFirst({
    where: { id: questionId },
    select: {
      id: true,
      question: true,
      image: true,
      timer: true,
      quizId: true,
      note:true,
      answers: {
        select: {
          id: true,
          text: true,
          isCorrect: true,
          order: true,
        },
      },
    },
  });

  return question;
};

/**
 * Update question and answers
 * @returns
 */
export const updateQuestion = async (formData: QuestionWithAnswersUpdate) => {

  if (!isAdmin) {
    throw new Error("Action impossible");
  }

  try {

    const { id } = formData;
    const { answers, ...question } = formData;

    // update question
    const updatedQuestion = await db.question.update({
      where: { id },
      data: question
    });

    if (!updatedQuestion.id) {
      throw new Error("Question non trouvée");
    }

    // update answers
    await db.answer.deleteMany({
      where: { questionId: id },
    });
    await db.answer.createMany({
      data: answers.map((answer, index) => ({
        ...answer,
        questionId: updatedQuestion.id,
        order: index + 1,
      })),
    });

    const result = await getQuestionById(updatedQuestion.id);
    const quiz = await getQuizById(updatedQuestion.quizId as string);

    return {
        success: "Question mis à jour avec succès",
        question: result,
        quiz
    }

  } catch (error) {
    return {
        error: (error as Error).message
    };
  }
};

export const deleteQuestion = async (id:string) => {

  if (!isAdmin) {
    throw new Error("Action impossible");
  }

  if(!id) {
    throw new Error("Id question obligatoire");
  }

  try {

    await db.question.delete({ where: { id } });

    return {
      success: "Question supprimée avec succès"
    }
    
  } catch (error) {
    return {
      error: (error as Error).message
    }
  }

}

export const getQuestionsByQuizId = async (quizId:string) => {
  
    if (!isAdmin) {
      throw new Error("Action impossible");
    }
  
    if(!quizId) {
      throw new Error("Id quiz obligatoire");
    }

    try {

      const questions = await db.question.findMany({
        where: { quizId }
      });
    
      return questions;

    } catch (error) {

      return {
        error: (error as Error).message
      }
      
    }
  
    
}

export const isAdmin = async () => {
  const session = await auth();
  return !session || session.user.role !== "ADMIN";
};
