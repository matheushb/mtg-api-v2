import { Module } from '@nestjs/common';
import { ScyfallGateway } from './scyfall.gateway';

@Module({
  providers: [ScyfallGateway],
  exports: [ScyfallGateway],
})
export class ScyfallModule {}
