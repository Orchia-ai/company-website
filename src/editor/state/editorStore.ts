import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export interface LogMessage {
  id: string;
  timestamp: Date;
  level: 'info' | 'warning' | 'error' | 'success';
  message: string;
  source?: string;
}

export interface EditorState {
  // Toolbar state
  activeTool: string | null;
  
  // Console/Log state
  logs: LogMessage[];
  maxLogs: number;
  
  // Settings state
  settings: {
    showGrid: boolean;
    showAxes: boolean;
    autoSave: boolean;
    theme: 'light' | 'dark';
  };
  
  // Modal state
  activeModal: string | null;
  
  // Actions
  setActiveTool: (tool: string | null) => void;
  addLog: (message: string, level?: LogMessage['level'], source?: string) => void;
  clearLogs: () => void;
  updateSetting: <K extends keyof EditorState['settings']>(
    key: K,
    value: EditorState['settings'][K]
  ) => void;
  setActiveModal: (modal: string | null) => void;
}

export const useEditorStore = create<EditorState>()(
  immer((set) => ({
    activeTool: null,
    logs: [],
    maxLogs: 1000,
    settings: {
      showGrid: true,
      showAxes: true,
      autoSave: true,
      theme: 'light',
    },
    activeModal: null,
    
    setActiveTool: (tool) => {
      set((state) => {
        state.activeTool = tool;
      });
    },
    
    addLog: (message, level = 'info', source) => {
      set((state) => {
        const newLog: LogMessage = {
          id: `${Date.now()}-${Math.random()}`,
          timestamp: new Date(),
          level,
          message,
          source,
        };
        
        state.logs.push(newLog);
        
        // Keep only the last maxLogs
        if (state.logs.length > state.maxLogs) {
          state.logs = state.logs.slice(-state.maxLogs);
        }
      });
    },
    
    clearLogs: () => {
      set((state) => {
        state.logs = [];
      });
    },
    
    updateSetting: (key, value) => {
      set((state) => {
        state.settings[key] = value;
      });
    },
    
    setActiveModal: (modal) => {
      set((state) => {
        state.activeModal = modal;
      });
    },
  }))
);
