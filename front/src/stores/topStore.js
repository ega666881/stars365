import { action, makeAutoObservable, set } from 'mobx';
import OnePage from '../pages/introduction/onePage';
import TwoPage from '../pages/introduction/twoPage';
import { createTransactionReq, getAllCurrencyReq, getBetsValuesReq, getTopUsersReq } from '../utils/requests/users';
import clientStore from './clientStore';

class TopStore {
    tops = null
    selectedTop = "balanceTop"

    topTypes = {
        balanceTop: "balanceTop",
        candyTop: "candyTop",
    }

    constructor() {
        makeAutoObservable(this);
    }

    setSelectedTop = action(async (newValue) => {
        this.selectedTop = newValue
    })

    getTopUsers = action(async () => {
        const response = await getTopUsersReq()
        switch(response.status) {
            case 200: {
                const data = await response.data;
                this.tops = data
            }
        }
    })


}

const topStore = new TopStore();

export default topStore;
