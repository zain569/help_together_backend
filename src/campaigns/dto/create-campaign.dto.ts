import { IsBoolean, IsNotEmpty, isNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Min } from "class-validator";
import { Transform, Type } from "class-transformer";

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

    @Transform(({ value }) => value === true || value === 'true')
    @IsBoolean()
    zakatEligible: boolean;

    @Transform(({ value }) => value === true || value === 'true')
    @IsBoolean()
    urgent: boolean;

    @IsUUID()
    causeId: string;
}
