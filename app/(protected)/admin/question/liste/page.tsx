"use client";

import { getQuizs } from "@/actions/quiz-admin/quiz";
import { Question } from "@prisma/client";
import { useState, useEffect, useTransition, useRef, useCallback } from "react";

import { useSearchParams, usePathname, useRouter } from "next/navigation";

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
    totalPages:number;
  }>({
    totalQuestions: 0,
    pageSize: 10,
    currentPage: 1,
    totalPages: 0
  });

  //const totalPages = Math.ceil(pagination.totalQuestions / pagination.pageSize); // Total number of pages

  const [isPending, startTransition] = useTransition();

  const [filteredQuestions, setFilteredQuestions] = useState<Question[] | null>(
    null
  ); // Filtered list
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const { replace } = useRouter();

  const [filterValue, setFilterValue] = useState<string| "">("");

  const [quizs, setQuizs] = useState<Map<string, string>>();

  const rowRefs = useRef<Map<string, HTMLTableRowElement | null>>(new Map());

  const filterByQuiz = searchParams.get("filter_by_quiz");

  const fetchQuestions = useCallback(async (page: number) => {
    const offset = (page - 1) * pagination.pageSize;

    try {
      const filterQuery = {
        field: "quizId" as string,
        s: filterValue as string
      };

      const { questions: fetchedQuestions, totalQuestions } =
        await getQuestions(offset, pagination.pageSize, filterQuery);

      if (fetchedQuestions) {
        setQuestions(fetchedQuestions);
        setFilteredQuestions(fetchedQuestions);
        
        setPagination((prevPagination) => ({
          ...prevPagination,
          totalQuestions,
          totalPages: Math.ceil(totalQuestions / prevPagination.pageSize)
        }));
      }
    } catch (error) {
      toast((error as Error).message);
    }
  }, [pagination.pageSize, filterValue]);

  const fetchQuizs = useCallback(async () => {
    const quizsData = await getQuizs();

    if (quizsData) {
      const quizMap = new Map<string, string>();
      quizsData.forEach((quiz) => {
        quizMap.set(quiz.id as string, quiz.title);
        setQuizs(quizMap);
      });
    }
  }, []);

  // Handle page change
  const handlePageChange = useCallback((page: number) => {
    if (page >= 1 && page <= pagination.totalPages) {
      //setCurrentPage(page);
      setPagination((prevPagination) => {
        return {
          ...prevPagination,
          currentPage: page,
        };
      });
    }
  }, [pagination.totalPages]);

  useEffect(() => {

    startTransition(() => {

      fetchQuestions(pagination.currentPage);
      
      fetchQuizs();

    });
  }, [pagination.currentPage, filterByQuiz, filterValue,fetchQuestions, fetchQuizs]);

  useEffect(() => {
    if (filterByQuiz) {
      handleFilter(filterByQuiz);
    }
  }, [filterByQuiz]); // Run when filterByQuiz, questions, or quizs changes

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

    if(value) {
        setFilterValue(value)
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
              Toutes les questions <span className="text text-sm text-black/50"> ({pagination.totalQuestions}) </span>
            </h2>
            {filteredQuestions.length === 0 && (
              <div className="bg-gray-100 p-10">
                <div className="text-sm">
                  Aucun résultat, essayez une autre filtre
                </div>
                <FilterItems
                  handleFilter={handleFilter}
                  placeholder="Filtrer par quiz..."
                  data={quizs}
                  filterValue={filterValue}
                />
              </div>
            )}

            

            {filteredQuestions.length > 0 && (
              <>
                {isPending && <Loading />}

                <FilterItems
                      handleFilter={handleFilter}
                      placeholder="Filtrer par quiz..."
                      data={quizs}
                      filterValue={filterValue}
                />

                {!isPending && (
                  <>
                    
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
                      {pagination.totalPages > 1 && <Pagination
                        currentPage={pagination.currentPage}
                        totalPages={pagination.totalPages}
                        onPageChange={handlePageChange}
                      />}
                      
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
