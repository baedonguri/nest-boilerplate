import { Controller, forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CategoryEntity } from './category.entity.js';
import { CategoryService } from './category.service.js';
import { CommentEntity } from './comment.entity.js';
import { CommentService } from './comment.service.js';
import { QuestionEntity } from './question.entity.js';
import { QuestionService } from './question.service.js';
import { WriterEntity } from './writer.entity.js';
import { WriterService } from './writer.service.js';
import { Crud, CrudController, CrudOptions } from '../../../src/lib/crud/index.js';
import { TestHelper } from '../test.helper.js';

enum RelationController {
    CATEGORY = 'category',
    WRITER = 'writer',
    QUESTION = 'question',
    COMMENT = 'comment',
}

type ControllerOptions = Record<RelationController, CrudOptions['routes']>;

export function RelationEntitiesModule(controllerOptions: ControllerOptions) {
    function categoryController() {
        @Crud({ entity: CategoryEntity, routes: controllerOptions[RelationController.CATEGORY] })
        @Controller(RelationController.CATEGORY)
        class CategoryController implements CrudController<CategoryEntity> {
            constructor(public readonly crudService: CategoryService) {}
        }
        return CategoryController;
    }

    function writerController() {
        @Crud({ entity: WriterEntity, routes: controllerOptions[RelationController.WRITER] })
        @Controller(RelationController.WRITER)
        class WriterController implements CrudController<WriterEntity> {
            constructor(public readonly crudService: WriterService) {}
        }
        return WriterController;
    }

    function questionController() {
        @Crud({ entity: QuestionEntity, routes: controllerOptions[RelationController.QUESTION] })
        @Controller(RelationController.QUESTION)
        class QuestionController implements CrudController<QuestionEntity> {
            constructor(public readonly crudService: QuestionService) {}
        }
        return QuestionController;
    }

    function commentController() {
        @Crud({ entity: CommentEntity, routes: controllerOptions[RelationController.COMMENT] })
        @Controller(RelationController.COMMENT)
        class CommentController implements CrudController<CommentEntity> {
            constructor(public readonly crudService: CommentService) {}
        }
        return CommentController;
    }

    function getModule() {
        @Module({
            imports: [
                forwardRef(() => TestHelper.getTypeOrmMysqlModule([CategoryEntity, CommentEntity, QuestionEntity, WriterEntity])),
                TypeOrmModule.forFeature([CategoryEntity, CommentEntity, QuestionEntity, WriterEntity]),
            ],
            controllers: [categoryController(), writerController(), questionController(), commentController()],
            providers: [CategoryService, CommentService, QuestionService, WriterService],
        })
        class BaseModule {}
        return BaseModule;
    }

    return getModule();
}
