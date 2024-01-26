import { Injectable } from '@nestjs/common';
import * as winston from 'winston';
import Transport from 'winston-transport';
import { SocketGateway } from 'src/socket/socket.gateway';

class SocketTransport extends Transport {
  constructor(
    opts: winston.transport.TransportStreamOptions,
    private socketGateway: SocketGateway,
  ) {
    super(opts);
  }

  log(info: any) {
    this.socketGateway.emitMessage('log', info);
  }
}

@Injectable()
export class CustomWinstonLogger {
  constructor(private readonly socketGateway: SocketGateway) {}

  getLogger() {
    return winston.createLogger({
      level: 'info',
      format: winston.format.json(),
      defaultMeta: { service: ' lsg-service' },
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'error.log', level: 'error' }),
        new SocketTransport({ level: 'info' }, this.socketGateway),
      ],
    });
  }
}
