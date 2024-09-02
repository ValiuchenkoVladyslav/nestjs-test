import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '~/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let appServer: any;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    appServer = app.getHttpServer();
  });

  it('/user/create (POST) CREATE NEW USER', () => {
    const userName = 'test';
    const userEmail = 'lalala@gmail.com';
    const userPassword = 'password';

    return request(app.getHttpServer())
      .post('/user/create')
      .send({ name: userName, email: userEmail, password: userPassword })
      .expect(201)
      .expect((res) => {
        const user = res.body;
        expect(user.name).toBe(userName);
        expect(user.email).toBe(userEmail);
        expect(user.password).toBe(userPassword);
      });
  });

  it('/user/find/:id (GET) GET USER', async () => {
    const userName = 'test';
    const userEmail = 'lalala@gmail.com';
    const userPassword = 'password';

    const newUser = await request(appServer)
      .post('/user/create')
      .send({ name: userName, email: userEmail, password: userPassword })
      .expect(201)
      .then((res) => res.body);

    return request(appServer)
      .get(`/user/find/${newUser.id}`)
      .expect(200)
      .expect((res) => {
        const user = res.body;
        expect(user.name).toBe(userName);
        expect(user.email).toBe(userEmail);
        expect(user.password).toBe(userPassword);
      });
  });

  it('/user/find/:id (GET) USER NOT FOUND', () => {
    return request(appServer)
      .get(`/user/find/non-existent-id`)
      .expect(404)
      .expect((res) => {
        expect(res.body.message).toBe('User not found');
      });
  });

  it('/user/login (POST) LOGIN', async () => {
    const userName = 'test';
    const userEmail = 'lalala@gmail.com';
    const userPassword = 'password';

    const newUser = await request(appServer)
      .post('/user/create')
      .send({ name: userName, email: userEmail, password: userPassword })
      .expect(201)
      .then((res) => res.body);

    return request(appServer)
      .post('/user/login')
      .send({ id: newUser.id, password: userPassword })
      .expect(201)
      .expect((res) => {
        expect(res.body.access_token).toBeDefined();
      });
  });

  it('/user/login (POST) LOGIN WRONG PASSWORD', async () => {
    const userName = 'test';
    const userEmail = 'lalala@gmail.com';
    const userPassword = 'password';

    const newUser = await request(appServer)
      .post('/user/create')
      .send({ name: userName, email: userEmail, password: userPassword })
      .expect(201)
      .then((res) => res.body);

    return request(appServer)
      .post('/user/login')
      .send({ id: newUser.id, password: 'WRONG PASSWORD' })
      .expect(401);
  });

  it('/user/delete (DELETE) DELETE USER', async () => {
    const userName = 'test';
    const userEmail = 'lalala@gmail.com';
    const userPassword = 'password';

    const newUser = await request(appServer)
      .post('/user/create')
      .send({ name: userName, email: userEmail, password: userPassword })
      .expect(201)
      .then((res) => res.body);

    const access_token = await request(appServer)
      .post('/user/login')
      .send({ id: newUser.id, password: userPassword })
      .expect(201)
      .then((res) => res.body.access_token);

    return request(appServer)
      .delete('/user/delete/' + newUser.id)
      .set('Authorization', `Bearer ${access_token}`)
      .send()
      .expect(200);
  });

  it('/user/delete (DELETE) DELETE USER WRONG TOKEN', async () => {
    const userName = 'test';
    const userEmail = 'lalala@gmail.com';
    const userPassword = 'password';

    const newUser = await request(appServer)
      .post('/user/create')
      .send({ name: userName, email: userEmail, password: userPassword })
      .expect(201)
      .then((res) => res.body);

    return request(appServer)
      .delete('/user/delete/' + newUser.id)
      .set('Authorization', `Bearer WRONG_TOKEN`)
      .send()
      .expect(401);
  });

  it('/user/delete (DELETE) DELETE USER NOT FOUND', async () => {
    const userName = 'test';
    const userEmail = 'lalala@gmail.com';
    const userPassword = 'password';

    const newUser = await request(appServer)
      .post('/user/create')
      .send({ name: userName, email: userEmail, password: userPassword })
      .expect(201)
      .then((res) => res.body);

    const access_token = await request(appServer)
      .post('/user/login')
      .send({ id: newUser.id, password: userPassword })
      .expect(201)
      .then((res) => res.body.access_token);

    return request(appServer)
      .delete('/user/delete/' + '123123123123123')
      .set('Authorization', `Bearer ${access_token}`)
      .send()
      .expect(404);
  });
});
