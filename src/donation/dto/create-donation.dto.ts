import { IsIn, IsNumber, IsString, IsUUID, Min } from "class-validator";

export class CreateDonationDto {
    @IsNumber()
    @Min(0.01)
    amount: number;

    @IsUUID()
    userId: string;

    @IsUUID()
    campaignId: string;

    @IsIn(["fail","complete"])
    paymentStatus: string;

    @IsString()
    paymentMethod: string;
}
