"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { getQuizData, getTopic } from "@/lib/services/quiz";
import { QuizData, Question } from "@/types/quiz";
import Image from "next/image";

export default function QuizPreviewPage() {
  const params = useParams();
  const router = useRouter();
  const topicId = params.topicId as string;

  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showRightAnswers, setShowRightAnswers] = useState(false);
  const [topicName, setTopicName] = useState("");

  useEffect(() => {
    const topic = getTopic(topicId);
    if (topic) setTopicName(topic.title);

    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getQuizData(topicId);
        setQuizData(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load quiz preview. Please try again.");
        setLoading(false);
      }
    };

    fetchData();
  }, [topicId]);

  const renderQuestion = (question: Question) => {
    return (
      <Card key={question.index} className="mb-6">
        <CardBody className="py-3 px-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-2 gap-2">
            <h4 className="font-medium text-base sm:text-lg">
              Index {question.index}
            </h4>
            <span className="text-default-500 text-xs sm:text-sm">
              Points: {question.points}
            </span>
          </div>
          <p className="mb-3 text-sm sm:text-base">{question.text}</p>

          {question.image && (
            <div className="my-4 flex justify-center">
              <div className="relative h-[150px] w-full max-w-[250px] sm:max-w-[300px]">
                <Image
                  src={question.image}
                  alt="Question context image"
                  fill
                  style={{ objectFit: "contain" }}
                  className="rounded-md"
                />
              </div>
            </div>
          )}

          {question.video && (
            <div className="my-4 flex justify-center">
              <video
                controls
                className="rounded-md max-w-full h-auto max-h-[200px]"
                src={question.video}
              />
            </div>
          )}

          <div className="space-y-2">
            {question.answers.map((answer, answerIndex) => (
              <div
                key={answerIndex}
                className={`flex items-center p-2 border rounded-md ${
                  showRightAnswers && answer.checked
                    ? "bg-success-50 border-success-200"
                    : ""
                }`}>
                <div
                  className={`h-5 w-5 rounded-sm flex items-center justify-center ${
                    showRightAnswers && answer.checked
                      ? "bg-success text-white"
                      : "border border-default-300"
                  }`}>
                  {showRightAnswers && answer.checked && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  )}
                </div>
                <div className="ml-3 flex-grow">
                  {answer.text && (
                    <p className="text-sm sm:text-base">{answer.text}</p>
                  )}
                  {answer.image && (
                    <div className="mt-2 relative h-[80px] w-[120px] sm:h-[100px] sm:w-[150px]">
                      <Image
                        src={answer.image}
                        alt="Answer option"
                        fill
                        style={{ objectFit: "contain" }}
                        className="rounded-md"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !quizData) {
    return (
      <Card className="max-w-md mx-auto mt-10">
        <CardBody className="text-center py-8 px-4">
          <h2 className="text-lg sm:text-xl font-bold text-danger mb-4">
            Error
          </h2>
          <p className="mb-4 text-sm sm:text-base">
            {error || "Quiz not found"}
          </p>
          <Button
            color="primary"
            onPress={() => router.push("/topics")}
            className="text-xs sm:text-sm py-2">
            Back to Topics
          </Button>
        </CardBody>
      </Card>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-5 px-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <h1 className="text-xl sm:text-2xl font-bold">{topicName} Preview</h1>
        <Button
          variant={showRightAnswers ? "solid" : "flat"}
          color="primary"
          onPress={() => setShowRightAnswers(!showRightAnswers)}
          className="text-xs sm:text-sm py-2">
          {showRightAnswers ? "Hide" : "Show"} Correct Answers
        </Button>
      </div>

      <div className="space-y-4">
        {quizData.questions.map((question) => renderQuestion(question))}
      </div>

      <div className="flex justify-center mt-6 mb-10">
        <Button
          color="primary"
          variant="flat"
          onPress={() => router.push("/topics")}
          className="text-xs sm:text-sm py-2">
          Back to Topics
        </Button>
      </div>
    </div>
  );
}
