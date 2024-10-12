"use client";

import { getQuizById, getQuizs } from "@/actions/quiz-admin/quiz";
import { useEffect, useState } from "react";
import { QuizFormValues } from "@/schemas/quiz";
import Image from 'next/image';
import { useRouter } from "next/navigation";

function QuizList() {

    const [quizs, setQuizs] = useState<QuizFormValues[]|null>(null);

    const router = useRouter()

    function showQuiz(id:string) {
        router.push(`/quiz/${id}`)
    }

    useEffect(() => {

        const quizsData = async () => {
            const data = await getQuizs();
            setQuizs(data);
        }

        quizsData();

    }, []);
    
    return (
        <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {quizs && quizs.map((quiz) => (
                <div key={quiz.id} onClick={() => showQuiz(quiz.id as string)} className="border rounded-lg shadow-sm overflow-hidden cursor-pointer">
                    <div className="h-[150px] w-full relative bg-gray-100">
                        {quiz.image && (
                            <Image src={quiz.image as string} fill={true} alt={quiz.title} style={{objectFit:"cover"}} />
                        )}
                    </div>
                    <div className="p-8">
                        <h2 className="text-xl font-semibold mb-2">{quiz.title}</h2>
                        <p className="text-gray-600 text-md">{quiz.description}</p>
                    </div>
                </div>
                ))}
            </div>
            </div>
    )
}

export default QuizList