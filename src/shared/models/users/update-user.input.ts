import {
    IsDate,
    IsEmail,
    IsEnum,
    IsOptional,
    IsString,
    Length,
    MaxLength,
} from 'class-validator';
import {ServiceBranch} from "./service-branch";
import {ServiceStatus} from "./service-status";

export class UpdateUserInput {
    @IsOptional()
    @MaxLength(100)
    @IsString()
    firstName?: string;

    @IsOptional()
    @MaxLength(100)
    @IsString()
    lastName?: string;

    @IsOptional()
    @Length(6, 100)
    @IsString()
    password?: string;

    @IsOptional()
    @IsEmail()
    @MaxLength(100)
    email?: string;

    @IsOptional()
    @IsDate()
    serviceEntryDate?: Date;

    @IsOptional()
    @IsDate()
    serviceExitDate?: Date;

    @IsOptional()
    @IsEnum(ServiceBranch)
    branch?: ServiceBranch;

    @IsOptional()
    @IsEnum(ServiceStatus)
    serviceStatus?: ServiceStatus;

    static fromPartial(partial: Partial<UpdateUserInput>): UpdateUserInput {
        const input = new UpdateUserInput();
        Object.assign(input, partial);
        return input;
    }
}
