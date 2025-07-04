from web3 import Web3
import hashlib
import time
import os

ganache_url = "http://127.0.0.1:7545"
web3 = Web3(Web3.HTTPProvider(ganache_url))

if not web3.is_connected():
    print("Eroare: Nu mă pot conecta la Ganache.")
    exit()

sender = "0xc38D77d3d78db017803aBe442a98F23d6d3315B7"
recipient = "0x504b74C0CEADC6be104FC3AE0B972Ff54C84F7EC"

nonce = web3.eth.get_transaction_count(sender)
file_path = "data.json"

def load_data_lines():
    if not os.path.exists(file_path):
        return []
    with open(file_path, "r") as f:
        return f.readlines()

def save_remaining_lines(lines):
    with open(file_path, "w") as f:
        f.writelines(lines)

while True:
    lines = load_data_lines()
    if not lines:
        print("Fișierul este gol. Aștept date...")
        time.sleep(5)
        continue

    lines_to_send = lines[-3:]
    remaining_lines = lines[:-3] if len(lines) > 3 else []

    for line in lines_to_send:
        data_hash = hashlib.sha256(line.encode()).hexdigest()
        print(f"Trimitem hash: {data_hash}")

        txn = {
            'from': sender,
            'to': recipient,
            'value': 0,
            'gas': 200000,
            'gasPrice': web3.to_wei('20', 'gwei'),
            'nonce': nonce,
            'data': web3.to_hex(text=data_hash)
        }

        txn_hash = web3.eth.send_transaction(txn)
        print(f"Tranzacție trimisă cu hash: {txn_hash.hex()}")

        nonce += 1
        time.sleep(2)

    save_remaining_lines(remaining_lines)
