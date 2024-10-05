"use server";

import { getQuizs } from "@/actions/quiz-admin/quiz";
import QuizsList from "@/components/quizz/quiz-list";
import { QuizFormValues } from "@/schemas/quiz";

async function ListeQuizs() {
  
  const initialData = await getQuizs();
  

  return (
     <QuizsList initialData={initialData as QuizFormValues[]} />
  )
}

export default ListeQuizs