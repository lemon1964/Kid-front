import NextAuth from "next-auth";
import axios, { InternalAxiosRequestConfig, AxiosHeaders } from "axios";

export interface AuthAxiosRequestConfig extends InternalAxiosRequestConfig {
  skipAuth?: boolean;
}

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      backendToken?: string | null;
    };
    backendToken?: token.backendToken | null;
    refreshToken?: token.refreshToken | null;
}

  interface JWT {
    id: string;
    name?: string | null;
    email?: string | null;
    backendToken?: string | null;
    refreshToken?: string | null;
  }

  interface User {
    id: string;
    name: string;
    email: string;
    backendToken?: string | null;
    refreshToken?: string | null;
  }
  interface User extends NextAuthUser {}
}