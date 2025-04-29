import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Platform,
  Alert 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import Icon from 'react-native-vector-icons/Ionicons';

type PaymentQueriesScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'PaymentQueries'
>;

const paymentIssues = [
  'Payment failed but amount deducted',
  'Refund not processed',
  'Payment method not working',
  'Duplicate payment',
  'Subscription cancellation',
  'Other payment issue'
];

const PaymentQueries = () => {
  const navigation = useNavigation<PaymentQueriesScreenNavigationProp>();
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);
  const [otherIssue, setOtherIssue] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    if (!selectedIssue) {
      Alert.alert('Error', 'Please select an issue type');
      return;
    }
    
    if (selectedIssue === 'Other payment issue' && !otherIssue.trim()) {
      Alert.alert('Error', 'Please describe your payment issue');
      return;
    }
    
    if (!description.trim()) {
      Alert.alert('Error', 'Please provide more details about your issue');
      return;
    }
    
    // Here you would typically send the data to your backend
    Alert.alert(
      'Query Submitted',
      'Your payment query has been submitted. We will get back to you within 24 hours.',
      [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]
    );
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.header}>Payment Help</Text>
      <Text style={styles.subHeader}>Select your payment issue and provide details</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Issue Type</Text>
        <View style={styles.issuesContainer}>
          {paymentIssues.map((issue, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.issueButton,
                selectedIssue === issue && styles.selectedIssueButton
              ]}
              onPress={() => setSelectedIssue(issue)}
            >
              <Text style={[
                styles.issueText,
                selectedIssue === issue && styles.selectedIssueText
              ]}>
                {issue}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      
      {selectedIssue === 'Other payment issue' && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Describe Your Issue</Text>
          <TextInput
            style={styles.input}
            value={otherIssue}
            onChangeText={setOtherIssue}
          />
        </View>
      )}
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Transaction ID (Optional)</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter transaction ID"
          placeholderTextColor="#94a3b8"
          value={transactionId}
          onChangeText={setTransactionId}
        />
      </View>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Additional Details</Text>
        <TextInput
          style={[styles.input, styles.multilineInput]}
          placeholder="Provide more details about your issue"
          placeholderTextColor="#94a3b8"
          multiline
          numberOfLines={5}
          value={description}
          onChangeText={setDescription}
        />
      </View>
      
      <TouchableOpacity 
        style={styles.submitButton}
        onPress={handleSubmit}
      >
        <Text style={styles.submitButtonText}>Submit Query</Text>
      </TouchableOpacity>
      
      <View style={styles.noteContainer}>
        <Icon name="time-outline" size={18} color="#64748b" />
        <Text style={styles.noteText}>
          Our payment support team typically responds within 24 hours.
        </Text>
      </View>
    </ScrollView>
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
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  issuesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  issueButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#e2e8f0',
  },
  selectedIssueButton: {
    backgroundColor: '#3b82f6',
  },
  issueText: {
    fontSize: 14,
    color: '#64748b',
  },
  selectedIssueText: {
    color: 'white',
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
    height: 120,
    textAlignVertical: 'top',
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
    alignItems: 'center',
    gap: 8,
    marginTop: 24,
    padding: 12,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
  },
  noteText: {
    flex: 1,
    fontSize: 14,
    color: '#64748b',
  },
});

export default PaymentQueries;