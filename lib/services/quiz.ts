import { QuizData, TopicInfo } from "@/types/quiz";

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
];

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
