"use client";

import { useParams } from "next/navigation";
import { getQuizById } from "@/actions/quiz-admin/quiz";
import { useEffect, useState } from "react";
import { QuizFormValues } from "@/schemas/quiz";


import Image from "next/image";
import { Button } from "@/components/ui/button";
import { getQuestions, getQuestionsByQuizId } from "@/actions/quiz-admin/question";
import { Question } from "@prisma/client";

import {LayoutGrid} from "lucide-react"

function page() {

  const params = useParams<{id:string}>();
  const [quiz, setQuiz] = useState<QuizFormValues|null>(null);
  const [questions, setQuestions] = useState<Question[]|null>(null);

  const getQuiz = async () => {
    const quizData = await getQuizById(params.id);
    const questionsData = await getQuestionsByQuizId(params.id)
    if(quizData) {
      setQuiz(quizData as QuizFormValues)
    }

    if (!('error' in questionsData)) {
      setQuestions(questionsData);
    } else {
      setQuestions(null);
    }
  }

  const startQuiz = () => {

  }

  useEffect(() => {

    getQuiz();

  }, []);

  return (
    <div>
      {quiz && (
        <div className="flex flex-col justify-center overflow-hidden items-center gap-6 rounded-lg bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 py-8 px-14 relative">
          <LayoutGrid className="absolute text-white opacity-35 h-[200px] w-[200px] transform -rotate-12 left-0" />
          {quiz.description && (
            <h1 className="text-2xl text-white font-semibold uppercase">{ quiz.title }</h1>
          )}

        </div>
      )}
    </div>
  )
}

export default page