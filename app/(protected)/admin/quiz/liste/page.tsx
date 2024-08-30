"use client";

import { deleteQuiz, getQuizById, getQuizs } from "@/actions/quiz-admin/quiz";
import { Quiz } from "@prisma/client";
import { useState, useEffect, useTransition, useRef, useCallback, RefObject } from "react";

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

function ListeQuiz() {
  const [quizs, setQuizs] = useState<Quiz[] | undefined>(undefined);
  const [isPending, startTransition] = useTransition();

  const rowRefs = useRef<Map<string, HTMLTableRowElement | null>>(new Map());

  useEffect(() => {
    startTransition(() => {
      getQuizs()
        .then((results) => {
          console.log(results)
          setQuizs(results);
        })
        .catch((error) => {
          console.error(error);
        });
    });
  }, []);

const setRowRef = useCallback((id: string) => (el: HTMLTableRowElement | null) => {
  if (el) {
    rowRefs.current.set(id, el);
  } else {
    rowRefs.current.delete(id);
  }
}, []);

  const handleDeleteQuiz = async (id: string) => {

    const row = rowRefs.current.get(id);
    console.log(row)
      if (row) {
        row.style.opacity = row.style.opacity === '0.5' ? '1' : '0.5';
        row.style.pointerEvents = 'none';
      }

      if(quizs) {
        deleteQuiz(id)
          .then(response => {
            if(response.error) {
              toast(response.error);
              // Reset opacity if there's an error
              if (row) {
                row.style.opacity = '1';
                row.style.pointerEvents = 'auto';
              }
            } else {
              const newQuizs = [...quizs];
              rowRefs.current.delete(id);
              // Reset opacity if there's an error
              if (row) {
                row.style.opacity = '1';
                row.style.pointerEvents = 'auto';
              }
              
              setQuizs(() => {
                return newQuizs.filter(quiz => quiz.id !== id)
              });
              toast(response.success);
            }
          })
      }
  }

  return (

    <div className="w-full">

      <h2 className="text-center uppercase font-bold text-2xl mb-4 flex justify-center items-center gap-2">
        <LayoutGrid />
        Tous les quizs
      </h2>

      {isPending && <Loading />}
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Date de création</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody >
              {isPending && (
                <TableRow>
                  <TableCell colSpan={3}>
                    <Loading />
                  </TableCell>
                </TableRow>
              )}
              {quizs && quizs.map((quiz, index) => {
                return (
                  <TableRow key={index} ref={setRowRef(quiz.id)} >
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
                    <TableCell>
                      {moment(quiz.createdAt).format("DD/MM/YYYY")}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-x-2">
                        <Link href={`/admin/quiz/${quiz.id}`}>
                          <Edit className="cursor-pointer" />
                        </Link>
                        <Button variant="link" onClick={() => handleDeleteQuiz(quiz.id)}>
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
    </div>
  );
}

export default ListeQuiz;
