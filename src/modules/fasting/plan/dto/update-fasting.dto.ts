import { PartialType } from '@nestjs/swagger';
import { CreateFastingDto } from './create-fasting.dto';

export class UpdateFastingDto extends PartialType(CreateFastingDto) {}
