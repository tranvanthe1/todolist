import { Inject, Injectable } from '@nestjs/common';
import { SHAREPOINT } from './sharepoint.provider';
import '@pnp/sp-commonjs/files';
import '@pnp/sp-commonjs/folders';

@Injectable()
export class SharePointService {
  constructor(@Inject(SHAREPOINT) private readonly sp: any) {}

  async createTodoFolder(todoId: string) {
    await this.sp.web.getFolderByServerRelativePath('thetv').folders.add(todoId);
  }

  async uploadFile(todoId: string, fileName: string, buffer: Buffer) {
    const file = await this.sp.web
      .getFolderByServerRelativePath(`thetv/${todoId}`)
      .files.addUsingPath(fileName, buffer, { Overwrite: true });
    return file.data.ServerRelativeUrl;
  }

  async deleteFile(fileUrl: string) {
    await this.sp.web.getFileByServerRelativePath(fileUrl).delete();
  }

  async deleteTodoFolder(todoId: string) {
    await this.sp.web.getFolderByServerRelativePath(`thetv/${todoId}`).delete();
  }

}
