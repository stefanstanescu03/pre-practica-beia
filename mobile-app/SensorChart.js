import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  StyleSheet,
  StatusBar,
  TouchableOpacity
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const chartConfig = {
  backgroundGradientFrom: '#1c1c1e',
  backgroundGradientTo: '#1c1c1e',
  color: (opacity = 1) => `rgba(0, 168, 255, ${opacity})`,
  labelColor: (opacity = 1) => `rgba(200, 200, 200, ${opacity})`,
  strokeWidth: 2,
  decimalPlaces: 1,
  propsForDots: {
    r: '4',
    strokeWidth: '2',
    stroke: '#fff',
  },
  propsForLabels: {
    fontSize: 10,
  },
};

export default function SensorChart({ navigation }) {
  const [temperature, setTemperature] = useState([]);
  const [humidity, setHumidity] = useState([]);
  const [labels, setLabels] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const url = 'https://sensor-data-a7b00-default-rtdb.europe-west1.firebasedatabase.app/sensor.json';
        const response = await fetch(url);
        const data = await response.json();

        if (!data) {
          setTemperature([]);
          setHumidity([]);
          setLabels([]);
          return;
        }

        const entries = Object.values(data)
          .map(item => JSON.parse(item))
          .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
          .slice(-12);

        setTemperature(entries.map(e => e.temperature));
        setHumidity(entries.map(e => e.humidity));
        setLabels(entries.map((e, i) => {
          if (i % 3 === 0) {
            const d = new Date(e.timestamp);
            return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          }
          return '';
        }));
      } catch (error) {
        console.error('Fetch Firebase REST error:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('ChatBot')}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>Go to ChatBot</Text>
        </TouchableOpacity>

        {temperature.length > 0 ? (
          <>
            <Text style={styles.subtitle}>Temperature (°C)</Text>
            <LineChart
              data={{
                labels,
                datasets: [{ data: temperature, color: () => 'rgba(255, 99, 132, 1)', strokeWidth: 2 }],
              }}
              width={screenWidth - 20}
              height={250}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />

            <Text style={styles.subtitle}>Humidity (%)</Text>
            <LineChart
              data={{
                labels,
                datasets: [{ data: humidity, color: () => 'rgba(54, 162, 235, 1)', strokeWidth: 2 }],
              }}
              width={screenWidth - 20}
              height={250}
              chartConfig={chartConfig}
              bezier
              style={styles.chart}
            />
          </>
        ) : (
          <Text style={styles.noData}>No recent data available</Text>
        )}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingTop: 50,
    paddingHorizontal: 10,
    alignItems: 'center',
    backgroundColor: '#121212',
  },
  button: {
    backgroundColor: '#00a8ff',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginBottom: 20,
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#ddd',
    marginTop: 15,
    marginBottom: 10,
    alignSelf: 'flex-start',
    marginLeft: 5,
  },
  chart: {
    borderRadius: 16,
    marginBottom: 25,
  },
  noData: {
    fontSize: 16,
    marginTop: 20,
    color: '#aaa',
  },
});
