import { action, makeAutoObservable, set } from 'mobx';
import { checkTaskUserReq, createInvoiceReq, getEveryDayRewardReq, getSettingsReq, getTasksReq, getUsersReq, takeDayRewardReq, takeReferalRewardReq, updateUserAvatarReq } from '../utils/requests/users';
import changeBetModalStore from './changeBetModalStore';
import socketStore from './socketStore';


class ClientStore {
    user = null
    settings = null
    everyDayReward = 0
    activeUsersCount = 0
    tasks = []
    winUserBar = null
    winsUsersHistoryOpen = false

    winsUsers = []

    constructor() {
        makeAutoObservable(this);
    }

    setWinsUsersHistoryOpen = action((newValue) => {
        this.winsUsersHistoryOpen = newValue
    })

    setWinUserBar = action((newValue) => {
        this.winUserBar = newValue
    })

    setSettings = action((newValue) => {
        this.settings = newValue
    })

    setActiveUsersCount = action((newValue) => {
        this.activeUsersCount = newValue
    })

    setWinsUsers = action((newValue) => {
        this.winsUsers = newValue
    })

    takeReferalReward = action(async () => {
        const response = await takeReferalRewardReq(this.user.id)
        switch(response.status) {
            case 201: {
                const data = await response.data;
                this.user.candy = data.newCandyBalance
            }
        }
    })
    updateUserBalance = action(async (method, amount) => {
        if (method === 1) {
            console.log('+')
            this.user.balance = Number(this.user.balance) + Number(amount)

        } else if (method === 2) {
            console.log('-')
            console.log(Number(this.user.balance) + Number(amount))
            this.user.balance = Number(this.user.balance) - Number(amount)
        }
    })

    updateUserCandy = action(async (method, amount) => {
        if (method === 1) {
            this.user.candy = Number(this.user.candy) + Number(amount)
        } else if (method === 2) {
            this.user.candy = Number(this.user.candy) - Number(amount)
        }
    })

    getSettings = action(async () => {
        const response = await getSettingsReq()
        switch(response.status) {
        case 200: {
            const data = await response.data;
            this.settings = data
        }
        }
    })

    getEveryDayReward = action(async () => {
        const response = await getEveryDayRewardReq()
        switch(response.status) {
            case 200: {
                const data = await response.data;
                this.everyDayReward = data
            }
        }
    })

    checkTask = action(async (taskId) => {
        const response = await checkTaskUserReq(this.user.id, taskId)
        switch(response.status) {
            case 201: {
                const data = await response.data;
                await this.getTasks()
            }
        }
    })


    getTasks = action(async () => {
        const response = await getTasksReq(this.user.id)
        switch(response.status) {
            case 200: {
                const data = await response.data;
                this.tasks = data
            }
        }
    })

    getUser = action(async (tgId) => {
        const response = await getUsersReq({tgId: tgId})
        console.log(response)
        switch(response.status) {
        case 200: {
            const data = await response.data;
            await changeBetModalStore.getBetsValues()
            await this.getSettings()
            await this.getEveryDayReward()
            console.log(data)
            this.user = data;
            await updateUserAvatarReq(this.user.id, Telegram.WebApp?.initDataUnsafe?.user?.photo_url, Telegram.WebApp?.initDataUnsafe?.user?.username)
            await this.getTasks()
        }
        }
    })


    setUser = action(async (user) => {
        this.user = user
    })

    createInvoice = action(async (navigate) => {
        const response = await createInvoiceReq(this.user.id)
        switch(response.status) {
        case 201: {
            const data = await response.data;
            Telegram.WebApp.openInvoice(data.link, (status) => {
                if (status === 'paid') {
                    this.getUser(this.user.telegram_id)
                    navigate('/')
                }
            })
        }
        }
    })

    takeDayReward = action(async (setTakeReward) => {
        const response = await takeDayRewardReq(this.user.id)
        switch(response.status) {
            case 201: {
                const data = await response.data;
                this.user = data
                setTakeReward(false)
            }
        }
    })

}

const clientStore = new ClientStore();

export default clientStore;
