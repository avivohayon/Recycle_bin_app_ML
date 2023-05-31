import { StyleSheet, Text, View , Image, ImageBackground, Dimensions, useColorScheme, TouchableOpacity, Modal} from 'react-native';
import { Camera, CameraType } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { useState, useEffect, useRef } from 'react';
import Button from './src/components/Buttons';
import {launchCameraAsync, launchImageLibraryAsync, MediaTypeOptions } from 'expo-image-picker';
import {API_KEY} from '@env'


import axios from 'axios';
import * as Premissions from 'expo-permissions'
import {Colors} from 'react-native/Libraries/NewAppScreen'
import { StatusBar } from 'expo-status-bar';
import {useFonts}from 'expo-font';




//init  global data before rendering the app
axios.interceptors.request.use(
  async config => {
    let request = config;
    request.headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
    request.url = configureUrl(config.url);
    return request;
  },
  error => error,
);

export const configureUrl = url => {
  let authUrl = url;
  if (url && url[url.length - 1] === '/'){
    authUrl = url.substring(0, url.length - 1);
  }
  return authUrl;
};

export const fonts = {
  Bold: {fontFamily: 'Roboto-Bold'},
};

const options = {
  mediaType: 'photo',
  quality: 1,
  width: 256,
  height: 256,
  includeBase64: true,
};


export const {height, width} = Dimensions.get('window');


