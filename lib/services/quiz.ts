import { QuizData, TopicInfo, Question } from "@/types/quiz";

export const topicsList: TopicInfo[] = [
  {
    id: "1",
    title: "1 - Basic concepts",
    link: "https://rta.government.bg/upload/11305/Category_1_Topic_1_13.10.2023+16_54_14_EN.pdf",
    lastUpdated: "12.05.2025",
    questionsCount: 84,
  },
  {
    id: "2",
    title: "2 - The roads and streets",
    link: "https://rta.government.bg/upload/10474/Category_1_Topic_2_01.06.2023+16_30_48_EN.pdf",
    lastUpdated: "18.05.2025",
    questionsCount: 87,
  },
  {
    id: "14",
    title: "14 - TRAVEL ORGANISATION",
    link: "https://rta.government.bg/upload/10486/Category_1_Topic_14_01.06.2023+16_51_16_EN.pdf",
    lastUpdated: "18.07.2025",
    questionsCount: 35,
  },
  {
    id: "15",
    title:
      "15 - IMPORTANCE OF THE PSYCHO-MOTOR FUNCTIONS, DRIVER’S ALERTNESS AND AWARENESS OF OTHER ROAD USERS’ ACTIONS FOR TRAFFIC SAFETY",
    link: "https://rta.government.bg/upload/10487/Category_1_Topic_15_01.06.2023+16_51_38_EN.pdf",
    lastUpdated: "18.07.2025",
    questionsCount: 44,
  },
  {
    id: "16",
    title: "16 - DRIVER’S OBLIGATIONS",
    link: "https://rta.government.bg/upload/10488/Category_1_Topic_16_01.06.2023+16_52_16_EN.pdf",
    lastUpdated: "18.07.2025",
    questionsCount: 46,
  },
  {
    id: "19",
    title: "19 - GENERAL INFORMATION ABOUT THE MOTOR VEHICLE STRUCTURE",
    link: "https://rta.government.bg/upload/10491/Category_1_Topic_19_01.06.2023+16_53_15_EN.pdf",
    lastUpdated: "18.07.2025",
    questionsCount: 50,
  },
  {
    id: "111",
    title: "[EXTRA] - Prohibitions",
    link: "",
    lastUpdated: "17.05.2025",
    questionsCount: 12,
  },
  {
    id: "22",
    title: "[EXTRA] - Random ones from avtoizpit",
    link: "https://avtoizpit.com/",
    lastUpdated: "21.05.2025",
    questionsCount: 12,
  },
  {
    id: "mistake-trainer",
    title: "Mistake Trainer",
    questionsCount: 0,
    lastUpdated: "Always",
    link: "#",
  },
];

export const getMistakeTrainerData = (questions: Question[]): QuizData => {
  return {
    questions,
    totalQuestions: questions.length,
  };
};

export async function getQuizData(topicId: string): Promise<QuizData> {
  try {
    const response = await fetch(`/data/topic-${topicId}.json`);
    if (!response.ok) {
      throw new Error("Failed to load quiz data");
    }
    return await response.json();
  } catch (error) {
    console.error("Error loading quiz data:", error);
    throw error;
  }
}

export function getTopic(topicId: string): TopicInfo | undefined {
  return topicsList.find((topic) => topic.id === topicId);
}
