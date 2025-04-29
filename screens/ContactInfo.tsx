import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking, Platform, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import Icon from 'react-native-vector-icons/Ionicons';

type ContactInfoScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'ContactInfo'
>;

const ContactInfo = () => {
  const navigation = useNavigation<ContactInfoScreenNavigationProp>();

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

  const contactMethods = [
    {
      title: 'Email Us',
      value: 'support@pashuparivar.com',
      icon: 'mail-outline' as const,
      action: () => Linking.openURL('mailto:support@pashuparivar.com')
    },
    {
      title: 'Call Us',
      value: '+91 9618800164',
      icon: 'call-outline' as const,
      action: () => Linking.openURL('tel:+919618800164')
    },
    {
      title: 'Live Chat',
      value: 'Available 24/7',
      icon: 'chatbubble-ellipses-outline' as const,
      action: () => openWhatsApp('+919618800164')
    },
    {
      title: 'Visit Our Website',
      value: 'www.pashuparivar.com',
      icon: 'globe-outline' as const,
      action: () => Linking.openURL('https://pashuparivar.com')
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Contact Information</Text>
      <Text style={styles.subHeader}>Choose your preferred contact method</Text>
      
      <View style={styles.contactCards}>
        {contactMethods.map((method, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.contactCard,
              Platform.OS === 'ios' ? styles.contactCardIOS : styles.contactCardAndroid
            ]}
            onPress={method.action}
            activeOpacity={0.7}
          >
            <View style={styles.contactCardContent}>
              <Icon name={method.icon} size={24} color="#3b82f6" />
              <View style={styles.contactTextContainer}>
                <Text style={styles.contactTitle}>{method.title}</Text>
                <Text style={styles.contactValue}>{method.value}</Text>
              </View>
              <Icon name="chevron-forward" size={20} color="#9ca3af" />
            </View>
          </TouchableOpacity>
        ))}
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
  header: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 8,
  },
  subHeader: {
    fontSize: 16,
    color: '#64748b',
    marginBottom: 24,
  },
  contactCards: {
    gap: 16,
  },
  contactCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
  },
  contactCardIOS: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  contactCardAndroid: {
    elevation: 3,
    borderWidth: 0.5,
    borderColor: '#e2e8f0',
  },
  contactCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  contactTextContainer: {
    flex: 1,
  },
  contactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 4,
  },
  contactValue: {
    fontSize: 14,
    color: '#64748b',
  },
});
export default ContactInfo;