"use client";

import React from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Clock, ExternalLink } from "lucide-react";
import { Button } from "@heroui/button";
import Link from "next/link";
import { motion } from "framer-motion";
import { topicsList } from "@/lib/services/quiz";
import { useQuizHistory } from "../contexts/history-context";
import { formatScore } from "@/lib/formatters";

export default function TopicsPage() {
  const topics = topicsList;
  const { getHistoryForTopic } = useQuizHistory();

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="py-8">
      <h1 className="text-3xl font-bold text-center mb-2">Quiz Topics</h1>
      <p className="text-center text-sm text-default-600 mb-10">
        More topics will be available someday.
      </p>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={container}
        initial="hidden"
        animate="show">
        {topics.map((topic) => {
          const topicHistory = getHistoryForTopic(topic.id);
          const bestAttempt =
            topicHistory.length > 0
              ? topicHistory.reduce((best, current) => {
                  const currentScore =
                    current.summary.earnedPoints / current.summary.totalPoints;
                  const bestScore =
                    best.summary.earnedPoints / best.summary.totalPoints;
                  return currentScore > bestScore ? current : best;
                }, topicHistory[0])
              : null;

          return (
            <motion.div key={topic.id} variants={item}>
              <Card className="h-full">
                <CardHeader className="pb-0 pt-2 px-4 flex flex-col items-start">
                  <h4 className="font-bold text-large">{topic.title}</h4>
                  <p className="text-tiny text-default-500">
                    {topic.questionsCount} questions
                  </p>
                </CardHeader>
                <CardBody className="overflow-visible py-2">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="w-4 h-4 text-default-400" />
                    <p className="text-sm text-default-600">
                      Last Updated: {topic.lastUpdated}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <ExternalLink className="w-4 h-4 text-default-400" />
                    <a
                      href={topic.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline truncate max-w-[200px]">
                      Original Source
                    </a>
                  </div>

                  {bestAttempt && (
                    <div className="mt-2 pt-2 border-t">
                      <p className="text-xs text-default-400">Best Score</p>
                      <p className="text-sm font-medium">
                        {formatScore(
                          bestAttempt.summary.earnedPoints,
                          bestAttempt.summary.totalPoints
                        )}
                      </p>
                    </div>
                  )}
                </CardBody>
                <CardFooter className="pt-2 gap-2">
                  <Button
                    as={Link}
                    href={`/quiz/${topic.id}`}
                    color="primary"
                    className="w-full">
                    Start Quiz
                  </Button>
                  <Button
                    as={Link}
                    href={`/preview/${topic.id}`}
                    variant="flat"
                    color="primary"
                    className="w-full">
                    Preview
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
}
