"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@heroui/button";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { useQuizHistory } from "../contexts/history-context";
import { getTopic } from "@/lib/services/quiz";
import { formatTime, formatScore, getQuizStatusColor } from "@/lib/formatters";

export default function HistoryPage() {
  const { history, clearHistory } = useQuizHistory();

  if (history.length === 0) {
    return (
      <div className="py-4 px-3 sm:py-6 sm:px-4">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-4 sm:mb-6">
          History
        </h1>
        <Card className="max-w-md mx-auto shadow-md hover:shadow-lg transition-shadow">
          <CardBody className="text-center py-8 px-4 sm:py-12 sm:px-6">
            <p className="mb-4 text-sm sm:text-base md:text-lg text-gray-600">
              You haven't taken any quizzes yet.
            </p>
            <Button
              as={Link}
              href="/topics"
              color="primary"
              className="px-5 py-2.5 text-sm sm:text-base font-medium">
              Start a Quiz
            </Button>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="py-6 px-3 sm:py-8 sm:px-4 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-3">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">
          Quiz History
        </h1>
        <Button
          color="danger"
          variant="light"
          onPress={clearHistory}
          className="text-xs sm:text-sm py-2 px-4">
          Clear History
        </Button>
      </div>

      <div className="space-y-4 sm:space-y-6">
        {history.map((item, index) => {
          const topic = getTopic(item.topicId);
          const percentageScore =
            (item.summary.earnedPoints / item.summary.totalPoints) * 100;
          const statusColor = getQuizStatusColor(percentageScore);
          const date = new Date(item.date);

          return (
            <Card
              key={index}
              className="shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
              <div className={`h-1 sm:h-2 w-full bg-${statusColor}-500`}></div>
              <CardBody className="px-4 py-4 sm:px-6 sm:py-5">
                <div className="flex flex-col gap-3 sm:gap-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-3">
                    <div>
                      <h3 className="font-bold text-base sm:text-lg md:text-xl mb-1">
                        {topic?.title || `Topic ${item.topicId}`}
                      </h3>
                      <p className="text-gray-500 text-xs sm:text-sm">
                        {date.toLocaleDateString()} ·{" "}
                        {date.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                    <div
                      className={`px-3 py-1 sm:px-4 sm:py-1.5 rounded-full bg-${statusColor}-500 text-white font-semibold text-xs sm:text-sm`}>
                      {formatScore(
                        item.summary.earnedPoints,
                        item.summary.totalPoints
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-2">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="bg-blue-600 p-2 sm:p-2.5 rounded-full">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 sm:h-5 sm:w-5 text-white"
                          viewBox="0 0 20 20"
                          fill="currentColor">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-0.5">Points</p>
                        <p className="font-semibold text-sm sm:text-base">
                          {item.summary.earnedPoints}/{item.summary.totalPoints}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="bg-green-600 p-2 sm:p-2.5 rounded-full">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 sm:h-5 sm:w-5 text-white"
                          viewBox="0 0 20 20"
                          fill="currentColor">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-0.5">Correct</p>
                        <p className="font-semibold text-sm sm:text-base">
                          {item.summary.correctQuestions}/
                          {item.summary.totalQuestions}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="bg-purple-600 p-2 sm:p-2.5 rounded-full">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 sm:h-5 sm:w-5 text-white"
                          viewBox="0 0 20 20"
                          fill="currentColor">
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 mb-0.5">Time</p>
                        <p className="font-semibold text-sm sm:text-base">
                          {formatTime(item.summary.timeTaken)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardBody>
              <div className="px-4 py-3 sm:px-6 sm:py-4 border-t flex justify-start">
                <Button
                  as={Link}
                  href={`/quiz/${item.topicId}`}
                  color="primary"
                  size="md"
                  className="px-4 py-2 text-sm sm:px-5 sm:text-base">
                  Retake Quiz
                </Button>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
