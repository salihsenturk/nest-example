import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AuthController (e2e)', () => {
	let app: INestApplication;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	it('handles a signup request', () => {
		return request(app.getHttpServer())
			.post('/auth/signup')
			.send({ email: 'asdasd@asd.com', password: '123' })
			.expect(201)
			.then((resp) => {
				const { email, id } = resp.body;
				expect(id).toBeDefined();
				expect(email).toEqual('asdasd@asd.com');
			});
	});

	it('signup as a new user and then get the currently logged in user', async () => {
		const resp = await request(app.getHttpServer())
			.post('/auth/signup')
			.send({ email: 'asdasd@asd.com', password: '123' })
			.expect(201);

		const cookie = resp.get('Set-Cookie');
		const { body } = await request(app.getHttpServer()).get('/auth/whoami').set('Cookie', cookie).expect(200);
		expect(body.email).toEqual('asdasd@asd.com');
	});
});
