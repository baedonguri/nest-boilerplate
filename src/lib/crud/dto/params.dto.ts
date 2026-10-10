import { mixin } from '@nestjs/common';
import { PickType } from '@nestjs/swagger';

import type { EntityType } from '../interface/index.js';
import type { Type } from '@nestjs/common';

export function CreateParamsDto(parentClass: EntityType, keys: Array<keyof EntityType>) {
    class ParamsDto extends PickType(parentClass as Type<EntityType>, keys) {}
    return mixin(ParamsDto);
}
