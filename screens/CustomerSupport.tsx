import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Platform, 
  Linking, 
  Alert 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import Icon from 'react-native-vector-icons/Ionicons';

type CustomerSupportScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'CustomerSupport'
>;

const CustomerSupport = () => {
  const navigation = useNavigation<CustomerSupportScreenNavigationProp>();

  const openWhatsApp = async (phoneNumber: string) => {
    const defaultMessage = 'Hello, I need help with...';
    const url = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(defaultMessage)}`;
    
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert(
          'WhatsApp not installed',
          'Would you like to install WhatsApp?',
          [
            { text: 'Cancel', style: 'cancel' },
            { 
              text: 'Install', 
              onPress: () => {
                const storeUrl = Platform.OS === 'ios'
                  ? 'https://apps.apple.com/app/whatsapp-messenger/id310633997'
                  : 'https://play.google.com/store/apps/details?id=com.whatsapp';
                Linking.openURL(storeUrl);
              }
            }
          ]
        );
      }
    } catch (error) {
      console.error('Error opening WhatsApp:', error);
      Alert.alert('Error', 'Failed to open WhatsApp');
    }
  };

  const supportOptions = [
    { 
      title: 'Chat Support', 
      subtext: 'Text via WhatsApp', 
      action: 'whatsapp',
      phoneNumber: '+91 9618800164', // Replace with your support number
      icon: 'chatbubble-ellipses-outline',
      iconColor: '#6366f1'
    },
    { 
      title: 'Request Callback', 
      subtext: 'Order callback', 
      screen: 'CallbackRequest',
      icon: 'call-outline',
      iconColor: '#10b981'
    },
    { 
      title: 'Contact Info', 
      subtext: 'E-mail, Phone, etc', 
      screen: 'ContactInfo',
      icon: 'information-circle-outline',
      iconColor: '#3b82f6'
    },
    { 
      title: 'Payment Help', 
      subtext: 'Create query', 
      screen: 'PaymentQueries',
      icon: 'card-outline',
      iconColor: '#f59e0b'
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>How can we help you?</Text>
      </View>
      
      <View style={styles.cardsContainer}>
        {supportOptions.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.card,
              Platform.OS === 'ios' ? styles.cardIOS : styles.cardAndroid
            ]}
            activeOpacity={0.8}
            onPress={() => {
              if (option.action === 'whatsapp') {
                openWhatsApp(option.phoneNumber);
              } else {
                navigation.navigate(option.screen as keyof RootStackParamList);
              }
            }}
          >
            <View style={styles.cardContent}>
              <View style={[styles.iconContainer, { backgroundColor: `${option.iconColor}20` }]}>
                <Icon 
                  name={option.icon} 
                  size={22} 
                  color={option.iconColor} 
                />
              </View>
              <View style={styles.textContainer}>
                <Text style={styles.cardTitle}>{option.title}</Text>
                <Text style={styles.cardSubtext}>{option.subtext}</Text>
              </View>
              <Icon 
                name="chevron-forward" 
                size={20} 
                color="#9ca3af" 
                style={styles.chevron} 
              />
            </View>
          </TouchableOpacity>
        ))}
      </View>
      
      <View style={styles.footer}>
        <Text style={styles.footerText}>Available 24/7 for your convenience</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8fafc',
  },
  headerContainer: {
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
  },
  cardsContainer: {
    gap: 14,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  cardIOS: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  cardAndroid: {
    elevation: 4,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  cardSubtext: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
  },
  chevron: {
    marginLeft: 8,
  },
  footer: {
    marginTop: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    color: '#94a3b8',
    fontStyle: 'italic',
  },
});

export default CustomerSupport;