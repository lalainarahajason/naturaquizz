"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getQuizById } from "@/actions/quiz-admin/quiz";

import QuizzAdminForm from "@/components/quizz/quizz-admin-form";
import { Question } from "@prisma/client";
import { FormError } from "@/components/form-error";

import { Card, CardHeader, CardContent} from "@/components/ui/card";
import QuestionAdminForm from "@/components/quizz/question-admin-form";
import { QuestionFormValues } from "@/schemas/quiz";

function QuestionEdit() {

  const params = useParams<{id:string}>();
  const [error, setError] = useState<string|undefined>(undefined);
  const [question, setQuestion] = useState<Question|null>(null);
  
  return (
    <>
      {error ? (
        <Card className="w-[600px]">
          <CardHeader>
            <div className="flex justify-between">
              <h2 className="text-lg font-bold">Erreur</h2>
              <div className="text-xs max-w-[180px] font-mono p-2 bg-slate-100 rounded-md truncate">{`${params.id}`}</div>
            </div>
          </CardHeader>
          <CardContent>
            <FormError message={error} />
          </CardContent>
          
        </Card>
      ) : <QuestionAdminForm mode="create" /> }
    </>
  )
}

export default QuestionEdit