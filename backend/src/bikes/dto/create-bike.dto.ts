import { Transform } from "class-transformer";
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  Min,
} from "class-validator";

const trim = ({ value }: { value: unknown }) =>
  typeof value === "string" ? value.trim() : value;

export class CreateBikeDto {
  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  brand: string;

  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  model: string;

  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  description: string;

  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  category: string;

  @Transform(trim)
  @IsString()
  @IsNotEmpty()
  frameMaterial: string;

  @IsNumber()
  @IsPositive()
  frameSizeCm: number;

  @IsNumber()
  @IsPositive()
  wheelSizeInches: number;

  @IsInt()
  @IsPositive()
  gearCount: number;

  @IsNumber()
  @IsPositive()
  weightKg: number;

  @IsBoolean()
  electric: boolean;

  @IsInt()
  @Min(0)
  priceCents: number;
}