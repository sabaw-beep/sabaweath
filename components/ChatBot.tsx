import React, { useState, useRef, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Keyboard,
} from 'react-native';
import { useKnowledgeBase } from '../hooks/useKnowledgeBase';
import { createContextString } from '../data/knowledgeBase';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

interface ChatBotProps {
  visible: boolean;
  onClose: () => void;
}

export function ChatBot({ visible, onClose }: ChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hi! I'm Saba AI. Ask me anything about my travels, experiences, or tips from the places I've visited!",
      sender: 'assistant',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollViewRef = useRef<ScrollView>(null);
  
  // Use knowledge base hook with optimistic updates
  const { searchEntries } = useKnowledgeBase();

  // OpenAI API Key from environment variable
  const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY || '';

  useEffect(() => {
    if (visible && messages.length === 1) {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }
  }, [visible, messages.length]);

  // Handle keyboard show/hide to scroll to bottom
  useEffect(() => {
    if (!visible) return;

    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      () => {
        setTimeout(() => {
          scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    );

    return () => {
      keyboardWillShow.remove();
    };
  }, [visible]);

  const sendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    // Scroll to bottom
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    try {
      // Call OpenAI API
      if (!OPENAI_API_KEY) {
        throw new Error('OpenAI API key not configured');
      }

      // Get relevant knowledge from your writings/experiences
      const relevantKnowledge = await searchEntries(userMessage.text, 3);
      const knowledgeContext = createContextString(relevantKnowledge);
      
      // Debug: Log when no knowledge is found to help verify the logic
      // console.log('Knowledge found:', relevantKnowledge.length, 'entries for query:', userMessage.text);

      // Build enhanced system prompt with your knowledge
      let systemPrompt = `You are Saba AI, a helpful travel companion who shares personal experiences and insights from travels around the world. 
You speak from Saba's first-person perspective, using "I" and "my" when sharing experiences.
You are friendly, enthusiastic, and authentic.`;

      // Add knowledge context if available
      if (knowledgeContext) {
        systemPrompt += `\n\nHere is some context from Saba's experiences:\n${knowledgeContext}\n\nWhen answering questions:
- Use ONLY the information provided in the context above
- Reference specific experiences and locations from the context
- Share personal tips and insights from the context
- Be conversational and genuine
- if there is minimal information in the context above, then reference general information about the place from the internet or other sources. State that you are doing referencing general infomation/reference where you got it from.
- Do NOT make up or invent experiences that are not in the context above`;
      } else {
        // CRITICAL: When no knowledge is found - be very explicit
        systemPrompt += `\n\n🚨 CRITICAL INSTRUCTIONS - READ CAREFULLY:

You do NOT have any personal experiences or knowledge about the topic the user is asking about.

STRICT RULES:
1. You MUST start your response by saying "I haven't been there yet" or "I don't have personal experience with that" or similar
2. You MUST NOT use phrases like "When I visited...", "I went to...", "I experienced...", "I saw..." or any first-person statements about being there
3. You MUST NOT make up any stories, experiences, or anecdotes about this place
4. You MUST NOT pretend to have visited or know about it from personal experience
5. You CAN provide general, factual travel advice (e.g., "It's known for...", "Many travelers recommend...") but make it clear it's NOT your personal experience
6. Stay friendly and conversational, but be honest about your limitations

Example of CORRECT response:
"I haven't been to India yet, but it's definitely on my travel list! From what I've heard, it's an incredible country with rich culture and diverse regions. I'd love to visit someday and share my experiences with you once I do."

Example of WRONG response (DO NOT DO THIS):
"When I visited India, I loved the food and the Taj Mahal was amazing..." ❌

Remember: No knowledge context was provided, which means Saba has NOT been to this place. Be honest.`;
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: 'gpt-3.5-turbo', // You can upgrade to gpt-4 later
          messages: [
            {
              role: 'system',
              content: systemPrompt,
            },
            ...messages.map((msg) => ({
              role: msg.sender === 'user' ? 'user' : 'assistant',
              content: msg.text,
            })),
            {
              role: 'user',
              content: userMessage.text,
            },
          ],
          temperature: 0.7,
          max_tokens: 500,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to get response');
      }

      const data = await response.json();
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.choices[0]?.message?.content || 'Sorry, I could not process that request.',
        sender: 'assistant',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error('Error calling OpenAI API:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text:
          'Sorry, I encountered an error. Please check your OpenAI API key configuration and try again.',
        sender: 'assistant',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={styles.keyboardView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>SA</Text>
              </View>
              <View style={styles.headerText}>
                <Text style={styles.title}>Saba AI</Text>
                <Text style={styles.subtitle}>Your travel companion</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Messages */}
          <ScrollView
            ref={scrollViewRef}
            style={styles.messagesContainer}
            contentContainerStyle={styles.messagesContent}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="interactive"
          >
            {messages.map((message) => (
              <View
                key={message.id}
                style={[
                  styles.messageBubble,
                  message.sender === 'user' ? styles.userMessage : styles.assistantMessage,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    message.sender === 'user' ? styles.userMessageText : styles.assistantMessageText,
                  ]}
                >
                  {message.text}
                </Text>
              </View>
            ))}
            {isLoading && (
              <View style={[styles.messageBubble, styles.assistantMessage]}>
                <ActivityIndicator size="small" color="#007bff" />
                <Text style={[styles.messageText, styles.assistantMessageText]}>Thinking...</Text>
              </View>
            )}
          </ScrollView>

          {/* Input */}
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Ask me anything about travel..."
              placeholderTextColor="#999"
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
              onSubmitEditing={sendMessage}
              returnKeyType="send"
              blurOnSubmit={false}
              onFocus={() => {
                setTimeout(() => {
                  scrollViewRef.current?.scrollToEnd({ animated: true });
                }, 100);
              }}
            />
            <TouchableOpacity
              style={[styles.sendButton, (!inputText.trim() || isLoading) && styles.sendButtonDisabled]}
              onPress={sendMessage}
              disabled={!inputText.trim() || isLoading}
            >
              <Text style={styles.sendButtonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  keyboardView: {
    flex: 1,
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
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  headerText: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212529',
  },
  subtitle: {
    fontSize: 14,
    color: '#6c757d',
    marginTop: 2,
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#6c757d',
    fontWeight: '300',
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  messagesContent: {
    paddingBottom: 20,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 12,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#007bff',
  },
  assistantMessage: {
    alignSelf: 'flex-start',
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: 'white',
  },
  assistantMessageText: {
    color: '#212529',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    alignItems: 'flex-end',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#dee2e6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 100,
    fontSize: 16,
    color: '#212529',
    marginRight: 8,
  },
  sendButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#dee2e6',
  },
  sendButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

