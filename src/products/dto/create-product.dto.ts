import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class VariantDTO {
  @IsString() label: string;
  @IsOptional() @IsNumber() price_delta?: number;
}

export class CreateProductDto {
  @IsString() categoryId: string;
  @IsString() name: string;
  @IsNumber() base_price: number;
  @IsOptional() @IsString() description?: string;
  @IsString() image: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => VariantDTO)
  variants?: VariantDTO[];
}
