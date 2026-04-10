import React, { useEffect } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { enableMapSet } from 'immer';
import { ErrorBoundary } from '../shared/components/ErrorBoundary';
import { theme } from './theme';
import { LayoutManager } from '../editor/docking/LayoutManager';
import { createPanel } from '../editor/panels/PanelFactory';
import { useSelectionStore } from '../editor/state/selectionStore';
import { useEditorStore } from '../editor/state/editorStore';
import { useKeyboardShortcuts } from '../shared/hooks/useKeyboardShortcuts';

// Enable Immer's MapSet plugin for Map/Set support
enableMapSet();

// Main App component
const App: React.FC = () => {
  const { addSceneObject, sceneObjects } = useSelectionStore();
  const { addLog } = useEditorStore();
  
  // Initialize keyboard shortcuts
  useKeyboardShortcuts();

  // Initialize default scene objects on first load
  useEffect(() => {
    if (sceneObjects.size === 0) {
      // Add some default objects for demonstration
      const defaultObjects = [
        {
          id: 'robot-1',
          name: 'Robot Base',
          type: 'robot' as const,
          visible: true,
          selected: false,
          position: [0, 1, 0] as [number, number, number],
          rotation: [0, 0, 0] as [number, number, number],
          scale: [1, 1, 1] as [number, number, number],
        },
        {
          id: 'object-1',
          name: 'Cube',
          type: 'object' as const,
          visible: true,
          selected: false,
          position: [2, 0.5, 0] as [number, number, number],
          rotation: [0, 0.5, 0] as [number, number, number],
          scale: [1, 1, 1] as [number, number, number],
        },
        {
          id: 'light-1',
          name: 'Sun Light',
          type: 'light' as const,
          visible: true,
          selected: false,
          position: [5, 5, 5] as [number, number, number],
          rotation: [0, 0, 0] as [number, number, number],
          scale: [1, 1, 1] as [number, number, number],
        },
        {
          id: 'camera-1',
          name: 'Main Camera',
          type: 'camera' as const,
          visible: true,
          selected: false,
          position: [-3, 2, 3] as [number, number, number],
          rotation: [0, -0.5, 0] as [number, number, number],
          scale: [1, 1, 1] as [number, number, number],
        },
      ];

      defaultObjects.forEach((obj) => {
        addSceneObject(obj);
      });

      addLog('Scene initialized with default objects', 'success', 'App');
    }
  }, [sceneObjects.size, addSceneObject, addLog]);

  // Log app startup
  useEffect(() => {
    addLog('Unity-like Editor started successfully', 'success', 'App');
    addLog('Welcome! Select objects in the scene to edit their properties.', 'info', 'App');
  }, [addLog]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ErrorBoundary>
        <div style={{
          width: '100vw',
          height: '100vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}>
          {/* Main Layout */}
          <LayoutManager factory={createPanel} />
        </div>
      </ErrorBoundary>
    </ThemeProvider>
  );
};

export default App;
