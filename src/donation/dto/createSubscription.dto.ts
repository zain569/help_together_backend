import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { SubscriptionFrequency } from '../entities/subscriptions.entity.js';

export class CreateSubscriptionDto {
    @IsEnum(SubscriptionFrequency)
    frequency: SubscriptionFrequency;

    @IsString()
    @IsNotEmpty()
    subscriptionType: string
}