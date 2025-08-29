import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ProjectsModule } from './projects/projects.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ UsersModule, ProjectsModule, PrismaModule, AuthModule, ConfigModule.forRoot({ isGlobal: true }) ],
  controllers: [AppController],
  providers: [AppService, ],
})

export class AppModule {
 
}

