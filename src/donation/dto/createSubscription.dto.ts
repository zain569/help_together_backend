import { IsEnum } from 'class-validator';
import { SubscriptionFrequency } from '../entities/subscriptions.entity.js';

export class CreateSubscriptionDto {
    @IsEnum(SubscriptionFrequency)
    frequency: SubscriptionFrequency;
}