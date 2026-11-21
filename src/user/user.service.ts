import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  getUser() {
    return 'This is a user';
  }
}
