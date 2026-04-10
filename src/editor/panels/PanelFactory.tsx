import React from 'react';
import { TabNode } from 'flexlayout-react';
import { ErrorBoundary } from '../../shared/components/ErrorBoundary';
import PlaceholderPanel from './PlaceholderPanel';
import HierarchyPanel from '../../features/hierarchy/HierarchyPanel';
import InspectorPanel from '../../features/inspector/InspectorPanel';
import ConsolePanel from '../../features/console/ConsolePanel';
import ScenePanel from '../../features/scene/ScenePanel';

// Panel registry mapping component names to React components
const panelRegistry: Record<string, React.ComponentType> = {
  hierarchy: HierarchyPanel,
  inspector: InspectorPanel,
  console: ConsolePanel,
  scene: ScenePanel,
};

// Factory function for creating panels
export const createPanel = (node: TabNode): React.ReactNode => {
  const component = node.getComponent();
  
  // Guard against undefined component
  if (!component) {
    return (
      <ErrorBoundary>
        <PlaceholderPanel
          title="Unknown Panel"
          description="No component specified for this panel."
        />
      </ErrorBoundary>
    );
  }
  
  // Get the panel component from registry
  const PanelComponent = panelRegistry[component];
  
  if (!PanelComponent) {
    console.warn(`Panel component "${component}" not found in registry`);
    return (
      <ErrorBoundary>
        <PlaceholderPanel
          title={`Unknown Panel: ${component}`}
          description="This panel type is not registered in the panel factory."
        />
      </ErrorBoundary>
    );
  }
  
  // Wrap panel in error boundary for graceful error handling
  return (
    <ErrorBoundary>
      <PanelComponent />
    </ErrorBoundary>
  );
};

// Export panel registry for external use
export { panelRegistry };

export default createPanel;
