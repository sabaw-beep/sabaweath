import React, { useState, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere, useTexture } from '@react-three/drei';
import { Asset } from 'expo-asset';
import { Platform } from 'react-native';
import { LocationMarker } from './LocationMarker';
import { locations, Location } from '../data/locations';

interface GlobeProps {
  onLocationClick: (location: Location) => void;
}

// Convert lat/long to 3D coordinates on sphere
function latLongToVector3(lat: number, lng: number, radius: number = 1): [number, number, number] {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);

  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return [x, y, z];
}

function Earth() {
  // Use async loading with expo-asset for both web and native
  return <EarthWithAsyncLoading />;
}

function EarthWithAsyncLoading() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  
  useEffect(() => {
    const loadAsset = async () => {
      try {
        const earthTexture = require('../assets/earth_texture.jpg');
        if (Asset) {
          const asset = Asset.fromModule(earthTexture);
          await asset.downloadAsync();
          // On web, use uri; on native, prefer localUri
          const uri = Platform.OS === 'web' ? asset.uri : (asset.localUri || asset.uri);
          setImageUri(uri);
        }
      } catch (error) {
        console.warn('Could not load earth texture, using fallback:', error);
      }
    };
    
    loadAsset();
  }, []);
  
  if (imageUri) {
    return <EarthWithTexture uri={imageUri} />;
  }
  
  // Fallback: simple blue sphere
  return (
    <Sphere args={[1, 32, 32]}>
      <meshStandardMaterial 
        color="#4a90e2"
        roughness={0.8}
        metalness={0.2}
      />
    </Sphere>
  );
}

function EarthWithTexture({ uri }: { uri: string }) {
  // useTexture will suspend until loaded (handled by Suspense in App.tsx)
  const earthTexture = useTexture(uri) as any;
  
  return (
    <Sphere args={[1, 32, 32]}>
      <meshStandardMaterial 
        map={earthTexture}
        roughness={0.8}
        metalness={0.2}
      />
    </Sphere>
  );
}

export function Globe({ onLocationClick }: GlobeProps) {
  const [hoveredMarker, setHoveredMarker] = useState<string | null>(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const controlsRef = useRef<any>(null);

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      
      {/* Earth */}
      <Earth />
      
      {/* Location Markers */}
      {locations.map((location) => {
        const position = latLongToVector3(location.latitude, location.longitude);
        return (
          <LocationMarker
            key={location.id}
            position={position}
            onClick={() => onLocationClick(location)}
            isHovered={hoveredMarker === location.id}
          />
        );
      })}
      
      {/* Controls */}
      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        enableZoom={true}
        enableRotate={true}
        minDistance={1.0}
        maxDistance={6}
        autoRotate={autoRotate}
        autoRotateSpeed={0.5}
        zoomSpeed={2.0}
        rotateSpeed={0.5}
        enableDamping={false}
        onStart={() => setAutoRotate(false)}
        onEnd={() => {
          // Resume autoRotate after a delay
          setTimeout(() => setAutoRotate(true), 2000);
        }}
      />
    </>
  );
}
