export const EASE_HERO = [0.55, 0, 0, 1] as [number, number, number, number];
export const EASE_MOCKUP = [0.68, 0, 0, 0.99] as [number, number, number, number];
export const EASE_CARD = [0.22, 1, 0.36, 1] as [number, number, number, number];

export const heroElement = {
  hidden: { opacity: 0.001, y: 40, scale: 0.9 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { delay: 1.0, duration: 1.5, ease: EASE_HERO },
  },
};

export const mockupReveal = {
  hidden: { opacity: 1, y: 95, scale: 1.4 },
  visible: {
    opacity: 1, y: 0, scale: 1,
    transition: { delay: 0.95, duration: 1.3, ease: EASE_MOCKUP },
  },
};

export const sectionReveal = {
  hidden: { opacity: 0, y: 148 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.8, ease: EASE_HERO },
  },
};

export const cardContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

export const cardReveal = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1, y: 0,
    transition: { duration: 0.5, ease: EASE_CARD },
  },
};

export const feedContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.2 } },
};

export const feedCardReveal = {
  hidden: { opacity: 0, x: 40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: EASE_CARD } },
};

export const chatSequence = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 1.2, delayChildren: 0.8 } },
};

export const messageAppear = {
  hidden: { opacity: 0, y: 10, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: "easeOut" } },
};
