/** test-only: @nestjs/swagger 12 `exports` hides the dist internals the swagger specs inspect, so load them by file path */
export { SwaggerExplorer } from '../../node_modules/@nestjs/swagger/dist/swagger-explorer.js';
export { SwaggerScanner } from '../../node_modules/@nestjs/swagger/dist/swagger-scanner.js';
export { ModelPropertiesAccessor } from '../../node_modules/@nestjs/swagger/dist/services/model-properties-accessor.js';
export { SchemaObjectFactory } from '../../node_modules/@nestjs/swagger/dist/services/schema-object-factory.js';
export { SwaggerTypesMapper } from '../../node_modules/@nestjs/swagger/dist/services/swagger-types-mapper.js';
export type { DenormalizedDoc } from '../../node_modules/@nestjs/swagger/dist/interfaces/denormalized-doc.interface.js';
export type { RequestBodyObject } from '../../node_modules/@nestjs/swagger/dist/interfaces/open-api-spec.interface.js';
