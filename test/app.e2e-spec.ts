import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { Response } from 'supertest';
import { AppModule } from '../src/app.module';

describe('User Service E2E', () => {
  let app: INestApplication;
  let accessToken: string;
  let userId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Health Check', () => {
    it('/health (GET)', () => {
      return request(app.getHttpServer()).get('/health').expect(200);
    });
  });

  describe('Auth', () => {
    it('/auth/register (POST)', () => {
      return request(app.getHttpServer())
        .post('/auth/register')
        .send({
          name: 'E2E Test User',
          email: 'e2e@example.com',
          password: 'password123',
          preferences: {
            email: true,
            push: true,
          },
        })
        .expect(201)
        .expect((res: Response): void => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.user).toBeDefined();
          expect(res.body.data.access_token).toBeDefined();
          userId = res.body.data.user.id;
          accessToken = res.body.data.access_token;
        });
    });

    it('/auth/login (POST)', () => {
      return request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'e2e@example.com',
          password: 'password123',
        })
        .expect(200)
        .expect((res: Response): void => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.access_token).toBeDefined();
        });
    });
  });

  describe('Users', () => {
    it('/users (GET)', () => {
      return request(app.getHttpServer())
        .get('/users?page=1&limit=10')
        .expect(200)
        .expect((res: Response): void => {
          expect(res.body.success).toBe(true);
          expect(res.body.data).toBeInstanceOf(Array);
          expect(res.body.meta).toBeDefined();
        });
    });

    it('/users/:id/preferences (PATCH)', () => {
      return request(app.getHttpServer())
        .patch(`/users/${userId}/preferences`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send({
          email: false,
          push: true,
        })
        .expect(200)
        .expect((res: Response): void => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.preferences.email).toBe(false);
          expect(res.body.data.preferences.push).toBe(true);
        });
    });
  });
});
