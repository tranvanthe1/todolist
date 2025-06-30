import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import mikroOrmConfig from './mikro-orm.config';
import { TodosModule } from './todos/todos.module';
import { SharePointModule } from './sharepoint/sharepoint.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MikroOrmModule.forRoot(mikroOrmConfig),
    TodosModule,
    SharePointModule
  ],
})
export class AppModule {}