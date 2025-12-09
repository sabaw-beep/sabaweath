import React, { useRef } from 'react';
import { Mesh } from 'three';
import { useFrame } from '@react-three/fiber';

interface LocationMarkerProps {
  position: [number, number, number];
  onClick: () => void;
  isHovered: boolean;
}

export function LocationMarker({ position, onClick, isHovered }: LocationMarkerProps) {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Gentle pulsing animation
      meshRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 2) * 0.1);
    }
  });

  return (
    <mesh
      ref={meshRef}
      position={position}
      onClick={onClick}
      onPointerOver={(e) => {
        e.stopPropagation();
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
      }}
    >
      <sphereGeometry args={[0.02, 16, 16]} />
      <meshStandardMaterial
        color={isHovered ? '#ff6b6b' : '#4ecdc4'}
        emissive={isHovered ? '#ff6b6b' : '#4ecdc4'}
        emissiveIntensity={0.3}
      />
    </mesh>
  );
}
