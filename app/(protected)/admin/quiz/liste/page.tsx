
import { getQuizs } from "@/actions/quiz-admin/quiz";
import Loading from "@/components/loading";
import QuizsList from "@/components/quizz/quiz-list";
import { Suspense } from "react";

function ListeQuizs() {
  
  const initialData = getQuizs();

  return (
    <Suspense fallback={ <Loading /> }>
      <QuizsList initialData={initialData} />
    </Suspense>
  )
}

export default ListeQuizs