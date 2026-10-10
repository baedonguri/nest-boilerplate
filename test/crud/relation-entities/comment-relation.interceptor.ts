import { Injectable } from '@nestjs/common';
import { Request } from 'express';

import { CustomRequestInterceptor, CustomReadOneRequestOptions } from '../../../src/lib/crud/index.js';

@Injectable()
export class CommentRelationInterceptor extends CustomRequestInterceptor {
    async overrideOptions(req: Request): Promise<CustomReadOneRequestOptions> {
        return new Promise((resolve, _reject) => {
            resolve({
                relations: Number(req.params.id) % 2 === 0 ? ['writer'] : [],
            });
        });
    }
}
