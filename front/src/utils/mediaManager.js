import starsLogo from '../assets/starsLogo.svg'
import backgroundImage from '../assets/44 1.svg'
import x10Icon from '../assets/Group 244.png'
import autoIcon from '../assets/Group 245.png'
import topIcon from '../assets/Group 126.svg'
import tempEnergyImage from '../assets/Group 246.svg'
import plusIcon from '../assets/Group 65.svg'
import arrowLeftHeader from '../assets/Vector 25.svg'
import walletIcon from '../assets/Group 66.svg'
import inviteFriendIcon from '../assets/Vector (1).svg'
import settingsIcon from '../assets/Vector (2).svg'
import successGreenIcon from '../assets/Vector (3).svg'
import successWhiteIcon from '../assets/Vector (4).svg'
import candyGrayIcon from '../assets/Union.svg'
import candyWhiteIcon from '../assets/Union (1).svg'
import x10GrayIcon from '../assets/Group 60.svg'
import peoplesGrayIcon from '../assets/Group.svg'
import x10TextGrayIcon from '../assets/Group 45.svg'
// import spinBackgroundImage from '../assets/Group 224.svg'
import spinBackgroundImage from '../assets/Group 224 (1).svg'
import x10SpinBackgroundImage from '../assets/Group 289.svg'
import arrowSpinImage from '../assets/Union (3).svg'
import elipceCenterSpinImage from '../assets/Ellipse 25.svg'
import clickSound from '../assets/clickSound.mp3'
import finalSound from '../assets/finalSound.mp3'
import arrowSpinImageElipce from '../assets/Group 249.svg'
import starsOutlinedImage from '../assets/Group 110.svg'
import x10ActiveIcon from '../assets/Group 233.png'
import closeIcon from '../assets/Group 181.svg'
import starsOutlinedImageDisabled from '../assets/Group (1).svg'
import autoActiveIcon from '../assets/Group 282.png'
import infoIcon from '../assets/Group 283.svg'
import friendsIconOutlined from '../assets/Group 284.svg'
import starsMiniIcon from '../assets/Group 112.svg'
import jackPodIcon from '../assets/Mask group.svg'
import notWalletIcon from '../assets/walletNotIcon.svg'
import tonIcon from '../assets/Group 308.svg'


function mediaManager(assetName) {
  const assets = {
    starsLogo: starsLogo,
    backgroundImage: backgroundImage,
    x10Icon: x10Icon,
    autoIcon: autoIcon,
    topIcon: topIcon,
    tempEnergyImage: tempEnergyImage,
    plusIcon: plusIcon,
    arrowLeftHeader: arrowLeftHeader,
    walletIcon: walletIcon,
    inviteFriendIcon: inviteFriendIcon,
    settingsIcon: settingsIcon,
    successGreenIcon: successGreenIcon,
    successWhiteIcon: successWhiteIcon,
    candyGrayIcon: candyGrayIcon,
    candyWhiteIcon: candyWhiteIcon,
    x10GrayIcon: x10GrayIcon,
    peoplesGrayIcon: peoplesGrayIcon,
    x10TextGrayIcon: x10TextGrayIcon,
    spinBackgroundImage: spinBackgroundImage,
    arrowSpinImage: arrowSpinImage,
    elipceCenterSpinImage: elipceCenterSpinImage,
    clickSound: clickSound,
    finalSound: finalSound,
    arrowSpinImageElipce: arrowSpinImageElipce,
    starsOutlinedImage: starsOutlinedImage,
    x10ActiveIcon: x10ActiveIcon,
    closeIcon: closeIcon,
    starsOutlinedImageDisabled: starsOutlinedImageDisabled,
    autoActiveIcon: autoActiveIcon,
    x10SpinBackgroundImage: x10SpinBackgroundImage,
    infoIcon: infoIcon,
    friendsIconOutlined: friendsIconOutlined,
    starsMiniIcon: starsMiniIcon,
    jackPodIcon: jackPodIcon,
    notWalletIcon: notWalletIcon,
    tonIcon: tonIcon,
  };

  if (assetName in assets) {
    return assets[assetName];

  } else {
    throw new Error(`Ошибка! Изображение ${assetName} не найдено.`);
  }
}

export default mediaManager;
