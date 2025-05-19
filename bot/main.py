from fastapi import FastAPI, HTTPException, Request, Query
from aiogram import Bot, Dispatcher, Router, types, F
from aiogram.fsm.storage.memory import MemoryStorage
from aiogram.types import Message, FSInputFile
import asyncio
import json
import requests
import start
from pydantic import BaseModel
from aiogram.types import PreCheckoutQuery, SuccessfulPayment
import traceback
import time
import random
import os

TELEGRAM_TOKEN = '7723808676:AAHwaL5RENzPUH4p53OAVVflG7ux9Cenht4'
CHAT_ID = -4674720334
BACKEND_IP = 'http://127.0.0.1:8000/api'

bot = Bot(token=TELEGRAM_TOKEN)
storage = MemoryStorage()
dp = Dispatcher()
my_router = Router()
app = FastAPI()

async def set_webhook():
    await bot.delete_webhook()  # Удаляем старый вебхук (если есть)
    await bot.set_webhook(url="https://serenely-scholarly-bulbul.cloudpub.ru/webhook",
                           allowed_updates=dp.resolve_used_update_types(),
                          drop_pending_updates=True)

class MessageRequest(BaseModel):
    telegram_id: str

@my_router.pre_checkout_query(lambda query: True)
async def pre_checkout_query(pre_checkout_q: types.PreCheckoutQuery):
    await bot.answer_pre_checkout_query(pre_checkout_q.id, ok=True)

@app.on_event("startup")
async def startup():
    dp.include_routers(start.router, my_router)
    # asyncio.create_task(dp.start_polling(bot))
    await set_webhook()
    

@app.get('/get-invoice')
async def getInvoice(
    telegram_id: int,
    amount: int = 1,
):
    invoice = await bot.create_invoice_link(
        title="Подписка на 365 дней",
        description="test",
        payload=f"{telegram_id}",
        provider_token="",
        currency="XTR",
        prices=[{"label": "test", "amount": amount}]
    )
    
    return {"link": invoice}

@app.get('/send-lottery-message')
async def getInvoice(
    username: str,
    amount: int = 1,
):
    current_dir = os.path.dirname(os.path.abspath(__file__))
    image_path = os.path.join(current_dir, 'images', '00020-1855996300.jpg')

    photo = FSInputFile(path = image_path, filename = 'a.jpg')
    await bot.send_photo(chat_id=CHAT_ID,
                        photo=photo,
                        caption=f"Поздравляем победителя\n  РОЗЫГРЫША ДНЯ 🚀\n@{username}\nТВОЙ ПРИЗ {amount} ⭐️ 🥳")


@app.post("/webhook")
async def webhook_handler(data: dict, request: Request):
    try:
        print(data['message']['successful_payment'])
        paynament = data['message']['successful_payment']
        telegram_user_id  = paynament['invoice_payload']
        response = await requests.post('http://127.0.0.1:8000/api/users/buy-subscription', 
                                       json.dumps({"telegram_id": telegram_user_id}), 
                                       headers={'content-type': 'application/json'})

    except:
        pass

    update = await request.json()
    await dp.feed_webhook_update(bot, update)

    

    return {"status": "ok"}

# @dp.message(F.text == "/start")
# async def start(message: Message, bot: Bot):

#     body = {
#         "telegram_id": message.from_user.id, 
#         "username": message.from_user.username,
#         "first_name": message.from_user.first_name,
#         "last_name": message.from_user.last_name,
#         "photo_url": ""
#         }
#     try:
#         body['referalId'] = int(message.text[7:])

#     except:
#         pass

#     print(body)
#     response = requests.post('http://127.0.0.1:8000/api/users/create-user', json.dumps(body), headers={'content-type': 'application/json'})
#     print(response.status_code, response.text)


#     await message.answer("Приветствуем в проекте")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=81, reload=True)
