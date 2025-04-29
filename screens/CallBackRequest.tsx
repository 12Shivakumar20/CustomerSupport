import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Platform, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import Icon from 'react-native-vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';

type CallbackRequestScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'CallbackRequest'
>;

const CallbackRequest = () => {
  const navigation = useNavigation<CallbackRequestScreenNavigationProp>();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [issue, setIssue] = useState('');
  const [preferredTime, setPreferredTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleSubmit = () => {
    if (!phoneNumber) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }
    
    // Here you would typically send the data to your backend
    Alert.alert(
      'Callback Requested',
      `We'll call you at ${phoneNumber} around ${preferredTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`,
      [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]
    );
  };

  const onTimeChange = (event: any, selectedTime?: Date) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setPreferredTime(selectedTime);
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Request a Callback</Text>
      <Text style={styles.subHeader}>Fill in the details below and we'll call you back</Text>
      
      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your phone number"
            placeholderTextColor="#94a3b8"
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Preferred Time</Text>
          <TouchableOpacity 
            style={styles.timePickerButton}
            onPress={() => setShowTimePicker(true)}
          >
            <Text style={styles.timePickerText}>
              {preferredTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </Text>
            <Icon name="time-outline" size={20} color="#64748b" />
          </TouchableOpacity>
          {showTimePicker && (
            <DateTimePicker
              value={preferredTime}
              mode="time"
              display="spinner"
              onChange={onTimeChange}
            />
          )}
        </View>
        
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Issue (Optional)</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            placeholder="Briefly describe your issue..."
            placeholderTextColor="#94a3b8"
            multiline
            numberOfLines={10}
            value={issue}
            onChangeText={setIssue}
          />
        </View>
        
        <TouchableOpacity 
          style={styles.submitButton}
          onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>Request Callback</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.noteContainer}>
        <Icon name="information-circle-outline" size={20} color="#3b82f6" />
        <Text style={styles.noteText}>
          Our customer support team is available from 8:00 AM to 8:00 PM, Monday to Friday.
        </Text>
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
  form: {
    gap: 20,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
      borderWidth: 0.5,
        borderColor: '#e2e8f0',
      },
    }),
  },
  multilineInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  timePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 14,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
      },
      android: {
        elevation: 2,
        borderWidth: 0.5,
        borderColor: '#e2e8f0',
      },
    }),
  },
  timePickerText: {
    fontSize: 16,
    color: '#1e293b',
  },
  submitButton: {
    backgroundColor: '#3b82f6',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  noteContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    marginTop: 32,
    padding: 12,
    backgroundColor: '#e0e7ff',
    borderRadius: 8,
  },
  noteText: {
    flex: 1,
    fontSize: 14,
    color: '#1e40af',
  },
});

export default CallbackRequest;