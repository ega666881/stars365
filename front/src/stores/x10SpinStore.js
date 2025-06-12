import { action, makeAutoObservable, set } from 'mobx';
import OnePage from '../pages/introduction/onePage';
import TwoPage from '../pages/introduction/twoPage';
import { getBetsValuesReq, getRoomUserReq, makeBetReq } from '../utils/requests/users';
import clientStore from './clientStore';
import changeBetModalStore from './changeBetModalStore';

class X10SpinStore {
    rotation = 0
    activeRoom = null
    x10 = false
    currentGame = {}
    gameStart = false
    targetSegment = null
    fixedPositions = [
        { x: 290, y: 162 },
        { x: 260, y: 230 },
        { x: 200, y: 285 },
        { x: 120, y: 285 },
        { x: 55, y: 230 },
        { x: 35, y: 162 },
        { x: 55, y: 85 },
        { x: 120, y: 35 },
        { x: 200, y: 35 },
        { x: 260, y: 85 },
    ];
    
    

    constructor() {
        makeAutoObservable(this);
    }

    setRotation = action((newValue) => {
        this.rotation = newValue
    })

    setGameStart = action((newValue) => {
        this.gameStart = newValue
    })

    getCoords = action(() => {
        let returnCoords = null
        this.playersCoords.map((coords, index) => {
            if (!coords.active) {
                console.log("fdsf")
                this.playersCoords[index].index = index
                return returnCoords = coords
            }
        })
        
        if (returnCoords) {
            this.playersCoords[returnCoords.index].active = true
        }
        return returnCoords
    })

    setTargetSegment = action((newValue) => {
        this.targetSegment = this.newValue
    })

    setX10 = action(async (newValue) => {
        this.x10 = newValue
        console.log(this.x10)
    })

    getRoomUser = action(async (setAvatars) => {
        const response = await getRoomUserReq(clientStore.user.id)
        switch(response.status) {
            case 200: {
                const data = await response.data;
                this.activeRoom = data
                console.log(data)
                if (data) {
                    setAvatars(data.players)
                }
            }
        }
    })

    

}

const x10SpinStore = new X10SpinStore();

export default x10SpinStore;
