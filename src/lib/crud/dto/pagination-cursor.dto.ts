import { AbstractPaginationRequest } from '../abstract/index.js';
import { PaginationType } from '../interface/index.js';

import type { CursorPaginationResponse } from '../interface/index.js';

export class PaginationCursorDto extends AbstractPaginationRequest {
    type: PaginationType.CURSOR = PaginationType.CURSOR;

    nextTotal(): number {
        return this.total;
    }

    metadata<T>(take: number, _dataLength: number, total: number, nextCursor: string): CursorPaginationResponse<T>['metadata'] {
        return {
            limit: take,
            total,
            nextCursor: this.makeQuery(total, nextCursor),
        };
    }
}
