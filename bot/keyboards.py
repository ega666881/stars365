from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo

def startKeyboard():
    
    buttons = [
        [
            InlineKeyboardButton(
                    text = 'ТЫК СЮДА👆🏻',
                    web_app=WebAppInfo(url="https://app.starsgame365.top")
            ),
        ],
        [
            InlineKeyboardButton(
                    text = 'Флудилка',
                    url="https://t.me/StarsGame365Chat"
            ),
        ],
        [
            InlineKeyboardButton(
                    text = 'Комьюнити',
                    url="https://t.me/starsgame365"
            ),
        ]
    ]


    keyboard = InlineKeyboardMarkup(inline_keyboard=buttons)
    return keyboard
