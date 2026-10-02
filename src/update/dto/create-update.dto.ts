import { IsOptional, IsString } from "class-validator";

export class CreateUpdateDto {
    @IsString()
    causeName: string;

    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsOptional()
    @IsString()
    imageUrl: string;
}
