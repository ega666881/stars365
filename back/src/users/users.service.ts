import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { KNEX_INSTANCE, tableNames } from '../database/database.constants';
import { Inject } from '@nestjs/common';
import { Knex } from 'knex';
import { UsersRepository } from './users.repository';
import { BetCandyDto, BetDto, BuySubscriptionDto, CheckTaskDto, CreateInvoiceDto, CreateUserDto, GetUsersQuery, TakeReferalRewardDto, UpdateUserAvatarDto, WinUserStarsDto, CreateTransactionDto, AddWalletUserDto } from './users.dto';
import * as dotenv from 'dotenv-ts';
import { IBetPull, IFullUser, ITask, ITaskUser, ITransaction, IUser } from './users.interface';
import axios from 'axios'
import { SocketGateway } from 'src/socket/socket.gateway';
import { beginCell } from '@ton/ton'
dotenv.config();


@Injectable()
export class UsersService {
    private readonly COINGECKO_API = 'https://api.coingecko.com/api/v3'; 
    private readonly EXCHANGERATE_API = 'https://v6.exchangerate-api.com/v6/7c48ad6acbdbb714db67fe30/latest/USD'; 
    constructor(
            @Inject(KNEX_INSTANCE) private readonly knex: Knex,
            private readonly usersRepository: UsersRepository,
            private readonly socketGateway: SocketGateway
        ) {}

    private async getWinCountReward(reward: string, betValue: number, jackpod?: number) {
        let winCount = 0
        switch (reward) {
            case "x10": {
                winCount = betValue * 10
                break
            }

            case "x3": {
                winCount = betValue * 3
                break
            }
            
            case "x1": {
                winCount = 0
                break
            }
            case "jackpod": {
                winCount = jackpod
                break
            }
        }
        return winCount
    }

