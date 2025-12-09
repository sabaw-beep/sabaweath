import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Location, Video } from '../data/locations';

interface VideoListScreenProps {
  location: Location;
  onVideoSelect: (video: Video) => void;
  onBack: () => void;
}

// Helper function to extract YouTube video ID from URL
function getYouTubeVideoId(url: string): string | null {
  // Handle various YouTube URL formats
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/,
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  return null;
}

// Generate YouTube thumbnail URL
function getYouTubeThumbnailUrl(videoId: string): string {
  // Try maxresdefault first (highest quality), fallback to hqdefault
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
}

// Video Card Component with thumbnail support
function VideoCard({ video, onPress }: { video: Video; onPress: () => void }) {
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  
  const videoId = getYouTubeVideoId(video.youtubeUrl);
  const thumbnailUrl = videoId ? getYouTubeThumbnailUrl(videoId) : null;
  
  return (
    <TouchableOpacity
      style={styles.videoCard}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.videoThumbnail}>
        {thumbnailUrl && !imageError ? (
          <>
            <Image
              source={{ uri: thumbnailUrl }}
              style={styles.thumbnailImage}
              onLoadStart={() => setImageLoading(true)}
              onLoadEnd={() => setImageLoading(false)}
              onError={() => {
                setImageError(true);
                setImageLoading(false);
              }}
              resizeMode="cover"
            />
            {imageLoading && (
              <View style={styles.thumbnailLoader}>
                <ActivityIndicator size="small" color="#007bff" />
              </View>
            )}
            <View style={styles.playButtonOverlay}>
              <View style={styles.playButton}>
                <Text style={styles.playIcon}>▶</Text>
              </View>
            </View>
          </>
        ) : (
          <View style={styles.placeholderThumbnail}>
            <Text style={styles.placeholderPlayIcon}>▶</Text>
          </View>
        )}
      </View>
      <View style={styles.videoInfo}>
        <Text style={styles.videoTitle}>{video.title}</Text>
        <Text style={styles.videoSubtitle}>Click to play</Text>
      </View>
    </TouchableOpacity>
  );
}

export function VideoListScreen({ location, onVideoSelect, onBack }: VideoListScreenProps) {
  return (
    <LinearGradient
      colors={['#1e3c72', '#2a5298', '#7e8ba3', '#a8b5c0']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.gradientContainer}
    >
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={onBack}>
            <Text style={styles.backButtonText}>← Back to Globe</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{location.name}</Text>
        </View>
        
        <ScrollView style={styles.videoList} showsVerticalScrollIndicator={false}>
          <Text style={styles.subtitle}>Videos from {location.name}</Text>
          {location.videos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              onPress={() => onVideoSelect(video)}
            />
          ))}
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradientContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  backButton: {
    marginBottom: 10,
  },
  backButtonText: {
    fontSize: 16,
    color: '#E8F4FD',
    fontWeight: '500',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  videoList: {
    flex: 1,
    padding: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 20,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  videoCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  videoThumbnail: {
    width: 120,
    height: 90,
    borderRadius: 8,
    marginRight: 16,
    overflow: 'hidden',
    backgroundColor: '#e9ecef',
    position: 'relative',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  thumbnailLoader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  playButtonOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  playButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 123, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.8)',
  },
  placeholderThumbnail: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e9ecef',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 2, // Slight offset to center the play icon visually
  },
  placeholderPlayIcon: {
    fontSize: 24,
    color: '#007bff',
  },
  videoInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  videoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 4,
  },
  videoSubtitle: {
    fontSize: 14,
    color: '#6c757d',
  },
});
