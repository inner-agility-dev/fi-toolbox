# Tiles Toolbox Backend API Specification

## System Overview

The Tiles Toolbox is a configuration management platform that enables financial institutions to customize and manage their UI components (tiles) across different platforms (App/Desktop/Mobile) and audiences (Consumer/Business).

## Core Entities

### 1. Users
```json
{
  "id": "uuid",
  "email": "string",
  "name": "string",
  "role": "admin|editor|viewer",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

### 2. Financial Institutions (FIs)
```json
{
  "id": "uuid",
  "name": "string",
  "slug": "string",
  "logo_url": "string",
  "created_by": "user_id",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

### 3. Configurations
```json
{
  "id": "uuid",
  "fi_id": "uuid",
  "name": "string",
  "description": "string",
  "is_active": "boolean",
  "version": "integer",
  "created_by": "user_id",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

### 4. Configuration Data
```json
{
  "id": "uuid",
  "configuration_id": "uuid",
  "mode": "app|desktop|mobile",
  "audience": "consumer|business",
  "tile_structure": "json",
  "settings": "json",
  "created_at": "timestamp",
  "updated_at": "timestamp"
}
```

### 5. Tiles
```json
{
  "id": "uuid",
  "name": "string",
  "type": "spending_wheel|budget_card|cashflow|etc",
  "category": "string",
  "default_config": "json",
  "is_system": "boolean",
  "created_at": "timestamp"
}
```

### 6. Share Links
```json
{
  "id": "uuid",
  "configuration_id": "uuid",
  "token": "string",
  "expires_at": "timestamp",
  "created_by": "user_id",
  "created_at": "timestamp"
}
```

## Database Schema

```sql
-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'editor',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Financial Institutions
CREATE TABLE financial_institutions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    logo_url TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Configurations
CREATE TABLE configurations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fi_id UUID REFERENCES financial_institutions(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT FALSE,
    version INTEGER DEFAULT 1,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(fi_id, name)
);

-- Configuration Data (per mode/audience)
CREATE TABLE configuration_data (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    configuration_id UUID REFERENCES configurations(id) ON DELETE CASCADE,
    mode VARCHAR(50) NOT NULL, -- app, desktop, mobile
    audience VARCHAR(50) NOT NULL, -- consumer, business
    tile_structure JSONB NOT NULL,
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(configuration_id, mode, audience)
);

-- Available Tiles
CREATE TABLE tiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(100),
    default_config JSONB DEFAULT '{}',
    is_system BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Share Links
CREATE TABLE share_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    configuration_id UUID REFERENCES configurations(id) ON DELETE CASCADE,
    token VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Audit Log
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id),
    fi_id UUID REFERENCES financial_institutions(id),
    configuration_id UUID REFERENCES configurations(id),
    action VARCHAR(100) NOT NULL,
    details JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

-- User FI Access (for V2)
CREATE TABLE user_fi_access (
    user_id UUID REFERENCES users(id),
    fi_id UUID REFERENCES financial_institutions(id),
    permission VARCHAR(50) DEFAULT 'edit', -- view, edit, admin
    created_at TIMESTAMP DEFAULT NOW(),
    PRIMARY KEY (user_id, fi_id)
);
```

## API Endpoints

### Authentication
```
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh
GET    /api/auth/me
```

### Financial Institutions
```
GET    /api/fis                          # List all FIs
POST   /api/fis                          # Create new FI
GET    /api/fis/:id                      # Get FI details
PUT    /api/fis/:id                      # Update FI
DELETE /api/fis/:id                      # Delete FI
POST   /api/fis/:id/clone                # Clone FI configuration
```

### Configurations
```
GET    /api/fis/:fi_id/configurations           # List configs for FI
POST   /api/fis/:fi_id/configurations           # Create new config
GET    /api/configurations/:id                  # Get config details
PUT    /api/configurations/:id                  # Update config
DELETE /api/configurations/:id                  # Delete config
POST   /api/configurations/:id/activate         # Make config active
POST   /api/configurations/:id/clone            # Clone configuration
GET    /api/configurations/:id/export           # Export configuration
POST   /api/configurations/:id/import           # Import configuration
```

### Configuration Data
```
GET    /api/configurations/:id/data                    # Get all config data
GET    /api/configurations/:id/data/:mode/:audience    # Get specific mode/audience data
PUT    /api/configurations/:id/data/:mode/:audience    # Update specific data
POST   /api/configurations/:id/data/bulk              # Bulk update data
```

### Tiles
```
GET    /api/tiles                        # List available tiles
GET    /api/tiles/:type                  # Get tile details
POST   /api/tiles                        # Create custom tile
PUT    /api/tiles/:id                    # Update tile
DELETE /api/tiles/:id                    # Delete custom tile
```

### Preview & Rendering
```
POST   /api/preview/render               # Render preview with JWT context
GET    /api/preview/:config_id           # Get preview for configuration
POST   /api/preview/jwt                  # Load preview with JWT data
```

### Export & Sharing
```
POST   /api/share/link                   # Generate share link
GET    /api/share/:token                 # Get shared configuration
POST   /api/export/html                  # Download tiles.html
POST   /api/export/json                  # Export configuration as JSON
GET    /api/export/template/:fi_id       # Export as template
```

### Templates
```
GET    /api/templates                    # List available templates
GET    /api/templates/:id                # Get template details
POST   /api/templates                    # Create template from config
```

### Audit & History
```
GET    /api/audit/fis/:fi_id            # Get audit log for FI
GET    /api/audit/configurations/:id     # Get audit log for config
GET    /api/configurations/:id/versions  # Get version history
POST   /api/configurations/:id/restore   # Restore previous version
```

## Detailed API Examples

### 1. Create Financial Institution
```http
POST /api/fis
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "First National Bank",
  "slug": "first-national-bank",
  "logo_url": "https://example.com/logo.png"
}

