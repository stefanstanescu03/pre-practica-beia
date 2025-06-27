from telegram import Update
from telegram.ext import ApplicationBuilder, CommandHandler, ContextTypes
import json
import os

TELEGRAM_TOKEN = '7869563302:AAGZlv1hhsst0lFuQIVvysG9KIlwNag4_dU'

def read_latest_data():
    filename = 'data.json'
    if not os.path.exists(filename):
        return None
    with open(filename, 'r') as f:
        lines = f.readlines()
        if not lines:
            return None
        last_line = lines[-1]
        return json.loads(last_line)

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("Hello! Use /temperature or /humidity to get latest sensor data.")

async def temperature(update: Update, context: ContextTypes.DEFAULT_TYPE):
    data = read_latest_data()
    if data:
        await update.message.reply_text(f"Current temperature: {data['temperature']} °C")
    else:
        await update.message.reply_text("No temperature data available.")

async def humidity(update: Update, context: ContextTypes.DEFAULT_TYPE):
    data = read_latest_data()
    if data:
        await update.message.reply_text(f"Current humidity: {data['humidity']} %")
    else:
        await update.message.reply_text("No humidity data available.")

def main():
    app = ApplicationBuilder().token(TELEGRAM_TOKEN).build()

    app.add_handler(CommandHandler("start", start))
    app.add_handler(CommandHandler("temperature", temperature))
    app.add_handler(CommandHandler("humidity", humidity))

    app.run_polling()

if __name__ == '__main__':
    main()