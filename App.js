import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";

import Login from "./pages/login/login";
import Home from "./pages/home";
import Purchase from "./pages/purchase/purchase";
import List from "./pages/list";
import Settings from "./pages/settings";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function HomeTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          height: 50,
          paddingHorizontal: 5,
          paddingTop: 5,
          backgroundColor: "black",
          position: "absolute",
          //borderTopWidth: 0,
        },
      })}
    >
      <Tab.Screen
        name="Dashboard"
        component={Home}
        options={{ headerShown: false, tabBarIcon: ({ color, size }) => <MaterialIcons name="dashboard" size={24} color="white" /> }}
      />
      <Tab.Screen
        name="Purchase"
        component={Purchase}
        options={{ headerShown: false, tabBarIcon: ({ color, size }) => <Ionicons name="add-circle-outline" size={24} color="white" /> }}
      />
      <Tab.Screen
        name="List"
        component={List}
        options={{ headerShown: false, tabBarIcon: ({ color, size }) => <FontAwesome5 name="clipboard-list" size={20} color="white" /> }}
      />
      <Tab.Screen name="Settings" component={Settings} options={{ headerShown: false, tabBarButton: (props) => null }} />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" backgroundColor="black" hidden={false} />
      <Stack.Navigator>
        <Stack.Screen name="Login" component={Login} options={{ headerShown: false /* , orientation: "all" */ }} />
        <Stack.Screen name="Home" component={HomeTabs} options={{ headerShown: false /* , orientation: "all" */ }} />
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
