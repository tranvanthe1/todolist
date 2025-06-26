import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import mikroOrmConfig from './mikro-orm.config';
import { TodosModule } from './todos/todos.module';

@Module({
  imports: [
    MikroOrmModule.forRoot(mikroOrmConfig),
    TodosModule,
  ],
})
export class AppModule {}