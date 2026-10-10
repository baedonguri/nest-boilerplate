import type { TransformFnParams } from 'class-transformer';
import { MaybeType } from '../types/maybe.type.js';

export const lowerCaseTransformer = (
  params: TransformFnParams,
): MaybeType<string> => params.value?.toLowerCase().trim();
