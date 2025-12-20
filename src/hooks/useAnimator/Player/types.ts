export type Timeline = {
  elapsed: number;
  duration: number;
  items: {
    start: number;
    end: number;
  }[];
};
