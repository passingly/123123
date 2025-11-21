
export interface ChatMessageContent {
  text?: string;
  imageUrl?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: ChatMessageContent[];
  activeContentIndex: number;
}

export interface Character {
  id: string;
  name: string;
  prompt: string;
  image: string;
  greeting?: string;
}

export interface UserProfile {
  id:string;
  name: string;
  prompt: string;
}

export interface AIModel {
  id: string;
  name: 'gemini-2.5-flash' | 'gemini-2.5-pro' | 'gemini-3-pro-preview';
  displayName: string;
  description: string;
  thinkingBudget?: number;
}

export interface ChatSession {
  id: string;
  characterId: string;
  userProfileId: string;
  modelId: string;
  messages: ChatMessage[];
  lastUpdated: number;
  memoPrompt?: string;
  summaries?: string[];
  enableLongTermMemory?: boolean;
}

export interface ExportedSessionData {
  character: Character;
  userProfile: UserProfile;
  session: ChatSession;
  isAdultMode: boolean;
  chatLog: string;
}
