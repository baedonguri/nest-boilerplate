import { of } from 'rxjs';

import { CustomRequestInterceptor } from './custom-request.interceptor.js';
import { CUSTOM_REQUEST_OPTIONS } from '../constants.js';
import { ExecutionContextHost } from '../provider/index.js';

import type { CallHandler } from '@nestjs/common';

describe('CustomRequestInterceptor', () => {
    it('should intercept', async () => {
        const handler: CallHandler = {
            handle: () => of('test'),
        };
        const interceptor: CustomRequestInterceptor = new CustomRequestInterceptor();

        const context = new ExecutionContextHost([{}]);

        await interceptor.intercept(context, handler);
        expect(context.switchToHttp().getRequest()).toHaveProperty(CUSTOM_REQUEST_OPTIONS);
    });
});
