import { randomUUID } from 'node:crypto';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino';
import type { IncomingMessage, ServerResponse } from 'node:http';

const REQUEST_ID_HEADER = 'x-request-id';

/** reuse a caller's request id (load balancer / gateway) when it looks sane, otherwise mint one; echoed back on the response */
function requestId(req: IncomingMessage, res: ServerResponse): string {
  const incoming = req.headers[REQUEST_ID_HEADER];
  const id =
    typeof incoming === 'string' && /^[\w.:-]{1,128}$/.test(incoming)
      ? incoming
      : randomUUID();
  res.setHeader(REQUEST_ID_HEADER, id);
  return id;
}

/** structured JSON logs (pino) with a request id per line; credentials in headers are redacted, health probes are not logged */
@Module({
  imports: [
    LoggerModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        pinoHttp: {
          level: config.get<string>('app.logLevel', 'info'),
          genReqId: requestId,
          redact: {
            paths: [
              'req.headers.authorization',
              'req.headers.cookie',
              'res.headers["set-cookie"]',
            ],
            censor: '[REDACTED]',
          },
          autoLogging: {
            ignore: (req) => req.url?.includes('/health') ?? false,
          },
        },
      }),
    }),
  ],
})
export class LoggingModule {}
