import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
	let controller: UsersController;
	let mockUsersService: Partial<UsersService>;
	let mockAuthService: Partial<AuthService>;

	beforeEach(async () => {
		mockUsersService = {
			find: (email: string) => Promise.resolve([{ id: 1, email, password: '123' } as User]),
			findOne: (id: number) => Promise.resolve({ id, email: 'asd@asd.com', password: '123' } as User),
			// remove: (id) => {},
			// update: (id, attrs) => {},
		};
		mockAuthService = {
			signin: (email: string, password: string) => Promise.resolve({ id: 1, email, password } as User),
			// signup: () => {},
		};
		const module: TestingModule = await Test.createTestingModule({
			controllers: [UsersController],
			providers: [
				{
					provide: UsersService,
					useValue: mockUsersService,
				},
				{
					provide: AuthService,
					useValue: mockAuthService,
				},
			],
		}).compile();

		controller = module.get<UsersController>(UsersController);
	});

	it('should be defined', () => {
		expect(controller).toBeDefined();
	});

	it('find all users with the given email', async () => {
		const users = await controller.findAllUsers('email@email.com');
		expect(users.length).toEqual(1);
		expect(users[0].email).toEqual('email@email.com');
	});

	it('find user with the given id', async () => {
		const user = await controller.findUser('123');
		expect(user).toBeDefined();
		expect(user.id).toEqual(123);
	});

	it('find user throws NotFoundException when no user exists with the given id', async () => {
		mockUsersService.findOne = () => null;
		await expect(controller.findUser('123')).rejects.toThrow(NotFoundException);
	});

	it('signin updates session object and returns user', async () => {
		const session = { userId: -1 };
		const user = await controller.signin({ email: 'asd@asd.com', password: '123' }, session);
		expect(user.id).toEqual(1);
		expect(session.userId).toEqual(1);
	});
});
