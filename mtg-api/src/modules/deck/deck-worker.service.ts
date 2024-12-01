import { Controller, Inject } from '@nestjs/common';
import {
  ClientProxy,
  Ctx,
  EventPattern,
  Payload,
  RmqContext,
} from '@nestjs/microservices';
import { DecksService } from './deck.service';
import { io, Socket } from 'socket.io-client';

@Controller()
export class DecksWorkerService {
  private socket: Socket;

  constructor(
    private readonly decksService: DecksService,
    @Inject('RABBITMQ_WEBSOCKET') private readonly client: ClientProxy,
  ) {
    this.socket = io(
      process.env.SOCKET_SERVER_URL || 'http://websocket-service:4000',
    );
  }

  @EventPattern('deck_import_queue')
  async handleDeckImportMessage(
    @Payload() message: any,
    @Ctx() context: RmqContext,
  ) {
    const parsedMessage = JSON.parse(message);

    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    const info = {
      email: parsedMessage.data.user.email,
      channel: 'deck_import_queue',
    };
    console.log('Mensagem recebida:', info);
    try {
      if (!message) return;

      const { user, importDeckDto } = parsedMessage.data;

      console.log('Processando Mensagem:', info);

      await this.decksService.importDeck(
        user,
        importDeckDto.name,
        importDeckDto.cards,
      );

      channel.ack(originalMsg);

      await this.client.connect();

      this.client.emit('deck_updates_queue', {
        data: {
          user,
          message: 'Deck importado com sucesso',
        },
      });
    } catch (error) {
      console.error('Erro ao processar a mensagem:', error);
      console.error('Mensagem: ', info, message);

      channel.ack(originalMsg);
    }
  }

  @EventPattern('deck_updates_queue')
  async handleDeckUpdate(@Payload() message: any, @Ctx() context: RmqContext) {
    const channel = context.getChannelRef();
    const originalMsg = context.getMessage();

    const info = { message, channel: 'deck_updates_queue' };

    console.log('Mensagem recebida em deck_updates_queue:', info);

    try {
      if (!message) return;

      const { data } = message;

      console.log('Processando mensagem em deck_updates_queue:', info);

      if (this.socket.connected) {
        this.socket.emit('deck_update', data);
      }

      channel.ack(originalMsg);
    } catch (error) {
      console.error('Erro ao processar a mensagem:', info, error);
      console.error('Mensagem: ', message);

      channel.ack(originalMsg);
    }
  }
}
