import React, { useState, useRef, useEffect } from "react";
import { Box, Typography, Avatar } from "@mui/material";
import { motion } from "framer-motion";
import mediaManager from "../../utils/mediaManager";
import { observer } from "mobx-react";
import changeBetModalStore from "../../stores/changeBetModalStore";
import clientStore from "../../stores/clientStore";
import spinStore from "../../stores/spinStore";

import socketStore from './../../stores/socketStore';

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
    console.log(avatars)
  useEffect(() => {
    rotationRef.current = rotation;
  }, [rotation]);

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
        console.log(avatars)
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

  const renderSegmentImages = () => {
    return Array.from({ length: segmentCount }).map((_, index) => {
      const angle = (index * segmentAngle) - rotation;
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
            zIndex: 5555
          }}
        >
          {avatars[index] && (
            <Avatar
              src={avatars[index].avatar}
              alt={`User ${index}`}
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