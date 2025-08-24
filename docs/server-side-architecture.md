# Floods 2025 Server-Side Architecture

## Folder Structure

The folder structure of a server-side application is critical for ensuring scalability, maintainability, and ease of use. While Node.js and NestJS applications often start small, as the application grows in size and complexity, a poorly designed structure can lead to significant challenges, such as:

1.Difficulty finding and navigating files
2.Poor separation of concerns, resulting in tightly coupled modules
3.Challenges in introducing new features or making improvements
4.Difficulties in upgrading dependencies or configurations
5.Complications in onboarding new developers
6.Lack of ownership for specific modules or domains

A robust folder structure addresses these issues and provides key benefits:

1.Simplified navigation
2.Clear module boundaries for independent changes
3.Easier upgrades and maintenance
4.Clear separation of concerns
5.Reduced inter-module dependencies
6.Defined ownership for each module or feature
7.Enhanced scalability

## Common Initial Structure in Node.js/NestJS

A typical Node.js or NestJS project often begins with the following structure:

/src
/controllers
/services
/modules
/dtos
/entities
/utils

While this structure is sufficient for small applications, it does not scale well as the application grows in size or complexity. It can lead to tightly coupled modules and hinder maintainability.

## Scalable Folder Structure for Node.js/NestJS

To build enterprise-grade applications, it’s essential to adopt a modular and feature-based structure. Each feature or domain should be isolated into its own module, with strict boundaries and a clear API for interaction. This approach ensures scalability and maintainability.

/src
/core # Core functionalities shared across the application
/exceptions # Custom exceptions
/filters # Global filters (e.g., HTTP exceptions)
/interceptors # Custom interceptors
/middlewares # Global middlewares
/decorators # Custom decorators
/pipes # Global pipes
/modules # Feature-specific modules
/users # User module (example)
/controllers # Controllers for this module
/services # Services for this module
/dtos # DTOs (Data Transfer Objects) for this module
/entities # Entities or schemas for this module
/interfaces # Interfaces for this module
/tests # Module-specific tests
/auth # Authentication module (example)
/controllers
/services
/guards # Guards specific to this module
/strategies # Passport strategies (e.g., JWT, local)
/dtos
/entities
/interfaces
/shared # Shared resources (used across modules)
/dtos # Shared DTOs
/entities # Shared entities or schemas
/services # Shared services (e.g., logging, notifications)
/interfaces # Shared interfaces
/constants # Shared constants
/utils # Shared utility functions
/config # Configuration files
/database.ts # Database configuration
/app.config.ts # Application-wide configuration
/migrations # Database migrations
/seeds # Database seeding scripts
/tests # Global tests

## Guidelines for Floods 2025 Application

## Rule #1: Organize by Feature

Instead of organizing the application by roles (e.g., controllers, services), organize it by features or domains. For example:

## Old Structure (By Role):

/controllers
└── users.controller.ts
/services
└── users.service.ts
/entities
└── user.entity.ts

## Improved Structure (By Feature):

/modules
└── /users
├── /controllers
│ └── users.controller.ts
├── /services
│ └── users.service.ts
└── /entities
└── user.entity.ts

This approach ensures that everything related to a feature is grouped together, reducing navigation overhead and improving maintainability.

## Rule #2: Create Strict Module Boundaries

Each module should expose a well-defined public API, typically through its index.ts or module definition file. Avoid importing internal files from one module to another.

## Rule #3: Avoid Circular Dependencies

Circular dependencies occur when two or more modules depend on each other directly or indirectly, leading to runtime issues. To avoid this:

Use dependency injection wherever possible.
Refactor shared logic into a separate shared module.
Avoid importing deep internal files of another module.
