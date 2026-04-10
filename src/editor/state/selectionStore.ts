import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export interface SceneObject {
  id: string;
  name: string;
  type: 'robot' | 'object' | 'light' | 'camera';
  visible: boolean;
  selected: boolean;
  children?: string[];
  parent?: string;
  position?: [number, number, number];
  rotation?: [number, number, number];
  scale?: [number, number, number];
}

export interface SelectionState {
  selectedIds: Set<string>;
  hoveredId: string | null;
  focusedId: string | null;
  sceneObjects: Map<string, SceneObject>;
  
  // Actions
  select: (id: string, multi?: boolean) => void;
  deselect: (id: string) => void;
  deselectAll: () => void;
  selectAll: () => void;
  setHovered: (id: string | null) => void;
  setFocused: (id: string | null) => void;
  addSceneObject: (object: SceneObject) => void;
  removeSceneObject: (id: string) => void;
  updateSceneObject: (id: string, updates: Partial<SceneObject>) => void;
  getSelectedObjects: () => SceneObject[];
  getSceneHierarchy: () => SceneObject[];
}

export const useSelectionStore = create<SelectionState>()(
  immer((set, get) => ({
    selectedIds: new Set(),
    hoveredId: null,
    focusedId: null,
    sceneObjects: new Map(),
    
    select: (id, multi = false) => {
      set((state) => {
        if (!multi) {
          state.selectedIds.clear();
        }
        state.selectedIds.add(id);
        
        // Update scene object selection
        const obj = state.sceneObjects.get(id);
        if (obj) {
          obj.selected = true;
        }
      });
    },
    
    deselect: (id) => {
      set((state) => {
        state.selectedIds.delete(id);
        
        // Update scene object selection
        const obj = state.sceneObjects.get(id);
        if (obj) {
          obj.selected = false;
        }
      });
    },
    
    deselectAll: () => {
      set((state) => {
        // Clear all selections in scene objects
        state.selectedIds.forEach((id) => {
          const obj = state.sceneObjects.get(id);
          if (obj) {
            obj.selected = false;
          }
        });
        state.selectedIds.clear();
      });
    },
    
    selectAll: () => {
      set((state) => {
        state.selectedIds.clear();
        state.sceneObjects.forEach((obj) => {
          state.selectedIds.add(obj.id);
          obj.selected = true;
        });
      });
    },
    
    setHovered: (id) => {
      set((state) => {
        state.hoveredId = id;
      });
    },
    
    setFocused: (id) => {
      set((state) => {
        state.focusedId = id;
      });
    },
    
    addSceneObject: (obj) => {
      set((state) => {
        state.sceneObjects.set(obj.id, { ...obj });
      });
    },
    
    removeSceneObject: (id) => {
      set((state) => {
        state.selectedIds.delete(id);
        state.sceneObjects.delete(id);
        
        // Remove from parent's children
        state.sceneObjects.forEach((obj) => {
          if (obj.children) {
            obj.children = obj.children.filter((childId) => childId !== id);
          }
        });
      });
    },
    
    updateSceneObject: (id, updates) => {
      set((state) => {
        const obj = state.sceneObjects.get(id);
        if (obj) {
          Object.assign(obj, updates);
        }
      });
    },
    
    getSelectedObjects: () => {
      const { selectedIds, sceneObjects } = get();
      return Array.from(selectedIds)
        .map((id) => sceneObjects.get(id))
        .filter((obj): obj is SceneObject => obj !== undefined);
    },
    
    getSceneHierarchy: () => {
      const { sceneObjects } = get();
      const hierarchy: SceneObject[] = [];
      const visited = new Set<string>();
      
      const visit = (obj: SceneObject) => {
        if (visited.has(obj.id)) return;
        visited.add(obj.id);
        hierarchy.push(obj);
        
        if (obj.children) {
          obj.children.forEach((childId) => {
            const child = sceneObjects.get(childId);
            if (child) visit(child);
          });
        }
      };
      
      // Find root objects (no parent)
      sceneObjects.forEach((obj) => {
        if (!obj.parent && !visited.has(obj.id)) {
          visit(obj);
        }
      });
      
      return hierarchy;
    },
  }))
);
