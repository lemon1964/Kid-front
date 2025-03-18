"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import Modal from "@/Components/Modal";
import BaseForm from "@/Components/users/BaseForm";
import { audioService } from "@/services/audioService";
import { localizationService } from "@/services/localizationService";
import Link from "next/link";
import { useRive } from "rive-react";
import ModalTogglable from "@/Components/ModalTogglable";
import apiClient from "@/services/authClientService";
import { prod } from "@/utils/prod";
import Notification from "@/Components/Notification";

interface TogglableHandle {
  toggleVisibility: () => void;
}

const Home = () => {
  const [, setLanguage] = useState(localizationService.getCurrentLanguage());
  const loginRef = useRef<TogglableHandle>(null);
  const registerRef = useRef<TogglableHandle>(null);
  const { data: session } = useSession();

  const verifySession = useCallback(async () => {
    if (!session?.backendToken || !session.refreshToken) {
      console.log("No tokens available for session verification");
      return;
    }

    try {
      await apiClient.post("/api/auth/token/verify/", {
        token: session.refreshToken,
      });
      console.log("Session verified successfully");
    } catch (error: unknown) {
      console.log("Session verification failed", error);
    }
  }, [session?.backendToken, session?.refreshToken]);

  useEffect(() => {
    verifySession();
  }, [verifySession]);

  useEffect(() => {
    audioService.playMusic(`${prod}/media/musics/main.mp3`);
    return () => {
      audioService.stopMusic();
    };
  }, []);

  const { RiveComponent } = useRive({
    src: "/animations/burb.riv",
    autoplay: true,
  });

  const handleLanguageChange = (lang: string) => {
    localizationService.setLanguageAndSync(lang);
    setLanguage(lang);
  };

  return (
    <div className="p-6 space-y-6">
      <Notification />
      {/* Верхний блок с языками и подпиской */}
      <div className="flex justify-between items-center">
        {/* Переключатели языков */}
        <div className="flex space-x-4">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            onClick={() => handleLanguageChange("en")}
          >
            EN
          </button>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
            onClick={() => handleLanguageChange("ru")}
          >
            RU
          </button>
        </div>
        {/* Кнопка подписки */}
        <Link
          href="/payment"
          className="px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
        >
          {localizationService.get("payment")}
        </Link>
      </div>
      {/* Greeting */}
      <h1 className="text-3xl font-bold">{localizationService.get("HelloKidBe")}</h1>
      {/* Session Information */}
      {session ? (
        <div className="p-4 border rounded-md">
          <p>
            <span className="font-medium">📍</span> {session.user?.name || "unknown user"}
          </p>
          <button
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
            onClick={() => signOut()}
          >
            {localizationService.get("Logout")}
          </button>
        </div>
      ) : (
        <div>
          {/* Togglable for Login */}
          <ModalTogglable buttonLabel="Login" ref={loginRef}>
            <Modal onClose={() => loginRef.current?.toggleVisibility()}>
              <BaseForm type="login" onClose={() => loginRef.current?.toggleVisibility()} />
            </Modal>
          </ModalTogglable>
          {/* Togglable for Register */}
          <ModalTogglable buttonLabel="Register" ref={registerRef}>
            <Modal onClose={() => registerRef.current?.toggleVisibility()}>
              <BaseForm type="register" onClose={() => registerRef.current?.toggleVisibility()} />
            </Modal>
          </ModalTogglable>
        </div>
      )}
      {/* Links Section */}
      <div className="space-y-4">
        <h2 className="text-xl text-green-600">
          🔍 {localizationService.get("SlugsInBrowserBar")}
        </h2>
        <h2 className="text-lg font-semibold text-blue-600 hover:underline">
          <Link href="/pixi">{localizationService.get("PixiGraphics")}</Link>
        </h2>
        <h2 className="text-lg font-semibold text-blue-600 hover:underline">
          <Link href="/quizzes">{localizationService.get("Quizzes")}</Link>
        </h2>
        <h2 className="text-lg font-semibold text-blue-600 hover:underline">
          <Link href="/dragdrop">{localizationService.get("DragAndDrop")}</Link>
        </h2>
      </div>
      {/* По номерам */}
      <div className="space-y-4">
        <Link href="/tasks" className="text-xl text-green-600 hover:underline">
          🔍 {localizationService.get("NumbersInBrowserBar")}
        </Link>
      </div>

      {/* Animation Section */}
      <div className="w-[800px] h-[500px] mx-auto border rounded-lg overflow-hidden">
        <RiveComponent />
      </div>
    </div>
  );
};

export default Home;
