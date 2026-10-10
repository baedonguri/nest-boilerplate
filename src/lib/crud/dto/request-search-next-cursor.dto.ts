import { PickType } from '@nestjs/swagger';

import { RequestSearchDto } from './request-search.dto.js';

export class RequestSearchNextCursorDto extends PickType(RequestSearchDto, ['nextCursor']) {
    static getExample(): RequestSearchNextCursorDto {
        return {
            nextCursor: 'next_cursor',
        };
    }
}
