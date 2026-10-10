import type { EntityType } from './index.js';
import type { CrudService } from '../crud.service.js';

export interface CrudController<T extends EntityType> {
    crudService: CrudService<T>;
}
