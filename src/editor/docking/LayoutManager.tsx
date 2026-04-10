import React, { useCallback, useRef } from 'react';
import { Layout, Model, TabNode } from 'flexlayout-react';
import { useLayoutStore } from '../state/layoutStore';
import { ErrorBoundary } from '../../shared/components/ErrorBoundary';
import 'flexlayout-react/style/light.css';
import '../../styles/flexlayout-overrides.css';

interface LayoutManagerProps {
  factory: (node: TabNode) => React.ReactNode;
  onRenderTab?: (node: TabNode, renderValues: { leading: React.ReactNode; content: React.ReactNode }) => void;
}

export const LayoutManager: React.FC<LayoutManagerProps> = ({ factory, onRenderTab }) => {
  const { layout, setLayout } = useLayoutStore();
  const layoutRef = useRef<Layout>(null);

  const handleLayoutChange = useCallback((model: Model) => {
    setLayout(model.toJson());
  }, [setLayout]);

  // Custom tab renderer for Material 3 styling
  const renderTab = useCallback((node: TabNode) => {
    const renderValues = {
      leading: null,
      content: (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '4px 12px',
          fontSize: '14px',
          fontWeight: 500,
        }}>
          {node.getIcon() && (
            <span className="flexlayout__tab_icon" style={{ fontSize: 18 }}>
              {node.getIcon()}
            </span>
          )}
          <span>{node.getName()}</span>
        </div>
      ),
    };

    onRenderTab?.(node, renderValues);
    return renderValues.content;
  }, [onRenderTab]);

  return (
    <ErrorBoundary>
      <div style={{
        height: '100%',
        width: '100%',
        overflow: 'hidden',
        background: '#F7F2FA',
      }}>
        <Layout
          ref={layoutRef}
          model={Model.fromJson(layout)}
          factory={factory}
          onRenderTab={renderTab}
          onModelChange={handleLayoutChange}
                  />
      </div>
    </ErrorBoundary>
  );
};

export default LayoutManager;
