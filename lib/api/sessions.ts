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
const prototypeCardImage = null;

type PrototypeSession = {
  sessionId: string;
  bossComment?: string;
  playerPersona?: string;
  playerCardImage?: string;
};

function isPrototypeSession(value: unknown): value is PrototypeSession {
  return (
    typeof value === "object" &&
    value !== null &&
    "sessionId" in value &&
    typeof value.sessionId === "string"
  );
}

function splitBossComment(comment = "") {
  const [firstLine = "", ...bodyLines] = comment.split(/\r?\n/);
  const hashtags = firstLine.startsWith("#") ? [firstLine.trim()] : [];
  const body = hashtags.length > 0 ? bodyLines.join("\n").trim() : comment.trim();

  return { hashtags, body };
}

function normalizeSessionList(data: unknown): SessionSummary[] {
  const list =
    Array.isArray(data)
      ? data
      : typeof data === "object" &&
          data !== null &&
          "sessions" in data &&
          Array.isArray(data.sessions)
        ? data.sessions
        : [];

  return list.flatMap((item, index) => {
    if (isPrototypeSession(item)) {
      const { hashtags } = splitBossComment(item.bossComment);

      return [
        {
          id: item.sessionId,
          // Prototype 沒有 playedAt，使用遞減值保留後端原始順序。
          playedAt: new Date(-index).toISOString(),
          cardImage: prototypeCardImage,
          hashtags,
          persona: item.playerPersona || "PIZZALAB PLAYER",
        },
      ];
    }

    if (
      typeof item === "object" &&
      item !== null &&
      "id" in item &&
      typeof item.id === "string"
    ) {
      return [item as SessionSummary];
    }

    return [];
  });
}

async function fetchSessionList(): Promise<unknown> {
  const response = await fetch(`${API_BASE_URL}/api/sessions`, {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error("無法取得場次列表");
  }

  return response.json();
}

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
    return [...mockSessions].sort(
      (a, b) =>
        new Date(b.playedAt).getTime() - new Date(a.playedAt).getTime(),
    );
  }

  const data: SessionsResponse | SessionSummary[] | unknown =
    await fetchSessionList();
  const sessions = normalizeSessionList(data);

  if (!Array.isArray(sessions)) {
    throw new Error("場次列表格式錯誤：預期陣列或 { sessions: [] }");
  }

  return [...sessions].sort(
    (a, b) =>
      new Date(b.playedAt).getTime() - new Date(a.playedAt).getTime(),
  );
}

export async function getSession(id: string): Promise<SessionDetail | null> {
  if (useMockData) {
    const session =
      mockSessionDetails.find((item) => item.id === id) ?? null;

    return session
      ? {
          ...session,
          photos: [...session.photos].sort(
            (a, b) => a.gameTime - b.gameTime,
          ),
        }
      : null;
  }

  const response = await fetch(
    `${API_BASE_URL}/api/sessions/${encodeURIComponent(id)}`,
    { next: { revalidate: 60 } },
  );

  if (response.status === 404) {
    const listData = await fetchSessionList();
    const prototypeList = Array.isArray(listData)
      ? listData
      : typeof listData === "object" &&
          listData !== null &&
          "sessions" in listData &&
          Array.isArray(listData.sessions)
        ? listData.sessions
        : [];
    const prototypeSession = prototypeList.find(
      (item) => isPrototypeSession(item) && item.sessionId === id,
    );

    if (!isPrototypeSession(prototypeSession)) {
      return null;
    }

    const { hashtags, body } = splitBossComment(
      prototypeSession.bossComment,
    );

    return {
      id: prototypeSession.sessionId,
      playedAt: new Date(0).toISOString(),
      card: {
        image: prototypeCardImage,
        hashtags,
        persona: prototypeSession.playerPersona || "PIZZALAB PLAYER",
      },
      bossComment: body,
      photos: [],
    };
  }

  if (!response.ok) {
    throw new Error("無法取得場次內容");
  }

  const session: SessionDetail = await response.json();

  return {
    ...session,
    photos: [...session.photos].sort((a, b) => a.gameTime - b.gameTime),
  };
}
