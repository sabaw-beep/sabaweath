import React, { useMemo } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Platform,
} from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import { Video } from '../data/locations';

interface VideoModalProps {
  visible: boolean;
  video: Video | null;
  onClose: () => void;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export function VideoModal({ visible, video, onClose }: VideoModalProps) {
  if (!video) return null;

  // Extract YouTube video ID from URL
  // Handles multiple formats:
  // - youtube.com/watch?v=VIDEO_ID
  // - youtu.be/VIDEO_ID
  // - youtube.com/shorts/VIDEO_ID
  // - URLs with query parameters
  const getYouTubeId = (url: string): string => {
    // Try YouTube Shorts format first: youtube.com/shorts/VIDEO_ID
    let match = url.match(/youtube\.com\/shorts\/([^&\n?#]+)/);
    if (match) return match[1];
    
    // Try standard format: youtube.com/watch?v=VIDEO_ID or youtu.be/VIDEO_ID
    match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    if (match) return match[1];
    
    // If no match, return empty string
    return '';
  };

  const videoId = getYouTubeId(video.youtubeUrl);
  
  // Calculate dimensions - different approach for web vs mobile
  const { playerWidth, playerHeight } = useMemo(() => {
    if (Platform.OS === 'web') {
      // For web, calculate based on video type for optimal sizing
      const isShort = video.youtubeUrl.includes('/shorts/');
      const headerHeight = 60;
      const availableHeight = screenHeight - headerHeight;
      const availableWidth = screenWidth;
      
      let width: number;
      let height: number;
      
      if (isShort) {
        const shortAspectRatio = 9 / 16;
        height = availableHeight;
        width = height * shortAspectRatio;
        if (width > availableWidth) {
          width = availableWidth;
          height = width / shortAspectRatio;
        }
      } else {
        const horizontalAspectRatio = 16 / 9;
        width = availableWidth;
        height = width / horizontalAspectRatio;
        if (height > availableHeight) {
          height = availableHeight;
          width = height * horizontalAspectRatio;
        }
      }
      
      return {
        playerWidth: Math.round(width),
        playerHeight: Math.round(height),
      };
    } else {
      // For mobile, use original simple approach
      return {
        playerWidth: screenWidth,
        playerHeight: screenHeight * 0.4,
      };
    }
  }, [video.youtubeUrl, screenWidth, screenHeight]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.title} numberOfLines={2}>
            {video.title}
          </Text>
        </View>
        
        <View style={styles.videoContainer}>
          {videoId ? (
            Platform.OS === 'web' ? (
              // For web, use iframe directly for better control
              <iframe
                width={playerWidth}
                height={playerHeight}
                src={`https://www.youtube.com/embed/${videoId}?autoplay=1&playsinline=1`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
                  border: 'none',
                  borderRadius: '8px',
                }}
              />
            ) : (
              <YoutubePlayer
                height={playerHeight}
                width={playerWidth}
                videoId={videoId}
                play={true}
                onChangeState={(_state: string) => {
                  // Handle player state changes if needed
                }}
              />
            )
          ) : (
            <View style={styles.placeholder}>
              <Text style={styles.placeholderText}>
                Video not available
              </Text>
            </View>
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#1a1a1a',
    minHeight: 60,
  },
  closeButton: {
    marginRight: 16,
    padding: 8,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  title: {
    flex: 1,
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  videoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  playerWrapper: {
    overflow: 'hidden',
    borderRadius: 8,
    backgroundColor: '#000',
    position: 'relative',
  },
  placeholder: {
    height: screenHeight * 0.4,
    width: screenWidth * 0.9,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  placeholderText: {
    color: 'white',
    fontSize: 16,
  },
});
