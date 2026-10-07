import { IsNumber, Min } from 'class-validator';

export class JazzCashDonationDto {
    @IsNumber()
    @Min(1)
    amount: number;
}