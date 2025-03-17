# Kid Project

**Kid** is an educational project created to demonstrate web development skills. The project consists of two parts: **frontend** and **backend**, which interact with each other and are deployed on **Render**.

- **Backend:** [https://kid-wlsf.onrender.com](https://kid-wlsf.onrender.com)
- **Frontend:** [https://kid-front.onrender.com](https://kid-front.onrender.com)

### Tech Stack:
- **Frontend:** React, Next.js, Redux Toolkit, NextAuth, Tailwind CSS
- **CI/CD:** GitHub Actions for automatic deployment on Render
- **Payment Integration:** Stripe, ЮKassa
- **Localization and Audio:** Howler.js for sound management, audioService, localizationService

---

### Description

The **Kid** project includes interactive educational tasks for children. It features several types of tasks: quizzes, drag-and-drop tasks, and graphical tasks with animations, all of which help children develop various skills. The frontend interacts with the backend interface, which is integrated for user authentication and payment processing.

---

### Core Functionality

- **Interactive Tasks:**
  - **Quiz App:** Quizzes with questions and tasks, where children earn points for correct answers.
  - **Drag & Drop App:** Tasks for developing logic and attention by dragging objects.
  - **Pixi App:** Animations and tasks like "Find" and "Select" to enhance visual perception through graphics.

- **User Authentication:**
  - Authentication via **NextAuth** with the option to log in via **Google**.
  - Registration and password recovery with email link sending.
  - Notifications about successful registration or password reset.

- **Payments:**
  - Integration with **Stripe** and **ЮKassa** for one-time purchases and subscriptions.
  - Support for various subscription types: **monthly**, **yearly**, **lifetime**.
  - Support for promo codes for discounts.

---

### Project Structure

The **Kid** project is built using **Next.js** and **React** and has a clean and flexible structure for easy development and expansion.

**Main Directories and Files:**

- **app/** — the main folder for components and application pages.
  - **api/** — contains API routes for handling requests (e.g., authentication or fetching data).
  - **auth/** — pages and components related to user authentication.
  - **dragdrop/** — pages and components for **Drag & Drop** tasks.
  - **payment/** — pages for handling payments via **Stripe** and **ЮKassa**.
  - **pixi/** — pages and components for displaying animations and graphics using **PixiJS**.
  - **quizzes/** — pages and components for quizzes.
  - **tasks/** — tasks for the user with various types of interaction.

- **components/** — components used across different pages:
  - **drag-drop/** — components for drag-and-drop tasks.
  - **pixi/** — components for graphic tasks with PixiJS.
  - **providers/** — components related to data providers, such as authentication.
  - **quizzes/** — components for working with quizzes.
  - **users/** — components for interacting with users.
  - **ErrorMessage.tsx** — component for displaying error messages.
  - **Modal.tsx** — modal windows for registration and login.
  - **ModalTogglable.tsx** — component for managing modal window visibility.
  - **Notification.jsx** — notifications for the user.
  - **Preloader.tsx** — data loading indicator.

- **services/** — services for interacting with APIs and other external services:
  - **audioService.ts** — managing audio (music, sound effects).
  - **localizationService.ts** — managing localization and languages.
  - **authClientService.ts** — handling authentication requests and session management.
  - **dragdropService.ts** — service for handling **Drag & Drop** tasks.
  - **quizService.ts** — service for loading quiz data.
  - **taskService.ts** — service for handling tasks.

- **reducers/** — contains reducers for managing global app state via **Redux**.
- **store/** — configuration of **Redux Store** for managing app state.
- **utils/** — utility functions and helper modules.

---

### Interactive Components

#### Quiz App, Drag & Drop App, Pixi App

Example of interacting with the Quiz app and fetching data via API:

```typescript
import axios from "axios";

const BASE_URL = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/quiz`;

export const fetchQuizzes = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/list/`);
    return response.data.reverse();
  } catch (error) {
    console.error("Error loading quizzes:", error);
    return [];
  }
};
```

---

### Registration and Authentication

**NextAuth** is used for registration and login with **Google** support:

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

### Payments

Example of integrating **Stripe** for one-time purchases and subscriptions:

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
    setError("Something went wrong. Please try again.");
    setLoading(false);
  }
};
```

---

### Deployment

The frontend is deployed on **Render** with automatic deployment via **GitHub Actions**. Any changes pushed to the `main` branch trigger the build and deployment process.

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

### Installation

1. Clone the repository:

```bash
git clone https://github.com/lemon1964/Kid-front.git
```

2. Install dependencies:

```bash
npm install
```

3. Run the project:

```bash
npm run dev
```

4. Clone the backend repository to interact with the frontend:

```bash
git clone https://github.com/lemon1964/Kid.git
```

5. Deploy the backend to interact with the frontend.

