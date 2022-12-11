import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './user.entity';
import { UsersService } from './users.service';

describe('AuthService', () => {
	let service: AuthService;
	let mockUsersService: Partial<UsersService>;

	beforeEach(async () => {
		const users: User[] = [];
		mockUsersService = {
			find: (email: string) => {
				const filteredUsers = users.filter((user) => user.email === email);
				return Promise.resolve(filteredUsers);
			},
			create: (email: string, password: string) => {
				const user = { id: Math.floor(Math.random() * 999), email, password } as User;
				users.push(user);
				return Promise.resolve(user);
			},
		};

		const module = Test.createTestingModule({
			providers: [
				AuthService,
				{
					provide: UsersService,
					useValue: mockUsersService,
				},
			],
		}).compile();

		service = (await module).get(AuthService);
	});

	it('can create an instance of auth service', async () => {
		expect(service).toBeDefined();
	});

	it('creates a new user with a salted and hashed password', async () => {
		const user = await service.signup('asd2@asd.com', '123456');

		expect(user.password).not.toEqual('123456');
		const [salt, hash] = user.password.split('.');
		expect(salt).toBeDefined();
		expect(hash).toBeDefined();
	});

	it('throws BadRequestException if user signsup with an email that is in use', async () => {
		await service.signup('asd@asd.com', '1234');

		await expect(service.signup('asd@asd.com', '1234')).rejects.toThrow(BadRequestException);
	});

	it('throws NotFoundException if signin is called with an unused email', async () => {
		await expect(service.signin('asd@asd.com', 'asd')).rejects.toThrow(NotFoundException);
	});

	it('throws BadRequestException if an invalid password is provided', async () => {
		await service.signup('asd@asd.com', '1234');

		await expect(service.signin('asd@asd.com', '123')).rejects.toThrow(BadRequestException);
	});

	it('returns a user if correct password is provided', async () => {
		await service.signup('asd@asd.com', '123');

		const user = service.signin('asd@asd.com', '123');
		expect(user).toBeDefined();
	});
});