export default function App() {
  //app design use states
  const [cameraPremission, setCameraPremission] = useState(null);
  const [image, setImage] = useState(null);
  const [modalVisibale, setModalVisibale] = useState(false);
  const cameraRef = useRef(null);
  // prediction use states
  const [result, setResult] = useState({confidence:'', trash_data: ''});
  const [label, setLabel] = useState('');
  const background = require('./src/images/solar_power.jpg')

  const isDarkMode = useColorScheme() == 'dark';
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  let [fontsLoaded] = useFonts({
    'Roboto-Bold': require("./src/assets/fonts/Roboto/Roboto-Bold.ttf")
  })
  // get access to the camera and the image libabry
  useEffect(() => {
    (async () => {
      MediaLibrary.requestPermissionsAsync();
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setCameraPremission(cameraStatus.status === 'granted');
    })();
  }, [])



  if(!cameraPremission){
    return <Text>No access to camera</Text>
  } else if (cameraPremission === undefined){
    return <Text>Requesting premissions...</Text>
  } 

  // check if font is loaded
  if(!fontsLoaded){
    return null

  }

  const toggleModal = () => {
    // setModalVisibale(!modalVisibale);
    return(
      <View>
        <Modal
        visible={modalVisibale}
        onRequestClose={() => setModalVisibale(false)}
        >
          <View>
            <Text>lalala</Text>
          </View>
        </Modal>
      </View>

    )
  }

  const modalHandler = () => {
    setModalVisibale(true);

  }
  const clearOutput = () => {
    setLabel("")
    setResult({confidence: "" , trash_data: ""});
    setImage('');
    console.log("clearrrrrrrrr")
  }
  const makeHeader = path => {
    const formData = new FormData();

    const localUri = path;
    const filename = localUri.split('/').pop();
    console.log("image/" + filename.split('.').pop())
    formData.append('file', {
      uri: localUri,
      name: filename,
      type: "image/" + filename.substring(filename.lastIndexOf("."))
    })
    console.log("make header: ", JSON.stringify(formData))
    return formData
  }
  // calculate the prediction results
  const getResult = async path => {
    console.log("start get result")
    setImage(path);
    setLabel('Predicting...');
    setResult({});
    console.log('1')
    const imageUplade = makeHeader(path);
    console.log('2')

    const result = await getPrediction(imageUplade)
    .catch(error => {
      console.error('Error in getPrediction:', error);
      setLabel('Faild to predict');
    })
    console.log('result is: ', result['predicted class'])
    if(result['predicted class']){
      // console.log("inside the result?.data?.class we got: \n")
      const predicted_class = result['predicted class']
      const res_confidence = result.confidence
      const res_trash_data = result.trash_data
      setLabel(predicted_class);
      setResult({confidence: result.confidence , trash_data: result.trash_data});
    } else {
      setLabel('Faild to predict');
    }
  };

  const getPrediction = async imageUplade => {
    const apiUrl = API_KEY;
    console.log('3')

    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        body: imageUplade,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      let responseJson = await response.json();
      console.log(responseJson, "responseJson")
      return responseJson
    } catch(error) {
      console.error(error);
      setLabel('Failed to predicting.')
    }
  }

  const manageCamera = async type => {
    try {
      if(!cameraPremission){
        return [];
      }
       else {
        if(type === 'Camera') {
          console.log("open camera")
          openCamera();
        } else {
          openLibrary();
        }
      }
    } catch (err) {
      console.log('manage camera error: ', err);
    }
  };


  const getFileNameFromUri = (uri) => {
    const fileName = uri.substring(uri.lastIndexOf('/') + 1);
    return fileName;
  }
  

  const openLibrary = async () => {
    const response = await launchImageLibraryAsync(options);
    if(response.canceled){
      console.log('User cancelled image picker');
    } else if (response.error) {
      console.log('ImagePicker Error: ', response.error);
    } else if (response.customButton) {
      console.log('User tapped custom button: ', response.customButton);
    } else {
      const uri = response.assets[0].uri;
      getResult(uri)
    };
  };


 

  const openCamera = async () => {
    try {
      let response = await launchCameraAsync(options);


      if(response.canceled){
        console.log('User cancelled image picker');
        console.log('1');
  
      }else if (response.error){
        console.log('ImagePicker Error: ', response.error);
        console.log('2');
  
      } else if (response.customButton){
        console.log('User tapped custon button: ', response.customButton);
        console.log('3');
  
      } else {
        const uri = response.assets[0].uri;
        getResult(uri);
      };
    }catch(e){console.log("camera try catcg", e)}
 

    
  };
   

  // taking a picture
  const takePicutre = async () => {
    if(cameraRef.current)
    {
      try{
        let data = await cameraRef.current.takePictureAsync();
        console.log(data);
        setImage(data.uri);
        getResult(data.uri)
    } catch(e){console.log(e);}

  }
  }
  // saving the picture
  const saveImage = async () => {
    if(image)
    {
      try{
       await MediaLibrary.createAssetAsync(image);
       alert('Picture Save!')
       setImage(null);
      }catch(e){console.log(e);}
    }
  }

  const displayTrashData = () => {

  }

  return ( 
    <View style = {[backgroundStyle, styles.outer]}>
      {/* {fontLoaded ? (
        <> */}
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'}/>
        <ImageBackground 
          blurRadius={10}
          source={background}
          style = {{height: height, width: width}}
          />
        <Text style={styles.title}>{'    Recycle-Bin \n Classification app'}</Text>
          <Button
            title={"clean"}
            icon={'trash'}
            size = {30}
            onPress={clearOutput}
            />
    
        {(image?.length && (
          <Image source={{uri: image}} style={styles.imageStyle}/>
        )) ||
        null}
        {(result && label && (
          <View style={styles.mainOuter}>
            <Text style={[styles.space, styles.labelText]}>
              {'Label: \n'}
            <Text style={styles.resultText}>{label}</Text>
          </Text>
          <Text style={[styles.space, styles.labelText]}>
            {'Confidence: \n'}
            <Text style={styles.resultText}>
              {parseFloat(result.confidence).toFixed(2) + '%'}
            </Text>
          </Text>
          <Text style={[styles.space, styles.labelText]}>
            <View>
            <Modal
              visible={modalVisibale}
              transparent={true}
              onRequestClose={() => setModalVisibale(false)}
              >
                <View style={styles.centerView}>
                   <View style = {styles.modalWindow}>
                    <View style={styles.modelTitle}> 
                    <Text style={styles.centerView}>Trash Bin Information:</Text>
                    </View>
                    <Text style={styles.text}>{result.trash_data}</Text>
                </View>
                </View>
               
            </Modal>
            </View>
            {'Trash Info: \n'}
           
            <Button
              title={'trash data'}
              icon={'cycle'}
              data={result.trash_data}
              onPress={modalHandler}

            />
            
            {/* <Text style={styles.resultText}>
            {alert(result.trash_data)}
            </Text> */}
          </Text>
        </View>
        )) ||
        (image && <Text style={styles.emptyText}></Text>) || (
          <Text style={styles.emptyText}>
            Use below buttons to select a pucture of a recycle bin
          </Text>
        

        )}
        <View style={styles.btn}>
            <Button 
            title = {"btnStyle"}
            icon={'camera'} 
            onPress={() => manageCamera('Camera')} />
            <Button 
            title = {"btnStyle"}
            icon={'upload'}
            onPress={() => manageCamera('Library')} />
        </View>
        {/* </>
      ) : null} */}
      </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    paddingBottom: 40
  },
  outer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  camera: {
    flex:1,
    borderRadius:20,
  },
  library: {
    flex: 1,
    borderRadius: 20,
  },
  viewButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 30,
    
  },
  botButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 50
  },

  clearStyle: {
    position: 'absolute',
    top: 100,
    right: 30,
    tintColor: '#FFF',
    zIndex: 10,
  },
  imageStyle: {
    marginBottom: 50,
    width: width / 1.5,
    height: width / 1.5,
    borderRadius: 20,
    position: 'absolute',
    borderWidth: 0.3,
    borderColor: '#FFF',
    top: height / 4.5,
  },
  outer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
    titleContainer: {
    alignSelf: 'center',
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    alignSelf: 'center',
    position: 'absolute',
    top: 10,
    fontSize: 30,
    // ...fonts.Bold,
    fontFamily: 'Roboto',
    color: '#FFF',
    paddingTop: 20, // add padding to the top

  },
  clearImage: {height: 40, width: 40, tintColor: '#FFF'},
  btn: {
    position: 'absolute',
    bottom: 40,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  btnStyle: {
    backgroundColor: '#FFF',
    opacity: 0.8,
    marginHorizontal: 30,
    padding: 20,
    borderRadius: 20,
  },
  imageIcon: {height: 40, width: 40, tintColor: '#000'},
  mainOuter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'absolute',
    top: height / 1.6,
    alignSelf: 'center',
  },
  space: {
    marginVertical: 10,
     marginHorizontal: 10
    },
  labelText: {
    color: '#FFF', 
    fontSize: 10,
    fontFamily:'Roboto'
  },

  resultText: {
    fontSize: 14, 
    fontFamily:'Roboto'
  },
  emptyText: {
    position: 'absolute',
    top: height / 1.6,
    alignSelf: 'center',
    color: '#FFF',
    fontSize: 20,
    maxWidth: '70%',
    fontFamily: 'Roboto-Bold',
  },
  labelConfidenceContainer: {
    flexDirection: 'row', // Align label and confidence texts horizontally
    alignItems: 'center', // Align items vertically at the center
  },
  confidenceText: {
    marginLeft: 10, // Add a margin to the left of confidence text
    color: 'gray',
    fontSize: 16,
  },
  trashText: {

  },

  modalWindow: {
    width:300,
    height:300,
    backgroundColor: '#ffffff',
    borderWidth:1,
    borderColor: '#000',
    borderRadius:20,
  },
  modelTitle: {
    height:50,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor: 'green',
    borderTopRightRadius:20,
    borderTopLeftRadius: 20,
  },
  centerView: {
    paddingTop:10,
    flex:1,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor: '#00000001',

  },
  modalBody: {
    height:200,
    justifyContent:'center',
    alignItems:'center',
  },
  text: {
    color:'#000000',
    fontSize: 15,
    margin:10,
    textAlign: 'center'
  },

});


