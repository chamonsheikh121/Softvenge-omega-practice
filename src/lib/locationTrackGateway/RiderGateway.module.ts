import { Module } from '@nestjs/common';
import { RiderGateway } from './RiderGateway';

@Module({
  imports: [RiderGateway],
  exports: [RiderGateway],
})
export class RiderModule {}
