"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Question } from "@/types/quiz";

interface MistakeTrainerQuestion {
  question: Question;
  topicId: string;
  topicName: string;
  correctCount: number;
  incorrectCount: number;
  dateAdded: string;
}

interface MistakeTrainerContextType {
  mistakeQuestions: MistakeTrainerQuestion[];
  addMistakeQuestion: (
    question: Question,
    topicId: string,
    topicName: string
  ) => void;
  updateQuestionResult: (questionIndex: string, isCorrect: boolean) => void; 
  clearMistakeTrainer: () => void;
  getMistakeTrainerQuiz: () => {
    questions: Question[];
    totalQuestions: number;
  };
}

const MistakeTrainerContext = createContext<
  MistakeTrainerContextType | undefined
>(undefined);

export function MistakeTrainerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mistakeQuestions, setMistakeQuestions] = useState<
    MistakeTrainerQuestion[]
  >([]);

  useEffect(() => {
    const savedMistakes = localStorage.getItem("mistakeTrainer");
    if (savedMistakes) {
      try {
        setMistakeQuestions(JSON.parse(savedMistakes));
      } catch (error) {
        console.error("Failed to parse mistake trainer data:", error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("mistakeTrainer", JSON.stringify(mistakeQuestions));
  }, [mistakeQuestions]);

  const addMistakeQuestion = (
    question: Question,
    topicId: string,
    topicName: string
  ) => {
    setMistakeQuestions((prevMistakes) => {
      const existingIndex = prevMistakes.findIndex(
        (mistake) =>
          mistake.question.index === question.index &&
          mistake.topicId === topicId
      );

      if (existingIndex !== -1) {
        const updated = [...prevMistakes];
        updated[existingIndex] = {
          ...updated[existingIndex],
          incorrectCount: updated[existingIndex].incorrectCount + 1,
          correctCount: 0, 
        };
        return updated;
      } else {
        const newMistake: MistakeTrainerQuestion = {
          question,
          topicId,
          topicName,
          correctCount: 0,
          incorrectCount: 1,
          dateAdded: new Date().toISOString(),
        };
        return [newMistake, ...prevMistakes];
      }
    });
  };

  const updateQuestionResult = (questionIndex: string, isCorrect: boolean) => {

    setMistakeQuestions((prevMistakes) => {
      const updated = prevMistakes.map((mistake) => {
        if (mistake.question.index === questionIndex) {

          if (isCorrect) {
            const newCorrectCount = mistake.correctCount + 1;
            return {
              ...mistake,
              correctCount: newCorrectCount,
            };
          } else {
            return {
              ...mistake,
              incorrectCount: mistake.incorrectCount + 1,
              correctCount: 0, 
            };
          }
        }
        return mistake;
      });

      return updated.filter((mistake) => mistake.correctCount < 4);
    });
  };

  const clearMistakeTrainer = () => {
    setMistakeQuestions([]);
  };

  const getMistakeTrainerQuiz = () => {
    return {
      questions: mistakeQuestions.map((mistake) => mistake.question),
      totalQuestions: mistakeQuestions.length,
    };
  };

  return (
    <MistakeTrainerContext.Provider
      value={{
        mistakeQuestions,
        addMistakeQuestion,
        updateQuestionResult,
        clearMistakeTrainer,
        getMistakeTrainerQuiz,
      }}>
      {children}
    </MistakeTrainerContext.Provider>
  );
}

export function useMistakeTrainer() {
  const context = useContext(MistakeTrainerContext);
  if (context === undefined) {
    throw new Error(
      "useMistakeTrainer must be used within a MistakeTrainerProvider"
    );
  }
  return context;
}
