import React, { useState, useRef, useCallback, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";
import mediaManager from "../../utils/mediaManager";
import { observer } from "mobx-react";
import changeBetModalStore from "../../stores/changeBetModalStore";
import clientStore from "../../stores/clientStore";
import spinStore from "../../stores/spinStore";

// Предзагрузка звуков
const clickSound = new Audio(mediaManager("clickSound"));
const finalSound = new Audio(mediaManager("finalSound"));

function SpinTest({ targetSegment = null, segments = [] }) {
  const segmentList = segments.length > 0 ? segments : Array(16).fill({ image: null });
  const segmentCount = segmentList.length;
  const segmentAngle = 360 / segmentCount;
  const wheelSize = 320;
  const radius = wheelSize / 2;
  const [rotation, setRotation] = useState(0);
  const rotationRef = useRef(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentResult, setCurrentResult] = useState(null);
  const [arrowShake, setArrowShake] = useState(false);

  // Для ручного вращения
  const [isDragging, setIsDragging] = useState(false);
  const [manualRotation, setManualRotation] = useState(0);
  const manualRotationRef = useRef(0);
  const wheelRef = useRef(null);
  const lastX = useRef(0);
  const lastY = useRef(0);
  const lastTime = useRef(0);
  const velocityRef = useRef(0);

  // Для вибрации и щелчка
  const vibrationIntensityRef = useRef(0);
  const vibrationIntervalRef = useRef(null);
  const lastSegmentRef = useRef(-1);

  // Обновляем ref при изменении rotation
  useEffect(() => {
    rotationRef.current = rotation;
  }, [rotation]);

  // useEffect(() => {
  //   setInterval(() => {
      
  //     if (spinStore.autoSpin && !isSpinning) {
  //         handleSpin();
  //     }
  //   }, [5000])
    
  // }, [true]);

  const getTargetSegment = () => {
    if (spinStore.targetSegment !== null && spinStore.targetSegment >= 0 && spinStore.targetSegment < segmentCount) {
      return spinStore.targetSegment;
    }
    return Math.floor(Math.random() * segmentCount);
  };

  // Запуск вращения
  const handleSpin = useCallback((manualSpin = false) => {
    if (!manualSpin) {
      if (isSpinning) {
        return;
      }
    }

    if (changeBetModalStore.bet.value > clientStore.user.balance) {
      spinStore.setAutoSpin(false);
    }

    spinStore.makeBet();
    const target = getTargetSegment();
    const rotations = 5;
    const targetRotation = rotationRef.current + rotations * 360 + (segmentCount - target) * segmentAngle;

    // Коррекция на центр сегмента
    const correctedRotation = targetRotation + segmentAngle / 2;

    setRotation(correctedRotation);
    setIsSpinning(true);
    spinStore.setIsSpinning(true);
    setCurrentResult(null);
    startVibration();
    playClickSound();
    lastSegmentRef.current = -1;
    vibrationIntensityRef.current = 0;
  }, [isSpinning, segmentCount, segmentAngle]);

  // Обработка начала касания
  const handleTouchStart = (e) => {
    if (isSpinning) return;
    const touch = e.touches[0];
    const rect = wheelRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = touch.clientX - centerX;
    const dy = touch.clientY - centerY;
    const startAngle = Math.atan2(dy, dx) * (180 / Math.PI);

    manualRotationRef.current = rotationRef.current;
    lastX.current = touch.clientX;
    lastY.current = touch.clientY;
    lastTime.current = Date.now();
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging || isSpinning) return;
    const touch = e.touches[0];
    const rect = wheelRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = touch.clientX - centerX;
    const dy = touch.clientY - centerY;
    const currentAngle = Math.atan2(dy, dx) * (180 / Math.PI);
    const deltaAngle = currentAngle - manualRotationRef.current;

    setManualRotation((prev) => prev + deltaAngle);
    manualRotationRef.current = currentAngle;

    // Расчёт скорости свайпа
    const now = Date.now();
    const dt = now - lastTime.current;
    const dxVel = touch.clientX - lastX.current;
    const dyVel = touch.clientY - lastY.current;
    const speed = Math.sqrt(dxVel * dxVel + dyVel * dyVel) / dt;

    velocityRef.current = speed;
    lastX.current = touch.clientX;
    lastY.current = touch.clientY;
    lastTime.current = now;
  };

  // Обработка окончания касания
  const handleTouchEnd = () => {
    if (isSpinning) return;
    setIsDragging(false);
    const velocity = velocityRef.current;

    if (velocity > 0.5) {
      handleSpin();
    } else {
      setManualRotation(0);
    }

    velocityRef.current = 0;
  };

  // Обработка завершения анимации
  const handleAnimationComplete = useCallback(() => {
    if (isSpinning) {
      setIsSpinning(false);
      spinStore.setIsSpinning(false);
      if (clientStore.user.balance < changeBetModalStore.bet.value) {
        console.log("hhhh")
        spinStore.setAutoSpin(false);
      }

      if (spinStore.currentGame.win) {
        console.log(spinStore.currentGame.win)
        setCurrentResult(`Выйграл ${spinStore.currentGame.coinCount}`)
        clientStore.updateUserBalance(1, spinStore.currentGame.coinCount)

      } else if (spinStore.currentGame.win === false) {
        setCurrentResult(`Пройгрыш`)
        console.log(spinStore.currentGame)
        clientStore.updateUserBalance(2, spinStore.currentGame.betValue)
        clientStore.updateUserCandy(1, spinStore.currentGame.betValue)
      }
      stopVibrationOnStop();
      playFinalSound();

      spinStore.resetCurrentGame();
      console.log(spinStore.autoSpin)
      if (spinStore.autoSpin) {
        setRotation(-1500)
        const spinTimeout = setTimeout(() => {handleSpin(true)}, 1000); // задержка перед следующим спином
        return () => clearTimeout(spinTimeout);
      }
    }
  }, [isSpinning, segmentAngle, handleSpin]);

  // Анимация стрелки и звук при прохождении сегментов
  useEffect(() => {
    if (!isSpinning && !isDragging) return;

    const interval = setInterval(() => {
      const currentAngle = rotationRef.current % 360;
      const currentSegment = Math.floor(currentAngle / segmentAngle);

      if (currentSegment !== lastSegmentRef.current) {
        lastSegmentRef.current = currentSegment;
        const intensity = Math.min(200, 50 + currentSegment * 10);

        if ("vibrate" in navigator) {
          navigator.vibrate([intensity, 50]);
        }
        setRotation(getTargetSegment() * 19 * 5)
        setArrowShake(true);
        setTimeout(() => setArrowShake(false), 80);
        playClickSound();
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isSpinning, isDragging]);

  // Сильная вибрация при остановке
  const stopVibrationOnStop = () => {
    if ("vibrate" in navigator) {
      navigator.vibrate([300, 100, 400]);
    }
  };

  // Постепенная вибрация во время вращения
  const startVibration = () => {
    if ("vibrate" in navigator) {
      if (vibrationIntervalRef.current) {
        clearInterval(vibrationIntervalRef.current);
      }

      vibrationIntervalRef.current = setInterval(() => {
        const currentAngle = rotationRef.current % 360;
        const segmentIndex = Math.floor(currentAngle / segmentAngle);

        if (segmentIndex !== vibrationIntensityRef.current) {
          const intensity = Math.min(200, 50 + segmentIndex * 10);
          navigator.vibrate([intensity, 50]);
          vibrationIntensityRef.current = segmentIndex;
        }
      }, 100);
    }
  };

  // Очистка вибрации
  useEffect(() => {
    return () => {
      if (vibrationIntervalRef.current) {
        clearInterval(vibrationIntervalRef.current);
        navigator.vibrate(0);
      }
    };
  }, []);

  // Щелчок при сегменте
  const playClickSound = () => {
    if (clickSound) {
      clickSound.currentTime = 0;
      clickSound.play().catch(() => {
        console.log("Звук щелчка не воспроизведён");
      });
    }
  };

  // Финальный звук
  const playFinalSound = () => {
    finalSound.currentTime = 0;
    finalSound.play().catch(() => {
      console.log("Финальный звук не воспроизведён");
    });
  };

  const renderSegmentImages = () => {
    return segmentList.map((segment, index) => {
      const angle = (index * segmentAngle) - rotation - 5;
      const radians = (angle * Math.PI) / 180;
      const x = radius * Math.sin(radians);
      const y = -radius * Math.cos(radians);

      return (
        <Box
          key={index}
          sx={{
            position: "absolute",
            top: `${wheelSize / 2 + y}px`,
            left: `${wheelSize / 2 + x}px`,
            transform: `translate(-50%, -50%) rotate(${angle}deg)`,
            width: "auto",
            height: "auto",
            display: "flex",
            justifyContent: "center",
            pointerEvents: "none",
            zIndex: 10
          }}
        >
          {segment.image && (
            <img
              src={segment.image}
              alt={`Сегмент ${index}`}
              style={{ width: "30px", height: "30px" }}
            />
          )}
        </Box>
      );
    });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "90%",
        width: "90%",
        position: "relative"
      }}
    >
      {/* Колесо */}
      <Box
        ref={wheelRef}
        component={motion.div}
        className="spinBackground"
        animate={{
          rotate: isDragging ? manualRotation : rotation
        }}
        transition={{
          duration: isDragging ? 0 : 5,
          ease: "easeOut",
          onComplete: handleAnimationComplete
        }}
        style={{
          touchAction: "none",
          position: "relative",
          width: `${wheelSize}px`,
          height: `${wheelSize}px`,
          willChange: "transform",
          transform: "translateZ(0) scale3d(1, 1, 1)", // ✅ Ускорение GPU
          cursor: isSpinning ? "default" : "grab"
        }}
        
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={mediaManager("spinBackgroundImage")}
          alt="Spin Background"
          style={{ width: "100%", height: "auto" }}
        />

        {renderSegmentImages()}
      </Box>

      {/* Стрелка */}
      <Box
        sx={{
          position: "absolute",
          top: "0%",
          left: "50%",
          transform: "translate(-50%, 10%)",
          pointerEvents: "none",
          zIndex: 2,
          overflow: "visible"
        }}
      >
        <motion.img
          src={mediaManager("arrowSpinImage")}
          alt="Arrow"
          animate={{
            rotate: arrowShake ? [0, 5, 0] : 0
          }}
          transition={{
            duration: 0.1,
            ease: "easeIn"
          }}
          style={{
            width: "100%",
            height: "auto",
            willChange: "transform",
          }}
        />
      </Box>

      {/* Центральный круг */}
      <Box
        sx={{
          position: "absolute",
          transform: "translate(-0%, -0%)",
          zIndex: 2
        }}
        onClick={() => changeBetModalStore.setOpenModal(true)}
      >
        <img
          src={mediaManager("elipceCenterSpinImage")}
          alt="Center Circle"
          style={{ width: "100%", height: "auto" }}
        />
      </Box>

      <Box
        sx={{
          position: "absolute",
          transform: "translate(0%, -0%)",
          zIndex: 2
        }}
      >
        <Typography
          sx={{
            fontSize: 25,
            
            fontWeight: "bold",
            background: `
            linear-gradient(
              to right,
              #FFFCAE 0%,
              #FFAE35 47%,
              #AE4900 67%,
              #FFB400 100%
            )
          `,
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            MozBackgroundClip: "text",
            MozTextFillColor: "transparent",
            backgroundClip: "text",
            color: "transparent",
          }}
          onClick={() => changeBetModalStore.setOpenModal(true)}
        >
          {Number(changeBetModalStore.bet.value) >= 999 ? (<>
            {Array.from(String(changeBetModalStore.bet.value))[0]}K
          </>):(changeBetModalStore.bet.value)}
        </Typography>
      </Box>

      {/* Результат */}
      {currentResult !== null && (
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            bgcolor: "rgba(0,0,0,0.8)",
            color: "white",
            padding: "10px 20px",
            borderRadius: "10px",
            zIndex: 2
          }}
        >
          {currentResult}
        </Box>
      )}
    </Box>
  );
}

export default observer(SpinTest);