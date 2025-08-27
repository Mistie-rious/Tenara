import { Injectable } from '@nestjs/common';

@Injectable()
export class ConfigService {
    get(key: string, defaultValue: string): string {
        return process.env[key] ?? defaultValue;
      }
      
}
