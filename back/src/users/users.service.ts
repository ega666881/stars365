import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { KNEX_INSTANCE, tableNames } from '../database/database.constants';
import { Inject } from '@nestjs/common';
import { Knex } from 'knex';
import { UsersRepository } from './users.repository';
import { BetDto, BuySubscriptionDto, CreateInvoiceDto, CreateUserDto, GetUsersQuery, TakeReferalRewardDto, UpdateUserAvatarDto, WinUserStarsDto } from './users.dto';
import * as dotenv from 'dotenv-ts';
import { IBetPull, IFullUser, IUser } from './users.interface';
import axios from 'axios'
dotenv.config();


@Injectable()
export class UsersService {
    constructor(
            @Inject(KNEX_INSTANCE) private readonly knex: Knex,
            private readonly usersRepository: UsersRepository
        ) {}

    async getUsers(dto: GetUsersQuery) {
        return this.usersRepository.getUsers(dto.subscripted, dto.userId, dto.tgId)
    }

    async takeReferalReward(dto: TakeReferalRewardDto) {
        const user = await this.usersRepository.getUsers(undefined, dto.id) as IFullUser
        let rewardCount = 0 
        for (let referal of user.referals) {
            rewardCount += referal.reward
        }
        const updatedUser = await this.usersRepository.updateUser({candy: this.knex.raw(`candy + ${rewardCount}`)}, dto.id)
        await this.knex(tableNames.referals).update({reward: 0}).where({userId: user.id})
        return {newCandyBalance: updatedUser.candy}
    }

    async createInvoice(dto: CreateInvoiceDto) {
        const user = await this.usersRepository.getUsers(undefined, dto.id) as IUser
        const response = await axios.get(`${process.env.BOT_URL}/get-invoice`, {
            params: {
                telegram_id: user.telegram_id,
                amount: 365,
            }
        })
        
        const data = await response.data
        return {link: data.link}
    }
    
    async makeBet(dto: BetDto) {
        const betPull = await this.usersRepository.getBetsPulls(dto.betId) as IBetPull
        const user = await this.usersRepository.getUsers(undefined, dto.userId) as IFullUser
        if (user.balance < betPull.betValue) {
            throw new HttpException("У пользователя недостаточно баланса", HttpStatus.CONFLICT)

        } else {
            const winRewards = []
            if (betPull.betValue * 10 <= betPull.x10) {
                winRewards.push("x10")
                
            } else if (betPull.betValue * 3 <= betPull.x3) {
                winRewards.push("x3")

            } else if (betPull.betValue <= betPull.x1) {
                winRewards.push("x1")
            }

            if (winRewards.length > 0) {
                const reward = winRewards[Math.floor(Math.random() * winRewards.length)]
                let winCount = 0
                switch (reward) {
                    case "x10": {
                        winCount = betPull.betValue * 10
                        break
                    }

                    case "x3": {
                        winCount = betPull.betValue * 3
                        break
                    }
                    
                    case "x1": {
                        winCount = betPull.betValue
                        break
                    }
                }
                const updatedData = {}
                updatedData[reward] = this.knex.raw(`${reward} - ${winCount}`)
                await this.usersRepository.betValueUpdate(updatedData, betPull.id)
                await this.usersRepository.updateUser({balance: this.knex.raw(`balance + ${winCount}`)}, dto.userId)
                if (user.referalUser) {
                    await this.knex(tableNames.referals).update({reward: this.knex.raw(`reward + ${winCount / 100 * 1}`)}).where({referalId: user.id})

                }
                return {win: true, winCount: winCount, reward: reward}

            } else {
                await this.usersRepository.updateUser({
                    balance: this.knex.raw(`balance - ${betPull.betValue}`),
                    candy: this.knex.raw(`candy + ${betPull.betValue}`)
                }, dto.userId)
                const x10Pull = betPull.betValue / 2
                const x3Pull = (betPull.betValue * 20) / 100
                const x1Pull = (betPull.betValue * 10) / 100
                await this.usersRepository.betValueUpdate({
                        x10: this.knex.raw(`x10 + ${x10Pull}`),
                        x3: this.knex.raw(`x3 + ${x3Pull}`),
                        x1: this.knex.raw(`x1 + ${x1Pull}`),
                    }, betPull.id
                )
                return {win: false, winCount: 0}
            }
        }
        
        
    }

    async buySubscriptionUser(dto: BuySubscriptionDto) {
        const today = new Date();
        const nextYear = new Date(today);
        nextYear.setFullYear(today.getFullYear() + 1);
        await this.usersRepository.updateUser({subscripted: true, subscriptionEndDate: nextYear}, undefined, dto.telegram_id)
    }

    async getBetsValues() {
        return this.usersRepository.getBetsValue()
    }

    async takeDayReward(dto: CreateInvoiceDto) {
        const user = await this.usersRepository.getUsers(undefined, dto.id) as IUser
        const currentDate = new Date()
        if (new Date(user.nextTakeDayReward) < currentDate) {
            const nextTakeRewardDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000)
            let newDayCount = user.dayRewardCount + 1
            if (newDayCount > 6) {
                newDayCount = 0
            }
            const updatedUser = await this.usersRepository.updateUser(
                {
                    candy: this.knex.raw(`candy + 100`), 
                    nextTakeDayReward: nextTakeRewardDate, 
                    dayRewardCount: newDayCount
                }, 
                user.id
            )

            return updatedUser
        } else {
            throw new HttpException("Награда не выдана", HttpStatus.CONFLICT)
        }
    }

    async createUser(dto: CreateUserDto) {
        console.log(dto)
        if (dto.referalId) {
            const referalId = dto.referalId
            delete dto.referalId
            const newUser = await this.usersRepository.createUser(dto)
            console.log(referalId)
            await this.usersRepository.addReferalToUser(referalId, newUser.id)
            return newUser

        } else {
            const newUser = await this.usersRepository.createUser(dto)
            const emilGc = await this.usersRepository.getUsers(undefined, undefined, undefined, "EmilGC") as IFullUser
            if (emilGc) {
                await this.usersRepository.addReferalToUser(emilGc.id, newUser.id)
            }
            return newUser
        }
        
    }

    async updateAvatarUser(dto: UpdateUserAvatarDto) {
        await this.usersRepository.updateUser({photo_url: dto.photo_url}, dto.id)
        return true
    }

    async getSettings() {
        return this.usersRepository.getSettings()
    }

    async getEveryDayReward() {
        const rewardRow = await this.usersRepository.getEveryDayReward()
        //@ts-ignore
        return rewardRow.total
    }

    async winUserLotteryStars(dto: WinUserStarsDto) {
        const settings = await this.usersRepository.getSettings()
        console.log(dto.id)
        if (settings.starsPullLottery > 0) {
            const subscriptedUsers = await this.usersRepository.getUsers(true) as IUser[]
            const winStarsCount = subscriptedUsers.length
            await this.usersRepository.updateUser({ winStarsBalance: this.knex.raw(`"winStarsBalance" + ${winStarsCount}`)}, dto.id,)
            await this.usersRepository.updateSettings({starsPullLottery: this.knex.raw(`"starsPullLottery" - ${winStarsCount}`)})
            return {winStars: winStarsCount}

        } else {
            throw new HttpException('Нету звезд для розыгрыша', HttpStatus.CONFLICT)
        }
    }
}
