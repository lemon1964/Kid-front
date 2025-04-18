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
    <div
      className="min-h-screen bg-cover bg-center px-4 py-6 text-[#4B2E2E]"
      style={{ backgroundImage: 'url("/images/main.png")' }}
    >
      <Notification />
      <h1 className="text-3xl font-bold text-center mb-4">
        {localizationService.get("HelloKidBe")}
      </h1>

      <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
        <div className="flex gap-4">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            onClick={() => handleLanguageChange("en")}
          >
            EN
          </button>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
            onClick={() => handleLanguageChange("ru")}
          >
            RU
          </button>
        </div>
        <Link
          href="/payment"
          className="px-5 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
        >
          {localizationService.get("payment")}
        </Link>
      </div>

      {session ? (
        <div className="p-4 border rounded-md bg-white/80">
          <p>
            <span className="font-medium">📍</span> {session.user?.name || "unknown user"}
          </p>
          <button
            className="mt-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            onClick={() => signOut()}
          >
            {localizationService.get("Logout")}
          </button>
        </div>
      ) : (
        <div className="space-y-2">
          <ModalTogglable buttonLabel="Login" ref={loginRef}>
            <Modal onClose={() => loginRef.current?.toggleVisibility()}>
              <BaseForm type="login" onClose={() => loginRef.current?.toggleVisibility()} />
            </Modal>
          </ModalTogglable>
          <ModalTogglable buttonLabel="Register" ref={registerRef}>
            <Modal onClose={() => registerRef.current?.toggleVisibility()}>
              <BaseForm type="register" onClose={() => registerRef.current?.toggleVisibility()} />
            </Modal>
          </ModalTogglable>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <div className="space-y-4">
          <h2 className="text-xl text-green-700 font-semibold">
            🔍 {localizationService.get("ListOfTasks:")}
          </h2>
          <Link href="/pixi" className="block text-blue-700 hover:underline">
            {localizationService.get("ToThePixiTasks")}
          </Link>
          <Link href="/quizzes" className="block text-blue-700 hover:underline">
            {localizationService.get("ToTheQuizzes")}
          </Link>
          <Link href="/dragdrop" className="block text-blue-700 hover:underline">
            {localizationService.get("ToTheDragAndDropTasks")}
          </Link>
          <Link href="/tasks" className="block text-blue-700 hover:underline">
            {localizationService.get("WithNumbersInURL")}
          </Link>
          <Link href="/cartoons" className="block text-red-700 hover:underline">
            🎬 {localizationService.get("Cartoons")}
          </Link>
        </div>

        <div className="w-full max-w-lg mx-auto bg-white/80 rounded-xl shadow-lg overflow-hidden p-4">
          <RiveComponent className="w-full h-auto aspect-square" />
        </div>
      </div>
    </div>
  );
};

export default Home;
