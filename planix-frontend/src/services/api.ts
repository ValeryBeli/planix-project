const API_URL = "http://localhost:8080";

function getToken() {
  return localStorage.getItem("token");
}

async function request(
  endpoint: string,
  options: RequestInit = {}
) {

  const res = await fetch(
    `${API_URL}${endpoint}`,
    {
      ...options,
      headers: {
        "Content-Type":
          "application/json",

        ...(getToken() && {
          Authorization:
            `Bearer ${getToken()}`
        }),

        ...options.headers
      }
    }
  );

  if (!res.ok) {
    throw new Error("Ошибка API");
  }

  if (
    res.status === 204 ||
    res.headers.get("content-length") === "0"
  ) {
    return null;
  }

  return res.json();
}

// AUTH
export const authApi = {

  login: (
    email: string,
    password: string
  ) =>
    request("/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email,
        password
      })
    }),

  register: (
    name: string,
    email: string,
    password: string
  ) =>
    request("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        name,
        email,
        password
      })
    }),

  recoverPassword: (
    email: string
  ) =>
    request(
      "/auth/recover-password",
      {
        method: "POST",
        body: JSON.stringify({
          email
        })
      }
    ),

  changePassword: (
    data: {
      oldPassword: string;
      newPassword: string;
    }
  ) =>
    request("/users/password", {
      method: "PUT",
      body: JSON.stringify(data)
    })
};

// TASKS
export const taskApi = {

  getAll: () =>
    request("/tasks"),

  create: (data: any) =>
    request("/tasks", {
      method: "POST",
      body: JSON.stringify(data)
    }),

  update: (
    id: number,
    data: any
  ) =>
    request(`/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify(data)
    }),

  delete: (id: number) =>
    request(`/tasks/${id}`, {
      method: "DELETE"
    }),

  complete: (id: number) =>
    request(`/tasks/${id}/complete`, {
      method: "PATCH"
    })

};

export async function markOverdueTasksCancelled(tasks: any[]) {
  if (!Array.isArray(tasks) || tasks.length === 0) return;

  const now = new Date();
  const nowTime = now.getTime();

  const updates: Promise<any>[] = [];

  for (const t of tasks) {
    try {
      if (!t || !t.deadline) continue;

      const status = String(t.status || "").toUpperCase();

      if (
        status === "CANCELLED" ||
        status === "CANCELED" ||
        status === "COMPLETED" ||
        status === "DONE"
      ) {
        continue;
      }

      const dl = new Date(t.deadline);
      const dlTime = dl.getTime();

      if (isNaN(dlTime)) continue;

      if (dlTime < nowTime) {
        updates.push(taskApi.update(t.id, { ...t, status: "CANCELLED" }));
      }
    } catch (e) {
      console.error("markOverdueTasksCancelled error for task", t, e);
    }
  }

  if (updates.length === 0) return;

  try {
    await Promise.all(updates);
  } catch (e) {
    console.error("Error marking overdue tasks cancelled", e);
  }
}

// SUBJECTS / SCHEDULE
export const subjectApi = {

  getAll: () =>
    request("/subjects"),

  create: (data: any) =>
    request("/subjects", {
      method: "POST",
      body: JSON.stringify(data)
    }),

  update: (
    id: number,
    data: any
  ) =>
    request(`/subjects/${id}`, {
      method: "PUT",
      body: JSON.stringify(data)
    }),

  delete: (id: number) =>
    request(`/subjects/${id}`, {
      method: "DELETE"
    }),

  clear: () =>
    request("/subjects", {
      method: "DELETE"
    }),

  importSchedule: (url: string) =>
    request("/subjects/import", {
      method: "POST",
      body: JSON.stringify({ url })
    })
};

// HABITS
export const habitApi = {

  getAll: () =>
    request("/habits"),

  create: (data: {
    name: string;
    description?: string;
  }) =>
    request("/habits", {
      method: "POST",
      body: JSON.stringify(data)
    }),

  update: (
    id: number,
    data: {
      name: string;
      description?: string;
    }
  ) =>
    request(`/habits/${id}`, {
      method: "PUT",
      body: JSON.stringify(data)
    }),

  delete: (id: number) =>
    request(`/habits/${id}`, {
      method: "DELETE"
    }),

  addLog: (id: number, date: string) =>
    request(`/habits/${id}/log?date=${date}`, {
      method: "POST"
    }),

  deleteLog: (id: number, date: string) =>
    request(`/habits/${id}/log?date=${date}`, {
      method: "DELETE"
    }),

  getLogs: (id: number) =>
    request(`/habits/${id}/logs`)
};

// USER
export const userApi = {

  getMe: () =>
    request("/users/me")

};