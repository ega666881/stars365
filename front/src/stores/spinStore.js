import { action, makeAutoObservable, set } from 'mobx';
import OnePage from '../pages/introduction/onePage';
import TwoPage from '../pages/introduction/twoPage';
import { getBetsValuesReq, makeBetReq } from '../utils/requests/users';
import clientStore from './clientStore';
import changeBetModalStore from './changeBetModalStore';

class SpinStore {
    winSegments = {
        x1: 10,
        x10: 12,
        x3: 4,
        x2: 8
    }

    autoSpin = false
    looseSegments = [9, 7, 5, 3, 1, 11]
    isSpinning = false
    targetSegment = 0
    currentGame = {}

    constructor() {
        makeAutoObservable(this);
    }

    setTargetSegment = action((newValue) => {
        this.targetSegment = newValue
    })

    setIsSpinning = action((newValue) => {
        this.isSpinning = newValue
    })

    setAutoSpin = action(async (newValue) => {
        this.autoSpin = newValue
        console.log(this.autoSpin)
    })

    setWin = action(async (newValue) => {
        this.win = newValue
    })

    resetCurrentGame = action(async () => {
        this.currentGame = {}
    })

    makeBet = action(async () => {
        const response = await makeBetReq(clientStore.user.id, changeBetModalStore.bet.id)
        switch(response.status) {
            case 201: {
                const data = await response.data;
                console.log(data)
                if (data.win) {
                    if (data.reward === 'jackpod') {
                        this.targetSegment = this.looseSegments[Math.floor(Math.random() * this.looseSegments.length)]

                    } else {
                        this.targetSegment = this.winSegments[data.reward]
                    }
                    clientStore.setUser(data.user)
                    this.currentGame = {
                        betValue: changeBetModalStore.bet.value,
                        coinCount: data.winCount,
                        win: true,
                        jackpod: data.reward === 'jackpod'
                    }

                } else {
                    this.targetSegment = this.looseSegments[Math.floor(Math.random() * this.looseSegments.length)]
                    this.win = false
                    clientStore.setUser(data.user)
                    this.currentGame = {
                        betValue: changeBetModalStore.bet.value,
                        coinCount: data.winCount,
                        win: false,
                        jackpod: data.reward === 'jackpod'
                    }
                }
                break
            }
            default: {
                
            }
        }
    })
    

}

const spinStore = new SpinStore();

export default spinStore;
