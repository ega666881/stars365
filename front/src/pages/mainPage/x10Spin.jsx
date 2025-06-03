import React, { useState, useRef, useEffect } from "react";
import { Box, Typography, Avatar } from "@mui/material";
import { motion } from "framer-motion";
import mediaManager from "../../utils/mediaManager";
import { observer } from "mobx-react";
import changeBetModalStore from "../../stores/changeBetModalStore";
import clientStore from "../../stores/clientStore";
import spinStore from "../../stores/spinStore";

import socketStore from './../../stores/socketStore';
import x10SpinStore from "../../stores/x10SpinStore";

const clickSound = new Audio(mediaManager("clickSound"));
const finalSound = new Audio(mediaManager("finalSound"));

function X10Spin() {
  const segmentCount = 10;
  const segmentAngle = 360 / segmentCount;
  const wheelSize = 320;
  const radius = wheelSize / 2;

  const [rotation, setRotation] = useState(0);
  const rotationRef = useRef(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentResult, setCurrentResult] = useState(null);
  const [arrowShake, setArrowShake] = useState(false);
  const [avatars, setAvatars] = useState([]); // Храним аватарки
  const [winnerIndex, setWinnerIndex] = useState(null);

  const wheelRef = useRef(null);

  const fixedPositions = [
    { x: 315, y: 162 },
    { x: 280, y: 250 },
    { x: 208, y: 308 },
    { x: 115, y: 305 },
    { x: 35, y: 250 },
    { x: 10, y: 162 },
    { x: 36, y: 73 },
    { x: 115, y: 15 },
    { x: 208, y: 15 },
    { x: 285, y: 70 },
  ];

  useEffect(() => {
    rotationRef.current = rotation;
  }, [rotation]);

  useEffect(() => {
    setRotation(spinStore.targetSegment * 35.8)
  }, [isSpinning])

  // Подключиться к комнате при монтировании
  useEffect(() => {
    console.log("gggg")
    socketStore.socket.emit("join-x10-room", {
      userId: clientStore.user.id,
      avatar: clientStore.user.photo_url
    });

    socketStore.socket.on("room-update", (users) => {
      console.log(avatars)
      setAvatars(users);
    });

    const onGameStarted = ({ winnerUserId }) => {
      console.log("Игра началась, победитель:", winnerUserId);
      
      // Находим индекс победителя среди avatars
      const winnerIndex = avatars.findIndex((avatar) => avatar.user_id === winnerUserId);
      console.log(winnerUserId)
      if (winnerIndex !== -1) {
        spinStore.setTargetSegment(winnerIndex); // Устанавливаем целевой сегмент
        startSpin(); // Запускаем вращение
      }
    };

    socketStore.socket.on("game-started", onGameStarted);

    return () => {
      socketStore.socket.off("room-update");
      socketStore.socket.off("game-started");
    };
  }, []);

  const startSpin = (targetIndex) => {
    console.log(isSpinning)
    if (isSpinning) return;
    setIsSpinning(true);

    const rotations = 5;
    const targetRotation = rotationRef.current + rotations * 360 + (segmentCount - spinStore.targetSegment) * segmentAngle;
    const correctedRotation = targetRotation + segmentAngle / 2;

    setRotation(correctedRotation);
  };

  const handleAnimationComplete = () => {
    if (isSpinning && winnerIndex !== null) {
      setCurrentResult(`Победитель: ${winnerIndex}`);
      playFinalSound();
      setIsSpinning(false);
    }
  };

  const playFinalSound = () => {
    finalSound.currentTime = 0;
    finalSound.play().catch(() => {
      console.log("Финальный звук не воспроизведён");
    });
  };

  // Расчёт координат для аватарки
  const getAvatarCoords = (index) => {
    const centerX = wheelSize / 2;
    const centerY = wheelSize / 2
    const angle = (index * segmentAngle) - rotation; // Угол текущего сегмента
    const radians = (angle * Math.PI) / 180; // Преобразуем угол в радианы
    console.log(radians)
    const x = centerX + radius * Math.cos(radians);
    const y = centerY + radius * Math.sin(radians);
    // x = x + (index * 25)
    // y = y + (index)
    return { x, y };
  };

  // Рендеринг аватарок
  const renderSegmentImages = () => {
    return avatars.map((avatar, index) => {
      const pos = fixedPositions[index];
      return (
        <Box
          key={index}
          sx={{
            position: "absolute",
            left: `${pos.x}px`,
            top: `${pos.y}px`,
            transform: "translate(-50%, -50%)",
            zIndex: 5,
            pointerEvents: "none"
          }}
        >
          <Avatar
            src={avatar.avatar}
            alt={`User ${index}`}
            style={{ width: "59px", height: "59px" }}
          />
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
        position: "relative",
        marginTop: "10%"
      }}
    >
      {/* Колесо */}
      <Box
        ref={wheelRef}
        component={motion.div}
        className="spinBackground"
        animate={{ rotate: rotation }}
        transition={{
          duration: 5,
          ease: "easeOut",
          onComplete: handleAnimationComplete
        }}
        style={{
          touchAction: "none",
          position: "relative",
          width: `${wheelSize}px`,
          height: `${wheelSize}px`,
          willChange: "transform",
          transform: "translateZ(0) scale3d(1, 1, 1)",
          cursor: isSpinning ? "default" : "grab"
        }}
      >
        <img
          src={mediaManager("x10SpinBackgroundImage")}
          alt="Spin Background"
          style={{ width: "120%", height: "180%", transform: "translate(-8%, -22%)" }}
        />
        {renderSegmentImages()}
      </Box>

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
            display: 'flex',
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
        >
          {changeBetModalStore.bet.value === "candy" ? (<img src={mediaManager('candyWhiteIcon')} width={"40"}/>):(
            <>
            {Number(changeBetModalStore.bet.value) >= 999 ? (<Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
              {Array.from(String(changeBetModalStore.bet.value))[0]}K
              <img src={mediaManager('starsMiniIcon')} />
            </Box>):(<Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
              {changeBetModalStore.bet.value}
              <img src={mediaManager('starsMiniIcon')} />
            </Box>)}
            </>
          )}
        </Typography>
      </Box>

      {/* Результат */}
      {currentResult && (
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

export default observer(X10Spin);