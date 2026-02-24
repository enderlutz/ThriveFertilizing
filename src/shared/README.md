# Shared

Shared types, utilities, and constants used across frontend, backend, and AI agent.

## Contents

- `types/` - TypeScript type definitions
- `constants/` - Shared constants
- `utils/` - Common utility functions
- `validators/` - Input validation schemas

## Usage

Import shared code from this directory in any other module:

```typescript
import { CustomerType, JobStage } from '@shared/types';
import { validateEmail } from '@shared/validators';
```
