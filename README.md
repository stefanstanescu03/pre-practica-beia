# IoT Data Monitoring and Blockchain Logging

This project simulates an IoT device that collects temperature and humidity data, sends it via MQTT, stores it locally when offline, visualizes it in Grafana, and secures its integrity on a local Ethereum blockchain using Ganache. A Telegram chatbot is also included to query the latest sensor values.

## Features

- Sends sensor data to MQTT broker: `mqtt.beia-telemetrie.ro`
- Local backup of data when MQTT is unavailable
- Automatic data resynchronization after reconnection
- Real-time visualization in [Grafana](https://grafana.beia-telemetrie.ro)
- Data integrity via SHA-256 hashes stored on Ethereum (Ganache)
- Telegram bot for querying latest temperature and humidity

## Requirements

- Python 3
- Python libraries: `paho-mqtt`, `web3`, `python-telegram-bot`
- [Ganache](https://trufflesuite.com/ganache/) (local Ethereum blockchain)
- Telegram bot token (created via BotFather)

## How to Run

1. Start Ganache at `http://127.0.0.1:7545`.
2. Run the MQTT data sender script.
3. Launch the blockchain logger script.
4. Start the Telegram bot.
