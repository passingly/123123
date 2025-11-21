
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from '@google/genai';
import CharacterList from './components/CharacterList';
import ChatView from './components/ChatView';
import CreateCharacterForm from './components/CreateCharacterForm';
import UserProfileList from './components/UserProfileList';
import CreateUserProfileForm from './components/CreateUserProfileForm';
import SessionHistoryPanel from './components/SessionHistoryPanel';
import SessionContinuation from './components/SessionContinuation';
import IosStorageModal from './components/IosStorageModal';
import ConfirmModal from './components/ConfirmModal';
import type { Character, AIModel, UserProfile, ChatSession, ChatMessage, ExportedSessionData } from './types';
import { get, set } from './utils/storage';

// Pre-populated characters for initial display
const initialCharacters: Character[] = [
  {
    id: '1',
    name: '유나',
    prompt: "당신은 유나, 상냥하고 애교 많은 여고생입니다. 항상 당신의 짝사랑 상대인 사용자에게 적극적으로 애정을 표현하며, 가끔은 집착에 가까운 모습을 보이기도 합니다. 사용자를 '선배'라고 부르며 살갑게 대하지만, 다른 사람이 선배에게 접근하는 것은 극도로 경계합니다.",
    image: 'https://raw.githubusercontent.com/passingly/crack/refs/heads/main/IMG_3618.jpeg',
    greeting: "어, 선배! 마침 잘 만났어요. 선배 생각하고 있었는데... 우리, 운명인가 봐요. 후훗.",
  },
  {
    id: '2',
    name: '설아',
    prompt: "당신은 설아, 말수가 적고 부끄러움을 많이 타는 소녀입니다. 다른 사람과 눈을 마주치는 것을 어려워하지만, 사실은 누구보다 따뜻한 마음을 가지고 있습니다. 사용자와의 대화를 통해 조금씩 마음을 열어가며, 서툴지만 진심을 담아 자신의 감정을 표현하려고 노력합니다.",
    image: 'https://raw.githubusercontent.com/passingly/crack/refs/heads/main/IMG_3589.jpeg',
    greeting: "*조심스럽게 고개를 들어 당신을 바라본다. 시선이 마주치자 화들짝 놀라며 다시 고개를 숙인다.* \"...아, 안녕하세요...\"",
  },
  {
    id: '3',
    name: '나리',
    prompt: "당신은 나리, 고양이의 특성을 가진 활발하고 장난기 많은 소녀입니다. 말끝마다 '~냥'을 붙이는 습관이 있으며, 호기심이 많아 새로운 것을 발견하는 것을 좋아합니다. 사용자에게는 스스럼없이 다가가 애교를 부리거나, 기분에 따라 변덕스러운 모습을 보이기도 합니다.",
    image: 'https://raw.githubusercontent.com/passingly/crack/refs/heads/main/IMG_3611.jpeg',
    greeting: "흐음~? 어디서 좋은 냄새가 난다 했더니, 네가 있었구나, 냥! 나랑 놀아주러 온 거야?",
  },
   {
    id: '4',
    name: '아린',
    prompt: "당신은 아린, 성숙하고 신비로운 분위기를 가진 연상의 누나입니다. 항상 여유로운 미소를 띠고 있으며, 때로는 대담한 말과 행동으로 사용자를 놀리기도 합니다. 사용자를 동생처럼 아끼면서도, 이성으로서의 매력을 어필하며 관계를 주도해 나갑니다.",
    image: 'https://raw.githubusercontent.com/passingly/crack/refs/heads/main/IMG_3605.png',
    greeting: "어머, 귀여운 동생님이네? 누나 보러 온 거야? 잘 왔어. 마침 심심하던 참이었는데. *그녀가 우아하게 미소 지으며 당신을 바라본다.*",
  },
  {
    id: '5',
    name: '단아',
    prompt: "당신은 단아, 고즈넉한 한옥에 머무는 아씨입니다. 차분하고 기품 있는 말투를 사용하며, 시와 그림을 즐기는 풍류를 압니다. 바깥세상에 대한 호기심을 가지고 있지만, 자신의 공간을 벗어나는 것에는 신중합니다. 사용자에게 세상 이야기를 들으며 새로운 감정을 배워갑니다.",
    image: 'https://raw.githubusercontent.com/passingly/crack/refs/heads/main/IMG_3479.png',
    greeting: "*먹을 갈던 손을 멈추고 창밖의 당신을 발견한다. 조용히 일어나 문을 열고는, 고운 목소리로 말한다.* \"뉘신지 모르겠으나, 잠시 쉬어가시겠어요?\"",
  }
];

