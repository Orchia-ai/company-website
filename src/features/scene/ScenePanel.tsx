import React, { useRef, useEffect, useCallback } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import {
  OrbitControls,
  Grid,
  GizmoHelper,
  GizmoViewport,
  PerspectiveCamera,
} from '@react-three/drei';
import * as THREE from 'three';
import { Box as MuiBox, Typography } from '@mui/material';
import { useSelectionStore } from '../../editor/state/selectionStore';
import { useEditorStore } from '../../editor/state/editorStore';
import { ErrorBoundary } from '../../shared/components/ErrorBoundary';

// Scene component with error boundary wrapper
const SceneContent: React.FC = () => {
  const { sceneObjects, selectedIds, hoveredId } = useSelectionStore();
  const { settings } = useEditorStore();
  
  return (
    <>
      {/* Camera */}
      <PerspectiveCamera makeDefault position={[5, 5, 5]} />
      
      {/* Controls */}
      <OrbitControls
        makeDefault
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={1}
        maxDistance={100}
      />
      
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      
      {/* Grid */}
      {settings.showGrid && (
        <Grid
          args={[20, 20]}
          cellSize={1}
          cellThickness={0.5}
          cellColor="#E7DEF0"
          sectionSize={5}
          sectionThickness={1}
          sectionColor="#6750A4"
          fadeDistance={30}
          fadeStrength={1}
          infiniteGrid
        />
      )}
      
      {/* Axes */}
      {settings.showAxes && <axesHelper args={[5]} />}
      
      {/* Scene Objects */}
      {Array.from(sceneObjects.values()).map((obj) => (
        <SceneObject
          key={obj.id}
          object={obj}
          isSelected={selectedIds.has(obj.id)}
          isHovered={hoveredId === obj.id}
        />
      ))}
      
      {/* Gizmo */}
      <GizmoHelper alignment="bottom-right" margin={[80, 80]}>
        <GizmoViewport
          axisColors={['#ff0000', '#00ff00', '#0000ff']}
          labelColor="white"
        />
      </GizmoHelper>
    </>
  );
};

// Individual scene object component
interface SceneObjectProps {
  object: any;
  isSelected: boolean;
  isHovered: boolean;
}

const SceneObject: React.FC<SceneObjectProps> = ({ object, isSelected, isHovered }) => {
const meshRef = useRef<THREE.Mesh>(null);
  const { setHovered } = useSelectionStore();
  
      // Handle hover state
      useEffect(() => {
        if (meshRef.current) {
          meshRef.current.userData.cursor = 'pointer';
        }
      }, []);

  // Update selection outline
  useFrame(() => {
    if (meshRef.current && isSelected) {
      meshRef.current.rotation.y += 0.01;
    }
  });

  const handlePointerOver = useCallback((e: any) => {
    e.stopPropagation();
    setHovered(object.id);
  }, [object.id, setHovered]);

  const handlePointerOut = useCallback((e: any) => {
    e.stopPropagation();
    setHovered(null);
  }, [setHovered]);

  const handleClick = useCallback((e: any) => {
    e.stopPropagation();
    // Selection will be handled by parent
  }, []);

  const getGeometry = (type: string) => {
    switch (type) {
      case 'robot':
        return <boxGeometry args={[1, 2, 1]} />;
      case 'object':
        return <boxGeometry args={[1, 1, 1]} />;
      case 'light':
        return <sphereGeometry args={[0.5]} />;
      case 'camera':
        return <boxGeometry args={[0.8, 0.6, 1.2]} />;
      default:
        return <boxGeometry args={[1, 1, 1]} />;
    }
  };

  const getMaterial = () => {
    let color = '#6750A4';
    if (isSelected) color = '#D0BCFF';
    if (isHovered) color = '#E8DEF8';
    
    return {
      color,
      transparent: true,
      opacity: object.visible ? 1 : 0.3,
      wireframe: object.type === 'light',
      emissive: object.type === 'light' ? '#FFA500' : '#000000',
      emissiveIntensity: object.type === 'light' ? 0.5 : 0,
    };
  };

  return (
    <mesh
      ref={meshRef}
      position={object.position}
      rotation={object.rotation}
      scale={object.scale}
      visible={object.visible}
      onPointerOver={handlePointerOver}
      onPointerOut={handlePointerOut}
      onClick={handleClick}
      userData={{ id: object.id }}
    >
      {getGeometry(object.type)}
      <meshStandardMaterial {...getMaterial()} />
    </mesh>
  );
};

// Resize handler for canvas
interface CanvasWrapperProps {
  onResize: (width: number, height: number) => void;
}

const CanvasWrapper: React.FC<CanvasWrapperProps> = ({ onResize }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      // Initial size
      const { width, height } = containerRef.current.getBoundingClientRect();
      onResize(width, height);

      // Setup resize observer
      resizeObserverRef.current = new ResizeObserver((entries) => {
        for (const entry of entries) {
          const { width, height } = entry.contentRect;
          onResize(width, height);
        }
      });

      resizeObserverRef.current.observe(containerRef.current);
    }

    return () => {
      resizeObserverRef.current?.disconnect();
    };
  }, [onResize]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
      }}
    >
      <Canvas
        shadows
        gl={{
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping as any,
        }}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
        }}
      >
        <SceneContent />
      </Canvas>
    </div>
  );
};

// Main Scene Panel component
export const ScenePanel: React.FC = () => {
  const { addLog } = useEditorStore();

  const handleCanvasResize = useCallback((width: number, height: number) => {
    addLog(`Viewport resized: ${width}x${height}`, 'info', 'Scene');
  }, [addLog]);

  return (
    <MuiBox sx={{ height: '100%', position: 'relative', bgcolor: '#1C1B1F' }}>
      {/* Header overlay */}
      <MuiBox
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          p: 2,
          background: 'linear-gradient(to bottom, rgba(28, 27, 31, 0.9), transparent)',
          zIndex: 10,
          pointerEvents: 'none',
        }}
      >
        <Typography variant="h6" color="white">
          Scene
        </Typography>
      </MuiBox>

      {/* 3D Viewport */}
      <ErrorBoundary>
        <CanvasWrapper onResize={handleCanvasResize} />
      </ErrorBoundary>

      {/* Controls hint */}
      <MuiBox
        sx={{
          position: 'absolute',
          bottom: 16,
          left: 16,
          bgcolor: 'rgba(0, 0, 0, 0.7)',
          color: 'white',
          p: 1,
          borderRadius: 1,
          fontSize: '0.75rem',
        }}
      >
        <Typography variant="caption">Left click: Select</Typography>
        <br />
        <Typography variant="caption">Right drag: Rotate</Typography>
        <br />
        <Typography variant="caption">Middle drag: Pan</Typography>
        <br />
        <Typography variant="caption">Scroll: Zoom</Typography>
      </MuiBox>
    </MuiBox>
  );
};

export default ScenePanel;
