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

export interface IBetPull {
    id?: number
    betValue?: number
    x10?: number | any
    x3?: number | any
    x1?: number | any
}

export interface ISettings {
    id?: number
    starsPullLottery?: number | any
    tonPullRoulette?: number
    lotteryDate?: Date | any
}