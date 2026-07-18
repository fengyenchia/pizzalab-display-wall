export type Work = {
  id: string;
  slug: string;
  cardImage: string;
  personality: string;
  tags: string[];
  scenePhotos: string[];
  noteImage: string;
  summaryImage: string;
};

// 保留舊名稱，避免後端串接中的既有引用立即失效。
export type Works = Work;