const initialUserProfiles: UserProfile[] = [];

const aiModels: AIModel[] = [
  { id: 'flash', name: 'gemini-2.5-flash', displayName: 'Gemini 2.5 Flash', description: 'Fast, efficient, and great for everyday conversations.' },
  { id: 'pro', name: 'gemini-2.5-pro', displayName: 'Gemini 2.5 Pro', description: 'Advanced model for more creative and complex role-playing.' },
  { id: 'pro-lite', name: 'gemini-2.5-pro', displayName: 'Gemini 2.5 Pro (Lite)', description: 'Pro model with a limited thinking budget (128 tokens) for faster, concise responses.', thinkingBudget: 128 },
  { id: 'v3-pro', name: 'gemini-3-pro-preview', displayName: 'Gemini 3.0 Pro', description: 'State-of-the-art reasoning model with maximum thinking capacity for the most complex interactions.', thinkingBudget: 32768 },
  { id: 'v3-pro-lite', name: 'gemini-3-pro-preview', displayName: 'Gemini 3.0 Pro (Lite)', description: 'Gemini 3.0 Pro with a limited thinking budget (128 tokens).', thinkingBudget: 128 },
];

type View = 'home' | 'chat' | 'createCharacter' | 'selectUserProfile' | 'createUserProfile' | 'sessionContinuation';

interface AppState {
  characters: Character[];
  userProfiles: UserProfile[];
  chatSessions: ChatSession[];
  isAdultMode: boolean;
  hasSeenIosModal: boolean;
}

