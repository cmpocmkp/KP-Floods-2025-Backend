import { Test, TestingModule } from '@nestjs/testing';
import { FloodsMapController } from './floods-map.controller';
import { FloodsMapService } from './floods-map.service';
import { TrendMetric } from './dtos/trend-params.dto';

describe('FloodsMapController', () => {
  let controller: FloodsMapController;
  let service: FloodsMapService;

  const mockGeoJsonResponse = {
    type: 'FeatureCollection' as const,
    features: [
      {
        type: 'Feature' as const,
        geometry: {
          type: 'Point' as const,
          coordinates: [71.5432, 34.0123],
        },
        properties: {
          district: 'Peshawar',
          latest_report_date: '2025-08-20',
          deaths: 12,
          injured: 28,
          houses_damaged: 156,
          schools_damaged: 9,
          livestock_lost: 23,
          roads_damaged_km: 78.5,
          bridges_damaged: 5,
          culverts_damaged: 23,
        },
      },
    ],
  };

  const mockOverviewResponse = {
    report_period: {
      from: '2025-08-14',
      to: '2025-08-20',
    },
    totals: {
      deaths: 156,
      injured: 342,
      houses_damaged: 1245,
      livestock_lost: 789,
      schools_damaged: 126,
    },
    last_updated: '2025-08-20T15:52:00Z',
  };

  const mockTrendResponse = {
    metric: TrendMetric.DEATHS,
    series: [
      { date: '2025-08-14', value: 145 },
      { date: '2025-08-15', value: 162 },
    ],
  };

  const mockDivisionSummaryResponse = {
    rows: [
      {
        division: 'Peshawar',
        deaths: 45,
        injured: 98,
        houses_damaged: 345,
        schools_damaged: 12,
        livestock_lost: 234,
      },
    ],
    totals: {
      deaths: 156,
      injured: 342,
      houses_damaged: 1245,
      schools_damaged: 126,
      livestock_lost: 789,
    },
  };

  const mockDistrictSummaryResponse = {
    district: 'Peshawar',
    latest_report_date: '2025-08-20',
    deaths: 12,
    injured: 28,
    houses_damaged: 156,
    schools_damaged: 9,
    livestock_lost: 23,
    cw: {
      roads_km: 78.5,
      bridges: 5,
      culverts: 23,
    },
    notes: [],
    sources: [
      'dmis.district_incidents_reported',
      'floods.esed_school_damages',
      'floods.livestock_losses',
      'floods.cnw_assets',
    ],
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FloodsMapController],
      providers: [
        {
          provide: FloodsMapService,
          useValue: {
            getDistrictGeoJson: jest.fn().mockResolvedValue(mockGeoJsonResponse),
            getOverview: jest.fn().mockResolvedValue(mockOverviewResponse),
            getTrend: jest.fn().mockResolvedValue(mockTrendResponse),
            getDivisionSummaries: jest.fn().mockResolvedValue(mockDivisionSummaryResponse),
            getDistrictSummary: jest.fn().mockResolvedValue(mockDistrictSummaryResponse),
          },
        },
      ],
    }).compile();

    controller = module.get<FloodsMapController>(FloodsMapController);
    service = module.get<FloodsMapService>(FloodsMapService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getDistrictGeoJson', () => {
    it('should return GeoJSON response', async () => {
      const params = { date_from: '2025-08-14', date_to: '2025-08-20' };
      const result = await controller.getDistrictGeoJson(params);

      expect(result).toEqual(mockGeoJsonResponse);
      expect(service.getDistrictGeoJson).toHaveBeenCalledWith(params);
    });
  });

  describe('getOverview', () => {
    it('should return overview response', async () => {
      const params = { date_from: '2025-08-14', date_to: '2025-08-20' };
      const result = await controller.getOverview(params);

      expect(result).toEqual(mockOverviewResponse);
      expect(service.getOverview).toHaveBeenCalledWith(params);
    });
  });

  describe('getTrend', () => {
    it('should return trend response', async () => {
      const params = {
        date_from: '2025-08-14',
        date_to: '2025-08-20',
        metric: TrendMetric.DEATHS,
      };
      const result = await controller.getTrend(params);

      expect(result).toEqual(mockTrendResponse);
      expect(service.getTrend).toHaveBeenCalledWith(params);
    });
  });

  describe('getDivisionSummaries', () => {
    it('should return division summary response', async () => {
      const params = { date_from: '2025-08-14', date_to: '2025-08-20' };
      const result = await controller.getDivisionSummaries(params);

      expect(result).toEqual(mockDivisionSummaryResponse);
      expect(service.getDivisionSummaries).toHaveBeenCalledWith(params);
    });
  });

  describe('getDistrictSummary', () => {
    it('should return district summary response', async () => {
      const district = 'Peshawar';
      const params = { date_from: '2025-08-14', date_to: '2025-08-20' };
      const result = await controller.getDistrictSummary(district, params);

      expect(result).toEqual(mockDistrictSummaryResponse);
      expect(service.getDistrictSummary).toHaveBeenCalledWith(district, params);
    });
  });
});