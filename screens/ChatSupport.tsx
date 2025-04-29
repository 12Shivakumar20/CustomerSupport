import React, { useState, useEffect, useRef } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  KeyboardAvoidingView, 
  Platform,
  SafeAreaView,
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import Icon from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

type ChatSupportScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ChatSupport'
>;

type Message = {
  id: string;
  text: string;
  sender: 'user' | 'support';
  timestamp: Date;
  status?: 'sent' | 'delivered' | 'read';
};

const ChatSupport = () => {
  const navigation = useNavigation<ChatSupportScreenNavigationProp>();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSupportTyping, setIsSupportTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const flatListRef = useRef<FlatList>(null);

  const quickReplies = [
    "Where's my order?",
    "I need a refund",
    "Account issue",
    "Payment problem"
  ];

  // Load messages from storage on component mount
  useEffect(() => {
    const loadMessages = async () => {
      setIsLoading(true);
      try {
        const savedMessages = await AsyncStorage.getItem('chatMessages');
        if (savedMessages) {
          const parsedMessages = JSON.parse(savedMessages);
          const messagesWithDates = parsedMessages.map((msg: any) => ({
            ...msg,
            timestamp: new Date(msg.timestamp)
          }));
          setMessages(messagesWithDates);
        } else {
          // Initial welcome message
          const welcomeMessage: Message = {
            id: '1',
            text: 'Hello! How can we help you today?',
            sender: 'support',
            timestamp: new Date(),
            status: 'delivered'
          };
          setMessages([welcomeMessage]);
        }
      } catch (error) {
        console.error('Failed to load messages:', error);
        Alert.alert('Error', 'Failed to load chat history');
        // Fallback welcome message
        const welcomeMessage: Message = {
          id: '1',
          text: 'Hello! How can we help you today?',
          sender: 'support',
          timestamp: new Date(),
          status: 'delivered'
        };
        setMessages([welcomeMessage]);
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();

    // Simulate connection status
    const connectionInterval = setInterval(() => {
      setIsConnected(Math.random() > 0.1);
    }, 10000);

    return () => clearInterval(connectionInterval);
  }, []);

  // Save messages to storage
  useEffect(() => {
    const saveMessages = async () => {
      try {
        await AsyncStorage.setItem('chatMessages', JSON.stringify(messages));
      } catch (error) {
        console.error('Failed to save messages:', error);
      }
    };

    if (messages.length > 0 && !isLoading) {
      saveMessages();
    }
  }, [messages, isLoading]);

  const handleSend = () => {
    if (!message.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: 'user',
      timestamp: new Date(),
      status: 'sent'
    };
    
    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    
    setTimeout(() => {
      setMessages(prev => prev.map(msg => 
        msg.id === userMessage.id ? { ...msg, status: 'delivered' } : msg
      ));
    }, 500);

    setIsSupportTyping(true);
    setTimeout(() => {
      setIsSupportTyping(false);
      const supportMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: getRandomResponse(),
        sender: 'support',
        timestamp: new Date(),
        status: 'delivered'
      };
      setMessages(prev => [...prev, supportMessage]);
    }, 1000 + Math.random() * 2000);
  };

  const getRandomResponse = () => {
    const responses = [
      "I understand your concern. Let me check that for you.",
      "Thanks for reaching out. We'll look into this right away.",
      "I can help with that. Could you provide more details?",
      "That's a good question. Here's what I can tell you...",
      "We appreciate your patience. Our team is working on it.",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' });
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[
      styles.messageContainer,
      item.sender === 'user' ? styles.userMessage : styles.supportMessage
    ]}>
      <Text style={[
        styles.messageText,
        item.sender === 'user' && styles.userMessageText
      ]}>
        {item.text}
      </Text>
      <View style={styles.messageFooter}>
        <Text style={[
          styles.timestamp,
          item.sender === 'user' && styles.userTimestamp
        ]}>
          {formatTimestamp(item.timestamp)}
        </Text>
        {item.sender === 'user' && (
          <Icon 
            name={item.status === 'delivered' ? 'checkmark-done' : 'checkmark'} 
            size={14} 
            color={item.status === 'delivered' ? '#3b82f6' : '#9ca3af'} 
            style={styles.statusIcon} 
          />
        )}
      </View>
    </View>
  );

  const handleEndChat = () => {
    Alert.alert(
      'End Chat',
      'Are you sure you want to end this chat session?',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'End Chat',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('chatMessages');
            } catch (error) {
              console.error('Failed to clear chat history:', error);
            }
            navigation.goBack();
          }
        }
      ]
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Loading chat...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#3b82f6" />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>Chat Support</Text>
          <View style={[
            styles.connectionStatus, 
            { backgroundColor: isConnected ? '#10b981' : '#ef4444' }
          ]}>
            <Text style={styles.connectionStatusText}>
              {isConnected ? 'Online' : 'Offline'}
            </Text>
          </View>
        </View>
        <TouchableOpacity onPress={handleEndChat}>
          <Icon name="close" size={24} color="#ef4444" />
        </TouchableOpacity>
      </View>
      
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
        ListFooterComponent={
          isSupportTyping ? (
            <View style={styles.typingIndicator}>
              <Text style={styles.typingText}>Support is typing...</Text>
            </View>
          ) : null
        }
      />
      
      {!isSupportTyping && messages.length > 0 && (
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.quickReplies}
          contentContainerStyle={styles.quickRepliesContent}
        >
          {quickReplies.map((reply, index) => (
            <TouchableOpacity 
              key={index} 
              style={styles.quickReply} 
              onPress={() => setMessage(reply)}
            >
              <Text style={styles.quickReplyText}>{reply}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
        style={styles.inputContainer}
      >
        <TouchableOpacity style={styles.attachmentButton}>
          <Icon name="attach-outline" size={24} color="#3b82f6" />
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Type your message..."
          placeholderTextColor="#94a3b8"
          value={message}
          onChangeText={setMessage}
          multiline
        />
        <TouchableOpacity 
          style={[
            styles.sendButton,
            !message.trim() && styles.sendButtonDisabled
          ]}
          onPress={handleSend}
          disabled={!message.trim()}
        >
          <Icon 
            name="send" 
            size={20} 
            color={message.trim() ? '#3b82f6' : '#9ca3af'} 
          />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  loadingText: {
    marginTop: 16,
    color: '#64748b',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    backgroundColor: 'white',
  },
  headerCenter: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  connectionStatus: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  connectionStatusText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '500',
  },
  messagesList: {
    padding: 16,
    paddingBottom: 80,
  },
  messageContainer: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#3b82f6',
    borderBottomRightRadius: 0,
  },
  supportMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#f1f5f9',
    borderBottomLeftRadius: 0,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  messageText: {
    fontSize: 16,
    color: '#1e293b',
    marginBottom: 4,
  },
  userMessageText: {
    color: 'white',
  },
  messageFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  timestamp: {
    fontSize: 12,
    color: '#64748b',
  },
  userTimestamp: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  statusIcon: {
    marginLeft: 4,
  },
  typingIndicator: {
    alignSelf: 'flex-start',
    backgroundColor: '#f1f5f9',
    padding: 8,
    borderRadius: 12,
    marginTop: 8,
  },
  typingText: {
    fontSize: 14,
    color: '#64748b',
    fontStyle: 'italic',
  },
  quickReplies: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  quickRepliesContent: {
    gap: 8,
  },
  quickReply: {
    backgroundColor: '#e2e8f0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  quickReplyText: {
    color: '#334155',
    fontSize: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  attachmentButton: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    maxHeight: 120,
    marginRight: 8,
    fontSize: 16,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.6,
  },
});

export default ChatSupport;