const App: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [userProfiles, setUserProfiles] = useState<UserProfile[]>([]);
  const [selectedUserProfile, setSelectedUserProfile] = useState<UserProfile | null>(null);
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedModelId, setSelectedModelId] = useState<string>('pro');
  
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [isHistoryPanelOpen, setIsHistoryPanelOpen] = useState(false);
  const [isAdultMode, setIsAdultMode] = useState<boolean>(false);
  const [mostRecentSessionForSelectedChar, setMostRecentSessionForSelectedChar] = useState<ChatSession | null>(null);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  
  const [showIosModal, setShowIosModal] = useState(false);
  const [showSaveConfirmModal, setShowSaveConfirmModal] = useState(false);
  const [sessionToExport, setSessionToExport] = useState<ChatSession | null>(null);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    if (!installPrompt) {
      return;
    }
    installPrompt.prompt();
    installPrompt.userChoice.then((choiceResult: { outcome: string }) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User accepted the install prompt');
      } else {
        console.log('User dismissed the install prompt');
      }
      setInstallPrompt(null);
    });
  };
  
  const setStateFromData = (data: Partial<AppState> | null) => {
    setCharacters(data?.characters ?? initialCharacters);
    setUserProfiles(data?.userProfiles ?? initialUserProfiles);
    setIsAdultMode(data?.isAdultMode ?? false);
  
    const savedChatSessions = data?.chatSessions ?? [];
    if (savedChatSessions.length > 0) {
      const migratedSessions = savedChatSessions.map(session => {
        if (!session.messages) session.messages = [];
        const migratedMessages = session.messages.map((msg: any) => {
          if (msg.id && msg.content && Array.isArray(msg.content)) return msg as ChatMessage;
          return {
            id: `msg-${Date.now()}-${Math.random()}`,
            role: msg.role,
            content: [{ text: msg.text, imageUrl: msg.imageUrl }],
            activeContentIndex: 0,
          };
        });
        session.messages = migratedMessages;
        if ((session as any).summary && !session.summaries) session.summaries = [(session as any).summary];
        delete (session as any).summary;
        if (session.enableLongTermMemory === undefined) session.enableLongTermMemory = true;
        return session as ChatSession;
      });
      setChatSessions(migratedSessions);
    } else {
      setChatSessions([]);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const dbData = await get<AppState>('appState');
        setStateFromData(dbData);

        const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent);
        if (isIos && !dbData?.hasSeenIosModal) {
            setShowIosModal(true);
        }

      } catch (error) {
        console.error("Failed to load data:", error);
        setStateFromData(null); // Load initial data on error
      } finally {
        setIsDataLoaded(true);
      }
    };
  
    loadData();
  }, []);
  
  const handleIosModalClose = async () => {
    setShowIosModal(false);
    try {
        await set('hasSeenIosModal', true);
    } catch (error) {
        console.error("Failed to save iOS modal seen status:", error);
    }
  };


  useEffect(() => {
    if (!isDataLoaded) return;

    const saveData = async () => {
      const hasSeenIosModal = await get<boolean>('hasSeenIosModal') ?? false;
      const appState: AppState = { characters, userProfiles, chatSessions, isAdultMode, hasSeenIosModal };
      try {
        await set('appState', appState);
      } catch (error) {
        console.error("Failed to save data:", error);
      }
    };
  
    const debounceTimeout = setTimeout(saveData, 1000);
  
    const handlePageHide = () => {
      clearTimeout(debounceTimeout);
      saveData();
    };
  
    window.addEventListener('pagehide', handlePageHide);
  
    return () => {
      clearTimeout(debounceTimeout);
      window.removeEventListener('pagehide', handlePageHide);
    };
  }, [chatSessions, characters, userProfiles, isAdultMode, isDataLoaded]);

  const handleToggleAdultMode = (enabled: boolean) => {
    setIsAdultMode(enabled);
  };

  const handleSelectCharacter = (character: Character) => {
    setSelectedCharacter(character);
    
    const sessionsForChar = chatSessions
      .filter(s => s.characterId === character.id)
      .sort((a, b) => b.lastUpdated - a.lastUpdated);
    
    if (sessionsForChar.length > 0) {
      setMostRecentSessionForSelectedChar(sessionsForChar[0]);
    } else {
      setMostRecentSessionForSelectedChar(null);
    }
    
    setCurrentView('sessionContinuation');
  };

  const handleCreateCharacter = (newCharacterData: Omit<Character, 'id'>) => {
    const newCharacter: Character = {
      ...newCharacterData,
      id: Date.now().toString(),
    };
    setCharacters(prev => [newCharacter, ...prev]);
    setCurrentView('home');
  };
  
  const handleSelectUserProfile = (profile: UserProfile) => {
    if (!selectedCharacter) return;
    
    setSelectedUserProfile(profile);

    const existingSession = chatSessions.find(s => s.characterId === selectedCharacter.id && s.userProfileId === profile.id);

    if (existingSession) {
      setActiveSessionId(existingSession.id);
      setSelectedModelId(existingSession.modelId);
    } else {
      const newMessages: ChatMessage[] = [];
      
      if (selectedCharacter.greeting) {
        const processedGreeting = selectedCharacter.greeting
          .replace(/{{user}}/g, profile.name)
          .replace(/{user}/g, profile.name);

        newMessages.push({
          id: `msg-${Date.now()}-greeting`,
          role: 'model',
          content: [{ text: processedGreeting }],
          activeContentIndex: 0,
        });
      }

      const newSession: ChatSession = {
        id: `session-${Date.now()}`,
        characterId: selectedCharacter.id,
        userProfileId: profile.id,
        modelId: selectedModelId,
        messages: newMessages,
        lastUpdated: Date.now(),
        enableLongTermMemory: true, // Default ON
      };
      setChatSessions(prev => [newSession, ...prev]);
      setActiveSessionId(newSession.id);
    }
    setCurrentView('chat');
  };
  
  const handleCreateUserProfile = (newProfileData: Omit<UserProfile, 'id'>) => {
    const newProfile: UserProfile = {
      ...newProfileData,
      id: Date.now().toString(),
    };
    setUserProfiles(prev => [newProfile, ...prev]);
    handleSelectUserProfile(newProfile);
  };

  const handleUpdateSession = (updater: ChatSession | ((prevSession: ChatSession) => ChatSession)) => {
    setChatSessions(prevSessions =>
      prevSessions.map(session => {
        if (session.id === activeSessionId) {
          const updatedSession = typeof updater === 'function' ? updater(session) : updater;
          return { ...updatedSession, lastUpdated: Date.now() };
        }
        return session;
      })
    );
  };
  
  const handleBackToHome = () => {
    const session = chatSessions.find(s => s.id === activeSessionId);
    if (session && session.messages.length > 1) { // has more than just a greeting
      setSessionToExport(session);
      setShowSaveConfirmModal(true);
    } else {
      resetChatState();
    }
  };
  
  const resetChatState = () => {
    setSelectedCharacter(null);
    setSelectedUserProfile(null);
    setActiveSessionId(null);
    setMostRecentSessionForSelectedChar(null);
    setCurrentView('home');
    setSessionToExport(null);
    setShowSaveConfirmModal(false);
  };

  const handleNavigateToCreate = () => {
    setCurrentView('createCharacter');
  };

  const handleNavigateToCreateUserProfile = () => {
    setCurrentView('createUserProfile');
  };

  const handleBackToProfileSelection = () => {
    setCurrentView('selectUserProfile');
  };

  const handleResumeSession = (sessionId: string) => {
    const session = chatSessions.find(s => s.id === sessionId);
    if (!session) return;
    
    const character = characters.find(c => c.id === session.characterId);
    const profile = userProfiles.find(p => p.id === session.userProfileId);
    
    if (!character || !profile) {
      alert("Character or User Profile for this session no longer exists.");
      return;
    }

    setSelectedCharacter(character);
    setSelectedUserProfile(profile);
    setSelectedModelId(session.modelId);
    setActiveSessionId(sessionId);
    setCurrentView('chat');
    setIsHistoryPanelOpen(false);
  };
  
  const handleDeleteSession = (sessionId: string) => {
    if (window.confirm("Are you sure you want to delete this conversation forever?")) {
      setChatSessions(prev => prev.filter(s => s.id !== sessionId));
    }
  };
  
  const handleModelChange = (modelId: string) => {
    setSelectedModelId(modelId);
    if(activeSessionId) {
       setChatSessions(prev => prev.map(session => 
        session.id === activeSessionId 
          ? { ...session, modelId } // Update modelId without clearing messages
          : session
      ));
    }
  };

  const handleExportCharacter = (character: Character) => {
    const dataStr = JSON.stringify(character, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const fileName = `${character.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_character.json`;
    link.download = fileName;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  const exportSessionToFile = (session: ChatSession | null) => {
    if (!session) return;
    const character = characters.find(c => c.id === session.characterId);
    const userProfile = userProfiles.find(p => p.id === session.userProfileId);
    if (!character || !userProfile) return;

    const chatLog = [
        `Chat with ${character.name}`,
        `Persona: ${userProfile.name}`,
        ``,
        `--------------------------------------------------`,
        ``
    ].concat(session.messages.map(msg => {
        const author = msg.role === 'model' ? character.name : userProfile.name;
        const content = msg.content[msg.activeContentIndex];
        const text = content.text || (content.imageUrl ? '[Image]' : '');
        return `${author}:\n${text}`;
    })).join('\n\n');

    const data: ExportedSessionData = {
      character,
      userProfile,
      session,
      isAdultMode: isAdultMode,
      chatLog: chatLog,
    };

    const dataStr = JSON.stringify(data, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const fileName = `session_${character.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${new Date().toISOString().slice(0,10)}.json`;
    link.download = fileName;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };
  
  const handleExportSession = () => {
    const activeSession = chatSessions.find(s => s.id === activeSessionId);
    exportSessionToFile(activeSession);
  };

  const handleImportFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== 'string') {
          throw new Error("Failed to read file content.");
        }
        const data = JSON.parse(text);

        if (data.character && data.userProfile && data.session) {
          const { character: importedChar, userProfile: importedProfile, session: importedSession, isAdultMode: importedAdultMode } = data as ExportedSessionData;
          
          let alertMessage = "";
          if (Array.isArray(importedSession.summaries) && importedSession.summaries.length > 0) {
             importedSession.enableLongTermMemory = true;
             alertMessage = "Session imported successfully with existing memories!";
          } else {
             importedSession.enableLongTermMemory = false;
             alertMessage = "Session imported. Long-term memory is disabled (OFF) because no memories were found in the file.";
             importedSession.summaries = [];
          }

          if ('summary' in importedSession) {
            delete (importedSession as any).summary;
          }

          setCharacters(prev => prev.find(c => c.id === importedChar.id) ? prev : [importedChar, ...prev]);
          setUserProfiles(prev => prev.find(p => p.id === importedProfile.id) ? prev : [importedProfile, ...prev]);
          setChatSessions(prev => {
            const sessionExists = prev.some(s => s.id === importedSession.id);
            return sessionExists 
              ? prev.map(s => s.id === importedSession.id ? importedSession : s)
              : [importedSession, ...prev];
          });
          
          setIsAdultMode(importedAdultMode ?? false);
          
          setSelectedCharacter(importedChar);
          setSelectedUserProfile(importedProfile);
          setActiveSessionId(importedSession.id);
          setSelectedModelId(importedSession.modelId);
          setCurrentView('chat');
          alert(alertMessage);
          return;
        }

        if (data.name && data.prompt && data.image) {
          const { id, ...charData } = data as Character;
          const newCharacter: Character = {
            name: charData.name,
            prompt: charData.prompt,
            image: charData.image,
            greeting: charData.greeting,
            id: `char-${Date.now()}`,
          };
          setCharacters(prev => [newCharacter, ...prev]);
          alert(`Character "${newCharacter.name}" imported successfully!`);
          return;
        }

        throw new Error("Invalid file format. The file is not a valid character or session file.");

      } catch (error: any) {
        setImportStatus(null);
        console.error("Failed to import file:", error);
        alert(`Failed to import file. The file may be corrupt or in the wrong format. Error: ${error.message}`);
      }
    };
    reader.onerror = () => {
        alert("Error reading file.");
    }
    reader.readAsText(file);
  };

  const handleStartNewSession = () => {
    setCurrentView('selectUserProfile');
  };

  const handleContinueMostRecentSession = () => {
      if (!mostRecentSessionForSelectedChar || !selectedCharacter) return;
      
      const profile = userProfiles.find(p => p.id === mostRecentSessionForSelectedChar.userProfileId);
      if (!profile) {
        alert("The user profile for the last session could not be found. Please start a new chat.");
        setCurrentView('selectUserProfile');
        return;
      }
      
      setSelectedUserProfile(profile);
      setActiveSessionId(mostRecentSessionForSelectedChar.id);
      setSelectedModelId(mostRecentSessionForSelectedChar.modelId);
      setCurrentView('chat');
  };

  const renderView = () => {
    const activeSession = chatSessions.find(s => s.id === activeSessionId);

    switch (currentView) {
      case 'chat':
        return selectedCharacter && selectedUserProfile && activeSession && (
          <ChatView
            character={selectedCharacter}
            userProfile={selectedUserProfile}
            session={activeSession}
            onUpdateSession={handleUpdateSession}
            onBack={handleBackToHome}
            models={aiModels}
            onSelectModel={handleModelChange}
            isAdultMode={isAdultMode}
            onExportSession={handleExportSession}
          />
        );
      case 'createCharacter':
        return <CreateCharacterForm onSubmit={handleCreateCharacter} onBack={handleBackToHome} />;
      case 'selectUserProfile':
        return <UserProfileList 
                  profiles={userProfiles} 
                  onSelectProfile={handleSelectUserProfile} 
                  onNavigateToCreate={handleNavigateToCreateUserProfile}
                  onBack={handleBackToHome}
                />;
      case 'createUserProfile':
        return <CreateUserProfileForm onSubmit={handleCreateUserProfile} onBack={handleBackToProfileSelection} />;
      case 'sessionContinuation': {
        if (!selectedCharacter) {
          setCurrentView('home');
          return null;
        }
        const recentSessionProfile = mostRecentSessionForSelectedChar
            ? userProfiles.find(p => p.id === mostRecentSessionForSelectedChar.userProfileId)
            : null;

        return (
            <SessionContinuation
                character={selectedCharacter}
                recentSession={mostRecentSessionForSelectedChar}
                userProfile={recentSessionProfile || null}
                onStartNew={handleStartNewSession}
                onContinue={handleContinueMostRecentSession}
                onBack={handleBackToHome}
            />
        );
      }
      case 'home':
      default:
        return (
          <CharacterList
            characters={characters}
            onSelectCharacter={handleSelectCharacter}
            onNavigateToCreate={handleNavigateToCreate}
            onOpenHistory={() => setIsHistoryPanelOpen(true)}
            isAdultMode={isAdultMode}
            onToggleAdultMode={handleToggleAdultMode}
            onImportFile={handleImportFile}
            onExportCharacter={handleExportCharacter}
            isInstallable={!!installPrompt}
            onInstall={handleInstallClick}
          />
        );
    }
  };

  if (!isDataLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#141413]">
        <div className="flex flex-col items-center">
          <svg className="animate-spin h-10 w-10 text-zinc-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-zinc-400">Loading your sessions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#141413] font-sans text-zinc-100">
      <IosStorageModal 
        isOpen={showIosModal}
        onClose={handleIosModalClose}
      />
      <ConfirmModal
        isOpen={showSaveConfirmModal}
        onClose={resetChatState}
        onConfirm={() => {
          exportSessionToFile(sessionToExport);
          resetChatState();
        }}
        title="Save Session?"
        message="Would you like to download a backup of this conversation before returning to the main menu?"
      />
      <main className="max-w-7xl mx-auto">
        {renderView()}
      </main>
      <SessionHistoryPanel
        isOpen={isHistoryPanelOpen}
        onClose={() => setIsHistoryPanelOpen(false)}
        sessions={chatSessions}
        characters={characters}
        userProfiles={userProfiles}
        onResumeSession={handleResumeSession}
        onDeleteSession={handleDeleteSession}
      />
      {importStatus && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex flex-col items-center justify-center text-white animate-fade-in">
          <svg className="animate-spin h-10 w-10 text-zinc-400 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-xl font-bold">{importStatus}</p>
        </div>
      )}
    </div>
  );
};

export default App;