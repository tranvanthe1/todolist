import { Module } from '@nestjs/common';
import { TodosController } from './todos.controller';
import { TodosService } from './todos.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Todo } from './entities/todos.entities';

@Module({
  imports: [MikroOrmModule.forFeature([Todo])],
  controllers: [TodosController],
  providers: [TodosService],
})
export class TodosModule {}

