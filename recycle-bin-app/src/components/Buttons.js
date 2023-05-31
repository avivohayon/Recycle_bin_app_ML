import * as React from 'react';
import { Text, TouchableOpacity, StyleSheet, Modal } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { useState} from 'react';


export default function Button({title, onPress, icon, color, size, flag, data}) {
    const buttonStyle = title === 'btnStyle'? styles.btnStyle : styles.clearStyle
    const modalFlag = flag === 'modal' ? true : false
    const [isVisible, setIsVisible] = useState(false);

    const modalPress = () => {
        setModalVisibale(!modalVisibale);
    };

  

    return (
        <>
        {/* {(modalFlag == false &&( */}
        <TouchableOpacity 
        style={buttonStyle}
        onPress={onPress}>
            <Entypo name={icon} size={size? size:18} color={color ? color : '#f1f1f1'}/>
        </TouchableOpacity>
                 {/* )) */}
       
            {/* || */}
            {/* (modalFlag == true && ( */}
            {/* <Modal
            visible= {isVisible}
            transparent= {true}
            animationType={'fade'}
            onRequestClose={() => setIsVisible(false)}
            >
                <TouchableOpacity 
                onPress={() => setIsVisible(false)}
                style= {styles.modalBackground}
                >
                    <TouchableOpacity style = {styles.modalContent}>
                        <Entypo name = {icon} size={1} color='red'/>
                        <Text style={styles.modalText}>{data}</Text>

                    </TouchableOpacity>

                </TouchableOpacity>

            </Modal>
            ))} */}
         
        </>
 

    )
}

const styles = StyleSheet.create({

    btnStyle: {
    backgroundColor: '#000',
    opacity: 0.8,
    marginHorizontal: 30,
    padding: 20,
    borderRadius: 20,
    },
    clearStyle: {
        position: 'absolute',
        top: 180,
        right: 30,
        tintColor: '#FFF',
        zIndex: 10,
        opacity: 0.8
      },
    clearImage: {height: 100, width: 30, tintColor: '#FFF'},


    // modalBackground: {
    //     flex: 1,
    //     justifyContent: 'center',
    //     alignItems: 'center',
    //     backgroundColor: 'rgba(0, 0, 0, 0.5)',
    //   },
    //   modalContent: {
    //     backgroundColor: '#fff',
    //     padding: 20,
    //     borderRadius: 10,
    //     flexDirection: 'row',
    //     alignItems: 'center',
    //   },
    //   modalText: {
    //     marginLeft: 10,
    //     fontSize: 18,
    //     // backgroundColor: '#000',
    //     // opacity: 0.8,
    //     // marginHorizontal: 30,
    //     // padding: 20,
    //     // borderRadius: 20,
    //   },

}
)


// paddingHorizontal: 20,
    // button: {
    //     height:40,
    //     flexDirection: 'row',
    //     alignItems:'center',
    //     justifyContent: 'center',
    // },
    // text: {
    //     fontWeight:'bold',
    //     fontSize:16,
    //     color: '#f1f1f1',
    //     marginLeft:10
    // },
    // btn: {
    //     position: 'absolute',
    //     bottom: 40,
    //     justifyContent: 'space-between',
    //     flexDirection: 'row',
    //   },