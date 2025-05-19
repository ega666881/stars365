import { Controller, Post, Body, UseGuards, Get, Query, Param, Put } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';
import { BetDto, BuySubscriptionDto, CreateInvoiceDto, CreateUserDto, GetUsersQuery, TakeReferalRewardDto, UpdateUserAvatarDto, WinUserStarsDto } from './users.dto';


@Controller('users')
export class UsersController {
    constructor(private readonly userService: UsersService) {}

    @ApiTags('users')
    @Get('get-users')
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

    @ApiTags('users')
    @Post('take-day-reward')
    async takeDayReward(@Body() dto: CreateInvoiceDto) {
        return this.userService.takeDayReward(dto)
    }

    @ApiTags('users')
    @Post('bet')
    async bet(@Body() dto: BetDto) {
        return this.userService.makeBet(dto)
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
    async updateUserAvatar(@Body() dto: UpdateUserAvatarDto) {
        return this.userService.updateAvatarUser(dto)
    } 


    @ApiTags('users')
    @Get('get-every-day-reward')
    async getEveryDayReward() {
        return this.userService.getEveryDayReward()
    }

    @ApiTags('users')
    @Get('get-settings')
    async getSettings() {
        return this.userService.getSettings()
    }

    @ApiTags('users')
    @Post('/create-invoice')
    async createInvoice(@Body() dto: CreateInvoiceDto) {
        return this.userService.createInvoice(dto)
    }

    @ApiTags('users')
    @Post('win-user-stars')
    async winUserStars(@Body() dto: WinUserStarsDto) {
        return this.userService.winUserLotteryStars(dto)
    }
}
