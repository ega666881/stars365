import { action, makeAutoObservable, set } from 'mobx';
import OnePage from '../pages/introduction/onePage';
import TwoPage from '../pages/introduction/twoPage';
import { createTransactionReq, getAllCurrencyReq, getBetsValuesReq } from '../utils/requests/users';
import clientStore from './clientStore';

class CreateTransactionModalStore {
    isOpenModal = false
    payValue = 0
    currences = {}
    betOptions = []

    getAllCurrency = action(async () => {
        const response = await getAllCurrencyReq()
        switch(response.status) {
            case 200: {
                const data = await response.data;
                this.currences = data
            }
        }
    })

    createTransaction = action(async (amount) => {
        const response = await createTransactionReq(clientStore.user.id, amount)
        console.log(response.status)
        switch(response.status) {
            case 201: {
                return await response.data
            } 
        }
    })


    setOpenModal = action((newValue) => {
        this.isOpenModal = newValue
    })
    
    setPayValue = action((newValue) => {
        this.payValue = newValue
    })

    constructor() {
        makeAutoObservable(this);
    }



}

const createTransactionModalStore = new CreateTransactionModalStore();

export default createTransactionModalStore;
