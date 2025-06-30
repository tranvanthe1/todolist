import { Controller, Get, Post, Body, Param, Delete, Put } from '@nestjs/common';
import { TodosService } from './todos.service';
import { Todo } from './entities/todos.entities';

@Controller('todo')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Get()
  getAll() {
    return this.todosService.getAll();
  }

  @Get(':id')
  One(@Param('id') id: string) {
    return this.todosService.getOne(id);
  }

  @Post('add')
  add(@Body() body: { title: string, attachments?: { url: string; name: string; }[] }) {
    const { title, attachments } = body;
    if (!title) {
      return { message: 'Vui lòng nhập tiêu đề việc cần làm' };
    }
    return this.todosService.add(title, attachments);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.todosService.delete(id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() body: Partial<Todo>) {
    return this.todosService.update(id, body);
  }

  @Put(':id/completed')
  updateCompleted(@Param('id') id: string, @Body() body: { completed: boolean }) {
    return this.todosService.updateCompleted(id, body.completed);
  }
}
