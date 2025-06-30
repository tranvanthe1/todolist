import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SharePointService } from './sharepoint.service';
import { SharePointController } from './sharepoint.controller';
import { SharePointProvider } from './sharepoint.provider';

@Module({
  imports: [ConfigModule],
  controllers: [SharePointController],
  providers: [SharePointService, SharePointProvider],
})
export class SharePointModule {}
