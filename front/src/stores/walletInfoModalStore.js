import { action, makeAutoObservable, set } from 'mobx';
import OnePage from '../pages/introduction/onePage';
import TwoPage from '../pages/introduction/twoPage';
import { createTransactionReq, getAllCurrencyReq, getBetsValuesReq } from '../utils/requests/users';
import clientStore from './clientStore';

class WalletInfoModalStore {
    isOpenModal = false


    setOpenModal = action((newValue) => {
        this.isOpenModal = newValue
    })
    
    constructor() {
        makeAutoObservable(this);
    }



}

const walletInfoModalStore = new WalletInfoModalStore();

export default walletInfoModalStore;
