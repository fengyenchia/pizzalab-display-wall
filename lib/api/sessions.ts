import {
  mockSessionDetails,
  mockSessions,
} from "@/lib/mock/sessions";
import type {
  SessionDetail,
  SessionsResponse,
  SessionSummary,
} from "@/lib/types/sessions";

export const API_BASE_URL = (
  process.env.API_URL ?? "http://localhost:8787"
).replace(/\/$/, "");

const useMockData = process.env.USE_MOCK_DATA !== "false";

export function getImageUrl(path: string | null): string | null {
  if (!path) {
    return null;
  }

  if (/^https?:\/\//.test(path) || path.startsWith("/images/")) {
    return path;
  }

  return `${API_BASE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export async function getAllSessions(): Promise<SessionSummary[]> {
  if (useMockData) {
    return mockSessions;
  }

  const response = await fetch(`${API_BASE_URL}/api/sessions`, {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error("無法取得場次列表");
  }

  const data: SessionsResponse = await response.json();
  return data.sessions;
}

export async function getSession(id: string): Promise<SessionDetail | null> {
  if (useMockData) {
    return mockSessionDetails.find((session) => session.id === id) ?? null;
  }

  const response = await fetch(
    `${API_BASE_URL}/api/sessions/${encodeURIComponent(id)}`,
    { next: { revalidate: 60 } },
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("無法取得場次內容");
  }

  return response.json();
}
