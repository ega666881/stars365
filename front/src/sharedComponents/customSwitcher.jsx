import React, { useState } from "react";
import { Switch, styled } from "@mui/material";
import { observer } from "mobx-react";

// Кастомизация Switch
const CustomSwitch = styled((props) => (
  <Switch
    focusVisibleClassName=".Mui-focusVisible"
    disableRipple
    {...props}
  />
))(({ theme }) => ({
  width: 100, // Ширина всего переключателя
  height: 32, // Высота переключателя
  padding: 0, // Убираем все отступы
  "& .MuiSwitch-switchBase": {
    padding: 0, // Убираем отступы для базового элемента
    margin: 0, // Убираем все внешние отступы
    transition: "transform 200ms ease-in-out", // Плавное перемещение
    "&.Mui-checked": {
      transform: "translateX(40px)", // Смещение ползунка при активации
      "& + .MuiSwitch-track": {
        backgroundColor: "#000000",
        opacity: 1,
      },
    },
  },
  "& .MuiSwitch-thumb": {
    width: 70, // Размер ползунка
    height: 40,
    backgroundColor: "#fff",
    backgroundSize: "cover", // Растягиваем изображение
    backgroundPosition: "center",
    margin: 0, // Убираем отступы
  },
  "& .MuiSwitch-track": {
    borderRadius: 27, // Закругление трека
    backgroundColor: "#000000",
    opacity: 1,
    
  },
}));

const ImageSwitch = ({ onIcon, offIcon, onChange, checked }) => {
  const [isChecked, setChecked] = useState(checked)
  const handleChange = (event) => {
    setChecked(event.target.checked)

    // Вызываем callback-функцию с текущим состоянием
    if (onChange) {
      onChange(event.target.checked);
    }
  };

  return (
    <CustomSwitch
      checked={isChecked}
      onChange={handleChange}
      sx={{
        width: 80,
        height: 40,
        border: "2px solid",
        borderColor: "#878787",
        borderRadius: 27,
        alignItems: "center",
        "& .MuiSwitch-thumb": {
          backgroundImage: `url(${checked ? onIcon : offIcon})`,
          backgroundColor: "#000000",
          width: 60,
          height: 40,
          marginLeft: -1.5,
          marginTop: 0
        },
      }}
    />
  );
};

export default observer(ImageSwitch);