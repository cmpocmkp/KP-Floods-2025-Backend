# Floods 2025 Backend-service current & the future

The aim of this docoument is to list core libraries which are used for creating Floods 2025 Backend-service platform and to mention how to maintian them in the long run.

**Note:** This must be considered as a living document and should be constantly updated if and when we upgrade core platform libraries

## Core platform libraries

| Lib/Runtime | Version |
| ----------- | ------- |
| Node.js     | v22.7.0 |
| Npm         | 10.8.2  |
| Typescript  | v8.0.0  |
| eslint      | v8.0.0  |

## Future Maintenance

### General Guidelines

Core platform libraries upgrade should be taken with utmost priority. Attention must be paid to following when ugrading core libraries:

- Breaking changes - Check release information for that
- Backward compatibility
- All the tests must be run to ensure everything is working as expected
- All the lint/building tasks must be run on the depdendent packages and on the workspace as a whole
