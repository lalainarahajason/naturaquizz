"use client";

import { getQuizs } from "@/actions/quiz-admin/quiz";
import { Quiz } from "@prisma/client";
import { useState, useEffect, useTransition } from "react";

import Loading from "@/components/loading";

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

function ListeQuiz() {
  const [quizs, setQuizs] = useState<Quiz[] | undefined>(undefined);
  const [isPending, startTransition] = useTransition();

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

  return (

    <div className="w-full">

      <h2 className="text-center uppercase font-bold text-2xl mb-4 flex justify-center items-center gap-2">
        <LayoutGrid />
        Tous les quizs
      </h2>

      {isPending && <Loading />}

      {quizs && (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Date de création</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {quizs.map((quiz, index) => {
                return (
                  <TableRow key={index}>
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
                        <Link href={`/admin/quiz/${quiz.id}`}>
                          <Trash2 className="cursor-pointer text-red-600" />
                        </Link>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </>
      )}
    </div>
  );
}

export default ListeQuiz;
