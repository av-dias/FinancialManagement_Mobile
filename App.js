import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import Login from "./pages/login";
import Home from "./pages/home";
import Purchase from "./pages/purchase";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          //height: 90,
          paddingHorizontal: 5,
          paddingTop: 5,
          backgroundColor: "black",
          position: "absolute",
          //borderTopWidth: 0,
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={Home} options={{ headerShown: false }} />
      <Tab.Screen name="Purchase" component={Purchase} options={{ headerShown: false }} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
        <Stack.Screen name="Home" component={HomeTabs} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#d4e4fc",
    alignItems: "center",
    justifyContent: "center",
  },
});
