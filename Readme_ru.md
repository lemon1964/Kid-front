# Kid Project

**Kid** — учебный проект, созданный для демонстрации навыков в веб-разработке. Проект состоит из двух частей: **фронтенда** и **бэкенда**, которые взаимодействуют между собой и развернуты на **Render**.

- **Бэкенд:** [https://kid-wlsf.onrender.com](https://kid-wlsf.onrender.com)
- **Фронтенд:** [https://kid-front.onrender.com](https://kid-front.onrender.com)

### Стек технологий:
- **Frontend:** React, Next.js, Redux Toolkit, NextAuth, Tailwind CSS
- **CI/CD:** GitHub Actions для автоматического развертывания на Render
- **Интеграция с платежами:** Stripe, ЮKassa
- **Локализация и аудио:** Howler.js для управления звуками, audioService, localizationService

---

### Описание

Проект **Kid** включает в себя интерактивные обучающие задания для детей. Включает несколько типов заданий: викторины, задачи с перетаскиванием объектов и графические задачи с анимациями, что способствует развитию различных навыков у детей. Взаимодействие с фронтендом происходит через интерфейс, интегрированный с бэкендом для аутентификации пользователей и обработки платежей.

---

### Основной функционал

- **Интерактивные задания:**
  - **Quiz App:** Викторины с вопросами и заданиями, за которые дети получают баллы.
  - **Drag & Drop App:** Задачи для развития логики и внимания через перетаскивание объектов.
  - **Pixi App:** Анимации и задачи типа "Find" и "Select", развивающие зрительное восприятие через графику.

- **Аутентификация пользователей:**
  - Аутентификация через **NextAuth** с возможностью входа через **Google**.
  - Регистрация и восстановление пароля с отправкой ссылки на email.
  - Уведомления о успешной регистрации или сбросе пароля.

- **Платежи:**
  - Интеграция с **Stripe** и **ЮKassa** для одноразовых покупок и подписок.
  - Поддержка различных типов подписок: **ежемесячная**, **годовая**, **пожизненная**.
  - Поддержка промокодов для скидок.

---

### Структура проекта

Проект **Kid** организован с использованием **Next.js** и **React** и имеет четкую и гибкую структуру для удобства разработки и расширения.

**Основные директории и файлы:**

- **app/** — основная папка для компонентов и страниц приложения.
  - **api/** — содержит API маршруты для обработки запросов (например, для авторизации или получения данных).
  - **auth/** — страницы и компоненты, связанные с аутентификацией пользователей.
  - **dragdrop/** — страницы и компоненты для реализации задач типа **Drag & Drop**.
  - **payment/** — страницы для обработки платежей через интеграцию с **Stripe** и **ЮKасса**.
  - **pixi/** — страницы и компоненты для отображения анимаций и графики с использованием **PixiJS**.
  - **quizzes/** — страницы и компоненты для викторин.
  - **tasks/** — задачи для пользователя с различными типами взаимодействия.
  
- **components/** — компоненты, используемые на различных страницах приложения:
  - **drag-drop/** — компоненты для задач с перетаскиванием объектов.
  - **pixi/** — компоненты для графических задач с использованием PixiJS.
  - **providers/** — компоненты, связанные с провайдерами данных, таких как аутентификация.
  - **quizzes/** — компоненты для работы с викторинами.
  - **users/** — компоненты для взаимодействия с пользователями.
  - **ErrorMessage.tsx** — компонент для отображения сообщений об ошибках.
  - **Modal.tsx** — модальные окна для регистрации и входа.
  - **ModalTogglable.tsx** — компонент для управления отображением модальных окон.
  - **Notification.jsx** — уведомления для пользователя.
  - **Preloader.tsx** — индикатор загрузки данных.

- **services/** — сервисы для работы с API и другими внешними сервисами:
  - **audioService.ts** — управление аудио (музыка, звуковые эффекты).
  - **localizationService.ts** — управление локализацией и языками.
  - **authClientService.ts** — обработка запросов на аутентификацию и работу с сессиями.
  - **dragdropService.ts** — сервис для работы с задачами **Drag & Drop**.
  - **quizService.ts** — сервис для загрузки данных викторин.
  - **taskService.ts** — сервис для работы с задачами.

- **reducers/** — хранит редюсеры для работы с глобальным состоянием приложения через **Redux**.
- **store/** — конфигурация **Redux Store** для управления состоянием приложения.
- **utils/** — различные утилитные функции и вспомогательные модули.

---

### Интерактивные компоненты

#### Quiz App, Drag & Drop App, Pixi App

Пример взаимодействия приложения Quiz с API для загрузки данных:

```typescript
import axios from "axios";

const BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/quiz`;

export const fetchQuizzes = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/list/`);
    return response.data.reverse();
  } catch (error) {
    console.error("Ошибка при загрузке викторин:", error);
    return [];
  }
};
```

---

### Регистрация и авторизация

Для регистрации и входа используется **NextAuth** с поддержкой **Google**:

```typescript
const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          const { data } = await apiClient.post(`${baseURL}/api/auth/custom/login/`, {
            email: credentials.email,
            password: credentials.password,
          });
          return { id: data.user.id, name: data.user.name, email: data.user.email };
        } catch {
          throw new Error("Invalid email or password");
        }
      },
    }),
  ],
});
```

---

### Платежи

Пример интеграции с **Stripe** для одноразовых покупок и подписок:

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError("");
  try {
    const response = await apiClient.post(
      "/api/payment/process-buy/",
      {
        subscription_type: paymentType,
        coupon_code: couponCode,
      }
    );
    if (response.data.session_url) {
      window.location.href = response.data.session_url;
    }
  } catch {
    setError("Что-то пошло не так. Попробуйте снова.");
    setLoading(false);
  }
};
```

---

### Развертывание

Фронтенд развернут на **Render** с автоматическим развертыванием через **GitHub Actions**. Любые изменения в ветке `main` автоматически запускают процесс сборки и развертывания.

```yaml
name: Deploy to Render

on:
  push:
    branches:
      - main
  workflow_dispatch:

jobs:
  deploy:
    runs-on: ubuntu-latest
    env:
      RENDER_SERVICE_ID: ${{ secrets.RENDER_SERVICE_ID }}
      RENDER_API_KEY: ${{ secrets.RENDER_API_KEY }}
    steps:
      - name: Checkout code
        uses: actions/checkout@v2
      - name: Set up Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm install
      - name: Build to Render
        run: npm run build
      - name: Trigger Render deployment
        run: |
          curl -X POST "https://api.render.com/v1/services/srv-${{ secrets.RENDER_SERVICE_ID }}/deploys" \
            -H "Authorization: Bearer ${{ secrets.RENDER_API_KEY }}"
```

---

### Установка

1. Клонируйте репозиторий:

```bash
git clone https://github.com/lemon1964/Kid-front.git
```

2. Установите зависимости:

```bash
npm install
```

3. Запустите проект:

```bash
npm run dev
```

4. Получите данные с клонированного бэкенда:

```bash
git clone https://github.com/lemon1964/Kid.git
```

5. Разверните бэкенд, чтобы взаимодействовать с фронтендом.

