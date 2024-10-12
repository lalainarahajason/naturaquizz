"use client";

import { useParams } from "next/navigation";
import { getQuizById } from "@/actions/quiz-admin/quiz";
import { useEffect, useState } from "react";
import { QuizFormValues } from "@/schemas/quiz";

import Image from "next/image";
import { Button } from "@/components/ui/button";

function page() {

  const params = useParams<{id:string}>();
  const [quiz, setQuiz] = useState<QuizFormValues|null>(null);

  const getQuiz = async () => {
    const response = await getQuizById(params.id);
    if(response) {
      console.log(response)
      setQuiz(response as QuizFormValues)
    }
  }

  useEffect(() => {

    getQuiz();

  }, []);

  return (
    <div>
      {quiz && (
        <div className="flex flex-col space-y-6">
          {quiz.image && (
            <div className="flex justify-center mx-auto w-[350px] h-[120px] relative overflow-hidden rounded-xl bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-2">
              <Image src={quiz.image} alt={quiz.title} fill className="object-cover rounded-xl"/>
            </div>
          )}
          <h1 className="text-center text-2xl lg:text-3xl font-semibold uppercase">{ quiz.title }</h1>
          {quiz.description && (
            <p className="text-center text-lg lg:text-xl">{ quiz.description }</p>
          )}

          <div className="flex justify-center">
            <Button variant="success" size="lg" className="uppercase">Commencer le quiz</Button>
          </div>
        </div>
      )}
    </div>
  )
}

export default page