import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateServiceGiftDto {
    @IsString()
    name: string;

    @IsString()
    description: string;

    @IsNumber()
    price: number;

    @IsBoolean()
    isActive: boolean;

    @IsOptional()
    @IsString()
    imageUrl: string;
}
