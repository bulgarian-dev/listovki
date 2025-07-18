"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@heroui/button";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center pt-16 px-4 sm:px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}>
        <Card className="max-w-md w-full">
          <CardHeader className="flex flex-col items-center px-4">
            <h1 className="text-2xl sm:text-3xl font-bold">Добре дошли!</h1>
          </CardHeader>
          <CardBody className="text-center px-4">
            <p className="text-sm sm:text-base">
              Prepare for your Bulgarian driver's license theory exam with
              comprehensive practice quizzes.
            </p>
          </CardBody>
          <CardFooter className="justify-center gap-2 px-4">
            <Button
              as={Link}
              href="/topics"
              color="primary"
              size="lg"
              className="w-full text-sm py-2">
              Start Quiz
            </Button>
          </CardFooter>
        </Card>
      </motion.div>

      <motion.div
        className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.5 }}>
        <Card className="p-4">
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <div className="p-3 rounded-full bg-primary-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                  <polyline points="14 2 14 8 20 8" />
                  <path d="M8.5 17h7" />
                  <path d="M8.5 13h3.5" />
                  <path d="M8.5 9h3.5" />
                </svg>
              </div>
            </div>
            <h3 className="font-medium text-base sm:text-lg">
              Multiple Topics (more soon)
            </h3>
            <p className="text-default-500 text-xs sm:text-sm mt-1">
              Comprehensive coverage of all official exam areas (category B)
            </p>
          </div>
        </Card>

        <Card className="p-4">
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <div className="p-3 rounded-full bg-primary-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </div>
            </div>
            <h3 className="font-medium text-base sm:text-lg">
              Official Questions
            </h3>
            <p className="text-default-500 text-xs sm:text-sm mt-1">
              Practice with authentic exam questions
            </p>
          </div>
        </Card>

        <Card className="p-4">
          <div className="text-center">
            <div className="mb-4 flex justify-center">
              <div className="p-3 rounded-full bg-primary-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary">
                  <circle cx="12" cy="12" r="10" />
                  <path d="M12 6v6l4 2" />
                </svg>
              </div>
            </div>
            <h3 className="font-medium text-base sm:text-lg">Track Progress</h3>
            <p className="text-default-500 text-xs sm:text-sm mt-1">
              Monitor your performance and improve
            </p>
          </div>
        </Card>
      </motion.div>

      <motion.div
        className="mt-10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.5 }}>
        <h2 className="text-lg sm:text-xl font-semibold text-center mb-6">
          Additional Resources
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto">
          <Card className="p-4">
            <a
              href="https://rta.government.bg/en"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2 text-primary hover:text-primary-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
              <span className="text-sm sm:text-base">Official Documents</span>
            </a>
          </Card>
          <Card className="p-4">
            <a
              href="https://avtoizpit.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2 text-primary hover:text-primary-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round">
                <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
              <span className="text-sm sm:text-base">Simulation Exam</span>
            </a>
          </Card>
        </div>
      </motion.div>

      <div className="mt-10 mb-12 text-center text-xs sm:text-sm text-default-500">
        <p>
          This site is not affiliated with any official government entity.
          <br /> All questions are based on publicly available information from
          official sources.
        </p>
      </div>
    </div>
  );
}
