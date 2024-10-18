"use client";

import { useParams } from "next/navigation";
import { getQuizById } from "@/actions/quiz-admin/quiz";
import { useEffect, useState } from "react";
import { QuizFormValues } from "@/schemas/quiz";

import { useQuizStore } from "@/stores/quizStore";

import { Button } from "@/components/ui/button";
import { getQuestionsByQuizId } from "@/actions/quiz-admin/question";
import { Question } from "@prisma/client";

import { LayoutGrid } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
type Answer = {
  id: string;
  text: string;
  isCorrect: boolean;
  order: number;  
}

type QuestionWithMultipleChoice = Question & { isMultipleChoice: boolean; }

type QuestionWithAnswers = QuestionWithMultipleChoice & { answers: Answer[] };


function Page() {
  const { id } = useParams<{ id: string }>();
  const [quiz, setQuiz] = useState<QuizFormValues | null>(null);
  const [questions, setQuestions] = useState<QuestionWithAnswers[] | null>(null);
  const [questionsLength, setQuestionsLength] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Set<string>>(new Set());
  const { currentQuestionIndex, setCurrentQuestionIndex, addUserAnswer } = useQuizStore();
  const [timeLeft, setTimeLeft] = useState<number>(60);

  const getQuiz = async () => {
    const quizData = await getQuizById(id);
    const questionsData = await getQuestionsByQuizId(id);
    if (quizData) {
      setQuiz(quizData as QuizFormValues);
    }

    if (!("error" in questionsData)) {
      setQuestions(questionsData);
      setQuestionsLength(questionsData.length);
      setTimeLeft(questionsData[0]?.timer || 60);
    } else {
      setQuestions(null);
    }
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questionsLength - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTimeLeft(questions ? questions[currentQuestionIndex + 1]?.timer : 60);
      setSelectedAnswers(new Set());
    } else {
      console.log("submit quiz");
      // Implement quiz submission logic here
    }
  };

  useEffect(() => {
    getQuiz();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    if (timeLeft === 0) {
      nextQuestion();
    }

    return () => clearInterval(timer);
  }, [timeLeft]);

  const currentQuestion = questions ? questions[currentQuestionIndex] : null;

  const handleAnswer = () => {
    if (currentQuestion && selectedAnswers.size > 0) {
      /* addUserAnswer({
        questionId: currentQuestion.id,
        answerIds: Array.from(selectedAnswers)
      });*/
      nextQuestion();
    }
  };

  const toggleAnswer = (answerId: string) => {
    setSelectedAnswers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(answerId)) {
        newSet.delete(answerId);
      } else {
        if (!currentQuestion?.isMultipleChoice) {
          newSet.clear(); // Clear previous selections for single-choice questions
        }
        newSet.add(answerId);
      }
      return newSet;
    });
  };

  return (
    <div className="grid grid-cols-12">
      {quiz && (
        <div className="col-span-4 flex flex-col pt-14 pr-8 gap-8 h-screen relative">
          {quiz.description && (
            <h1 className="text-xl text-gray-400 uppercase">{quiz.title}</h1>
          )}
          {currentQuestion && (
            <h2 className="text-3xl font-extrabold ">
              {currentQuestion.question}
            </h2>
          )}
          <div className="flex items-center gap-3">
            <span className="text-2xl text-gray-500">Temps restants</span>
            <span className="text-5xl text-gray-500 font-extrabold ">
              {timeLeft}
            </span>
            <span className="text-2xl text-gray-500">s</span>
          </div>
        </div>
      )}

      {currentQuestion && (
        <div className="col-span-8 flex flex-col space-y-8 bg-gray-100 py-14 px-8 relative">
          <div className="flex flex-col space-y-4">
            {currentQuestion.answers && currentQuestion.answers.map((answer) => (
              <div key={answer.id} className="flex items-center gap-6 relative w-full">
                <Checkbox
                  id={answer.id}
                  checked={selectedAnswers.has(answer.id)}
                  onCheckedChange={() => toggleAnswer(answer.id)}
                  className="absolute opacity-0"
                />
                <label
                  htmlFor={answer.id}
                  className={`text-sm p-6 bg-white rounded-sm w-full cursor-pointer font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${
                    selectedAnswers.has(answer.id) ? 'bg-blue-100 border-2 border-blue-500' : 'border-2 border-white'
                  }`}
                >
                  {answer.text}
                </label>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center relative">
            <Button
              variant="success"
              onClick={handleAnswer}
              disabled={selectedAnswers.size === 0}
            >
              Valider la réponse
            </Button>
            <Button variant="outline" onClick={nextQuestion}>
              Question suivante
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}


export default Page;