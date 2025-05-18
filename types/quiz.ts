export interface Answer {
  text?: string;
  image?: string;
  checked: boolean;
}

export interface Question {
  text: string;
  index: string;
  points: string;
  pageNum: number;
  image?: string;
  video?: string;
  answers: Answer[];
}

export interface QuizData {
  totalQuestions: number;
  questions: Question[];
}

export interface TopicInfo {
  id: string;
  title: string;
  link: string;
  lastUpdated: string;
  questionsCount: number;
}

export interface QuizResult {
  questionId: string;
  userAnswers: boolean[];
  isCorrect: boolean;
  isUnanswered: boolean;
  points: string;
}

export interface QuizSummary {
  totalQuestions: number;
  correctQuestions: number;
  incorrectQuestions: number;
  unansweredQuestions: number;
  totalPoints: number;
  earnedPoints: number;
  timeTaken: number; 
}
