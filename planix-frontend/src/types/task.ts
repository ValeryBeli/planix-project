export type TaskStatus =
  | "PENDING"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export interface Task {
  id: number;
  title: string;
  description?: string;
  deadline?: string;
  status: TaskStatus;
  completedAt?: string;
  subjectId?: number | null;
}

export interface TaskRequest {
  title: string;
  description?: string;
  deadline?: string;
  subjectId?: number | null;
  status: TaskStatus;
}