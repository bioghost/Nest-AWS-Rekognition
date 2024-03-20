import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RekognitionController } from './rekognition.controller';
import { RekognitionService } from './rekognition.service';
import { S3StorageConfig } from './s3.storage';

@Module({
  imports: [
    MulterModule.register({
      storage: S3StorageConfig,
    }),
  ],
  controllers: [AppController,RekognitionController],
  providers: [AppService,RekognitionService],
})
export class AppModule {}
