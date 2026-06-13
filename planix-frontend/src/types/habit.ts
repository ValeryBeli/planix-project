export interface Habit {
  id: number;
  name: string;
  description?: string;
}

export interface HabitLog {
  id: number;
  habitId: number;
  date: string; // YYYY-MM-DD
}

export interface HabitRequest {
  name: string;
  description?: string;
}