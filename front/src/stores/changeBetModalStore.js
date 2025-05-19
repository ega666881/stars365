import { action, makeAutoObservable, set } from 'mobx';
import OnePage from '../pages/introduction/onePage';
import TwoPage from '../pages/introduction/twoPage';
import { getBetsValuesReq } from '../utils/requests/users';

class ChangeBetModalStore {
    duration = 1
    isOpenModal = false
    bet = {}

    betOptions = []

    setOpenModal = action((newValue) => {
        this.isOpenModal = newValue
        console.log(this.isOpenModal)
    })
    
    setBetValue = action((newValue) => {
        this.bet = newValue
    })

    constructor() {
        makeAutoObservable(this);
    }

    getBetsValues = action(async () => {
        const response = await getBetsValuesReq()
        switch(response.status) {
        case 200: {
            const data = await response.data;
            this.betOptions = data;
            this.bet = this.betOptions[0]
            console.log(this.betOptions)
        }
        }
    })
    

}

const changeBetModalStore = new ChangeBetModalStore();

export default changeBetModalStore;
