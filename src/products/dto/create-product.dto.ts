import {
  IsArray,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
class VariantDTO {
  @IsString() label: String;
  @IsNumber() priceDelta: number;
}

export class CreateProductDto {
  @IsString() productId: string;
  @IsString() name: string;
  @IsNumber() basePrice: number;
  @IsString() description: string;
  @IsString() imageUrl: string;
  @IsArray()
  @ValidateNested()
  @IsOptional({
    each: true,
  })
  @Type(() => VariantDTO)
  variants: VariantDTO[];
}
