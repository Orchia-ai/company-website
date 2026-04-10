import { useEffect, useMemo } from 'react';
import { useSelectionStore } from '../../editor/state/selectionStore';
import { useLayoutStore } from '../../editor/state/layoutStore';
import { useEditorStore } from '../../editor/state/editorStore';

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  action: () => void;
  description: string;
}

export const useKeyboardShortcuts = () => {
  const { deselectAll, getSelectedObjects } = useSelectionStore();
  const { resetLayout } = useLayoutStore();
  const { clearLogs, addLog } = useEditorStore();

  const shortcuts: KeyboardShortcut[] = useMemo(() => [
    {
      key: 'a',
      ctrlKey: true,
      action: () => {
        deselectAll();
        addLog('Deselected all objects', 'info', 'Keyboard');
      },
      description: 'Deselect All (Ctrl+A)',
    },
    {
      key: 'Delete',
      action: () => {
        const selected = getSelectedObjects();
        selected.forEach((obj) => {
          useSelectionStore.getState().removeSceneObject(obj.id);
        });
        addLog(`Deleted ${selected.length} object(s)`, 'info', 'Keyboard');
      },
      description: 'Delete Selected (Delete)',
    },
    {
      key: 'r',
      ctrlKey: true,
      shiftKey: true,
      action: () => {
        resetLayout();
        addLog('Layout reset to default', 'info', 'Keyboard');
      },
      description: 'Reset Layout (Ctrl+Shift+R)',
    },
    {
      key: 'l',
      ctrlKey: true,
      action: () => {
        clearLogs();
        addLog('Console cleared', 'info', 'Keyboard');
      },
      description: 'Clear Console (Ctrl+L)',
    },
  ], [deselectAll, getSelectedObjects, resetLayout, clearLogs, addLog]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in input fields
      const target = event.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.contentEditable === 'true') {
        return;
      }

      for (const shortcut of shortcuts) {
        const matchesKey = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const matchesCtrl = !!shortcut.ctrlKey === event.ctrlKey;
        const matchesShift = !!shortcut.shiftKey === event.shiftKey;
        const matchesAlt = !!shortcut.altKey === event.altKey;

        if (matchesKey && matchesCtrl && matchesShift && matchesAlt) {
          event.preventDefault();
          event.stopPropagation();
          shortcut.action();
          break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);

  return shortcuts;
};
