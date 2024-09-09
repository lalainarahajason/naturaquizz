"use server";

import { getQuizs } from "@/actions/quiz-admin/quiz";
import Loading from "@/components/loading";
import QuizsList from "@/components/quizz/quiz-list";
import { Suspense } from "react";

function ListeQuizs() {
  
  const initialData = getQuizs();

  return (
    
     <QuizsList initialData={initialData} />
  )
}

export default ListeQuizs