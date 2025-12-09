import React, { useState, Suspense, useEffect, Component, ErrorInfo, ReactNode } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, Text, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { Canvas } from '@react-three/fiber';
import { Globe } from './components/Globe';
import { VideoListScreen } from './components/VideoListScreen';
import { VideoModal } from './components/VideoModal';
import { ChatBot } from './components/ChatBot';
import { Location, Video } from './data/locations';

type AppState = 'globe' | 'videoList';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, { hasError: boolean; error: Error | null }> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <View style={[styles.canvas, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }]}>
          <Text style={{ color: '#fff', fontSize: 18, marginBottom: 10 }}>Error loading globe</Text>
          <Text style={{ color: '#fff', fontSize: 14 }}>{this.state.error?.message || 'Unknown error'}</Text>
        </View>
      );
    }

    return this.props.children;
  }
}

export default function App() {
  const [currentState, setCurrentState] = useState<AppState>('globe');
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [isVideoModalVisible, setIsVideoModalVisible] = useState(false);
  const [isChatBotVisible, setIsChatBotVisible] = useState(false);

  const handleLocationClick = (location: Location) => {
    setSelectedLocation(location);
    setCurrentState('videoList');
  };

  const handleBackToGlobe = () => {
    setCurrentState('globe');
    setSelectedLocation(null);
  };

  const handleVideoSelect = (video: Video) => {
    setSelectedVideo(video);
    setIsVideoModalVisible(true);
  };

  const handleCloseVideo = () => {
    setIsVideoModalVisible(false);
    setSelectedVideo(null);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      
      {currentState === 'globe' && (
        <View style={styles.globeContainer}>
          <ErrorBoundary>
            <Suspense fallback={
              <View style={[styles.canvas, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' }]}>
                <ActivityIndicator size="large" color="#007bff" />
                <Text style={{ color: '#fff', marginTop: 10 }}>Loading globe...</Text>
              </View>
            }>
              <Canvas
                style={styles.canvas}
                camera={{ position: [0, 0, 2.5], fov: 60 }}
                gl={{ antialias: true, alpha: false }}
                dpr={[1, 2]}
                onCreated={(state) => {
                  console.log('Canvas created successfully');
                }}
                onError={(error) => {
                  console.error('Canvas error:', error);
                }}
              >
                <Globe onLocationClick={handleLocationClick} />
              </Canvas>
            </Suspense>
          </ErrorBoundary>
          
          {/* Title Overlay */}
          <View style={styles.titleOverlay}>
            <Text style={styles.title}>Saba Takes Flight</Text>
            <Text style={styles.subtitle}>
              Come take flight with me! Click on a pin on the globe to see my adventures and tips from that place.
            </Text>
          </View>

          {/* ChatBot Icon Button */}
          <TouchableOpacity
            style={styles.chatBotButton}
            onPress={() => setIsChatBotVisible(true)}
            activeOpacity={0.8}
          >
            <View style={styles.chatBotContainer}>
              <View style={styles.chatBotIcon}>
                <Image
                  source={require('./assets/cartoon_ai_image.png')}
                  style={styles.chatBotImage}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.chatBotLabel}>Saba AI</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
      
      {currentState === 'videoList' && selectedLocation && (
        <VideoListScreen
          location={selectedLocation}
          onVideoSelect={handleVideoSelect}
          onBack={handleBackToGlobe}
        />
      )}
      
      <VideoModal
        visible={isVideoModalVisible}
        video={selectedVideo}
        onClose={handleCloseVideo}
      />

      <ChatBot
        visible={isChatBotVisible}
        onClose={() => setIsChatBotVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  globeContainer: {
    flex: 1,
    position: 'relative',
  },
  canvas: {
    flex: 1,
  },
  titleOverlay: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    zIndex: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 36,
    fontWeight: '800',
    color: '#E8F4FD',
    textAlign: 'center',
    marginBottom: 16,
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 1.2,
    fontStyle: 'italic',
  },
  subtitle: {
    fontSize: 17,
    color: '#F0F8FF',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.9)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 0.5,
    fontWeight: '500',
  },
  chatBotButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    zIndex: 20,
  },
  chatBotContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 123, 255, 0.9)',
    borderRadius: 35,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  chatBotIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    overflow: 'hidden',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  chatBotImage: {
    width: '145%',
    height: '145%',
  },
  chatBotLabel: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
});
