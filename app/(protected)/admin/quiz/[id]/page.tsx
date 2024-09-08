"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getQuizById } from "@/actions/quiz-admin/quiz";

import QuizzAdminForm from "@/components/quizz/quizz-admin-form";
import { Quiz } from "@prisma/client";
import { FormError } from "@/components/form-error";

import { Card, CardHeader, CardContent} from "@/components/ui/card";


// Cloudinary
import { getCloudinaryMedia } from "@/actions/quiz-admin/getCloudinaryMedia";
import MediaExplorer from "@/components/media-explorer";
import { CloudinarySearchResult } from "@/schemas/cloudinary";

import { RoleGate } from "@/components/auth/role-gate";

function Edit() {

  const params = useParams<{id:string}>();
  const [error, setError] = useState<string|undefined>(undefined);
  const [quiz, setQuiz] = useState<Quiz|null>(null);
  const [cloudinaryInitialData, setCloudinaryInitialData] = useState<CloudinarySearchResult|undefined>()

  
  useEffect(() => {
    const getQuiz = async () => {

      const data = await getQuizById(params.id);
      
      if(data) {
        setQuiz(data);
      } else {
        setError("Quiz non trouvé");
      }
    }
    getQuiz();

    const mediaExplorer = async () => {
      const initialData: CloudinarySearchResult = await getCloudinaryMedia({ expression: 'resource_type:image' });
      setCloudinaryInitialData(initialData);
    }
    mediaExplorer();

  }, [params.id]);

  return (
    <RoleGate allowedRole="ADMIN">
      {/* <MediaExplorer initialData={cloudinaryInitialData as CloudinarySearchResult} /> */}

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
      ) : <QuizzAdminForm initialData={quiz} mode="edit" /> }
    </RoleGate>
  )
}

export default Edit