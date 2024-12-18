import { Injectable } from '@nestjs/common';
import * as bcrypt from '@node-rs/bcrypt';

@Injectable()
export class BcryptService {
  async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }

  async compare(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(password, hash);
  }
}
