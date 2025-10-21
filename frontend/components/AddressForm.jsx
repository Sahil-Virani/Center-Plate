import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import globalStyles from '../styles/GlobalStyles';

const AddressForm = () => {
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [country, setCountry] = useState('');

  const handleSubmit = () => {
    // Handle form submission. For now, just display an alert with the data.
    Alert.alert(
      'Address Submitted',
      `Street: ${street}\nCity: ${city}\nState: ${state}\nZip: ${zip}\nCountry: ${country}`
    );
  };

  return (
    <ScrollView style={globalStyles.container}>
      <View style={globalStyles.contentContainer}>
        <Text style={globalStyles.h2}>Enter Your Address</Text>
        
        <View style={{ marginTop: 16 }}>
          <Text style={globalStyles.bodyText}>Street</Text>
      <TextInput
            style={globalStyles.input}
        placeholder="Enter street address"
        value={street}
        onChangeText={setStreet}
            placeholderTextColor={globalStyles.text.secondary}
      />
      
          <Text style={globalStyles.bodyText}>City</Text>
      <TextInput
            style={globalStyles.input}
        placeholder="Enter city"
        value={city}
        onChangeText={setCity}
            placeholderTextColor={globalStyles.text.secondary}
      />
      
          <Text style={globalStyles.bodyText}>State</Text>
      <TextInput
            style={globalStyles.input}
        placeholder="Enter state"
        value={state}
        onChangeText={setState}
            placeholderTextColor={globalStyles.text.secondary}
      />
      
          <Text style={globalStyles.bodyText}>Zip Code</Text>
      <TextInput
            style={globalStyles.input}
        placeholder="Enter zip code"
        value={zip}
        onChangeText={setZip}
        keyboardType="numeric"
            placeholderTextColor={globalStyles.text.secondary}
      />
      
          <Text style={globalStyles.bodyText}>Country</Text>
      <TextInput
            style={globalStyles.input}
        placeholder="Enter country"
        value={country}
        onChangeText={setCountry}
            placeholderTextColor={globalStyles.text.secondary}
      />
        </View>
      
        <TouchableOpacity style={globalStyles.button} onPress={handleSubmit}>
          <Text style={globalStyles.buttonText}>Submit</Text>
        </TouchableOpacity>
    </View>
    </ScrollView>
  );
};

export default AddressForm;
