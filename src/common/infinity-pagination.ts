import { IPaginationOptions } from './types/pagination-options.js';
import { InfinityPaginationResponseDto } from './dto/infinity-pagination-response.dto.js';

export const infinityPagination = <T>(
  data: T[],
  options: IPaginationOptions,
): InfinityPaginationResponseDto<T> => {
  return {
    data,
    hasNextPage: data.length === options.limit,
  };
};
