import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SensorChart from './SensorChart';
import ChatBotScreen from './ChatBotScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="SensorChart"
        screenOptions={{
          headerStyle: { backgroundColor: '#121212' },
          headerTintColor: '#fff',
        }}
      >
        <Stack.Screen
          name="SensorChart"
          component={SensorChart}
          options={{ title: 'Sensor Chart' }}
        />
        <Stack.Screen
          name="ChatBot"
          component={ChatBotScreen}
          options={{ title: 'ChatBot' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
