"use client";

import { getQuizs } from "@/actions/quiz-admin/quiz";
import { Question, Quiz } from "@prisma/client";
import { useState, useEffect, useTransition, useRef, useCallback } from "react";

import { useSearchParams } from "next/navigation";

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

import { Trash2, Edit, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteQuestion, getQuestions } from "@/actions/quiz-admin/question";
import NoList from "@/app/(protected)/admin/_components/no-list";
import AddItem from "../../_components/add-item";
import { FilterItems } from "@/app/(protected)/admin/_components/filter";
import { Badge } from "@/components/ui/badge";

import Pagination from "@/components/pagination";
import Loading from "@/components/loading";

function ListeQuiz() {
  const [questions, setQuestions] = useState<Question[] | null>(null);

  const [pagination, setPagination] = useState<{
    totalQuestions: number;
    pageSize: number;
    currentPage: number;
  }>({
    totalQuestions: 0,
    pageSize: 5,
    currentPage: 1,
  });

  const totalPages = Math.ceil(pagination.totalQuestions / pagination.pageSize); // Total number of pages

  const [isPending, startTransition] = useTransition();

  const [filteredQuestions, setFilteredQuestions] = useState<Question[] | null>(
    null
  ); // Filtered list
  const searchParams = useSearchParams();

  const [quizs, setQuizs] = useState<Map<string, string>>();

  const rowRefs = useRef<Map<string, HTMLTableRowElement | null>>(new Map());

  const filterByQuiz = searchParams.get("filterByQuiz");

  const fetchQuestions = async (page: number) => {
    const offset = (page - 1) * pagination.pageSize;

    try {
      const { questions: fetchedQuestions, totalQuestions } =
        await getQuestions(offset, pagination.pageSize);

      if (fetchedQuestions) {
        setQuestions(fetchedQuestions);
        setFilteredQuestions(fetchedQuestions);
        //setTotalQuestions(totalQuestions); // Update total number of questions

        setPagination((prevPagination) => {
          return {
            ...prevPagination,
            totalQuestions,
          };
        }); // Update total number of questions
      }
    } catch (error) {
      toast((error as Error).message);
    }
  };

  const fetchQuizs = async () => {
    const quizsData = await getQuizs();

    if (quizsData) {
      const quizMap = new Map<string, string>();
      quizsData.forEach((quiz) => {
        quizMap.set(quiz.id as string, quiz.title);
        setQuizs(quizMap);
      });
    }
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      //setCurrentPage(page);
      setPagination((prevPagination) => {
        return {
          ...prevPagination,
          currentPage: page,
        };
      });
    }
  };

  // Render page numbers
  const RenderPagination = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <Button
          key={i}
          variant={i === pagination.currentPage ? "default" : "outline"}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </Button>
      );
    }
    return <div className="flex space-x-2">{pageNumbers}</div>;
  };

  useEffect(() => {
    startTransition(() => {
      fetchQuestions(pagination.currentPage);
      fetchQuizs();
    });
  }, [pagination.currentPage]);

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

  const handleFilter = (value: string) => {
    if (questions) {
      const filteredQuestions = questions.filter((question) => {
        const quizTitle = quizs?.get(question.quizId as string);
        return (
          question.question.toLowerCase().includes(value.toLowerCase()) ||
          quizTitle?.toLowerCase().includes(value.toLowerCase())
        );
      });
      console.log(filteredQuestions);
      setFilteredQuestions(filteredQuestions);
    }
  };

  const handleDeleteQuestion = (id: string) => {
    const row = rowRefs.current.get(id);

    if (row) {
      row.style.opacity = row.style.opacity === "0.5" ? "1" : "0.5";
      row.style.pointerEvents = "none";
    }

    if (questions) {
      deleteQuestion(id).then((response) => {
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

          setFilteredQuestions(() => {
            return newQuestions.filter((question) => question.id !== id);
          });

          toast(response.success);
        }
      });
    }
  };

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

        {questions && questions.length > 0 && filteredQuestions && (
          <>
            <h2 className="font-bold text-2xl mb-4 flex items-center gap-2">
              <AddItem href="/admin/question/add" />
              Toutes les questions
            </h2>
            {filteredQuestions.length === 0 && (
              <div className="bg-gray-100 p-10">
                <div className="text-sm">
                  Aucun résultat, essayez une autre filtre
                </div>
                <FilterItems
                  defaultValue={filterByQuiz || ""}
                  handleFilter={handleFilter}
                  placeholder="Filtrer par quiz..."
                />
              </div>
            )}

            {filteredQuestions.length > 0 && (
              <>
                {isPending && <Loading />}

                {!isPending && (
                  <>
                    <FilterItems
                      defaultValue={filterByQuiz || ""}
                      handleFilter={handleFilter}
                      placeholder="Filtrer par quiz..."
                    />
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="lg:w-[350px]">
                            Question
                          </TableHead>
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
                                {question.quizId ? (
                                  <Link href={`/admin/quiz/${question.quizId}`}>
                                    <Badge variant="success">
                                      {quizs?.get(question.quizId as string)}
                                    </Badge>
                                  </Link>
                                ) : (
                                  <Badge variant="outline">non classé</Badge>
                                )}
                              </TableCell>
                              <TableCell>{`${question.timer} s`}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-x-2">
                                  <Link href={`/admin/question/${question.id}`}>
                                    <Edit className="cursor-pointer" />
                                  </Link>
                                  <Button
                                    variant="link"
                                    onClick={() =>
                                      handleDeleteQuestion(question.id)
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
                    {/* Pagination Controls */}
                    <div className="flex justify-center my-4">
                      <Pagination
                        currentPage={pagination.currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                      />
                    </div>
                  </>
                )}
              </>
            )}
          </>
        )}
      </>
    </div>
  );
}

export default ListeQuiz;
