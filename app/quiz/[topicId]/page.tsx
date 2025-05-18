"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@heroui/button";
import { Card, CardHeader, CardBody } from "@heroui/card";
import { getQuizData, getTopic } from "@/lib/services/quiz";
import { QuizData, Question, QuizResult, QuizSummary } from "@/types/quiz";
import { motion } from "framer-motion";
import Image from "next/image";
import { useQuizHistory } from "@/app/contexts/history-context";

const Checkbox = ({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) => {
  return (
    <div
      className={`h-5 w-5 border-2 rounded flex items-center justify-center cursor-pointer transition-colors ${
        checked ? "bg-gray-400 border-primary" : "border-default-300"
      }`}
      onClick={onChange}>
      {checked && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-red">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
      )}
    </div>
  );
};

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const topicId = params.topicId as string;

  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<boolean[][]>([]);
  const [quizStarted, setQuizStarted] = useState(false);
  const [quizFinished, setQuizFinished] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [summary, setSummary] = useState<QuizSummary | null>(null);
  const [topicName, setTopicName] = useState("");
  const [showSpoilers, setShowSpoilers] = useState(false);
  const [showFinishConfirm, setShowFinishConfirm] = useState(false);
  const [showCorrectCount, setShowCorrectCount] = useState(true);
  const [randomizeAnswers, setRandomizeAnswers] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!quizStarted || quizFinished) return;

      switch (event.key) {
        case "ArrowRight":
          if (currentQuestionIndex < (quizData?.questions.length || 0) - 1) {
            goToNextQuestion();
          }
          break;
        case "ArrowLeft":
          if (currentQuestionIndex > 0) {
            goToPreviousQuestion();
          }
          break;
        case "Enter":
          if (currentQuestionIndex === (quizData?.questions.length || 0) - 1) {
            finishQuiz();
          } else {
            goToNextQuestion();
          }
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentQuestionIndex, quizData, quizStarted, quizFinished]);

  useEffect(() => {
    const topic = getTopic(topicId);
    if (topic) setTopicName(topic.title);

    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getQuizData(topicId);
        setQuizData(data);
        setUserAnswers(
          data.questions.map((question) =>
            Array(question.answers.length).fill(false)
          )
        );
        setLoading(false);
      } catch (err) {
        setError("Failed to load quiz data. Please try again.");
        setLoading(false);
      }
    };

    fetchData();
  }, [topicId]);

  const startQuiz = () => {
    setQuizStarted(true);
    setStartTime(Date.now());
  };

  const handleCheckboxChange = (answerIndex: number) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestionIndex] = [...newAnswers[currentQuestionIndex]];
    newAnswers[currentQuestionIndex][answerIndex] =
      !newAnswers[currentQuestionIndex][answerIndex];
    setUserAnswers(newAnswers);
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < (quizData?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const calculateResults = (): {
    results: QuizResult[];
    summary: QuizSummary;
  } => {
    if (!quizData) throw new Error("Quiz data is missing");

    const endTimeValue = endTime || Date.now();
    const startTimeValue = startTime || endTimeValue;
    const timeTaken = Math.floor((endTimeValue - startTimeValue) / 1000);

    let correctCount = 0;
    let incorrectCount = 0;
    let unansweredCount = 0;
    let totalPoints = 0;
    let earnedPoints = 0;

    const questionResults: QuizResult[] = quizData.questions.map(
      (question, qIndex) => {
        const userSelectedAnswers = userAnswers[qIndex];
        const isUnanswered = userSelectedAnswers.every((ans) => !ans);

        let isCorrect = true;
        for (let i = 0; i < question.answers.length; i++) {
          if (userSelectedAnswers[i] !== question.answers[i].checked) {
            isCorrect = false;
            break;
          }
        }

        const points = parseInt(question.points) || 0;
        totalPoints += points;

        if (isUnanswered) {
          unansweredCount++;
        } else if (isCorrect) {
          correctCount++;
          earnedPoints += points;
        } else {
          incorrectCount++;
        }

        return {
          questionId: question.index,
          userAnswers: userSelectedAnswers,
          isCorrect,
          isUnanswered,
          points: question.points,
        };
      }
    );

    const summary: QuizSummary = {
      totalQuestions: quizData.questions.length,
      correctQuestions: correctCount,
      incorrectQuestions: incorrectCount,
      unansweredQuestions: unansweredCount,
      totalPoints,
      earnedPoints,
      timeTaken,
    };

    return { results: questionResults, summary };
  };

  const { addToHistory } = useQuizHistory();

  const finishQuiz = () => {
    setEndTime(Date.now());
    const { results: quizResults, summary: quizSummary } = calculateResults();
    setResults(quizResults);
    setSummary(quizSummary);
    setQuizFinished(true);
    addToHistory(topicId, quizSummary);
    setShowFinishConfirm(false);
  };

  const handleFinishQuizClick = () => {
    if (currentQuestionIndex < (quizData?.questions.length || 0) - 1) {
      setShowFinishConfirm(true);
    } else {
      finishQuiz();
    }
  };

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const displayedAnswers = useMemo(() => {
    if (!quizData || !quizData.questions[currentQuestionIndex]) return [];
    const answers = quizData.questions[currentQuestionIndex].answers;
    return randomizeAnswers ? shuffleArray(answers) : answers;
  }, [quizData, currentQuestionIndex, randomizeAnswers]);

  const renderQuestion = (question: Question) => {
    const correctAnswersCount = question.answers.filter(
      (answer) => answer.checked
    ).length;

    return (
      <motion.div
        key={question.index}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        className="space-y-4 px-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
          <h2 className="text-base sm:text-base text-gray-500 font-semibold">
            Index {question.index}
          </h2>
          <div className="flex items-center space-x-2">
            <span className="text-default-500 text-xs sm:text-sm">
              Points: {question.points}
            </span>
            {showCorrectCount && (
              <span className="text-default-500 text-xs sm:text-sm">
                Correct: {correctAnswersCount}
              </span>
            )}
            <Button
              size="sm"
              variant="flat"
              onPress={() => setShowSpoilers(!showSpoilers)}
              className="text-xs sm:text-sm">
              {showSpoilers ? "Hide" : "Spoiler"} Answers
            </Button>
          </div>
        </div>

        <p className="text-base sm:text-lg font-bold text-gray-300 mb-4">
          {question.text}
        </p>

        {question.image && (
          <div className="my-4 flex justify-center">
            <div className="relative h-[200px] w-full max-w-[350px] sm:max-w-[400px]">
              <Image
                src={question.image}
                alt="Question image"
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

        <div className="space-y-3">
          {displayedAnswers.map((answer, displayIndex) => {
            const originalIndex = question.answers.findIndex(
              (a) => a === answer
            );
            return (
              <div
                onClick={() => handleCheckboxChange(originalIndex)}
                className={`flex items-center p-3 border rounded-md transition-colors hover:bg-default-100 cursor-pointer ${
                  showSpoilers && answer.checked
                    ? "bg-success-50 border-success-200"
                    : ""
                }`}
                key={originalIndex}>
                <Checkbox
                  checked={
                    userAnswers[currentQuestionIndex]?.[originalIndex] || false
                  }
                  onChange={() => handleCheckboxChange(originalIndex)}
                />
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
            );
          })}
        </div>
      </motion.div>
    );
  };

  const renderQuizProgress = () => {
    if (!quizData) return null;

    return (
      <div className="w-full bg-default-100 rounded-full h-2 mb-4">
        <div
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{
            width: `${((currentQuestionIndex + 1) / quizData.questions.length) * 100}%`,
          }}></div>
      </div>
    );
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const renderResults = () => {
    if (!summary) return null;

    return (
      <div className="space-y-6 mt-5 px-4">
        <div className="text-center">
          <h2 className="text-xl sm:text-2xl font-bold mb-2">
            Quiz Completed!
          </h2>
          <p className="text-default-500 text-sm sm:text-base">
            You completed the {topicName} quiz in{" "}
            {formatTime(summary.timeTaken)}
          </p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <h3 className="text-lg sm:text-xl font-semibold">Your Results</h3>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="text-center p-3 bg-success-50 rounded-md">
                <p className="text-success font-bold text-xl sm:text-2xl">
                  {summary.correctQuestions}
                </p>
                <p className="text-success-600 text-xs sm:text-sm">Correct</p>
              </div>
              <div className="text-center p-3 bg-danger-50 rounded-md">
                <p className="text-danger font-bold text-xl sm:text-2xl">
                  {summary.incorrectQuestions}
                </p>
                <p className="text-danger-600 text-xs sm:text-sm">Incorrect</p>
              </div>
              <div className="text-center p-3 bg-warning-50 rounded-md">
                <p className="text-warning font-bold text-xl sm:text-2xl">
                  {summary.unansweredQuestions}
                </p>
                <p className="text-warning-600 text-xs sm:text-sm">
                  Unanswered
                </p>
              </div>
              <div className="text-center p-3 bg-primary-50 rounded-md">
                <p className="text-primary font-bold text-xl sm:text-2xl">
                  {summary.earnedPoints}/{summary.totalPoints}
                </p>
                <p className="text-primary-600 text-xs sm:text-sm">Points</p>
              </div>
            </div>
          </CardBody>
        </Card>

        <div className="space-y-4">
          <h3 className="text-lg sm:text-xl font-semibold">Question Review</h3>
          {results.map((result, index) => {
            const question = quizData?.questions[index];
            if (!question) return null;

            return (
              <Card
                key={result.questionId}
                className={`border-l-4 ${
                  result.isUnanswered
                    ? "border-l-warning"
                    : result.isCorrect
                      ? "border-l-success"
                      : "border-l-danger"
                }`}>
                <CardBody className="py-3 px-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium text-base sm:text-lg">
                      Aurelion {result.questionId}
                    </h4>
                    <span
                      className={`text-xs sm:text-sm px-2 py-1 rounded-full ${
                        result.isUnanswered
                          ? "bg-warning-100 text-warning-700"
                          : result.isCorrect
                            ? "bg-success-100 text-success-700"
                            : "bg-danger-100 text-danger-700"
                      }`}>
                      {result.isUnanswered
                        ? "Unanswered"
                        : result.isCorrect
                          ? "Correct"
                          : "Incorrect"}
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
                          result.userAnswers[answerIndex] && answer.checked
                            ? "bg-success-50 border-success-200"
                            : result.userAnswers[answerIndex] && !answer.checked
                              ? "bg-danger-50 border-danger-200"
                              : ""
                        }`}>
                        <div
                          className={`h-5 w-5 rounded-sm flex items-center justify-center ${
                            answer.checked
                              ? "bg-success text-white"
                              : "border border-default-300"
                          }`}>
                          {answer.checked && (
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
                            <p className="text-sm sm:text-base">
                              {answer.text}
                            </p>
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
                        {result.userAnswers[answerIndex] && (
                          <div className="flex-shrink-0">
                            <span
                              className={`text-xs sm:text-sm ${
                                answer.checked ? "text-success" : "text-danger"
                              }`}>
                              Your choice
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardBody>
              </Card>
            );
          })}
        </div>

        <div className="flex justify-center gap-3 sm:gap-4 pt-4">
          <Button
            color="primary"
            variant="flat"
            onPress={() => router.push("/topics")}
            className="text-xs sm:text-sm py-2">
            Return to Topics
          </Button>
          <Button
            color="primary"
            onPress={() => {
              setQuizStarted(false);
              setQuizFinished(false);
              setCurrentQuestionIndex(0);
              setUserAnswers(quizData?.questions.map(() => []) || []);
              setResults([]);
              setSummary(null);
              setStartTime(null);
              setEndTime(null);
            }}
            className="text-xs sm:text-sm py-2">
            Retry Quiz
          </Button>
        </div>
      </div>
    );
  };

  const renderFinishConfirmPopup = () => {
    if (!showFinishConfirm) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <Card className="max-w-sm w-full mx-4">
          <CardHeader className="px-4">
            <h3 className="text-lg font-semibold">Confirm Finish</h3>
          </CardHeader>
          <CardBody className="px-4 py-4">
            <p className="text-sm sm:text-base mb-4">
              You are not on the last question. Are you sure you want to finish
              the quiz? Unanswered questions will be marked as incorrect.
            </p>
            <div className="flex justify-end gap-2">
              <Button
                variant="flat"
                color="default"
                onPress={() => setShowFinishConfirm(false)}
                className="text-xs sm:text-sm py-2">
                Cancel
              </Button>
              <Button
                color="success"
                onPress={finishQuiz}
                className="text-xs sm:text-sm py-2">
                Finish Quiz
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="max-w-md mx-auto mt-10">
        <CardBody className="text-center py-8 px-4">
          <h2 className="text-lg sm:text-xl font-bold text-danger mb-4">
            Error
          </h2>
          <p className="mb-4 text-sm sm:text-base">{error}</p>
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

  if (!quizData) {
    return (
      <Card className="max-w-md mx-auto mt-10">
        <CardBody className="text-center py-8 px-4">
          <h2 className="text-lg sm:text-xl font-bold mb-4">Quiz Not Found</h2>
          <p className="mb-4 text-sm sm:text-base">
            The requested quiz could not be found.
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

  if (!quizStarted) {
    return (
      <Card className="max-w-md mx-auto mt-10">
        <CardHeader className="px-4">
          <h2 className="text-lg sm:text-xl font-bold">{topicName}</h2>
        </CardHeader>
        <CardBody className="text-center py-6 px-4">
          <p className="mb-4 text-sm sm:text-base">
            This quiz contains {quizData.totalQuestions} questions.
          </p>
          <p className="text-default-500 mb-4 text-xs sm:text-sm">
            Take your time to answer each question carefully. You can navigate
            between questions and review your answers before submitting.
          </p>
          <div className="space-y-3 mb-6">
            <div className="flex items-center justify-center gap-2">
              <Checkbox
                checked={showCorrectCount}
                onChange={() => setShowCorrectCount(!showCorrectCount)}
              />
              <span className="text-sm sm:text-base">
                Show correct answers amount
              </span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <Checkbox
                checked={randomizeAnswers}
                onChange={() => setRandomizeAnswers(!randomizeAnswers)}
              />
              <span className="text-sm sm:text-base">Randomize answers</span>
            </div>
          </div>
          <Button
            color="primary"
            size="lg"
            onPress={startQuiz}
            className="text-sm py-2">
            Start Quiz
          </Button>
        </CardBody>
      </Card>
    );
  }

  if (quizFinished) {
    return renderResults();
  }

  return (
    <div className="max-w-3xl mx-auto mt-5 px-4">
      {renderQuizProgress()}
      <Card className="mb-6">
        <CardBody>
          {quizData.questions[currentQuestionIndex] &&
            renderQuestion(quizData.questions[currentQuestionIndex])}
        </CardBody>
      </Card>
      <div className="flex flex-wrap justify-between items-center mt-6 gap-3">
        <Button
          variant="flat"
          color="primary"
          onPress={goToPreviousQuestion}
          isDisabled={currentQuestionIndex === 0}
          className="text-xs sm:text-sm py-2 flex-1 min-w-[100px]">
          Previous
        </Button>
        <Button
          color="primary"
          onPress={goToNextQuestion}
          isDisabled={currentQuestionIndex === quizData.questions.length - 1}
          className="text-xs sm:text-sm py-2 flex-1 min-w-[100px]">
          Next
        </Button>
        <Button
          color="success"
          onPress={handleFinishQuizClick}
          className="text-xs sm:text-sm py-2 flex-1 min-w-[100px]">
          Finish Quiz
        </Button>
        <div className="text-center flex-1 min-w-[100px]">
          <span className="text-default-500 text-xs sm:text-sm">
            {currentQuestionIndex + 1} of {quizData.questions.length}
          </span>
        </div>
      </div>
      {renderFinishConfirmPopup()}
    </div>
  );
}
