import React from 'react';
import { View } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import globalStyles from '../styles/GlobalStyles';

export default function AddressSearchBar(){
  return (
    <View style={globalStyles.container}>
      <GooglePlacesAutocomplete
        placeholder="Search for an address"
        onPress={(data, details = null) => {
          // 'data' is the information about the selected location.
          // 'details' is provided when fetchDetails = true.
          console.log('Selected address:', data);
          console.log('Location details:', details);
        }}
        query={{
          key: 'YOUR_GOOGLE_API_KEY', // Replace with your Google API Key
          language: 'en',
        }}
        fetchDetails={true}
        styles={{
          container: {
            flex: 1,
            backgroundColor: 'transparent',
          },
          textInputContainer: {
            backgroundColor: 'transparent',
            borderBottomWidth: 0,
          },
          textInput: {
            ...globalStyles.input,
            backgroundColor: 'transparent',
          },
          listView: {
            backgroundColor: 'white',
            borderRadius: 8,
            marginTop: 8,
          },
          row: {
            backgroundColor: 'white',
            padding: 13,
            height: 44,
            flexDirection: 'row',
            alignItems: 'center',
          },
          description: {
            color: '#000',
          },
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  inputContainer: {
    backgroundColor: 'white',
    borderRadius: 5,
    marginBottom: 10,
  },
  input: {
    height: 44,
    color: '#5d5d5d',
    fontSize: 16,
  },
});
