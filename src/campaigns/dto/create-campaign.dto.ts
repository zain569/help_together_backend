import { isBoolean, IsBoolean, IsNotEmpty, isNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min } from "class-validator";
import { Type } from "class-transformer";

export class CreateCampaignDto {
    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsNumber()
    @Min(1)
    @Type(() => Number)
    goalAmount: number;

    @IsString()
    @IsOptional()
    imageUrl: string;

    @IsNotEmpty()
    @IsBoolean()
    zakatEligible: boolean;

    @IsNotEmpty()
    @IsBoolean()
    urgent: boolean;

    @IsUUID()
    causeId: string;
}
