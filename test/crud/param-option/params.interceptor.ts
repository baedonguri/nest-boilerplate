import { Injectable } from '@nestjs/common';
import { Request } from 'express';

import { CustomRequestInterceptor } from '../../../src/lib/crud/index.js';

@Injectable()
export class ParamsInterceptor extends CustomRequestInterceptor {
    async overrideOptions(req: Request): Promise<void> {
        return new Promise((resolve, _reject) => {
            req.params = { name: req.params?.custom };
            resolve();
        });
    }
}
