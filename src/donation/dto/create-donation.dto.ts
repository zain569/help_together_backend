import { IsEnum, IsIn, IsNumber, IsOptional, IsString, IsUUID, Min } from "class-validator";
import { PaymentMethod } from "../entities/donation.entity.js";

export class CreateDonationDto {
    @IsNumber()
    @Min(0.01)
    amount: number;

    @IsUUID()
    userId: string;

    @IsOptional()
    @IsUUID()
    campaignId?: string;

    @IsString()
    @IsIn(['zakat', 'general', 'sadaqah'])
    donationType: string;

    @IsOptional()
    @IsUUID()
    serviceGiftId?: string;

    @IsEnum(PaymentMethod)
    paymentMethod?: string;
}
