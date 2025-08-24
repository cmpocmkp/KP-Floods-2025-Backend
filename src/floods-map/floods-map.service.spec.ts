import { Test, TestingModule } from '@nestjs/testing';
import { getDataSourceToken } from '@nestjs/typeorm';
import { FloodsMapService } from './floods-map.service';
import { BadRequestException } from '@nestjs/common';
import { TrendMetric } from './dtos/trend-params.dto';

describe('FloodsMapService', () => {
  let service: FloodsMapService;
  let mockDataSource: any;

  const mockDistrict = {
    district: 'peshawar',
    latitude: 34.0123,
    longitude: 71.5432,
  };

  const mockIncident = {
    district: 'peshawar',
    latest_report_date: '2025-08-20',
    deaths: 12,
    injured: 28,
    houses_damaged: 156,
  };

  const mockSchool = {
    district: 'peshawar',
    schools_damaged: 9,
  };

  const mockLivestock = {
    district: 'peshawar',
    livestock_lost: 23,
  };

  const mockCnw = {
    district: 'peshawar',
    roads_damaged_km: 78.5,
    bridges_damaged: 5,
    culverts_damaged: 23,
  };

  beforeEach(async () => {
    mockDataSource = {
      createQueryBuilder: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      addSelect: jest.fn().mockReturnThis(),
      from: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      getRawMany: jest.fn().mockResolvedValue([mockDistrict]),
      query: jest.fn().mockImplementation((query) => {
        if (query.includes('district_incidents_reported')) {
          return Promise.resolve([mockIncident]);
        }
        if (query.includes('district_casualties_trend_daily')) {
          return Promise.resolve([{ date: '2025-08-20', value: 12 }]);
        }
        return Promise.resolve([]);
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FloodsMapService,
        {
          provide: getDataSourceToken(),
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<FloodsMapService>(FloodsMapService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getDateRange', () => {
    it('should return correct date range when both dates provided', () => {
      const params = {
        date_from: '2025-08-14',
        date_to: '2025-08-20',
      };

      const result = (service as any).getDateRange(params);
      expect(result.from).toEqual(new Date('2025-08-14'));
      expect(result.to).toEqual(new Date('2025-08-20'));
    });

    it('should default to last 7 days when no dates provided', () => {
      const params = {};
      const result = (service as any).getDateRange(params);
      
      const now = new Date();
      const sevenDaysAgo = new Date(now);
      sevenDaysAgo.setDate(now.getDate() - 7);

      expect(result.from.toDateString()).toEqual(sevenDaysAgo.toDateString());
      expect(result.to.toDateString()).toEqual(now.toDateString());
    });

    it('should throw BadRequestException when from date is after to date', () => {
      const params = {
        date_from: '2025-08-20',
        date_to: '2025-08-14',
      };

      expect(() => (service as any).getDateRange(params)).toThrow(BadRequestException);
    });

    it('should throw BadRequestException for invalid date format', () => {
      const params = {
        date_from: 'invalid-date',
        date_to: '2025-08-20',
      };

      expect(() => (service as any).getDateRange(params)).toThrow(BadRequestException);
    });
  });

  describe('getDistrictGeoJson', () => {
    it('should return GeoJSON with metrics', async () => {
      mockDataSource.getRawMany
        .mockResolvedValueOnce([mockDistrict]) // coordinates
        .mockResolvedValueOnce([mockSchool]) // schools
        .mockResolvedValueOnce([mockLivestock]) // livestock
        .mockResolvedValueOnce([mockCnw]); // cnw

      const result = await service.getDistrictGeoJson({});

      expect(result.type).toBe('FeatureCollection');
      expect(result.features).toHaveLength(1);

      const feature = result.features[0];
      expect(feature.type).toBe('Feature');
      expect(feature.geometry.type).toBe('Point');
      expect(feature.geometry.coordinates).toEqual([mockDistrict.longitude, mockDistrict.latitude]);

      const props = feature.properties;
      expect(props.district).toBe(mockDistrict.district);
      expect(props.deaths).toBe(mockIncident.deaths);
      expect(props.schools_damaged).toBe(mockSchool.schools_damaged);
      expect(props.livestock_lost).toBe(mockLivestock.livestock_lost);
      expect(props.roads_damaged_km).toBe(mockCnw.roads_damaged_km);
    });

    it('should return zero values for missing metrics', async () => {
      mockDataSource.getRawMany
        .mockResolvedValueOnce([mockDistrict]) // coordinates
        .mockResolvedValueOnce([]) // schools
        .mockResolvedValueOnce([]) // livestock
        .mockResolvedValueOnce([]); // cnw
      mockDataSource.query.mockResolvedValueOnce([]); // incidents

      const result = await service.getDistrictGeoJson({});
      const props = result.features[0].properties;

      expect(props.deaths).toBe(0);
      expect(props.schools_damaged).toBe(0);
      expect(props.livestock_lost).toBe(0);
      expect(props.roads_damaged_km).toBe(0);
    });
  });

  describe('getTrend', () => {
    it('should return trend data from casualties table', async () => {
      const params = {
        metric: TrendMetric.DEATHS,
        date_from: '2025-08-14',
        date_to: '2025-08-20',
      };

      const result = await service.getTrend(params);

      expect(result.metric).toBe(TrendMetric.DEATHS);
      expect(result.series).toHaveLength(1);
      expect(result.series[0]).toEqual({
        date: '2025-08-20',
        value: 12,
      });
    });

    it('should fall back to incidents table when no casualties data', async () => {
      const params = {
        metric: TrendMetric.DEATHS,
        date_from: '2025-08-14',
        date_to: '2025-08-20',
      };

      mockDataSource.query
        .mockResolvedValueOnce([]) // casualties returns empty
        .mockResolvedValueOnce([{ date: '2025-08-20', value: 15 }]); // incidents has data

      const result = await service.getTrend(params);

      expect(result.metric).toBe(TrendMetric.DEATHS);
      expect(result.series).toHaveLength(1);
      expect(result.series[0]).toEqual({
        date: '2025-08-20',
        value: 15,
      });
    });
  });
});