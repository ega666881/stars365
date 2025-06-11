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
  const [rerenderKey, setRerenderKey] = useState(0);
  const [rotation, setRotation] = useState(0);
  const rotationRef = useRef(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [currentResult, setCurrentResult] = useState(null);
  const [arrowShake, setArrowShake] = useState(false);
  const [avatars, setAvatars] = useState([]); // Храним аватарки
  const [winnerIndex, setWinnerIndex] = useState(1);
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);
  const wheelRef = useRef(null);

  const forceRerender = () => setRerenderKey((prev) => prev + 1);
  const handleTouchStart = (e) => {
    touchStartX.current = e.targetTouches[0].clientX;
  };

  // Функция для обработки движения пальца
  const handleTouchMove = (e) => {
    touchEndX.current = e.targetTouches[0].clientX;
  };

  const formatBet = () => {
    let bet = changeBetModalStore.bet.value
    if (x10SpinStore.activeRoom) {
      if (Object.keys(x10SpinStore?.activeRoom).length > 2) {
        bet = x10SpinStore.activeRoom.betValue
      } 
    }
    
    return <>
      {Number(bet) >= 999 ? (
        <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
          {Array.from(String(bet))[0]}K
          <img src={mediaManager('starsMiniIcon')} />
        </Box>
      ):(
        <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
          {bet}
          <img src={mediaManager('starsMiniIcon')} />
        </Box>
      )}
    </>
  }

  // Функция для обработки окончания касания
  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return;
    if (isSpinning) return
    console.log(x10SpinStore.activeRoom)
    if (Object.keys(x10SpinStore.activeRoom).length < 2) {
      socketStore.sendJoinRoom({
        userId: clientStore.user.id,
        avatar: clientStore.user.photo_url,
        betValue: changeBetModalStore.bet.value
      })
      startSpin()
      x10SpinStore.getRoomUser(setAvatars)
      clientStore.getUser(clientStore.user.telegram_id)
    }

    // Сброс значений
    touchStartX.current = null;
    touchEndX.current = null;
  };
  useEffect(() => {
    rotationRef.current = rotation;
  }, [rotation]);

  useEffect(() => {
    if(x10SpinStore.targetSegment) {
      setRotation(x10SpinStore.targetSegment * 35.8)
      console.log("sd4444")
    }
  }, [isSpinning])

  useEffect(() => {
    x10SpinStore.setGameStart(false)
    x10SpinStore.getRoomUser(setAvatars)
    socketStore.socket.on("room-update", (users) => {
      setAvatars(users);
    });
    const onGameStarted = ({ winnerUserId }) => {
      console.log("Игра началась, победитель:", winnerUserId);

      const winnerIndex = x10SpinStore.activeRoom?.players?.findIndex((avatar) => avatar.user_id === winnerUserId);
      console.log(winnerIndex)
      if (winnerIndex !== -1) {
        x10SpinStore.setTargetSegment(winnerIndex); // Устанавливаем целевой сегмент
        x10SpinStore.setGameStart(true)
        startSpin(true, ((360 * 5) + (35.6 * (winnerIndex + 3) * -1)));
        // setTimeout(() => {
        //   setRotation((winnerIndex) * 35.6 * 1)
        // }, 2000)
      }
    };

    socketStore.socket.on("game-started", onGameStarted);

    return () => {
      socketStore.socket.off("room-update");
      socketStore.socket.off("game-started");
    };
  }, []);

  const startSpin = (win = false, rotation) => {
    console.log(isSpinning)
    if (isSpinning) return;

    const rotations = 5;
    const targetRotation = rotationRef.current + rotations * 360 + (segmentCount - 1) * segmentAngle;
    const correctedRotation = targetRotation + segmentAngle / 2;

    if (win) {
      console.log(rotation)
      setRotation(rotation)

    } else {
      setRotation(200);
    }
    setIsSpinning(true);
    console.log("123123")
  };

  const handleAnimationComplete = () => {
    if (isSpinning && winnerIndex !== null) {
      //setCurrentResult(`Победитель: ${winnerIndex}`);
      playFinalSound();
      setIsSpinning(false);
      if (!x10SpinStore.gameStart) {
        setRotation(0)
        forceRerender()
      } else {
        clientStore.getUser(clientStore.user.telegram_id)
      }
    }
  };

  const playFinalSound = () => {
    finalSound.currentTime = 0;
    finalSound.play().catch(() => {
      console.log("Финальный звук не воспроизведён");
    });
  };

  const renderSegmentImages = () => {
    return avatars.map((avatar, index) => {
      if (index > 9) return
      const pos = x10SpinStore.fixedPositions[index];
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
        key={rerenderKey}
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
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={mediaManager("x10SpinBackgroundImage")}
          alt="Spin Background"
          style={{ width: "100%", height: "100%", transform: "translate(-0%, -0%)" }}
        />
        {avatars && renderSegmentImages()}
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
          onClick={() => changeBetModalStore.setOpenModal(true)}
        >
            {formatBet()}
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