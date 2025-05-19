from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton

def startKeyboard():
    
    buttons = [
        [
            InlineKeyboardButton(
                    text = 'ТЫК СЮДА👆🏻',
                    web_app="https://t.me/starsgame365bot/app"
            ),
            InlineKeyboardButton(
                    text = 'Комьюнити',
                    url="https://t.me/starsgame365"
            ),
            
        ],
        
    ]


    keyboard = InlineKeyboardMarkup(inline_keyboard=buttons)
    return keyboard
