import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  health(): { status: 'Ok' } {
    return { status: 'Ok' };
  }
}
