import request from 'supertest';
import { beforeAll, describe, expect, it } from 'vitest';
import {
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
  APP_URL,
  TESTER_EMAIL,
  TESTER_PASSWORD,
} from '../utils/constants.js';

const login = async (email: string, password: string) => {
  const { body } = await request(APP_URL)
    .post('/api/v1/auth/email/login')
    .send({ email, password })
    .expect(200);
  return { token: body.token as string, userId: body.user.id as number };
};

describe('Posts (@Crud sample)', () => {
  let author: { token: string; userId: number };
  let other: { token: string; userId: number };
  let admin: { token: string; userId: number };

  beforeAll(async () => {
    const otherEmail = `post.other.${Date.now()}@example.com`;
    await request(APP_URL)
      .post('/api/v1/auth/email/register')
      .send({
        email: otherEmail,
        password: 'secret',
        firstName: 'Other',
        lastName: 'User',
      })
      .expect(204);
    author = await login(TESTER_EMAIL, TESTER_PASSWORD);
    other = await login(otherEmail, 'secret');
    admin = await login(ADMIN_EMAIL, ADMIN_PASSWORD);
  });

  it('requires a token to create and records the author from it', async () => {
    await request(APP_URL)
      .post('/api/v1/posts')
      .send({ title: 'nope', content: 'nope' })
      .expect(401);

    const { body } = await request(APP_URL)
      .post('/api/v1/posts')
      .auth(author.token, { type: 'bearer' })
      .send({ title: 'Hello', content: 'First post' })
      .expect(201);
    expect(body).toMatchObject({
      title: 'Hello',
      content: 'First post',
      authorId: author.userId,
    });
  });

  it('rejects a client-supplied authorId and invalid fields with 422', async () => {
    await request(APP_URL)
      .post('/api/v1/posts')
      .auth(author.token, { type: 'bearer' })
      .send({ title: 'spoof', content: 'spoof', authorId: other.userId })
      .expect(422);
    await request(APP_URL)
      .post('/api/v1/posts')
      .auth(author.token, { type: 'bearer' })
      .send({ title: 123, content: 'x' })
      .expect(422);
  });

  it('lets only the author or an admin change a post', async () => {
    const { body: post } = await request(APP_URL)
      .post('/api/v1/posts')
      .auth(author.token, { type: 'bearer' })
      .send({ title: 'Mine', content: 'only mine' })
      .expect(201);

    await request(APP_URL)
      .patch(`/api/v1/posts/${post.id}`)
      .auth(other.token, { type: 'bearer' })
      .send({ title: 'hijack' })
      .expect(403);
    await request(APP_URL)
      .delete(`/api/v1/posts/${post.id}`)
      .auth(other.token, { type: 'bearer' })
      .expect(403);

    const { body: updated } = await request(APP_URL)
      .patch(`/api/v1/posts/${post.id}`)
      .auth(author.token, { type: 'bearer' })
      .send({ title: 'Mine (edited)' })
      .expect(200);
    expect(updated.title).toBe('Mine (edited)');

    await request(APP_URL)
      .patch(`/api/v1/posts/${post.id}`)
      .auth(admin.token, { type: 'bearer' })
      .send({ content: 'moderated' })
      .expect(200);
    await request(APP_URL)
      .patch('/api/v1/posts/999999')
      .auth(author.token, { type: 'bearer' })
      .send({ title: 'ghost' })
      .expect(404);
  });

  it('soft deletes and recovers', async () => {
    const { body: post } = await request(APP_URL)
      .post('/api/v1/posts')
      .auth(author.token, { type: 'bearer' })
      .send({ title: 'Temp', content: 'to be deleted' })
      .expect(201);

    await request(APP_URL)
      .delete(`/api/v1/posts/${post.id}`)
      .auth(author.token, { type: 'bearer' })
      .expect(200);
    await request(APP_URL).get(`/api/v1/posts/${post.id}`).expect(404);
    await request(APP_URL)
      .post('/api/v1/posts/search')
      .send({ withDeleted: true })
      .expect(422);
    await request(APP_URL)
      .post(`/api/v1/posts/${post.id}/recover`)
      .auth(other.token, { type: 'bearer' })
      .expect(403);
    await request(APP_URL)
      .post(`/api/v1/posts/${post.id}/recover`)
      .auth(author.token, { type: 'bearer' })
      .expect(201);
    await request(APP_URL).get(`/api/v1/posts/${post.id}`).expect(200);
  });

  it('lists publicly with offset pagination, filters by author and caps limit', async () => {
    await request(APP_URL)
      .post('/api/v1/posts')
      .auth(other.token, { type: 'bearer' })
      .send({ title: 'Other', content: 'from other user' })
      .expect(201);

    const { body: page } = await request(APP_URL)
      .get('/api/v1/posts')
      .query({ limit: 1, offset: 0 })
      .expect(200);
    expect(page.data).toHaveLength(1);
    expect(page.metadata).toMatchObject({ page: 1, offset: 1 });
    expect(page.metadata.total).toBeGreaterThanOrEqual(4);

    const { body: mine } = await request(APP_URL)
      .get('/api/v1/posts')
      .query({ authorId: other.userId })
      .expect(200);
    expect(mine.data.length).toBeGreaterThan(0);
    expect(
      mine.data.every(
        (post: { authorId: number }) => post.authorId === other.userId,
      ),
    ).toBe(true);

    await request(APP_URL)
      .get('/api/v1/posts')
      .query({ limit: 101 })
      .expect(422);
  });

  it('never exposes the author relation or password hashes on reads', async () => {
    const { body: list } = await request(APP_URL)
      .get('/api/v1/posts')
      .expect(200);
    const { body: one } = await request(APP_URL)
      .get(`/api/v1/posts/${list.data[0].id}`)
      .expect(200);
    const { body: found } = await request(APP_URL)
      .post('/api/v1/posts/search')
      .send({})
      .expect(200);

    for (const body of [list, one, found]) {
      expect(JSON.stringify(body)).not.toMatch(/password|\$2[aby]\$/);
    }
    expect(one.author).toBeUndefined();
  });

  it('documents the generated routes in Swagger', async () => {
    const { body } = await request(APP_URL).get('/docs-json').expect(200);
    expect(Object.keys(body.paths)).toEqual(
      expect.arrayContaining([
        '/api/v1/posts',
        '/api/v1/posts/{id}',
        '/api/v1/posts/{id}/recover',
      ]),
    );
  });
});
