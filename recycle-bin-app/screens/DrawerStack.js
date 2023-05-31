import React from "react";
import {Button, Modal, SafeAreaView, StyleSheet,Text, View,} from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { StatusBar } from "expo-status-bar";


function MyModal({ isVisible, onClick }) {
  return (
    <Modal
      visible={isVisible}
      animationType="slide"
      presentationStyle="overFullScreen"
      transparent={false}
    >
      <SafeAreaView style={styles["modal-container"]}>
        <Text style={{ paddingTop: 20, fontSize: 22 }}>IN MODAL</Text>
        <Button onPress={onClick} title="CLOSE"></Button>
      </SafeAreaView>
    </Modal>
  );
}

function HomeScreen({ navigation }) {
  const [showModal, setShowModal] = React.useState(false);

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button title="ADD" onPress={() => setShowModal(true)}></Button>
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      {/* MODAL */}
      <MyModal isVisible={showModal} onClick={() => setShowModal(false)} />
      {/* PAGE CONTENT */}
      <Text>Open up App.tsx to start working on your app!</Text>
      <StatusBar style="auto" />
      <Button
        title="next page"
        onPress={() => navigation.navigate("Detail")}
      ></Button>
    </View>
  );
}

function ProfileScreen() {
  return (
    <View style={styles.container}>
      <Text>This is the ProfileScreen page</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const DrawerStack = createDrawerNavigator();
export function DrawerScreenStack() {
  return (
    <DrawerStack.Navigator initialRouteName="Home">
      <DrawerStack.Screen name="Home" component={HomeScreen} />
      <DrawerStack.Screen name="Profile" component={ProfileScreen} />
    </DrawerStack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  "modal-container": {
    flex: 1,
    alignItems: "center",
    borderRadius: 18,
  },
});
