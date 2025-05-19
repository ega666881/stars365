from aiogram import Bot, Router, F
from aiogram.types import CallbackQuery, Message
from aiogram.filters import Command, CommandStart
import requests
from aiogram.types import ReplyKeyboardMarkup, KeyboardButton, KeyboardButtonPollType
from aiogram.utils.keyboard import ReplyKeyboardBuilder
import json

router = Router(name=__name__)

@router.message(CommandStart())
async def start(message: Message, bot: Bot):

    body = {
        "telegram_id": message.from_user.id, 
        "username": message.from_user.username,
        "first_name": message.from_user.first_name,
        "last_name": message.from_user.last_name,
        "photo_url": ""
        }
    try:
        body['referalId'] = int(message.text[7:])

    except Exception as e:
        pass

    print(body)
    response = requests.post('http://127.0.0.1:8000/api/users/create-user', json.dumps(body), headers={'content-type': 'application/json'})
    print(response.status_code, response.text)


    await message.answer("Приветствуем в проекте")


    
    

