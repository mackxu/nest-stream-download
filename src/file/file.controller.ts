import { Controller, Get, Header, Res, StreamableFile } from '@nestjs/common';
import { createReadStream } from 'node:fs';
import { join } from 'node:path';
import type { Response } from 'express';

@Controller('file')
export class FileController {
  @Get()
  @Header('Content-Disposition', 'attachment; filename="pnpm-lock.yaml"')
  getFile(@Res() res: Response) {
    const fileStream = createReadStream(join(process.cwd(), 'pnpm-lock.yaml'));
    fileStream.pipe(res);
  }

  @Get('streamable')
  @Header('Content-Disposition', 'attachment; filename="pnpm-lock.yaml"')
  getFile2() {
    const fileStream = createReadStream(join(process.cwd(), 'pnpm-lock.yaml'));
    return new StreamableFile(fileStream);
  }

  @Get('json')
  @Header('Content-Disposition', 'attachment; filename="package.json"')
  @Header('Content-Type', 'application/json')
  json() {
    const fileStream = createReadStream(join(process.cwd(), 'package.json'));
    return new StreamableFile(fileStream);
  }

  @Get('json2')
  json2() {
    const fileStream = createReadStream(join(process.cwd(), 'package.json'));
    return new StreamableFile(fileStream, {
      type: 'application/json',
      disposition: 'attachment; filename="package2.json"',
    });
  }

  @Get('json3')
  json3(@Res({ passthrough: true }) res: Response) {
    const fileStream = createReadStream(join(process.cwd(), 'package.json'));
    res.set({
      'Content-Type': 'application/json',
      'Content-Disposition': 'attachment; filename="package3.json"',
    });
    return new StreamableFile(fileStream);
  }
}
