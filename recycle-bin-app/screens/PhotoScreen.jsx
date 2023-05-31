import { StatusBar } from 'expo-status-bar';
import { Camera, CameraType } from 'expo-camera';
import React ,{ useEffect, useState } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';

export function PhotoScreen({navigation}) {
    
  console.log("screen")
  
  const [type, setType] = useState(CameraType.back);
  const [hasPermission, setHasPermission] = Camera.useCameraPermissions();

  useEffect(() => {
    (async () => {
      const {status} = await Camera.requestMicrophonePermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, [])

  if (!hasPermission)
  {
    return <View/>;
  } 

  if (!hasPermission.granted)
  {
    return <Text>No access to camera</Text>
  } 

  function toggleCameraType() {
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  }

  return (
    <View style={styles.container}>
      <Camera style={styles.camera} type={type}>
        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={styles.button} onPress={toggleCameraType}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});




{/* <View style={styles.container}>
<Camera style={styles.camera} type={type}>
  <View style={styles.buttonContainer}>
    <TouchableOpacity 
      style={styles.button} 
      onPress={() => {
          setType(type === Camera.Constants.Type.back
              ? Camera.Constants.Type.front
              : Camera.Constants.Type.back
              );
      }}>
      <Text style={styles.text}>Flip Camera</Text>
    </TouchableOpacity>
  </View>
</Camera>
</View>
); */}