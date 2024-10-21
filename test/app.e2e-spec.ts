import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module'; // Asegúrate de que la ruta sea correcta
import { CreateMessageDto } from '../src/message/dto/create-message.dto';
import { SignUpDto } from '../src/auth/dto/signup.dto';
import { SignInDto } from '../src/auth/dto/signIn.dto';

describe('App (e2e)', () => {
  let app: INestApplication;
  let jwtToken: string;
  let messageId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/auth/signup (POST)', () => {
    const signUpDto: SignUpDto = {
      name:'test',
      email: 'test@test.com',
      password: 'password',
    };
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send(signUpDto)
      .expect(201)
      .then((response) => {
        expect(response.body.access_token).toBeDefined();
      });
  });

  it('/auth/signIn (POST)', () => {
    const signInDto: SignInDto = {
      email: 'test@test.com',
      password: 'password',
    };
    return request(app.getHttpServer())
      .post('/auth/signIn')
      .send(signInDto)
      .expect(200)
      .then((response) => {
        expect(response.body.access_token).toBeDefined();
        jwtToken = response.body.access_token;
      });
  });

  it('/messages (POST)', () => {
    const createMessageDto: CreateMessageDto = {
      receiver: '60d0fe4f5311236168a109cb',
      content: 'Test message content',
    };
    return request(app.getHttpServer())
      .post('/messages')
      .set('Authorization', `Bearer ${jwtToken}`)
      .send(createMessageDto)
      .expect(201)
      .then((response) => {
        expect(response.body._id).toBeDefined();
        messageId = response.body._id;
      });
  });

  it('/messages?isStarred=true (GET)', () => {
    return request(app.getHttpServer())
      .get('/messages')
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200)
      .then((response) => {
        expect(response.body).toBeInstanceOf(Array);
      });
  });

  it('/messages/:id (GET)', () => {
    return request(app.getHttpServer())
      .get(`/messages/${messageId}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200)
      .then((response) => {
        expect(response.body._id).toEqual(messageId);
      });
  });

  it('/messages/:id/status (PATCH)', () => {
    return request(app.getHttpServer())
      .patch(`/messages/${messageId}/status`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .send({ status: 'read' })
      .expect(200)
      .then((response) => {
        expect(response.body.status).toEqual('read');
      });
  });

  it('/messages/:id (DELETE)', () => {
    return request(app.getHttpServer())
      .delete(`/messages/${messageId}`)
      .set('Authorization', `Bearer ${jwtToken}`)
      .expect(200)
      .then((response) => {
        expect(response.body.deleted).toBe(true);
      });
  });
});
