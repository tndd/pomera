export interface Section {
  id: string;
  title: string;
}

export const sections: Section[] = Array.from({ length: 20 }, (_, i) => ({
  id: `section-${i + 1}`,
  title: `Dynamic Section ${i + 1}`,
}));

export const quotes = [
  "Fortune favors the bold.",
  "Change is the only constant.",
  "Adventure awaits around every corner.",
  "Expect the unexpected.",
  "Seize the day!",
];

export const ads = [
  "Buy one, get one free!",
  "Limited time offer, act now!",
  "Subscribe for exclusive content.",
  "Don't miss our summer sale.",
  "Upgrade your plan today.",
];
