import { Module } from '@nestjs/common';
import { FloodsMapController } from './floods-map.controller';
import { FloodsMapService } from './floods-map.service';

@Module({
  controllers: [FloodsMapController],
  providers: [FloodsMapService],
})
export class FloodsMapModule {}