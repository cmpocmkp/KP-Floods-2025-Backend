import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('API Endpoints (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: { enableImplicitConversion: true },
    }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/api/overview', () => {
    it('should return overview data', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/overview')
        .expect(200);

      expect(response.body).toHaveProperty('report_period');
      expect(response.body).toHaveProperty('totals');
      expect(response.body.totals).toHaveProperty('deaths');
      expect(response.body.totals).toHaveProperty('injured');
      expect(response.body.totals).toHaveProperty('houses_damaged');
      expect(response.body.totals).toHaveProperty('schools_damaged');
      expect(response.body.totals).toHaveProperty('livestock_lost');
      expect(response.body).toHaveProperty('last_updated');
      expect(response.body).toHaveProperty('sources');
    });
  });

  describe('/api/distribution/damage', () => {
    it('should return damage distribution data', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/distribution/damage')
        .expect(200);

      expect(response.body).toHaveProperty('total_incidents');
      expect(response.body).toHaveProperty('buckets');
      expect(Array.isArray(response.body.buckets)).toBe(true);
      expect(response.body.buckets.length).toBeGreaterThan(0);
      expect(response.body.buckets[0]).toHaveProperty('key');
      expect(response.body.buckets[0]).toHaveProperty('value');
    });
  });

  describe('/api/summaries/divisions', () => {
    it('should return division-wise summary data', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/summaries/divisions')
        .expect(200);

      expect(response.body).toHaveProperty('rows');
      expect(Array.isArray(response.body.rows)).toBe(true);
      expect(response.body).toHaveProperty('totals');
      expect(response.body).toHaveProperty('last_updated');
      expect(response.body.rows[0]).toHaveProperty('division');
      expect(response.body.rows[0]).toHaveProperty('deaths');
      expect(response.body.rows[0]).toHaveProperty('injured');
      expect(response.body.rows[0]).toHaveProperty('houses_damaged');
      expect(response.body.rows[0]).toHaveProperty('schools_damaged');
      expect(response.body.rows[0]).toHaveProperty('livestock_lost');
    });
  });

  describe('/api/trends/incidents', () => {
    it('should return province-wide incident trends', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/trends/incidents')
        .expect(200);

      expect(response.body).toHaveProperty('metric');
      expect(response.body).toHaveProperty('scope');
      expect(response.body).toHaveProperty('group_by');
      expect(response.body).toHaveProperty('series');
      expect(Array.isArray(response.body.series)).toBe(true);
      expect(response.body).toHaveProperty('last_updated');
      expect(response.body).toHaveProperty('source');
    });

    it('should return district-specific incident trends', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/trends/incidents?district=Peshawar')
        .expect(200);

      expect(response.body).toHaveProperty('metric');
      expect(response.body).toHaveProperty('scope');
      expect(response.body.scope).toHaveProperty('district');
      expect(response.body.scope.district).toBe('Peshawar');
      expect(response.body).toHaveProperty('series');
      expect(Array.isArray(response.body.series)).toBe(true);
    });
  });

  describe('/api/trends/incidents/by-district', () => {
    it('should return multi-district trends', async () => {
      const response = await request(app.getHttpServer())
        .get('/api/trends/incidents/by-district')
        .expect(200);

      expect(response.body).toHaveProperty('metric');
      expect(response.body).toHaveProperty('series');
      expect(Array.isArray(response.body.series)).toBe(true);
      if (response.body.series.length > 0) {
        expect(response.body.series[0]).toHaveProperty('district');
        expect(response.body.series[0]).toHaveProperty('series');
        expect(Array.isArray(response.body.series[0].series)).toBe(true);
      }
    });
  });

  // Performance test
  describe('Response times', () => {
    it('should respond within 200ms for a 30-day window', async () => {
      const dateFrom = new Date();
      dateFrom.setDate(dateFrom.getDate() - 30);
      const dateTo = new Date();

      const startTime = Date.now();
      await request(app.getHttpServer())
        .get('/api/overview')
        .query({
          date_from: dateFrom.toISOString().split('T')[0],
          date_to: dateTo.toISOString().split('T')[0],
        })
        .expect(200);
      const endTime = Date.now();

      expect(endTime - startTime).toBeLessThan(200);
    });
  });
});