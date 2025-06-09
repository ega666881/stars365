import { Injectable, OnModuleInit, OnModuleDestroy, Inject } from '@nestjs/common';
import { CronJob } from 'cron';
import * as moment from 'moment-timezone';
import { KNEX_INSTANCE, tableNames } from '../database/database.constants';
import { Knex } from 'knex';
import { ISettings, IUser } from 'src/users/users.interface';
import axios from 'axios';


@Injectable()
export class DailyTaskService implements OnModuleInit, OnModuleDestroy {
  private job: CronJob;

  constructor(@Inject(KNEX_INSTANCE) private readonly knex: Knex) {
    //'0 0 12 * * *',
    this.job = new CronJob(
      '0 0 12 * * *',
      () => {
        console.log('Запуск ежедневной задачи в', moment().tz('Europe/Moscow').format('YYYY-MM-DD HH:mm:ss'));
        this.performAction();
      },
      null,
      true,
      'Europe/Moscow'
    );
  }

  onModuleInit() {
    this.job.start();
  }

  onModuleDestroy() {
    this.job.stop();
  }

  private async performAction() {
    const users = await this.knex<IUser>(tableNames.users).select('*').where({subscripted: true})
    const winUser = users[Math.floor(Math.random() * users.length)]
    axios.get(`${process.env.BOT_URL}/send-lottery-message`, {
        params: {
            username: winUser.username,
            amount: users.length,
        }
    })
    await this.knex<IUser>(tableNames.users)
        .update({winStarsBalance: this.knex.raw(`"winStarsBalance" + ${users.length}`)})
        .where({id: winUser.id})
    
    await this.knex(tableNames.winsHistory).delete()

    const currentDate = new Date()
    currentDate.setTime(currentDate.getTime() + (24 * 60 * 60 * 1000))
    await this.knex<ISettings>(tableNames.settings)
        .update({
            lotteryDate: currentDate
        })
  }
}