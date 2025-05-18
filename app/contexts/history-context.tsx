"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { QuizSummary, TopicInfo } from "@/types/quiz";

interface QuizHistoryItem {
  topicId: string;
  date: string;
  summary: QuizSummary;
}

interface QuizHistoryContextType {
  history: QuizHistoryItem[];
  addToHistory: (topicId: string, summary: QuizSummary) => void;
  clearHistory: () => void;
  getHistoryForTopic: (topicId: string) => QuizHistoryItem[];
}

const QuizHistoryContext = createContext<QuizHistoryContextType | undefined>(
  undefined
);

export function QuizHistoryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [history, setHistory] = useState<QuizHistoryItem[]>([]);

  useEffect(() => {
    const savedHistory = localStorage.getItem("quizHistory");
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error("Failed to parse quiz history:", error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("quizHistory", JSON.stringify(history));
  }, [history]);

  const addToHistory = (topicId: string, summary: QuizSummary) => {
    const newItem: QuizHistoryItem = {
      topicId,
      date: new Date().toISOString(),
      summary,
    };

    setHistory((prevHistory) => [newItem, ...prevHistory]);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const getHistoryForTopic = (topicId: string) => {
    return history.filter((item) => item.topicId === topicId);
  };

  return (
    <QuizHistoryContext.Provider
      value={{
        history,
        addToHistory,
        clearHistory,
        getHistoryForTopic,
      }}>
      {children}
    </QuizHistoryContext.Provider>
  );
}

export function useQuizHistory() {
  const context = useContext(QuizHistoryContext);
  if (context === undefined) {
    throw new Error("useQuizHistory must be used within a QuizHistoryProvider");
  }
  return context;
}
