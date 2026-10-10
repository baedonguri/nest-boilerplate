import { CrudRouteFactory } from './crud.route.factory.js';
import { CrudService } from './crud.service.js';

import type { CrudOptions } from './interface/index.js';

type Constructor = new (...args: any[]) => any;

export const Crud =
    (options: CrudOptions) =>
    <T extends Constructor>(target: T) => {
        const crudRouteFactory = new CrudRouteFactory(target, options);
        crudRouteFactory.init();

        const ValidatedController = class extends target {
            constructor(...args: any[]) {
                super(...args);
                if (!(this.crudService instanceof CrudService)) {
                    throw new TypeError('controller should include member crudService, which is instance of CrudService');
                }
            }
        };
        Object.defineProperty(ValidatedController, 'name', { value: target.name });
        return ValidatedController;
    };
