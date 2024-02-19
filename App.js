import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, Dimensions, ActivityIndicator } from 'react-native';

import * as Location from 'expo-location';
import { Feather } from '@expo/vector-icons';

const {width : SCREEN_WIDTH, height : SCREEN_HEIGHT} = Dimensions.get('window');

const API_KEY = process.env.EXPO_PUBLIC_API_URL; // 원래는 env파일에 넣어줘야함

const icons = {
  "Clear" : "sun",
  "Clouds" : "cloud",
  "Rain" : "cloud-drizzle"
}

export default function App() {

  const [city,setCity] = useState();
  const [days,setDays] = useState([]);
  const [ok,setOk] = useState(true);
  
  const getWeather = async()=>{
    const {granted} = await Location.requestForegroundPermissionsAsync();
    if(!granted){
      setOk(false);
    }
    const {coords : {latitude, longitude}} = await Location.getCurrentPositionAsync({accuracy : 5});
    const location = await Location.reverseGeocodeAsync({latitude,longitude},{useGoogleMaps : false}); // 위도와 경도를 통해 도시를 가져오는것 googlemap 은 사용하지 않음

    setCity(location[0].city);

    const respone = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${API_KEY}`); // open wheather api
    const json = await respone.json(); // 가져온걸 json형식으로 수정해줍니다.

    setDays(json.list); // 날씨 정보를 넣어줍니다.

  }

  useEffect(()=>{
    getWeather();
  },[]);

  return (
    <View style={styles.container}>
      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text>
      </View>
      <ScrollView 
        showsHorizontalScrollIndicator={false}
        pagingEnabled 
        horizontal 
        contentContainerStyle={styles.weather}>
        {
          days.length === 0 ? (
            <View style={styles.day}>
              <ActivityIndicator 
                color="white" 
                style={{marginTop: 10}} 
                size="large" 
              />
            </View>
          ) : (
            days.map((day,index) =>
            <View key={index} style={styles.day}>
              
              <View style={{
                  flexDirection:"row", 
                  alignItems : "center", 
                  width : "100%",
                  justifyContent : "space-between",
                }}>
                <Text style={styles.temp}>{parseFloat(day.main.temp).toFixed(1)}</Text>
                <Feather name={icons[day.weather[0].main]} size={68} color="white" />
              </View>

              <Text style={styles.description}>{day.weather[0].main}</Text>
              <Text style={styles.tinyText}>{day.weather[0].description}</Text>
            </View>
          )
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container : {
    flex : 1,
    backgroundColor  : "tomato"
  },
  city : {
    flex : 1.5,
    justifyContent : "center",
    alignItems : "center"
  },
  cityName : {
    fontSize : 50,
    fontWeight : 500,
    color : "white"
  },
  weather : {
    
  },
  day : {
    width : SCREEN_WIDTH,
    padding : 10,
  },
  temp : {
    marginTop : 50,
    fontSize : 100,
    color : "white"
  },
  description : {
    fontSize : 36,
    color : "white"
  },
  tinyText : {
    fontSize : 20,
    color : "white"
  }
});