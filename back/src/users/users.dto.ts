import { IsString, IsNotEmpty, IsOptional, Validate } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EntityExistsByIdRule } from 'src/validators/entityExistsById';
import { tableNames } from 'src/database/database.constants';
import { EntityAlredyRule } from 'src/validators/entityAlreadyById';
import { EntityExistsByTgIdRule } from 'src/validators/entityExistsByTgId';


export class GetUsersQuery {
    @IsOptional()
    @ApiProperty({required: false})
    readonly subscripted: boolean;
    @ApiProperty({required: false})
    @IsOptional()
    @Validate(EntityExistsByIdRule, [tableNames.users, "telegram_id"])
    readonly userId: number
    @ApiProperty({required: false})
    @IsOptional()
    readonly tgId: number
}

export class CreateInvoiceDto {
    @ApiProperty()
    @IsNotEmpty()
    @Validate(EntityExistsByIdRule, [tableNames.users, "telegram_id"])
    readonly id: number
}

export class TakeReferalRewardDto {
    @ApiProperty()
    @IsNotEmpty()
    @Validate(EntityExistsByIdRule, [tableNames.users, "telegram_id"])
    readonly id: number
}

export class UpdateUserAvatarDto {
    @ApiProperty()
    @IsNotEmpty()
    @Validate(EntityExistsByIdRule, [tableNames.users, "telegram_id"])
    readonly id: number
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    readonly photo_url: string
}


export class BetDto {
    @ApiProperty()
    @IsNotEmpty()
    @Validate(EntityExistsByIdRule, [tableNames.users])
    readonly userId: number
    @ApiProperty()
    @IsNotEmpty()
    @Validate(EntityExistsByIdRule, [tableNames.betsPulls])
    readonly betId: number
}

export class CheckTaskDto {
    @ApiProperty()
    @IsNotEmpty()
    @Validate(EntityExistsByIdRule, [tableNames.users])
    readonly userId: number
    @ApiProperty()
    @IsNotEmpty()
    @Validate(EntityExistsByIdRule, [tableNames.tasks])
    readonly taskId: number
}


export class BuySubscriptionDto {
    @ApiProperty()
    @IsNotEmpty()
    @Validate(EntityExistsByTgIdRule, [tableNames.users, "telegram_id"])
    readonly telegram_id: number
}


export class WinUserStarsDto {
    @ApiProperty()
    @IsNotEmpty()
    @Validate(EntityExistsByIdRule, [tableNames.users, "telegram_id"])
    readonly id: number
}

export class CreateUserDto {
    @ApiProperty()
    @IsNotEmpty()
    @Validate(EntityAlredyRule, [tableNames.users, "telegram_id"])
    readonly telegram_id: number
    @ApiProperty()
    @IsNotEmpty()
    readonly first_name: string
    @ApiProperty()
    @IsOptional()
    readonly last_name: string
    @ApiProperty()
    @IsNotEmpty()
    readonly username: string
    @ApiProperty()
    readonly photo_url: string
    @ApiProperty()
    @IsOptional()
    referalId: number
}

