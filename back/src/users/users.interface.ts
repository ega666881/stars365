import { Knex } from "knex"


export interface IUser {
    id?: number
    first_name?: string
    telegram_id?: number
    last_name?: string
    username?: string
    photo_url?: string
    createdAt?: Date
    lastActive?: Date
    subscripted?: boolean
    subscriptionEndDate?: Date
    candy?: number | any
    nextTakeDayReward?: Date
    dayRewardCount?: number
    balance?: number | any
    winStarsBalance?: number | any
    isActive?: boolean | any
    socketId?: number | any
}

export interface IFullUser extends IUser {
    referalUser: IUser
    referals: IUser[] | any
}

export interface ITask {
    id?: number
    title?: string
    description?: string
    type?: string
    countToReward?: number
    channel_url?: string
    reward?: number
}

export interface ITaskUser {
    id?: number
    userId?: number
    taskId?: number
}

export interface IBetPull {
    id?: number
    betValue?: number
    x10?: number | any
    x3?: number | any
    x1?: number | any
}


export interface IWinsHistory {
    id?: number
    username?: string
    value?: string
    time?: string
    photo_url?: string
}

export interface ISettings {
    id?: number
    starsPullLottery?: number | any
    tonPullRoulette?: number
    lotteryDate?: Date | any
    jackpod?: number | any
    spinCountJackpod?: number | any
    spinCountPresent?: number | any
}

export interface IRoom {
    id?: number
    created_at?: Date
    is_active?: boolean
    betValue?: number
}
