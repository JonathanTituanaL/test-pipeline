import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'), // Path to your static files
      // serveRoot: '/static/', // Optional: Prefix for serving static files
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
