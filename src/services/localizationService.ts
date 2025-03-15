import { audioService } from "./audioService";

type Translations = { [key: string]: string };

class LocalizationService {
  private translations: Record<string, Translations> = {};
  private currentLanguage: string = "en";

  constructor() {
    this.loadTranslations();
  }

  private loadTranslations() {
    this.translations["en"] = require("../locales/en.json");
    this.translations["ru"] = require("../locales/ru.json");
  }

  setLanguage(language: string) {
    this.currentLanguage = language;
  }

  getCurrentLanguage(): string {
    return this.currentLanguage;
  }

  get(key: string, params?: Record<string, string>): string {
    const translation = this.translations[this.currentLanguage]?.[key] || key;
    if (params) {
      return Object.keys(params).reduce(
        (str, param) => str.replace(`{${param}}`, params[param]),
        translation
      );
    }
    return translation;
  }

  setLanguageAndSync(language: string) {
    this.setLanguage(language);
    audioService.setSpeechLanguage(language === "ru" ? "ru-RU" : "en-US");
  }
}

export const localizationService = new LocalizationService();
