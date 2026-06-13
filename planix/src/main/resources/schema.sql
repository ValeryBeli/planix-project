-- 1. Пользователи
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);

-- 2. Предметы
CREATE TABLE subject (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    day_of_week SMALLINT NOT NULL,
    week_type VARCHAR(10) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    location VARCHAR(255),
    teacher VARCHAR(255)
);

-- 3. Задачи
CREATE TABLE task (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    deadline TIMESTAMP,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    completed_at TIMESTAMP,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    subject_id INT REFERENCES subject(id) ON DELETE SET NULL
);

-- 4. Привычки
CREATE TABLE habit (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE
);

-- 5. Отметки привычек
CREATE TABLE habit_log (
    id SERIAL PRIMARY KEY,
    habit_id INT NOT NULL REFERENCES habit(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    UNIQUE (habit_id, date)
);