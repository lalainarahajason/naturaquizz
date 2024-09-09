"use client";

import { deleteQuiz, getQuizById, getQuizs } from "@/actions/quiz-admin/quiz";
import {
  useState,
  useEffect,
  useTransition,
  useRef,
  useCallback,
} from "react";

import { Suspense } from "react";
import Loading from "@/components/loading";

import { toast } from "sonner";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import Link from "next/link";
import { RoleGate } from "@/components/auth/role-gate";

import {
  Trash2,
  Edit,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import NoList from "@/app/(protected)/admin/_components/no-list";
import AddItem from "@/app/(protected)/admin/_components/add-item";
import { QuizFormValues } from "@/schemas/quiz";
import { FilterItems } from "@/app/(protected)/admin/_components/filter";

function ListeQuiz() {
  const [quizs, setQuizs] = useState<QuizFormValues[] | undefined>(undefined);
  const [filteredQuizs, setFilteredQuizs] = useState<QuizFormValues[] | undefined>(undefined);
  const [isPending, startTransition] = useTransition();
  const rowRefs = useRef<Map<string, HTMLTableRowElement | null>>(new Map());

  useEffect(() => {
    startTransition(() => {
      getQuizs()
        .then((results) => {
          console.log(results);
          setQuizs(results);
          setFilteredQuizs(results);
        })
        .catch((error) => {
          console.error(error);
        });
    });
  }, []);

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

  /**
   * Filters the list of quizzes based on the provided search value.
   * @param value - The search value to filter the quizzes by.
   */
  const handleFilter = (value:string) => {
    if(quizs) {
      const filtered = quizs.filter((quiz) => quiz.title.toLocaleLowerCase().includes(value.toLocaleLowerCase()))
      setFilteredQuizs(filtered);
    }
    
  }

  /**
   * Deletes a quiz from the database and updates the UI accordingly.
   * @param id - The ID of the quiz to be deleted.
   */
  const handleDeleteQuiz = async (id: string) => {
    const row = rowRefs.current.get(id);
    console.log(row);
    if (row) {
      row.style.opacity = row.style.opacity === "0.5" ? "1" : "0.5";
      row.style.pointerEvents = "none";
    }

    if (quizs) {
      deleteQuiz(id).then((response) => {
        if (response.error) {
          toast(response.error);
          // Reset opacity if there's an error
          if (row) {
            row.style.opacity = "1";
            row.style.pointerEvents = "auto";
          }
        } else {
          const newQuizs = [...quizs];
          rowRefs.current.delete(id);
          // Reset opacity if there's an error
          if (row) {
            row.style.opacity = "1";
            row.style.pointerEvents = "auto";
          }

          setQuizs(() => {
            return newQuizs.filter((quiz) => quiz.id !== id);
          });
          toast(response.success);
        }
      });
    }
  };

  return (
    
      <RoleGate allowedRole="ADMIN">
          <div className="w-full">
            <>
              {quizs && quizs.length === 0 && (
                <>
                  <NoList
                    message="🙄 Aucun quiz disponible"
                    label="ajouter"
                    link="/admin/quiz/add"
                  />
                </>
              )}
              <Suspense fallback={<Loading />}>
                {quizs && quizs.length > 0 && (
                  <>
                    <div className="flex justify-between items-center gap-2 mb-4">
                      <>
                        <h2 className="text-center uppercase font-bold text-2xl flex justify-center items-center gap-2">
                          <AddItem href="/admin/quiz/add" />
                          Tous les quizs
                        </h2>
                      </>
                    </div>
                    <FilterItems defaultValue="" handleFilter={handleFilter} placeholder="Trouver un quiz..." />
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nom</TableHead>
                          <TableHead className="text-center">Questions</TableHead>
                          <TableHead>Description</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredQuizs &&
                          filteredQuizs.map((quiz, index) => {
                            const questionsLength = quiz.questions?.length;
                            return (
                              <TableRow key={index} ref={setRowRef(quiz.id as string)}>
                                <TableCell>
                                  <h1>
                                    <Link
                                      href={`/admin/quiz/${quiz.id}`}
                                      className="hover:underline underline-offset-2"
                                    >
                                      {quiz.title}
                                    </Link>
                                  </h1>
                                </TableCell>
                                <TableCell className="text-center">
                                  <Link href={`/admin/question/liste?filterByQuiz=${encodeURIComponent(quiz.title)}`}><Badge>{questionsLength}</Badge></Link>
                                </TableCell>
                                <TableCell>{quiz.description}</TableCell>
                                <TableCell className="text-right">
                                  <div className="flex items-center justify-end gap-x-2">
                                    <Link href={`/admin/quiz/${quiz.id}`}>
                                      <Edit className="cursor-pointer" />
                                    </Link>
                                    <Button
                                      variant="link"
                                      onClick={() =>
                                        handleDeleteQuiz(quiz.id as string)
                                      }
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
              </Suspense>
            </>
          </div>
      </RoleGate>
    
  );
}

export default ListeQuiz;
