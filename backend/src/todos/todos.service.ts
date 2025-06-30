import { Injectable, NotFoundException } from '@nestjs/common';
import { EntityManager } from '@mikro-orm/mongodb';
import { Todo } from './entities/todos.entities';
import { ObjectId } from '@mikro-orm/mongodb';

@Injectable()
export class TodosService {
  constructor(private readonly em: EntityManager) {}

  async getAll(): Promise<Todo[]> {
    return this.em.find(Todo, {}, { orderBy: { createdAt: 'desc' } });
  }

  async getOne(id: string): Promise<Todo> {
    const todo = await this.em.findOne(Todo, { _id: new ObjectId(id) });
    if (!todo) throw new NotFoundException('Không tìm thấy việc cần làm này');
    return todo;
  }

  async add(title: string, attachments: { url: string; name: string; }[] = []): Promise<Todo> {
    const todo = new Todo();
    todo.title = title;
    todo.completed = false;
    todo.attachments = attachments;
    await this.em.persistAndFlush(todo);
    return todo;
  }

  async delete(id: string): Promise<void> {
    const todo = await this.getOne(id);
    await this.em.removeAndFlush(todo);
  }

  async updateCompleted(id: string, completed: boolean): Promise<Todo> {
    const todo = await this.getOne(id);
    todo.completed = completed;
    await this.em.flush();
    return todo;
  }

  async update(id: string, updateData: Partial<Todo>): Promise<Todo> {
    const todo = await this.getOne(id);

    if (updateData.title !== undefined) {
      todo.title = updateData.title;
    }
    if (updateData.completed !== undefined) {
      todo.completed = updateData.completed;
    }
    if (updateData.attachments !== undefined) {
      todo.attachments = updateData.attachments;
    }

    await this.em.flush();
    return todo;
  }

}


