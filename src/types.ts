export interface AnimationCode {
  html: string;
  css: string;
  js: string;
}

export interface User {
  id: number;
  username: string;
  isGuest?: boolean;
}

export interface GenerationState {
  isLoading: boolean;
  error: string | null;
  code: AnimationCode | null;
}
