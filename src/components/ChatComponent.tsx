import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Message } from '../types';
import { FirebaseService } from '../services/firebaseService';
import { useAuth } from '../context/AuthContext';
import { useAccessibility } from '../context/AccessibilityContext';

interface Props {
  rideId: string;
  isVisible: boolean;
  onClose: () => void;
}

export default function ChatComponent({ rideId, isVisible, onClose }: Props) {
  const { user } = useAuth();
  const { getFontSize, getColor } = useAccessibility();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (isVisible) {
      const unsubscribe = FirebaseService.listenToMessages(rideId, (msgs) => {
        setMessages(msgs);
        // Scroll to bottom
        setTimeout(() => flatListRef.current?.scrollToEnd(), 100);
      });
      return unsubscribe;
    }
  }, [rideId, isVisible]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !user) return;

    try {
      await FirebaseService.sendMessage(rideId, {
        rideId,
        senderId: user.id,
        senderName: user.name,
        content: newMessage.trim(),
        type: 'text',
      });
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isOwnMessage = item.senderId === user?.id;
    return (
      <View style={[styles.messageContainer, isOwnMessage ? styles.ownMessage : styles.otherMessage]}>
        {!isOwnMessage && (
          <Text style={[styles.senderName, { fontSize: getFontSize(12) }]}>{item.senderName}</Text>
        )}
        <Text style={[styles.messageText, { fontSize: getFontSize(14), color: getColor('#1F2937', '#000') }]}>
          {item.content}
        </Text>
        <Text style={[styles.timestamp, { fontSize: getFontSize(10) }]}>
          {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
    );
  };

  if (!isVisible) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { fontSize: getFontSize(16) }]}>Chat</Text>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="close" size={24} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContainer}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, { fontSize: getFontSize(14) }]}
          placeholder="Type a message..."
          value={newMessage}
          onChangeText={setNewMessage}
          multiline
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Ionicons name="send" size={20} color="#FFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 400,
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontWeight: '700',
    color: '#1F2937',
  },
  messagesList: {
    flex: 1,
  },
  messagesContainer: {
    padding: 16,
  },
  messageContainer: {
    marginBottom: 12,
    maxWidth: '80%',
  },
  ownMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#4F46E5',
    borderRadius: 16,
    padding: 12,
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#F3F4F6',
    borderRadius: 16,
    padding: 12,
  },
  senderName: {
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
  },
  messageText: {
    color: '#FFF',
  },
  timestamp: {
    color: '#9CA3AF',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    maxHeight: 80,
  },
  sendButton: {
    width: 40,
    height: 40,
    backgroundColor: '#4F46E5',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});