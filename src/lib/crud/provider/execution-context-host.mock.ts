import type { ContextType, ExecutionContext, Type } from '@nestjs/common';
type HttpArgumentsHost = ReturnType<ExecutionContext['switchToHttp']>;
type RpcArgumentsHost = ReturnType<ExecutionContext['switchToRpc']>;
type WsArgumentsHost = ReturnType<ExecutionContext['switchToWs']>;

/**
 * util class to mocking ExecutionContext
 */
export class ExecutionContextHost implements ExecutionContext {
    private contextType = 'http';

    constructor(
        private readonly args: unknown[],
        private readonly constructorRef?: Type<any>,
        private readonly handler?: Function,
    ) {}

    setType<TContext extends string = ContextType>(type: TContext): void {
        type && (this.contextType = type);
    }

    getType<TContext extends string = ContextType>(): TContext {
        return this.contextType as TContext;
    }

    getClass<T = unknown>(): Type<T> {
        return this.constructorRef!;
    }

    getHandler(): Function {
        return this.handler!;
    }

    getArgs<T extends unknown[] = unknown[]>(): T {
        return this.args as T;
    }

    getArgByIndex<T = any>(index: number): T {
        return this.args[index] as T;
    }

    switchToRpc(): RpcArgumentsHost {
        return Object.assign(this, {
            getData: () => this.getArgByIndex(0),
            getContext: () => this.getArgByIndex(1),
        });
    }

    switchToHttp(): HttpArgumentsHost {
        return Object.assign(this, {
            getRequest: () => this.getArgByIndex(0),
            getResponse: () => this.getArgByIndex(1),
            getNext: () => this.getArgByIndex(2),
        });
    }

    switchToWs(): WsArgumentsHost {
        return Object.assign(this, {
            getClient: () => this.getArgByIndex(0),
            getData: () => this.getArgByIndex(1),
            getPattern: () => this.getArgByIndex(2),
        });
    }
}
