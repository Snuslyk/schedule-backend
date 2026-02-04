import { Injectable } from '@nestjs/common';

@Injectable()
export class OwnerService {

  findAll() {
    return `This action returns all owner`;
  }

  findOne(id: number) {
    return `This action returns a #${id} owner`;
  }

}
