import { Module } from '@nestjs/common';
import { ScyfallModule } from 'src/gateways/scyfall.module';
import { CardDeckModule } from '../card-deck/card-deck.module';
import { CardsModule } from '../cards/cards.module';
import { DecksController } from './deck.controller';
import { DecksRepository } from './deck.repository';
import { DecksService } from './deck.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { DecksWorkerService } from './deck-worker.service';

@Module({
  imports: [
    CardsModule,
    ScyfallModule,
    CardDeckModule,
    ClientsModule.register([
      {
        name: 'RABBITMQ',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL],
          queue: 'deck_import_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
      {
        name: 'RABBITMQ_WEBSOCKET',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL],
          queue: 'deck_updates_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
  ],
  controllers: [DecksController, DecksWorkerService],
  providers: [DecksService, DecksRepository],
  exports: [DecksService],
})
export class DecksModule {}
