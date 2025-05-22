import { action, makeAutoObservable, set } from 'mobx';
import OnePage from '../pages/introduction/onePage';
import TwoPage from '../pages/introduction/twoPage';
import { getBetsValuesReq, makeBetReq } from '../utils/requests/users';
import clientStore from './clientStore';
import changeBetModalStore from './changeBetModalStore';

class X10SpinStore {


    x10 = false
    currentGame = {}

    constructor() {
        makeAutoObservable(this);
    }

    setX10 = action(async (newValue) => {
        this.x10 = newValue
        console.log(this.x10)
    })


    

}

const x10SpinStore = new X10SpinStore();

export default x10SpinStore;
