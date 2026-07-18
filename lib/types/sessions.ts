export type SessionSummary = {
  id: string;
  playedAt: string;
  cardImage: string | null;
  hashtags: string[];
  persona: string;
};

export type SessionCard = {
  image: string | null;
  hashtags: string[];
  persona: string;
};

export type SessionPhotoType = "customerFace" | "environment";

export type SessionPhoto = {
  image: string;
  caption: string;
  gameTime: number;
  type: SessionPhotoType;
};

export type SessionDetail = {
  id: string;
  playedAt: string;
  card: SessionCard;
  bossComment: string;
  photos: SessionPhoto[];
};

export type SessionsResponse = {
  sessions: SessionSummary[];
};
