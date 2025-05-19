import { Injectable } from "@nestjs/common";
import { ValidationArguments, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import knex, { Knex } from 'knex';
import knexfile from "db/knexfile";


@ValidatorConstraint({ name: 'EntityExists', async: true })
@Injectable()
export class EntityExistsByIdRule implements ValidatorConstraintInterface {
    knex: Knex
    constructor() {
        this.knex = knex(knexfile.development)
    }

    async validate(value: number, args: ValidationArguments) {
        const [tableName] = args.constraints
        const entity = await this.knex(tableName).select("*").where({id: value}).first()
        if (entity) {
            return true
            
        } else {
            return false
        }

        
    }

    defaultMessage(args: ValidationArguments) {
        return `Сущности не существует.`;
    }
}
