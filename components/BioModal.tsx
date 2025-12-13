import React, { useState, useMemo } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Dimensions,
  Platform,
} from 'react-native';
import YoutubePlayer from 'react-native-youtube-iframe';
import { WebView } from 'react-native-webview';

interface BioModalProps {
  visible: boolean;
  onClose: () => void;
}

const { width: screenWidth } = Dimensions.get('window');

// Extract YouTube video ID from URL
const getYouTubeId = (url: string): string => {
  // Try YouTube Shorts format first: youtube.com/shorts/VIDEO_ID
  let match = url.match(/youtube\.com\/shorts\/([^&\n?#]+)/);
  if (match) return match[1];
  
  // Try standard format: youtube.com/watch?v=VIDEO_ID or youtu.be/VIDEO_ID
  match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
  if (match) return match[1];
  
  return '';
};

const INTRO_VIDEO_URL = 'https://youtube.com/shorts/tooLhdpDlRU?si=2clKsq7rw2J5KWMZ';
const SECOND_VIDEO_URL = 'https://youtube.com/shorts/EieIOtxzgtg?si=y20mZyUqcG7JOXmU';

export function BioModal({ visible, onClose }: BioModalProps) {
  const [showSecondVideo, setShowSecondVideo] = useState(false);
  const [playingSecondVideo, setPlayingSecondVideo] = useState(false);

  const introVideoId = getYouTubeId(INTRO_VIDEO_URL);
  const secondVideoId = getYouTubeId(SECOND_VIDEO_URL);

  // Calculate video dimensions for Shorts (9:16 aspect ratio - vertical)
  const videoWidth = useMemo(() => {
    if (Platform.OS === 'web') {
      // On web, use a reasonable max width
      return Math.min(screenWidth - 40, 300);
    } else {
      // On mobile, make it wider to fill more of the screen for vertical videos
      // Use most of the screen width minus padding
      return screenWidth - 40;
    }
  }, [screenWidth]);

  const videoHeight = useMemo(() => {
    // Shorts are 9:16 (width:height), so height = width * (16/9)
    // This ensures the vertical video fills the width properly
    return Math.round((videoWidth * 16) / 9);
  }, [videoWidth]);

  const handleSecondVideoPress = () => {
    setShowSecondVideo(true);
    setPlayingSecondVideo(true);
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>About Saba</Text>
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          <Text style={styles.bioText}>
            Hello! I'm Saba, a lifelong lover of learning and travelling. Come with me as I travel to 12 countries spanning five continents in the past year and a half (and counting)! This website is my living travel journal - a space where personal storytelling meets cultural exploration. As a Black woman, student, and budget traveler, I created this platform to document my journeys across borders and dig deeper into how history, culture, and identity shift from place to place. Through videos, reflections, and interactive tools, I explore travel not just as movement, but as a way to understand people, power, and belonging. My goal is twofold: to practice cultural appreciation with curiosity and care, and to share everything I learn with others who want to see the world too - women, Black travelers, students, people traveling on a budget - anyone. If you've ever wanted to travel more intentionally, ask better questions, or feel less alone navigating unfamiliar places, this space is for you.
          </Text>

          {/* First Video - Intro */}
          <View style={styles.videoSection}>
            <Text style={styles.videoSectionTitle}>Intro Video</Text>
            <View style={[styles.videoContainer, { height: videoHeight }]}>
              {introVideoId ? (
                Platform.OS === 'web' ? (
                  <iframe
                    width={videoWidth}
                    height={videoHeight}
                    src={`https://www.youtube.com/embed/${introVideoId}?playsinline=1&modestbranding=1`}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{
                      border: 'none',
                      borderRadius: '8px',
                      width: '100%',
                      maxWidth: videoWidth,
                    }}
                  />
                ) : (
                  <View style={{ width: '100%', height: '100%', overflow: 'hidden', backgroundColor: '#000', borderRadius: 8 }}>
                    <WebView
                      source={{ uri: INTRO_VIDEO_URL }}
                      style={{ flex: 1, backgroundColor: '#000' }}
                      allowsFullscreenVideo={true}
                      mediaPlaybackRequiresUserAction={false}
                      javaScriptEnabled={true}
                      domStorageEnabled={true}
                    />
                  </View>
                )
              ) : (
                <View style={styles.placeholder}>
                  <Text style={styles.placeholderText}>Video not available</Text>
                </View>
              )}
            </View>
          </View>

          {/* Second Video - Optional */}
          {!showSecondVideo ? (
            <View style={styles.secondVideoSection}>
              <TouchableOpacity
                style={styles.playSecondVideoButton}
                onPress={handleSecondVideoPress}
                activeOpacity={0.8}
              >
                <Text style={styles.playSecondVideoButtonText}>
                  Watch More
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.videoSection}>
              <Text style={styles.videoSectionTitle}>More About My Journey</Text>
              <View style={[styles.videoContainer, { height: videoHeight }]}>
                {secondVideoId ? (
                  Platform.OS === 'web' ? (
                    <iframe
                      width={videoWidth}
                      height={videoHeight}
                      src={`https://www.youtube.com/embed/${secondVideoId}?autoplay=1&playsinline=1&modestbranding=1`}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{
                        border: 'none',
                        borderRadius: '8px',
                        width: '100%',
                        maxWidth: videoWidth,
                      }}
                    />
                  ) : (
                    <View style={{ width: '100%', height: '100%', overflow: 'hidden', backgroundColor: '#000', borderRadius: 8 }}>
                      <WebView
                        source={{ uri: SECOND_VIDEO_URL }}
                        style={{ flex: 1, backgroundColor: '#000' }}
                        allowsFullscreenVideo={true}
                        mediaPlaybackRequiresUserAction={false}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                      />
                    </View>
                  )
                ) : (
                  <View style={styles.placeholder}>
                    <Text style={styles.placeholderText}>Video not available</Text>
                  </View>
                )}
              </View>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212529',
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#6c757d',
    fontWeight: '300',
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  bioText: {
    fontSize: 16,
    lineHeight: 26,
    color: '#212529',
    textAlign: 'left',
    marginBottom: 24,
  },
  videoSection: {
    marginTop: 24,
    marginBottom: 16,
  },
  videoSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 12,
  },
  videoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#000',
    width: '100%',
  },
  placeholder: {
    width: '100%',
    height: 200,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  placeholderText: {
    color: 'white',
    fontSize: 14,
  },
  secondVideoSection: {
    marginTop: 24,
    marginBottom: 16,
    alignItems: 'center',
  },
  playSecondVideoButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  playSecondVideoButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
