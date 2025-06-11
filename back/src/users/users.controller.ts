import { Controller, Post, Body, UseGuards, Get, Query, Param, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';
import { BetCandyDto, BetDto, BuySubscriptionDto, CheckTaskDto, CreateInvoiceDto, CreateUserDto, GetUsersQuery, TakeReferalRewardDto, UpdateUserAvatarDto, WinUserStarsDto } from './users.dto';
import { TelegramAuthGuard } from 'src/middleware/telegram.middleware';


@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) {}

    @ApiTags('users')
    @Get('get-users')
    @UseGuards(TelegramAuthGuard)
    async getUsers(@Query() dto: GetUsersQuery) {
        return this.userService.getUsers(dto)
    }

    @ApiTags('users')
    @Post('create-user')
    async createUser(@Body() dto: CreateUserDto) {
        return this.userService.createUser(dto)
    }

    @ApiTags('users')
    @Post('buy-subscription')
    async buySubscription(@Body() dto: BuySubscriptionDto) {
        return this.userService.buySubscriptionUser(dto)
    }

    @UseGuards(TelegramAuthGuard)
    @ApiTags('users')
    @Post('take-day-reward')
    async takeDayReward(@Body() dto: CreateInvoiceDto) {
        return this.userService.takeDayReward(dto)
    }

    @ApiTags('users')
    @Post('bet')
    @UseGuards(TelegramAuthGuard)
    async bet(@Body() dto: BetDto) {
        return this.userService.makeBet(dto)
    }

    @ApiTags('users')
    @Get('get-task-user/:id')
    //@UseGuards(TelegramAuthGuard)
    async getTaskUser(@Param('id') userId: number) {
        return this.userService.getTasksUsers(userId)
    }

    @ApiTags('users')
    @Get('get-room-user/:id')
    //@UseGuards(TelegramAuthGuard)
    async getRoomUser(@Param('id') userId: number) {
        return this.userService.getRoomUser(userId)
    }

    @ApiTags('users')
    @Post('bet-candy')
    //@UseGuards(TelegramAuthGuard)
    async betCandy(@Body() dto: BetCandyDto) {
        return this.userService.betCandy(dto)
    }

    @ApiTags('users')
    @Post('check-task-user')
    //@UseGuards(TelegramAuthGuard)
    async checkTaskUser(@Body() dto: CheckTaskDto) {
        return this.userService.checkTaskUser(dto)
    }

    @ApiTags('users')
    @Post('take-referal-reward')
    async takeReferalReward(@Body() dto: TakeReferalRewardDto) {
        return this.userService.takeReferalReward(dto)
    }

    @ApiTags('users')
    @Get('get-bets-values')
    async getBetsValues() {
        return this.userService.getBetsValues()
    }

    @ApiTags('users')
    @Put('update-user-avatar')
    @UseGuards(TelegramAuthGuard)
    async updateUserAvatar(@Body() dto: UpdateUserAvatarDto) {
        return this.userService.updateAvatarUser(dto)
    } 


    @ApiTags('users')
    @Get('get-every-day-reward')
    @UseGuards(TelegramAuthGuard)
    async getEveryDayReward() {
        return this.userService.getEveryDayReward()
    }

    @ApiTags('users')
    @Get('get-settings')
    @UseGuards(TelegramAuthGuard)
    async getSettings() {
        return this.userService.getSettings()
    }

    @ApiTags('users')
    @Post('/create-invoice')
    @UseGuards(TelegramAuthGuard)
    async createInvoice(@Body() dto: CreateInvoiceDto) {
        return this.userService.createInvoice(dto)
    }

}
