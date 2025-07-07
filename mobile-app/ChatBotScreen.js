import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';

export default function ChatBotScreen() {
  const [temperature, setTemperature] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [messages, setMessages] = useState([
    { text: 'Hello! Ask me about temperature or humidity.', from: 'bot' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  // Fetch latest sensor data from Firebase
  const fetchSensorData = async () => {
    try {
      const url =
        'https://sensor-data-a7b00-default-rtdb.europe-west1.firebasedatabase.app/sensor.json';
      const response = await fetch(url);
      const data = await response.json();

      if (!data) return;

      const entries = Object.values(data)
        .map((item) => JSON.parse(item))
        .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp))
        .slice(-12);

      if (entries.length === 0) return;

      const meanTemp =
        entries.reduce((sum, e) => sum + e.temperature, 0) / entries.length;
      const meanHumidity =
        entries.reduce((sum, e) => sum + e.humidity, 0) / entries.length;

      const lastTemp = entries[entries.length - 1].temperature;
      const lastHumidity = entries[entries.length - 1].humidity;

      setTemperature(lastTemp.toFixed(2));
      setHumidity(lastHumidity.toFixed(2));

      return { meanTemp: meanTemp.toFixed(2), meanHumidity: meanHumidity.toFixed(2), lastTemp, lastHumidity };
    } catch (error) {
      console.error('Error fetching sensor data:', error);
    }
  };

  const handleUserMessage = async () => {
    if (!input.trim()) return;

    const userText = input.trim();
    setMessages((prev) => [...prev, { text: userText, from: 'user' }]);
    setInput('');
    setLoading(true);

    const data = await fetchSensorData();

    let botResponse = "Sorry, I didn't understand that. Please ask about temperature or humidity.";

    if (data) {
      const { meanTemp, meanHumidity, lastTemp, lastHumidity } = data;

      if (userText.toLowerCase().includes('average') && userText.toLowerCase().includes('temperature')) {
        botResponse = `Average temperature in last minute is ${meanTemp} °C.`;
      } else if (
        userText.toLowerCase().includes('average') && userText.toLowerCase().includes('humidity')
      ) {
        botResponse = `Average humidity in last minute is ${meanHumidity} %.`;
      } else if (
        userText.toLowerCase().includes('temperature')
      ) {
        botResponse = `Current temperature is ${lastTemp.toFixed(2)} °C.`;
      } else if (
        userText.toLowerCase().includes('humidity')
      ) {
        botResponse = `Current humidity is ${lastHumidity.toFixed(2)} %.`;
      }
    }

    setMessages((prev) => [...prev, { text: botResponse, from: 'bot' }]);
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={{ flex: 1 }}>
          <ScrollView
            style={styles.chat}
            contentContainerStyle={styles.chatContent}
            keyboardShouldPersistTaps="handled"
          >
            {messages.map((msg, i) => (
              <View
                key={i}
                style={[styles.message, msg.from === 'user' ? styles.user : styles.bot]}
              >
                <Text style={styles.text}>{msg.text}</Text>
              </View>
            ))}
            {loading && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color="#00a8ff" />
                <Text style={{ color: '#888', marginLeft: 10 }}>Thinking...</Text>
              </View>
            )}
          </ScrollView>

          <View style={styles.inputContainer}>
            <TextInput
              value={input}
              onChangeText={setInput}
              onSubmitEditing={handleUserMessage}
              placeholder="Ask about temperature or humidity..."
              placeholderTextColor="#aaa"
              style={styles.input}
              returnKeyType="send"
              blurOnSubmit={false}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  chat: {
    flex: 1,
    paddingHorizontal: 10,
  },
  chatContent: {
    paddingVertical: 20,
  },
  message: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 12,
    marginVertical: 6,
  },
  user: {
    alignSelf: 'flex-end',
    backgroundColor: '#007aff',
  },
  bot: {
    alignSelf: 'flex-start',
    backgroundColor: '#333',
  },
  text: {
    color: '#fff',
    fontSize: 16,
  },
  inputContainer: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#222',
    backgroundColor: '#121212',
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#1e1e1e',
    color: '#fff',
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 10,
    fontSize: 16,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
});
