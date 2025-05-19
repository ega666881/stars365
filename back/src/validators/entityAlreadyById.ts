import { Injectable } from "@nestjs/common";
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import knex, { Knex } from 'knex';
import knexfile from "db/knexfile";


@ValidatorConstraint({ name: 'EntityAlredy', async: true })
@Injectable()
export class EntityAlredyRule implements ValidatorConstraintInterface {
    knex: Knex
    constructor() {
        this.knex = knex(knexfile.development)
    }

    async validate(value: number, args: ValidationArguments) {
        const [tableName, columnName] = args.constraints
        const entity = await this.knex(tableName).select("*").where({telegram_id: value}).first()
        if (entity) {
            return false
            
        } else {
            return true
        }

        
    }

    defaultMessage(args: ValidationArguments) {
        return `Сущность уже существует.`;
    }
}
