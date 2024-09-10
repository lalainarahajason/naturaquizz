"use server";

import { getQuizs } from "@/actions/quiz-admin/quiz";
import QuizsList from "@/components/quizz/quiz-list";

async function ListeQuizs() {
  
  const initialData = await getQuizs();

  return (
     <QuizsList initialData={initialData} />
  )
}

export default ListeQuizs