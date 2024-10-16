// stores/quizStore.ts
import { create } from 'zustand';

interface QuizState {
  currentQuestionIndex: number;
  userAnswers: { questionId: string; answerId: string }[];
  setCurrentQuestionIndex: (index: number) => void;
  addUserAnswer: (questionId: string, answerId: string) => void;
}

export const useQuizStore = create<QuizState>((set) => ({
  currentQuestionIndex: 0,
  userAnswers: [],
  setCurrentQuestionIndex: (index) => set(() => ({ currentQuestionIndex: index })),
  addUserAnswer: (questionId, answerId) =>
    set((state) => ({
      userAnswers: [...state.userAnswers, { questionId, answerId }],
    })),
}));