Response: 201 Created
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "name": "First National Bank",
  "slug": "first-national-bank",
  "logo_url": "https://example.com/logo.png",
  "created_by": "user-id",
  "created_at": "2024-01-01T00:00:00Z"
}
```

### 2. Create Configuration
```http
POST /api/fis/{fi_id}/configurations
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Q1 2024 Config",
  "description": "Updated configuration for Q1 2024",
  "clone_from": "existing-config-id" // optional
}

Response: 201 Created
{
  "id": "config-id",
  "fi_id": "fi-id",
  "name": "Q1 2024 Config",
  "description": "Updated configuration for Q1 2024",
  "is_active": false,
  "version": 1
}
```

### 3. Update Configuration Data
```http
PUT /api/configurations/{config_id}/data/mobile/consumer
Authorization: Bearer {token}
Content-Type: application/json

{
  "tile_structure": {
    "showHeader": false,
    "showProductHeader": false,
    "showCloseButton": true,
    "hideNotificationsSnackbar": false,
    "disableFixed": false,
    "disableSearchButton": false,
    "enableSettings": false,
    "showAdvancedSearch": true,
    "hideTitle": false,
    "donutSize": 250,
    "donutSaturation": 0.15,
    "transformAccountNames": false,
    "scrollTracking": false,
    "props": {
      "muiButtonBase": {
        "disableRipple": false
      }
    },
    "transactions": {
      "showOriginalMemo": true
    },
    "expenses": {
      "balance": {
        "image": "https://example.com/image.png"
      }
    },
    "institution": {
      "image": "https://example.com/institution.svg"
    },
    "product": {
      "image": "https://example.com/product.gif"
    }
  },
  "settings": {
    "theme": "light",
    "language": "en"
  }
}
```

### 4. Generate Share Link
```http
POST /api/share/link
Authorization: Bearer {token}
Content-Type: application/json

{
  "configuration_id": "config-id",
  "expires_in_hours": 72 // optional, null for no expiry
}

Response: 201 Created
{
  "share_url": "https://app.tilestoolbox.com/share/abc123def456",
  "token": "abc123def456",
  "expires_at": "2024-01-04T00:00:00Z"
}
```

### 5. Export HTML
```http
POST /api/export/html
Authorization: Bearer {token}
Content-Type: application/json

{
  "configuration_id": "config-id",
  "mode": "mobile",
  "audience": "consumer",
  "jwt_context": "eyJ..." // optional JWT for preview context
}

Response: 200 OK
Content-Type: text/html
Content-Disposition: attachment; filename="tiles.html"

<html>...</html>
```

### 6. Preview with JWT Context
```http
POST /api/preview/render
Authorization: Bearer {token}
Content-Type: application/json

{
  "configuration_id": "config-id",
  "mode": "mobile",
  "audience": "consumer",
  "jwt": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9..."
}

Response: 200 OK
{
  "preview_url": "https://preview.tilestoolbox.com/temp/xyz789",
  "rendered_html": "<html>...</html>",
  "context_data": {
    "user": "decoded-jwt-data",
    "tiles": ["spending_wheel", "budget_card"]
  }
}
```

## WebSocket Support

For real-time collaboration and live preview updates:

```javascript
// WebSocket endpoints
ws://api.tilestoolbox.com/ws/configurations/{config_id}

// Events
{
  "type": "configuration.updated",
  "data": {
    "configuration_id": "...",
    "updated_by": "user-id",
    "changes": {...}
  }
}

{
  "type": "preview.refresh",
  "data": {
    "configuration_id": "...",
    "mode": "mobile",
    "audience": "consumer"
  }
}
```

## Security Considerations

1. **Authentication**: JWT-based authentication with refresh tokens
2. **Authorization**: Role-based access control (RBAC)
3. **Input Validation**: Strict validation on all inputs
4. **Rate Limiting**: API rate limiting per user/IP
5. **CORS**: Properly configured CORS for preview functionality
6. **Encryption**: All sensitive data encrypted at rest
7. **Audit Trail**: Comprehensive logging of all configuration changes

## Error Responses

Standard error format:
```json
{
  "error": {
    "code": "INVALID_REQUEST",
    "message": "Human-readable error message",
    "details": {
      "field": "specific error details"
    }
  }
}
```

Common HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 409: Conflict
- 422: Unprocessable Entity
- 500: Internal Server Error