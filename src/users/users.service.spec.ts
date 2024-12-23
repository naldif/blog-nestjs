/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return a user by ID', () => {
    const user = service.findOne(1);
    expect(user).toEqual({ id: 1, name: 'John Doe' });
  });

  it('should return undefined if user not found', () => {
    const user = service.findOne(999);
    expect(user).toBeUndefined();
  });
});
