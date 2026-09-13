import { IsString } from 'class-validator';

export class UpdateDonationDto {
    @IsString()
    paymentStatus: string;
}