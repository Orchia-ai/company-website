import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { IJsonModel } from 'flexlayout-react';

export interface LayoutState {
  layout: IJsonModel;
  defaultLayout: IJsonModel;
  setLayout: (layout: IJsonModel) => void;
  resetLayout: () => void;
  saveLayout: () => void;
}

const defaultLayoutJson: IJsonModel = {
  global: {
    tabEnableClose: true,
    tabSetEnableClose: true,
    tabSetEnableMaximize: true,
    borderEnableAutoHide: true,
  },
  borders: [],
  layout: {
    type: 'row',
    weight: 100,
    children: [
      {
        type: 'tabset',
        weight: 20,
        children: [
          {
            type: 'tab',
            name: 'Hierarchy',
            component: 'hierarchy',
          },
        ],
      },
      {
        type: 'row',
        weight: 60,
        children: [
          {
            type: 'tabset',
            weight: 100,
            children: [
              {
                type: 'tab',
                name: 'Scene',
                component: 'scene',
                enableClose: false,
              },
            ],
          },
        ],
      },
      {
        type: 'tabset',
        weight: 20,
        children: [
          {
            type: 'tab',
            name: 'Inspector',
            component: 'inspector',
          },
          {
            type: 'tab',
            name: 'Console',
            component: 'console',
          },
        ],
      },
    ],
  },
};

export const useLayoutStore = create<LayoutState>()(
  persist(
    immer((set) => ({
      layout: defaultLayoutJson,
      defaultLayout: defaultLayoutJson,
      
      setLayout: (newLayout) => {
        set((state) => {
          state.layout = newLayout;
        });
      },
      
      resetLayout: () => {
        set((state) => {
          state.layout = state.defaultLayout;
        });
      },
      
      saveLayout: () => {
        // Layout is automatically persisted via zustand persist middleware
        // This method is for explicit save actions
      },
    })),
    {
      name: 'editor-layout',
      partialize: (state) => ({ layout: state.layout }),
    }
  )
);
