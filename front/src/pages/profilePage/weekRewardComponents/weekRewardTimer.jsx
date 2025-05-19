import { observer } from 'mobx-react';
import React, { useState, useEffect } from 'react';

const CountdownTimer = ({ targetDate, setTakeReward }) => {
  const [timeRemaining, setTimeRemaining] = useState({});

  // Функция для добавления ведущего нуля
  const formatTime = (time) => {
    return time < 10 ? `0${time}` : `${time}`;
  };

  useEffect(() => {
    // Функция для обновления времени
    const calculateTimeRemaining = () => {
      const now = new Date();
      const distance = new Date(targetDate) - now;

      // Если время истекло
      if (distance < 0) {
        setTimeRemaining({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });
        if (setTakeReward) {
          setTakeReward(true);
        }
        return;
      }

      // Вычисляем оставшееся время
      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeRemaining({ days, hours, minutes, seconds });
    };

    // Запускаем таймер
    const timerId = setInterval(calculateTimeRemaining, 1000);

    // Вызываем функцию сразу для начального значения
    calculateTimeRemaining();

    // Очистка интервала при размонтировании компонента
    return () => clearInterval(timerId);
  }, [targetDate]);

  return (
    <span>
      {formatTime(timeRemaining.hours)}:{formatTime(timeRemaining.minutes)}:{formatTime(timeRemaining.seconds)}
    </span>
  );
};

export default observer(CountdownTimer);