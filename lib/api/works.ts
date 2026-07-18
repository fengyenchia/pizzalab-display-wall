import { mockWorks } from "@/lib/mock/works";
import type { Work } from "@/lib/types/works";

const API_URL = process.env.API_URL?.replace(/\/$/, "");
const useMockData = process.env.USE_MOCK_DATA === "true" || !API_URL;

export async function getAllWorks(): Promise<Work[]> {
  if (useMockData) {
    return mockWorks;
  }

  const response = await fetch(`${API_URL}/works`, {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error("無法取得作品列表");
  }

  return response.json();
}

export async function getWork(slug: string): Promise<Work | null> {
  if (useMockData) {
    return mockWorks.find((work) => work.slug === slug) ?? null;
  }

  const response = await fetch(`${API_URL}/works/${slug}`, {
    next: { revalidate: 60 },
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("無法取得作品內容");
  }

  return response.json();
}

export const getWorks = getWork;
