import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientStatisticsService } from './client-statistics.service';
import { ClientStatisticsController } from './client-statistics.controller';
import { ClientStatistics } from '../database/entities/client-statistics.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ClientStatistics])],
  controllers: [ClientStatisticsController],
  providers: [ClientStatisticsService],
  exports: [ClientStatisticsService],
})
export class ClientStatisticsModule {}
