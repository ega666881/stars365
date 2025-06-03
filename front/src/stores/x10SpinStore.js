import { action, makeAutoObservable, set } from 'mobx';
import OnePage from '../pages/introduction/onePage';
import TwoPage from '../pages/introduction/twoPage';
import { getBetsValuesReq, makeBetReq } from '../utils/requests/users';
import clientStore from './clientStore';
import changeBetModalStore from './changeBetModalStore';

class X10SpinStore {


    x10 = false
    currentGame = {}

    fixedPositions = [
        { x: 310, y: 150 },
        { x: 293.18, y: 186.60 },
        { x: 272.79, y: 233.83 },
        { x: 242.71, y: 272.79 },
        { x: 200, y: 293.18 },
        { x: 150, y: 300 },
        { x: 97.29, y: 293.18 },
        { x: 57.29, y: 272.79 },
        { x: 27.29, y: 233.83 },
        { x: 16.82, y: 186.60 }
      ];
    

    constructor() {
        makeAutoObservable(this);
    }

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

    setX10 = action(async (newValue) => {
        this.x10 = newValue
        console.log(this.x10)
    })


    

}

const x10SpinStore = new X10SpinStore();

export default x10SpinStore;
