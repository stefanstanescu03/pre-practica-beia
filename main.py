import paho.mqtt.client as mqtt
import time
import random
import json
import os
from datetime import datetime

broker = "mqtt.beia-telemetrie.ro"
port = 1883
topic = "training/device/stefan-stanescu"
client_id = "simulator-stefan-stanescu"
storage_file = "stefan-stanescu/data.json"

client = mqtt.Client(client_id=client_id, protocol=mqtt.MQTTv311, transport="tcp")

os.makedirs("stefan-stanescu", exist_ok=True)

def save_local(data):
    with open(storage_file, "a") as f:
        f.write(json.dumps(data) + "\n")
    print("Salvat local:", data)

def resend_local():
    if not os.path.exists(storage_file):
        return
    lines_to_keep = []
    with open(storage_file, "r") as f:
        lines = f.readlines()
    for line in lines:
        try:
            data = json.loads(line)
            payload = json.dumps(data)
            result = client.publish(topic, payload)
            if result.rc == mqtt.MQTT_ERR_SUCCESS:
                print("Resincronizat:", payload)
            else:
                lines_to_keep.append(line)
        except Exception as e:
            lines_to_keep.append(line)
    with open(storage_file, "w") as f:
        f.writelines(lines_to_keep)

try:
    client.connect(broker, port)
    client.loop_start()
    mqtt_available = True
except:
    print("MQTT indisponibil la start")
    mqtt_available = False

while True:
    data = {
        "temperature": round(random.uniform(20.0, 30.0), 2),
        "humidity": round(random.uniform(40.0, 60.0), 2),
        "timestamp": datetime.utcnow().isoformat()
    }

    payload = json.dumps(data)

    try:
        result = client.publish(topic, payload)
        if result.rc == mqtt.MQTT_ERR_SUCCESS:
            print(f"Trimis MQTT: {payload}")
            resend_local()
        else:
            print("eroare MQTT, salvez local.")
            save_local(data)
    except Exception as e:
        print("MQTT eșuat:", str(e))
        save_local(data)

    time.sleep(5)