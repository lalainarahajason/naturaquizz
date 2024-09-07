"use client";

import { deleteQuiz, getQuizById, getQuizs } from "@/actions/quiz-admin/quiz";
import { Question, Quiz } from "@prisma/client";
import {
  useState,
  useEffect,
  useTransition,
  useRef,
  useCallback,
  RefObject,
} from "react";

import { useSearchParams } from "next/navigation";

import Loading from "@/components/loading";

import { toast } from "sonner";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import moment from "moment";
import Link from "next/link";

import { Trash2, Edit, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getQuestions } from "@/actions/quiz-admin/question";
import NoList from "@/app/(protected)/admin/_components/no-list";
import AddItem from "../../_components/add-item";
import { FilterItems } from "@/app/(protected)/admin/_components/filter";

function ListeQuiz() {
  const [questions, setQuestions] = useState<Question[] | null>(null);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[] | null>(null); // Filtered list
  const searchParams = useSearchParams();

  const [quizs, setQuizs] = useState<Map<string, string>>();
  const [isPending, startTransition] = useTransition();

  const rowRefs = useRef<Map<string, HTMLTableRowElement | null>>(new Map());

  const filterByQuiz = searchParams.get('filterByQuiz');

  useEffect(() => {
    startTransition(() => {

      

      getQuestions()
        .then((results) => {

          setQuestions(results);
          setFilteredQuestions(results);

          // get quizs
          getQuizs().then((quizData) => {
            const quizMap = new Map<string, string>();
            quizData.forEach((quiz) => {
              quizMap.set(quiz.id as string, quiz.title);
              setQuizs(quizMap);

            

            });
          });
        })
        .catch((error) => {
          console.error(error);
        });

        
    });
  }, []);

  useEffect(() => {
    if (filterByQuiz && questions && quizs) {
      handleFilter(filterByQuiz);
    }
  }, [filterByQuiz, questions, quizs]); // Run when filterByQuiz, questions, or quizs changes

  const setRowRef = useCallback(
    (id: string) => (el: HTMLTableRowElement | null) => {
      if (el) {
        rowRefs.current.set(id, el);
      } else {
        rowRefs.current.delete(id);
      }
    },
    []
  );

  const handleDeleteQuiz = async (id: string) => {
    const row = rowRefs.current.get(id);
    console.log(row);
    if (row) {
      row.style.opacity = row.style.opacity === "0.5" ? "1" : "0.5";
      row.style.pointerEvents = "none";
    }

    if (questions) {
      deleteQuiz(id).then((response) => {
        if (response.error) {
          toast(response.error);
          // Reset opacity if there's an error
          if (row) {
            row.style.opacity = "1";
            row.style.pointerEvents = "auto";
          }
        } else {
          const newQuestions = [...questions];
          rowRefs.current.delete(id);
          // Reset opacity if there's an error
          if (row) {
            row.style.opacity = "1";
            row.style.pointerEvents = "auto";
          }

          setQuestions(() => {
            return newQuestions.filter((question) => question.id !== id);
          });
          toast(response.success);
        }
      });
    }
  };

  const handleFilter = (value:string) => {
    if(questions) {
      const filteredQuestions = questions.filter((question) => {
        const quizTitle = quizs?.get(question.quizId);
        return (
          question.question.toLowerCase().includes(value.toLowerCase()) ||
          quizTitle?.toLowerCase().includes(value.toLowerCase())
        );
      });
      console.log(filteredQuestions)
      setFilteredQuestions(filteredQuestions);
    }
  }

  return (
    <div className="w-full">
      <>
        {questions && questions.length === 0 && (
          <NoList
            message="🙄 Aucune question disponible"
            label="ajouter"
            link="/admin/question/add"
          />
        )}
        
        {filteredQuestions && (
          <>
            <h2 className="uppercase font-bold text-2xl mb-4 flex items-center gap-2">
              <AddItem href="/admin/question/add" />
              Toutes les questions
            </h2>
            {filteredQuestions.length === 0 && (
              <div className="bg-gray-100 p-10">
                <div className="text-sm">Aucun résultat, essayez une autre filtre</div>
                <FilterItems defaultValue={filterByQuiz || ""} handleFilter={handleFilter} placeholder="Filtrer par quiz..."/>
              </div>
            )}

            
            
            {filteredQuestions.length > 0 && (
              <>
              <FilterItems defaultValue={filterByQuiz || ""} handleFilter={handleFilter} placeholder="Filtrer par quiz..."/>
              <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Question</TableHead>
                  <TableHead>Quiz</TableHead>
                  <TableHead>Timer</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredQuestions.map((question, index) => {
                  return (
                    <TableRow key={index} ref={setRowRef(question.id)}>
                      <TableCell>
                        <h1>
                          <Link
                            href={`/admin/question/${question.id}`}
                            className="hover:underline underline-offset-2"
                          >
                            {question.question}
                          </Link>
                        </h1>
                      </TableCell>
                      <TableCell>
                        <Link href={`/admin/quiz/${question.quizId}`}>
                          {quizs?.get(question.quizId) || "Chargement ..."}
                        </Link>
                      </TableCell>
                      <TableCell>{`${question.timer} s`}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-x-2">
                          <Link href={`/admin/quiz/${question.id}`}>
                            <Edit className="cursor-pointer" />
                          </Link>
                          <Button
                            variant="link"
                            onClick={() => handleDeleteQuiz(question.id)}
                          >
                            <Trash2 className="cursor-pointer text-red-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
            </>
            )}
            
          </>
        )}
      </>
    </div>
  );
}

export default ListeQuiz;
