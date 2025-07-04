import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Dimensions, StyleSheet } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const chartConfig = {
  backgroundGradientFrom: '#fff',
  backgroundGradientTo: '#fff',
  color: (opacity = 1) => `rgba(0, 123, 255, ${opacity})`,
  labelColor: () => '#333',
  strokeWidth: 2,
  decimalPlaces: 1,
};

export default function App() {
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
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Last minute values : Temperature & Humidity</Text>
      {temperature.length > 0 ? (
        <LineChart
          data={{
            labels,
            datasets: [
              {
                data: temperature,
                color: () => 'rgba(255, 99, 132, 1)',
                strokeWidth: 2,
              },
              {
                data: humidity,
                color: () => 'rgba(54, 162, 235, 1)',
                strokeWidth: 2,
              },
            ],
            legend: ['Temperature (°C)', 'Humidity (%)'],
          }}
          width={screenWidth - 20}
          height={260}
          chartConfig={chartConfig}
          bezier
          style={styles.chart}
        />
      ) : (
        <Text style={styles.noData}>No recent data found</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 50,
    paddingHorizontal: 10,
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
    flexGrow: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
  },
  chart: {
    borderRadius: 16,
  },
  noData: {
    fontSize: 16,
    marginTop: 20,
    color: '#666',
  },
});
