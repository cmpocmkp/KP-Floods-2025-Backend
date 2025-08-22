# Floods Database Schema

This document describes the floods database schema and how to use it.

## Overview

The floods database contains the following tables in the `floods` schema:

- `livestock_losses` - Livestock damage and losses
- `human_losses` - Human casualties and injuries
- `cnw_assets` - Communication & Works (C&W) infrastructure damage
- `agriculture_impacts` - Agricultural damage and losses
- `energy_power_assets` - Energy and power infrastructure damage
- `irrigation_assets` - Irrigation infrastructure damage
- `housing_impacts` - Housing and building damage
- `affected_district_coordinates` - Geographic coordinates of affected districts

## Migration

### Running the Migration

The migration runs automatically when the application starts. The migration is idempotent and safe to run multiple times.

To manually trigger the migration, you can call the `FloodsMigrationService.runMigration()` method.

### What the Migration Does

1. Creates the `floods` schema if it doesn't exist
2. Enables the `pgcrypto` extension for UUID generation
3. Creates all flood-related tables with proper indexes and constraints
4. Adds unique indexes on `(district, report_date)` for upsert operations

## API Endpoints

Each flood data type has its own set of endpoints following this pattern:

### Livestock Losses

- `POST /floods/livestock-losses` - Upsert livestock losses data
- `GET /floods/livestock-losses` - Get all livestock losses (supports filters)
- `GET /floods/livestock-losses/:id` - Get specific record by ID

### Human Losses

- `POST /floods/human-losses` - Upsert human losses data
- `GET /floods/human-losses` - Get all human losses (supports filters)
- `GET /floods/human-losses/:id` - Get specific record by ID

### C&W Assets

- `POST /floods/cnw-assets` - Upsert C&W assets data
- `GET /floods/cnw-assets` - Get all C&W assets (supports filters)
- `GET /floods/cnw-assets/:id` - Get specific record by ID

### Agriculture Impacts

- `POST /floods/agriculture-impacts` - Upsert agriculture impacts data
- `GET /floods/agriculture-impacts` - Get all agriculture impacts (supports filters)
- `GET /floods/agriculture-impacts/:id` - Get specific record by ID

### Energy & Power Assets

- `POST /floods/energy-power-assets` - Upsert energy & power assets data
- `GET /floods/energy-power-assets` - Get all energy & power assets (supports filters)
- `GET /floods/energy-power-assets/:id` - Get specific record by ID

### Irrigation Assets

- `POST /floods/irrigation-assets` - Upsert irrigation assets data
- `GET /floods/irrigation-assets` - Get all irrigation assets (supports filters)
- `GET /floods/irrigation-assets/:id` - Get specific record by ID

### Housing Impacts

- `POST /floods/housing-impacts` - Upsert housing impacts data
- `GET /floods/housing-impacts` - Get all housing impacts (supports filters)
- `GET /floods/housing-impacts/:id` - Get specific record by ID

### District Coordinates

- `POST /floods/district-coordinates` - Create new district coordinates
- `POST /floods/district-coordinates/upsert` - Upsert district coordinates
- `GET /floods/district-coordinates` - Get all district coordinates (supports filters)
- `GET /floods/district-coordinates/:district` - Get coordinates by district name
- `PUT /floods/district-coordinates/:district` - Update district coordinates
- `DELETE /floods/district-coordinates/:district` - Delete district coordinates

## Data Access Functions

Each module provides two main data access functions:

### 1. upsertByDistrictAndDate(payload)

Inserts or updates a record using `(district, report_date)` as the natural key.

**Example:**

```typescript
const livestockService = new LivestockLossesService();

const data = {
  report_date: "2024-01-15",
  division: "Peshawar",
  district: "Nowshera",
  cattles_perished: 50,
  big_cattles: 30,
  small_cattles: 20,
  notes: "Flood damage assessment",
};

const result = await livestockService.upsertByDistrictAndDate(data);
```

