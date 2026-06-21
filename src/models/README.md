# Models

This directory contains Sequelize models for the GetFitter application. Each model represents a table in the database and follows a consistent pattern.

## Model Loading and Initialization

The `src/models/index.ts` file is responsible for:
- Dynamically loading all model files in the directory (excluding itself and non-JS/TS files)
- Separating models into two arrays:
  - Those with an `initializeModel` method
  - Those with an `associate` method
- Calling `initializeModel` on all models that have it
- Calling `associate` on all models that have it

This two-pass approach ensures that all models are defined before associations are set up.

## Example

See `bodypartcategory.model.ts` for a standard model with associations and initialization.

See `equipment.model.ts` for a model that also includes a transformation method for API responses.

## Guidelines

- Ensure the model class is exported as the default export so that `src/models/index.ts` can automatically load it.
- Use the `@ModelWithInitialization()` and `@ModelWithAssociations()` decorators to mark the class as initializable and associatable, enabling automatic loading and initialization.
- Use UUIDv7 for primary keys (generated via `uuidv7()`).
- Enable paranoid mode (soft deletes) for all models.
- Keep attribute definitions consistent with the database schema.
- Place association definitions in the `associate` method.
- Place model initialization (attributes, indexes, etc.) in the `initializeModel` method.
- Use transformation methods to encapsulate API response formatting.

## Pattern

Each model file follows this structure:

1. **Imports**: 
   - Sequelize types (`DataTypes`, `Model`, `Optional`)
   - Utility functions (like `uuidv7` for UUID generation)
   - The Sequelize instance from `@/config/database`
   - Related models (for associations)
   - Decorator interfaces from `@/types/base.models`

2. **Attribute Interfaces**:
   - `*Attributes`: Defines the model attributes (including timestamps)
   - `*CreationAttributes`: Defines which attributes are optional when creating an instance (using `Optional` to exclude auto-generated fields)

3. **Decorators**:
   - `@ModelWithAssociations()`: Marks the model as having an `associate` method
   - `@ModelWithInitialization()`: Marks the model as having an `initializeModel` method
   - `@ModelWithTransformation()`: (Optional) Marks the model as having a `transform` method for DTO conversion

4. **Class Definition**:
   - Extends `Model<*Attributes, *CreationAttributes>`
   - Declares TypeScript properties for each attribute (using `declare`)
   - Defines static methods:
     - `associate()`: Defines associations with other models (using Sequelize's `hasMany`, `belongsTo`, etc.)
     - `initializeModel()`: Initializes the model with Sequelize's `init` method, defining attributes and options (table name, paranoid mode, etc.)
     - `transform()`: (If present) Converts model instance to a DTO for API responses

5. **Export**:
   - The class is exported as the default export