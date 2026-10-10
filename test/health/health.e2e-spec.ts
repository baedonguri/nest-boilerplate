import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { APP_URL } from '../utils/constants.js';

describe('Health and request id', () => {
  it('liveness answers without touching dependencies', async () => {
    const { body } = await request(APP_URL).get('/api/health/live').expect(200);
    expect(body).toEqual({ status: 'ok' });
  });

  it('readiness checks the database (and /api/health stays as its alias)', async () => {
    for (const path of ['/api/health/ready', '/api/health']) {
      const { body } = await request(APP_URL).get(path).expect(200);
      expect(body.details.database.status).toBe('up');
    }
  });

  it('echoes a sane x-request-id and mints one otherwise', async () => {
    const echoed = await request(APP_URL)
      .get('/api/health/live')
      .set('x-request-id', 'e2e-req-1')
      .expect(200);
    expect(echoed.headers['x-request-id']).toBe('e2e-req-1');

    const minted = await request(APP_URL).get('/api/health/live').expect(200);
    expect(minted.headers['x-request-id']).toMatch(/^[0-9a-f-]{36}$/);

    const replaced = await request(APP_URL)
      .get('/api/health/live')
      .set('x-request-id', 'bad id with spaces')
      .expect(200);
    expect(replaced.headers['x-request-id']).toMatch(/^[0-9a-f-]{36}$/);
  });
});
