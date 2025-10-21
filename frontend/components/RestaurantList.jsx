import React, { useState, useEffect } from "react";
import {View, Text, Image, TouchableOpacity} from "react-native";
import axios from "axios";
import { useRouter } from 'expo-router';
import { useAuth } from '../contexts/AuthContext';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL;


const NO_IMAGE = "https://static.tildacdn.com/tild6538-3239-4337-b435-393935363438/broken-image-example.png";

const RestaurantList = ({midpoint, sessionData, userData}) => {
  const [restaurants, setRestaurants] = useState({});
  const router = useRouter();
  const { user } = useAuth();


  // const convertPreferences(preferenceObj){
    
  // }

  const addSuggestion = async (rid, name, image, sessionData) =>{
    try {
      const response = await axios.post(`${BASE_URL}/sessions/${sessionData._id}/suggestions/${userData._id}`, 
        {
          rid: rid, 
          name: name, 
          image: image
        });
        console.log(response.data);
        router.push(`/groupVote?id=${sessionData._id}`)

    } catch (error) {
      console.log('Error adding suggestion: %s', error)
    }
  }

useEffect(() => {
    const generateRestaurants = async () => {
      const reqbody = {
        coordinates: [midpoint.latitude, midpoint.longitude],
        filters: [[sessionData.preferences.dietaryValue],[sessionData.preferences.cuisineValue], [sessionData.preferences.priceValue], [sessionData.preferences.includeParking ? "parking": ""],], // TODO: replace with actual filters
      };
      try {
        
        const response = await axios.post(`${BASE_URL}/midpoint/score-location`, reqbody);
        let restaurantObjs = response.data.bestRestaurants;
        let newRestaurants = {};
        restaurantObjs.forEach((r) => {
          newRestaurants[r.fsq_id] = r;
        });
        setRestaurants(newRestaurants);
      } catch (e) {
        console.error("Error scoring location: ", e);
      }
    };

    generateRestaurants();
  }, [midpoint]); 

  useEffect(() => {
    if (!Object.keys(restaurants).length) return; 

    const getRestaurantImages = async () => {
      try {
        const updatedRestaurants = { ...restaurants };
        const imageFetchPromises = Object.keys(updatedRestaurants).map(async (id) => {
          if (updatedRestaurants[id].imageUrl) return; 

          try {
            // TODO: consolidate all into one request instead of several (post with batch of ids?)
            const response = await axios.get(`${BASE_URL}/midpoint/place-image/${id}`);
            if (response.data.length > 0) {
              let imageData = response.data[0];
              updatedRestaurants[id].imageUrl = `${imageData.prefix}${imageData.width}x${imageData.height}${imageData.suffix}`;
            }
          } catch (e) {
            console.error(`Error getting image for ${updatedRestaurants[id].name}:`, e);
          }
        });

        await Promise.all(imageFetchPromises); 
        setRestaurants(updatedRestaurants); 
      } catch (e) {
        console.error("Error fetching restaurant images:", e);
      }
    };

    getRestaurantImages();
  }, [Object.keys(restaurants).length]);
  return (
    <View>
      <Text>Lat: {midpoint.latitude}</Text>
      <Text>Long: {midpoint.longitude}</Text>
      {Object.keys(restaurants).length > 0 &&
        Object.keys(restaurants).map((key) =>
          restaurants[key].imageUrl ? (
            <View key={key}>
              <Text>{restaurants[key].name}</Text>
              <TouchableOpacity onPress={()=>{addSuggestion(key, restaurants[key].name, restaurants[key].imageUrl, sessionData)}}>
              <Image source={{ uri: restaurants[key].imageUrl }} style={{ width: 100, height: 100 }} />
              </TouchableOpacity>
            </View>
          ) : (
            <View key={key}>
              <Text>{restaurants[key].name}</Text>
              <TouchableOpacity onPress={()=>{addSuggestion(key, restaurants[key].name, restaurants[key].imageUrl, sessionData)}}>
              <Image source={{ uri: NO_IMAGE }} style={{ width: 100, height: 100 }} />
              </TouchableOpacity>
            </View>
          )
        )}
    </View>
  );
};

export default RestaurantList;
