import { IsNumber, IsOptional, IsString, IsUUID, Min } from "class-validator";

export class CreateCampaignDto {
    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsNumber()
    @Min(1)
    goalAmount: number;

    @IsString()
    @IsOptional()
    image: string;

    @IsUUID()
    causeId: string;
}
