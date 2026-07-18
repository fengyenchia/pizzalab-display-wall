import type {
  SessionDetail,
  SessionSummary,
} from "@/lib/types/sessions";

export const mockSessionDetails: SessionDetail[] = [
  {
    id: "20260718_203048_Control",
    playedAt: "2026-07-18T20:30:48+08:00",
    card: {
      image: "/images/UI_Polaroid.png",
      hashtags: ["#SauceTornado", "#BigEffort"],
      persona: "Sauce Tornado",
    },
    bossComment:
      "Great arm tonight! You painted the shop more than the pizzas, but the customers had a blast. Same time tomorrow?",
    photos: [
      {
        image: "/images/bg.png",
        caption: "Hit in the face",
        gameTime: 24.3,
        type: "customerFace",
      },
      {
        image: "/images/bg.png",
        caption: "Store overview",
        gameTime: 180,
        type: "environment",
      },
      {
        image: "/images/bg.png",
        caption: "A perfect sauce throw",
        gameTime: 245.8,
        type: "customerFace",
      },
    ],
  },
  {
    id: "20260718_201522_Experiment",
    playedAt: "2026-07-18T20:15:22+08:00",
    card: {
      image: "/images/UI_Polaroid.png",
      hashtags: ["#FastHands", "#PizzaChaos"],
      persona: "Kitchen Cyclone",
    },
    bossComment:
      "You moved like a kitchen cyclone. The pizzas were wild, the customers were louder, and somehow everyone left smiling.",
    photos: [
      {
        image: "/images/bg.png",
        caption: "The rush begins",
        gameTime: 42.1,
        type: "environment",
      },
      {
        image: "/images/bg.png",
        caption: "Customer surprise",
        gameTime: 133.6,
        type: "customerFace",
      },
    ],
  },
  {
    id: "20260718_195910_Control",
    playedAt: "2026-07-18T19:59:10+08:00",
    card: {
      image: null,
      hashtags: ["#QuietChef"],
      persona: "Quiet Chef",
    },
    bossComment: "",
    photos: [],
  },
  {
    id: "20260718_194102_Experiment",
    playedAt: "2026-07-18T19:41:02+08:00",
    card: {
      image: "/images/UI_Polaroid.png",
      hashtags: ["#CustomerMagnet", "#BigEnergy"],
      persona: "Party Starter",
    },
    bossComment:
      "Every table became a party when you walked past. Cleanup may take all night, but the energy was unforgettable.",
    photos: [
      {
        image: "/images/bg.png",
        caption: "Direct hit",
        gameTime: 18.7,
        type: "customerFace",
      },
      {
        image: "/images/bg.png",
        caption: "Dining room aftermath",
        gameTime: 201.4,
        type: "environment",
      },
    ],
  },
  {
    id: "20260718_192315_Experiment",
    playedAt: "2026-07-18T19:23:15+08:00",
    card: {
      image: "/images/UI_Polaroid.png",
      hashtags: [],
      persona: "Focused Baker",
    },
    bossComment:
      "Focused, steady, and surprisingly accurate. You kept the kitchen moving even when the sauce started flying.",
    photos: [
      {
        image: "/images/bg.png",
        caption: "Calm before the rush",
        gameTime: 65,
        type: "environment",
      },
    ],
  },
  {
    id: "20260718_190844_Control",
    playedAt: "2026-07-18T19:08:44+08:00",
    card: {
      image: "/images/UI_Polaroid.png",
      hashtags: ["#SauceArtist", "#FullSend"],
      persona: "Sauce Artist",
    },
    bossComment: "",
    photos: [
      {
        image: "/images/bg.png",
        caption: "Unexpected topping",
        gameTime: 92.4,
        type: "customerFace",
      },
    ],
  },
];

export const mockSessions: SessionSummary[] = mockSessionDetails.map(
  ({ id, playedAt, card }) => ({
    id,
    playedAt,
    cardImage: card.image,
    hashtags: card.hashtags,
    persona: card.persona,
  }),
);