    async getTonToUsd(): Promise<number> {
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price',  {
        params: {
            ids: 'the-open-network',
            vs_currencies: 'usd'
        }
        });
        const tonUsd = response.data['the-open-network'].usd;
        return tonUsd
      }
    
      async getStarsToRub(): Promise<number> {
        const starsToUsd = 0.005;
    

        const usdToRub = await this.getUsdToRub();
    
        return starsToUsd * usdToRub;
      }
    
      async getUsdToRub(): Promise<any> {
        const res = await axios.get(this.EXCHANGERATE_API);
        console.log(res.data.conversion_rates.RUB)
        return res.data.conversion_rates.RUB;
      }

    async createPayloadTrans(dto: CreateTransactionDto): Promise<object> {
        const transaction = await this.usersRepository.createTransaction(dto.userId, dto.amount)
        const body = beginCell()
          .storeUint(0, 32)
          .storeStringTail(transaction.id.toString())
          .endCell()
    
        return {"payload": body.toBoc().toString("base64")}
    }

    async addWalletUser(dto: AddWalletUserDto) { 
        await this.usersRepository.updateUser({wallet: dto.wallet}, dto.userId)
        return this.usersRepository.getUsers(undefined, dto.userId)
    }

    async getTopUsers() {
        return this.usersRepository.getTopUsers()
    }

    async getUsers(dto: GetUsersQuery) {
        let user = await this.usersRepository.getUsers(dto.subscripted, dto.userId, dto.tgId) as IFullUser
        //console.log(user)
        const transactions = await this.usersRepository.getTransactions(user.id)
        if (transactions.length > 0) {
            console.log("sdfsf")
            const response = await fetch(`https://toncenter.com/api/v2/getTransactions?address=${user.wallet}&limit=20&to_lt=0&archival=true`)
            const tonTransactions = await response.json()
            tonTransactions.result.map((transaction) => {
                transaction.out_msgs.map( async (msg) => {
                    try {
                        const trx = await this.usersRepository.getTransactionById(Number(msg.message)) as ITransaction
                        if (trx) {
                            await this.usersRepository.setTransactionInactive(trx.id)
                            await this.usersRepository.updateUser({
                                balance: this.knex.raw(`balance + ${trx.amount}`)
                            }, trx.userId)
                            user = await this.usersRepository.getUsers(dto.subscripted, dto.userId) as IFullUser
                            await this.knex(tableNames.transactions).delete().where({userId: user.id})
                            //@ts-ignore
                            //   const referal = await this.knex('referals').select('*').leftJoin('users', 'users.id', 'referals.userId').where({referalId: updatedUser.id}).first()
                            //   if (referal) {
                            //     if (referal.wallet.length > 0) {
                            //       const addProfit = trx.amount * 40 / 100
                            //       await this.usersRepository.updateReferalUser(referal.id, updatedUser.id, addProfit)
                            //       updatedUser['referalWallet'] = referal.wallet
                            //     }
                            //   }
                            return user
                        }
                    } catch (error) {
                        //console.log(error)
                        return user
                    }
                })
            })
            return user

        } else {
            return user
        }
    }

    async checkTaskUser(dto: CheckTaskDto) {
        const taskUser = await this.knex(tableNames.tasksUsers).select("*").where({userId: dto.userId, taskId: dto.taskId}).first()
        if (taskUser) {
            throw new HttpException("Пользователь уже выполнил это задание", HttpStatus.CONFLICT)

        } else {
            const user = await this.usersRepository.getUsers(undefined, dto.userId) as IFullUser
            const task = await this.usersRepository.getTasks(dto.taskId) as ITask
            switch(task.type) {
                case "invite_friends": {
                    const invitedFriends = await this.knex(tableNames.referals).count('* as total').where({userId: user.id}).first()
                    console.log(invitedFriends)
                    if (Number(invitedFriends.total) >= task.countToReward) {
                        await this.usersRepository.updateUser({candy: this.knex.raw(`candy + ${task.reward}`)}, user.id)
                        await this.usersRepository.addCompleteTaskUser(user.id, task.id)
                        return {success: true}

                    } else {
                        throw new HttpException("Не выполнены требования", HttpStatus.CONFLICT)
                    }
                    break
                }
            }
        }

    }

    async getRoomUser(userId: number) {
        return this.usersRepository.getRoomUser(userId)
    }

    async getTasksUsers(userId: number) {
        const tasks = await this.usersRepository.getTasks()
        const tasksUsers = await this.knex(tableNames.tasksUsers).select('*').where({userId: userId}) as ITaskUser[]
        const returnArray = []
        for (let task of tasks) {
            let complete = false
            const findTaskInUser = tasksUsers.find(taskUser => taskUser.taskId)
            if (findTaskInUser) {
                complete = true
            }

            returnArray.push({...task, complete: complete})
        }

        return returnArray
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
    
    async betCandy(dto: BetCandyDto) {
        const betCandyValue = 100
        let user = await this.usersRepository.getUsers(undefined, dto.userId) as IFullUser
        const win = Math.floor(Math.random() * 2)
        const rewards = [
            'x10',
            'x3',
            'x1'
        ]
        if (win >= 1) {
            const reward = rewards[Math.floor(Math.random() * rewards.length)]
            const winCount = await this.getWinCountReward(reward, betCandyValue)
            await this.usersRepository.updateUser({
                    candy: this.knex.raw(`candy + ${winCount}`)
                }, 
                dto.userId
            )
            user = await this.usersRepository.getUsers(undefined, user.id) as IFullUser
            return {win: true, winCount: winCount, reward: reward, user: user}

        } else {
            await this.usersRepository.updateUser({
                    candy: this.knex.raw(`candy + ${betCandyValue}`)
                }, 
                dto.userId
            )
            user = await this.usersRepository.getUsers(undefined, user.id) as IFullUser
            return {win: false, winCount: betCandyValue, user: user}
        }
    }

    async makeBet(dto: BetDto) {
        const betPull = await this.usersRepository.getBetsPulls(dto.betId) as IBetPull
        let user = await this.usersRepository.getUsers(undefined, dto.userId) as IFullUser
        if (user.balance < betPull.betValue) {
            throw new HttpException("У пользователя недостаточно баланса", HttpStatus.CONFLICT)

        } else {
            const settings = await this.usersRepository.getSettings()
            const winRewards = []
            if (betPull.betValue * 10 <= betPull.x10) {
                winRewards.push("x10")
                
            } else if (betPull.betValue * 3 <= betPull.x3) {
                winRewards.push("x3")

            } else if (betPull.betValue <= betPull.x1) {
                winRewards.push("x1")

            } else if (settings.spinCountJackpod >= process.env.SPIN_COUNT_JACKPOD) {
                winRewards.push("jackpod")
            }

            if (winRewards.length > 0) {
                const reward = winRewards[Math.floor(Math.random() * winRewards.length)]
                let winCount = await this.getWinCountReward(reward, betPull.betValue, settings.jackpod)
                const updatedData = {}
                if (reward === 'x1') {
                    updatedData[reward] = this.knex.raw(`${reward} - ${betPull.betValue}`)

                } else {
                    updatedData[reward] = this.knex.raw(`${reward} - ${winCount}`)
                }
                if (reward === 'jackpod') {
                    await this.usersRepository.updateSettings({jackpod: 0, spinCountJackpod: 0})

                } else {
                    await this.usersRepository.betValueUpdate(updatedData, betPull.id)
                }
                
                
                if (user.referalUser) {
                    await this.knex(tableNames.referals).update({reward: this.knex.raw(`reward + ${winCount / 100 * 1}`)}).where({referalId: user.id})

                }
                //@ts-ignore
                await this.usersRepository.updateUser({balance: this.knex.raw(`balance + ${winCount}`)}, dto.userId)
                user = await this.usersRepository.getUsers(undefined, user.id) as IFullUser
                const now = new Date();
                const hours = String(now.getHours()).padStart(2, '0');    
                const minutes = String(now.getMinutes()).padStart(2, '0'); 
                const seconds = String(now.getSeconds()).padStart(2, '0');
                if (reward !== "x1") {
                    this.socketGateway.server.emit('win-user', {
                        username: user.username,
                        photo_url: user.photo_url,
                        value: winCount,
                        type: "wheel",
                        time: `${hours}:${minutes}:${seconds}`
                    })
                    await this.usersRepository.addWinHistory({
                        username: user.username,
                        photo_url: user.photo_url,
                        value: String(winCount),
                        time: `${hours}:${minutes}:${seconds}`,
                    })
                }
                return {win: true, winCount: winCount, reward: reward, user: user}

            } else {
                await this.usersRepository.updateUser({
                    balance: this.knex.raw(`balance - ${betPull.betValue}`),
                    candy: this.knex.raw(`candy + ${betPull.betValue}`)
                }, dto.userId) as IUser
                user = await this.usersRepository.getUsers(undefined, user.id) as IFullUser
                const x10Pull = betPull.betValue / 2
                const x3Pull = (betPull.betValue * 20) / 100
                const x1Pull = (betPull.betValue * 10) / 100
                const jackpodPull = (betPull.betValue * 5) / 100
                await this.usersRepository.betValueUpdate({
                        x10: this.knex.raw(`x10 + ${x10Pull}`),
                        x3: this.knex.raw(`x3 + ${x3Pull}`),
                        x1: this.knex.raw(`x1 + ${x1Pull}`),
                    }, betPull.id
                )

                await this.usersRepository.updateSettings({
                    jackpod: this.knex.raw(`jackpod + ${jackpodPull}`), 
                    spinCountJackpod: this.knex.raw(`"spinCountJackpod" + 1`)
                })
                return {win: false, winCount: 0, user: user}
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
        await this.usersRepository.updateUser({photo_url: dto.photo_url, username: dto.username}, dto.id)
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
