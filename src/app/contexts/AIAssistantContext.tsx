import { createContext, useContext } from 'react';

interface AIAssistantContextType {
  openAIAssistant: () => void;
}

export const AIAssistantContext = createContext<AIAssistantContextType>({
  openAIAssistant: () => {},
});

export const useAIAssistant = () => useContext(AIAssistantContext);
