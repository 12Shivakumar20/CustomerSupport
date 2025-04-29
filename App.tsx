import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CustomerSupport from './screens/CustomerSupport';
import ChatSupport from './screens/ChatSupport';
import CallBackRequest from './screens/CallBackRequest';
import ContactInfo from './screens/ContactInfo';
import PaymentQueries from './screens/PaymentQueries';

export type RootStackParamList = {
  CustomerSupport: undefined;
  ChatSupport: undefined;
  CallbackRequest: undefined;
  ContactInfo: undefined;
  PaymentQueries: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="CustomerSupport">
        <Stack.Screen 
          name="CustomerSupport" 
          component={CustomerSupport} 
          options={{ title: 'Customer Support' }} 
        />
        <Stack.Screen 
          name="ChatSupport" 
          component={ChatSupport} 
          options={{ title: 'Chat Support' }} 
        />
        <Stack.Screen 
          name="CallbackRequest" 
          component={CallBackRequest} 
          options={{ title: 'Callback Request' }} 
        />
        <Stack.Screen 
          name="ContactInfo" 
          component={ContactInfo} 
          options={{ title: 'Contact Information' }} 
        />
        <Stack.Screen 
          name="PaymentQueries" 
          component={PaymentQueries} 
          options={{ title: 'Payment Queries' }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}