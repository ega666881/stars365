import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import { observer } from 'mobx-react';
import mediaManager from '../../../utils/mediaManager';
import { CountUp } from 'countup.js';


const BalanceAnimation = ({typeBalance, image, elementId}) => {
    const animationDuration = 1
    const initialCandy = Number(typeBalance) || 0
    const [displayBalance, setDisplayBalance] = useState(Number(initialCandy));
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        const rawValue = typeBalance;
        const newBalance = Number(rawValue);

        if (isNaN(newBalance)) {
            console.error('Значение candy не является числом:', rawValue);
            return;
        }

        // Если значение совпадает — не запускаем анимацию
        if (newBalance === displayBalance) return;

        // Запуск анимации с помощью CountUp
        const countUp = new CountUp(
            elementId, // ID элемента, который будем анимировать
            newBalance, // конечное значение
            {
                startVal: displayBalance, // начальное значение
                duration: animationDuration, // длительность анимации в секундах
                useEasing: true,
                useGrouping: false,
                onComplete: () => {
                    console.log("анимация завершена")
                    setIsAnimating(false);
                    setDisplayBalance(newBalance); // обновляем локальный стейт
                },
            }
        );

        if (!countUp.error) {
            setIsAnimating(true);
            countUp.start();
            setTimeout(() => {setIsAnimating(false)}, [animationDuration * 1000])
        } else {
            // Если ошибка (например, нет DOM-элемента), просто обновляем напрямую
            setDisplayBalance(newBalance);
        }
    }, [typeBalance]);
    return (
        <Typography
            sx={{
                fontFamily: "Roboto",
                fontSize: isAnimating ? "28px" : "20px",
                fontWeight: 'bold',
                color: isAnimating ? '#ff9800' : 'inherit',
                transition: 'all 0.3s ease',
                display: "flex",
                gap: 1,
                alignItems: 'center',
            }}
        >
            <span id={elementId}>{displayBalance}</span>
            <img 
                src={mediaManager(image)} 
                alt="Candy"
                style={{ 
                    transition: 'transform 0.3s ease',
                    transform: isAnimating ? 'scale(1.3)' : 'scale(1)',
                }} 
            />
        </Typography>
    );
};

export default observer(BalanceAnimation);