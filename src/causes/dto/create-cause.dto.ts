import { IsBoolean, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateCauseDto {
    @IsString()
    name: string;

    @IsString()
    slug: string;

    @IsString()
    description: string;

    @IsOptional()
    @IsString()
    imageUrl?: string;

    @IsNumber()
    displayOrder: number;

    @IsOptional()
    @IsBoolean()
    isActive: boolean;
}
