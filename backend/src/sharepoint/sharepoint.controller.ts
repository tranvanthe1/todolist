import { Body, Controller, Delete, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { SharePointService } from './sharepoint.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FilesInterceptor } from '@nestjs/platform-express';
import { UploadedFiles } from '@nestjs/common';

@Controller('sharepoint')
export class SharePointController {
  constructor(private readonly spService: SharePointService) {}

  @Post('folder/:todoId')
  async createFolder(@Param('todoId') todoId: string) {
    await this.spService.createTodoFolder(todoId);
    return { message: `Tạo folder '${todoId}' thành công` };
  }

  @Post('upload/:todoId')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadMultipleFiles(
    @Param('todoId') todoId: string,
    @UploadedFiles() files: Express.Multer.File[]
  ) {
    const uploaded = await Promise.all(
      files.map(async (file) => {
        const url = await this.spService.uploadFile(
          todoId,
          file.originalname,
          file.buffer
        );
        return {
          url: 'https://1work.sharepoint.com' + url,
          name: file.originalname,
        };
      })
    );
    return uploaded;
  }

  @Delete('file/:todoId/:fileName')
    async deleteFile(
    @Param('todoId') todoId: string,
    @Param('fileName') fileName: string
    ) {
    const serverRelativeUrl = `/sites/intern-data/thetv/${todoId}/${fileName}`;
    await this.spService.deleteFile(serverRelativeUrl);
    return { message: `File '${fileName}' đã được xoá trong folder '${todoId}'` };
    }

  @Delete('folder/:todoId')
  async deleteFolder(@Param('todoId') todoId: string) {
    await this.spService.deleteTodoFolder(todoId);
    return { message: `Folder '${todoId}' đã được xoá` };
  }

}