### 2. getByFilters({ division?, district?, dateFrom?, dateTo? })

Returns filtered records based on the provided criteria.

**Example:**

```typescript
// Get all records for a specific district
const records = await livestockService.getByFilters({
  district: "Nowshera",
});

// Get records for a date range
const records = await livestockService.getByFilters({
  dateFrom: "2024-01-01",
  dateTo: "2024-01-31",
});

// Get records for a specific division and date range
const records = await livestockService.getByFilters({
  division: "Peshawar",
  dateFrom: "2024-01-01",
  dateTo: "2024-01-31",
});
```

## API Usage Examples

### Creating/Updating Data

```bash
# Upsert livestock losses data
curl -X POST http://localhost:3000/floods/livestock-losses \
  -H "Content-Type: application/json" \
  -d '{
    "report_date": "2024-01-15",
    "division": "Peshawar",
    "district": "Nowshera",
    "cattles_perished": 50,
    "big_cattles": 30,
    "small_cattles": 20,
    "notes": "Flood damage assessment"
  }'
```

### Reading Data

```bash
# Get all livestock losses
curl http://localhost:3000/floods/livestock-losses

# Get livestock losses for specific district
curl "http://localhost:3000/floods/livestock-losses?district=Nowshera"

# Get livestock losses for date range
curl "http://localhost:3000/floods/livestock-losses?dateFrom=2024-01-01&dateTo=2024-01-31"

# Get livestock losses for specific division and date range
curl "http://localhost:3000/floods/livestock-losses?division=Peshawar&dateFrom=2024-01-01&dateTo=2024-01-31"

# Get all C&W assets data
curl http://localhost:3000/floods/cnw-assets

# Get all agriculture impacts data
curl http://localhost:3000/floods/agriculture-impacts

# Get all energy & power assets data
curl http://localhost:3000/floods/energy-power-assets

# Get all irrigation assets data
curl http://localhost:3000/floods/irrigation-assets

# Get all housing impacts data
curl http://localhost:3000/floods/housing-impacts

# Get all district coordinates
curl http://localhost:3000/floods/district-coordinates

# Get specific district coordinates
curl http://localhost:3000/floods/district-coordinates/Nowshera
```

## Database Schema Details

### Key Features

1. **UUID Primary Keys**: All tables use UUID primary keys for better scalability
2. **Indexes**: Optimized indexes on location (division, district) and date fields
3. **Unique Constraints**: Each table has a unique constraint on (district, report_date) for upsert operations
4. **Check Constraints**: Numeric fields have check constraints to ensure non-negative values
5. **Generated Columns**: The coordinates table has a generated column for lat/lng formatting

### Common Fields

All tables (except coordinates) share these common fields:

- `id` - UUID primary key
- `report_date` - Date of the report
- `division` - Administrative division
- `district` - District name
- `department` - Responsible department (with defaults)
- `notes` - Optional notes/comments
- `source` - Data source information
- `created_at` - Timestamp when record was created

### Data Types

- **Numeric fields**: Use `NUMERIC` type with appropriate precision and scale
- **Text fields**: Use `TEXT` type for flexible length
- **Dates**: Use `DATE` type for report dates, `TIMESTAMPTZ` for timestamps
- **Coordinates**: Use `DOUBLE PRECISION` for latitude/longitude

## Development Notes

1. The migration service runs automatically on application startup
2. All entities are properly configured with TypeORM decorators
3. DTOs include validation rules using class-validator
4. Swagger documentation is available at `/api` endpoint
5. Each module follows NestJS best practices with proper separation of concerns

## Next Steps

To add more flood data modules:

1. Create entity in `src/floods/entities/`
2. Create DTO in `src/floods/dtos/`
3. Create service, controller, and module in `src/floods/[module-name]/`
4. Add to main `FloodsModule`
5. Update migration service to create the table

## Database Connection

The floods schema uses the existing database connection configured in the application. No additional database setup is required beyond running the migration.
