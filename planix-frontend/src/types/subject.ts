export interface Subject {
  id: number;
  name: string;
  dayOfWeek: number;
  weekType: "ODD" | "EVEN";
  startTime: string;
  endTime: string;
  location?: string;
  teacher?: string;
}