# Tiles Toolbox Backend Implementation Guide

## Technology Stack

### Core Technologies
- **Runtime**: Node.js 18+ with TypeScript
- **Framework**: Express.js or Fastify
- **Database**: PostgreSQL 14+
- **Cache**: Redis 7+
- **Queue**: Bull/BullMQ for background jobs
- **WebSocket**: Socket.io or ws
- **Authentication**: JWT with refresh tokens

### Supporting Libraries
```json
{
  "dependencies": {
    "express": "^4.18.0",
    "pg": "^8.11.0",
    "redis": "^4.6.0",
    "jsonwebtoken": "^9.0.0",
    "bcrypt": "^5.1.0",
    "joi": "^17.9.0",
    "winston": "^3.8.0",
    "socket.io": "^4.6.0",
    "bull": "^4.10.0",
    "node-cache": "^5.1.2",
    "cors": "^2.8.5",
    "helmet": "^7.0.0",
    "compression": "^1.7.4",
    "dotenv": "^16.0.0"
  }
}
```

## Service Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   API Gateway   │────▶│  Load Balancer  │────▶│   Web Servers   │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                                          │
                        ┌─────────────────────────────────┼─────────────────────────────────┐
                        │                                 │                                 │
                   ┌────▼────┐                    ┌──────▼──────┐                  ┌────────▼────────┐
                   │Auth API │                    │ Config API  │                  │ Preview Service │
                   └─────────┘                    └─────────────┘                  └─────────────────┘
                        │                                 │                                 │
                   ┌────▼────┐                    ┌──────▼──────┐                  ┌────────▼────────┐
                   │ Redis   │                    │ PostgreSQL  │                  │ Render Engine   │
                   └─────────┘                    └─────────────┘                  └─────────────────┘
```

## Key Services Implementation

### 1. Configuration Service

```typescript
// services/ConfigurationService.ts
export class ConfigurationService {
  async createConfiguration(data: CreateConfigDto): Promise<Configuration> {
    // Validate input
    const validated = await configSchema.validateAsync(data);
    
    // Check if FI exists and user has access
    await this.checkFIAccess(validated.fi_id, data.user_id);
    
    // If cloning from another config
    if (validated.clone_from) {
      return this.cloneConfiguration(validated.clone_from, validated);
    }
    
    // Create new configuration
    const config = await db.transaction(async (trx) => {
      // Create base configuration
      const [newConfig] = await trx('configurations').insert({
        fi_id: validated.fi_id,
        name: validated.name,
        description: validated.description,
        created_by: data.user_id,
        version: 1
      }).returning('*');
      
      // Create default data for all mode/audience combinations
      const modes = ['app', 'desktop', 'mobile'];
      const audiences = ['consumer', 'business'];
      
      for (const mode of modes) {
        for (const audience of audiences) {
          await trx('configuration_data').insert({
            configuration_id: newConfig.id,
            mode,
            audience,
            tile_structure: this.getDefaultTileStructure(mode, audience),
            settings: this.getDefaultSettings()
          });
        }
      }
      
      // Log the action
      await this.auditLog.log({
        user_id: data.user_id,
        fi_id: validated.fi_id,
        configuration_id: newConfig.id,
        action: 'configuration.created',
        details: { name: validated.name }
      });
      
      return newConfig;
    });
    
    // Invalidate cache
    await this.cache.invalidate(`fi:${validated.fi_id}:configs`);
    
    // Emit event
    this.eventEmitter.emit('configuration.created', config);
    
    return config;
  }
  
  async activateConfiguration(configId: string, userId: string): Promise<void> {
    await db.transaction(async (trx) => {
      // Get configuration
      const config = await trx('configurations')
        .where({ id: configId })
        .first();
        
      if (!config) {
        throw new NotFoundError('Configuration not found');
      }
      
      // Deactivate all other configs for this FI
      await trx('configurations')
        .where({ fi_id: config.fi_id })
        .update({ is_active: false });
      
      // Activate this config
      await trx('configurations')
        .where({ id: configId })
        .update({ 
          is_active: true,
          updated_at: new Date()
        });
      
      // Log the action
      await this.auditLog.log({
        user_id: userId,
        fi_id: config.fi_id,
        configuration_id: configId,
        action: 'configuration.activated'
      });
    });
    
    // Broadcast update via WebSocket
    this.broadcast(configId, 'configuration.activated');
  }
}
```

### 2. Preview Rendering Service

```typescript
// services/PreviewService.ts
export class PreviewService {
  private renderCache = new NodeCache({ stdTTL: 300 }); // 5 min cache
  
  async renderPreview(params: RenderParams): Promise<RenderResult> {
    const cacheKey = this.getCacheKey(params);
    
    // Check cache first
    const cached = this.renderCache.get<RenderResult>(cacheKey);
    if (cached) return cached;
    
    // Get configuration data
    const configData = await this.getConfigurationData(
      params.configuration_id,
      params.mode,
      params.audience
    );
    
    // Decode JWT context if provided
    let context = {};
    if (params.jwt) {
      try {
        context = this.decodeJWT(params.jwt);
      } catch (error) {
        console.warn('Invalid JWT provided for preview context');
      }
    }
    
    // Prepare render data
    const renderData = {
      config: configData.tile_structure,
      settings: configData.settings,
      context,
      tiles: await this.loadTileDefinitions(configData.tile_structure),
      mode: params.mode,
      audience: params.audience
    };
    
    // Render HTML
    const html = await this.templateEngine.render('preview', renderData);
    
    // Generate temporary preview URL
    const previewId = crypto.randomBytes(16).toString('hex');
    await this.storePreview(previewId, html, 3600); // 1 hour TTL
    
    const result = {
      preview_url: `${config.PREVIEW_BASE_URL}/preview/${previewId}`,
      rendered_html: html,
      context_data: {
        mode: params.mode,
        audience: params.audience,
        tiles: Object.keys(renderData.tiles)
      }
    };
    
    // Cache the result
    this.renderCache.set(cacheKey, result);
    
    return result;
  }
  
  private async loadTileDefinitions(tileStructure: any): Promise<TileMap> {
    const tileTypes = this.extractTileTypes(tileStructure);
    const tiles: TileMap = {};
    
    for (const type of tileTypes) {
      const tile = await db('tiles').where({ type }).first();
      if (tile) {
        tiles[type] = {
          ...tile,
          component: await this.loadTileComponent(type)
        };
      }
    }
    
    return tiles;
  }
}
```

### 3. Export Service

```typescript
// services/ExportService.ts
export class ExportService {
  async exportAsHTML(params: ExportParams): Promise<string> {
    // Get configuration data
    const config = await this.configService.getConfiguration(params.configuration_id);
    const configData = await this.configService.getConfigurationData(
      params.configuration_id,
      params.mode,
      params.audience
    );
    
    // Prepare standalone HTML template
    const templateData = {
      title: `${config.fi_name} - ${config.name}`,
      config: configData.tile_structure,
      settings: configData.settings,
      mode: params.mode,
      audience: params.audience,
      standalone: true,
      includeAssets: true
    };
    
    // Render complete HTML with embedded assets
    const html = await this.templateEngine.render('export', templateData);
    
    // Minify if requested
    if (params.minify) {
      return this.minifyHTML(html);
    }
    
    return html;
  }
  
  async generateShareLink(params: ShareLinkParams): Promise<ShareLink> {
    // Generate unique token
    const token = crypto.randomBytes(32).toString('base64url');
    
    // Calculate expiry
    const expiresAt = params.expires_in_hours 
      ? new Date(Date.now() + params.expires_in_hours * 3600000)
      : null;
    
    // Store in database
    const shareLink = await db('share_links').insert({
      configuration_id: params.configuration_id,
      token,
      expires_at: expiresAt,
      created_by: params.user_id
    }).returning('*');
    
    // Generate full URL
    const shareUrl = `${config.APP_BASE_URL}/share/${token}`;
    
    return {
      share_url: shareUrl,
      token,
      expires_at: expiresAt
    };
  }
}
```

### 4. WebSocket Handler

```typescript
// websocket/ConfigurationWebSocket.ts
export class ConfigurationWebSocket {
  private io: Server;
  private rooms: Map<string, Set<string>> = new Map();
  
  initialize(server: http.Server) {
    this.io = new Server(server, {
      cors: {
        origin: config.ALLOWED_ORIGINS,
        credentials: true
      }
    });
    
    this.io.use(this.authenticate);
    
    this.io.on('connection', (socket) => {
      console.log(`Client connected: ${socket.id}`);
      
      socket.on('join-configuration', async (configId: string) => {
        // Verify access
        const hasAccess = await this.verifyAccess(socket.userId, configId);
        if (!hasAccess) {
          socket.emit('error', { message: 'Access denied' });
          return;
        }
        
        // Join room
        socket.join(`config:${configId}`);
        this.addToRoom(configId, socket.id);
        
        // Send current state
        const currentState = await this.getConfigurationState(configId);
        socket.emit('configuration-state', currentState);
      });
      
      socket.on('update-configuration', async (data) => {
        // Validate and apply update
        const result = await this.applyUpdate(socket.userId, data);
        
        // Broadcast to all clients in the room
        this.io.to(`config:${data.configId}`).emit('configuration-updated', {
          user: socket.userId,
          timestamp: new Date(),
          changes: result.changes
        });
      });
      
      socket.on('disconnect', () => {
        this.removeFromAllRooms(socket.id);
      });
    });
  }
  
  broadcast(configId: string, event: string, data?: any) {
    this.io.to(`config:${configId}`).emit(event, data);
  }
}
```

## Background Jobs

```typescript
// jobs/ConfigurationJobs.ts
export class ConfigurationJobs {
  constructor(private queue: Queue) {
    this.registerProcessors();
  }
  
  private registerProcessors() {
    // Generate export job
    this.queue.process('generate-export', async (job) => {
      const { configId, format, options } = job.data;
      
      try {
        const result = await this.exportService.generateExport(
          configId, 
          format, 
          options
        );
        
        // Store result
        await this.storageService.store(result.fileId, result.data);
        
        // Notify user
        await this.notificationService.notify(job.data.userId, {
          type: 'export-complete',
          data: { fileId: result.fileId, downloadUrl: result.url }
        });
        
        return result;
      } catch (error) {
        console.error('Export generation failed:', error);
        throw error;
      }
    });
    
    // Cleanup expired share links
    this.queue.process('cleanup-share-links', async () => {
      const deleted = await db('share_links')
        .where('expires_at', '<', new Date())
        .delete();
      
      console.log(`Cleaned up ${deleted} expired share links`);
    });
  }
  
  async scheduleExport(params: ExportJobParams) {
    return this.queue.add('generate-export', params, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000
      }
    });
  }
}
```

## Caching Strategy

```typescript
// cache/CacheManager.ts
export class CacheManager {
  private redis: Redis;
  private localCache: NodeCache;
  
  constructor() {
    this.redis = new Redis(config.REDIS_URL);
    this.localCache = new NodeCache({ stdTTL: 60 });
  }
  
  async get<T>(key: string): Promise<T | null> {
    // Check local cache first
    const local = this.localCache.get<T>(key);
    if (local) return local;
    
    // Check Redis
    const cached = await this.redis.get(key);
    if (cached) {
      const parsed = JSON.parse(cached);
      // Store in local cache
      this.localCache.set(key, parsed);
      return parsed;
    }
    
    return null;
  }
  
  async set(key: string, value: any, ttl?: number) {
    const serialized = JSON.stringify(value);
    
    // Set in both caches
    this.localCache.set(key, value);
    
    if (ttl) {
      await this.redis.setex(key, ttl, serialized);
    } else {
      await this.redis.set(key, serialized);
    }
  }
  
  async invalidate(pattern: string) {
    // Clear from local cache
    const keys = this.localCache.keys();
    keys.forEach(key => {
      if (key.includes(pattern)) {
        this.localCache.del(key);
      }
    });
    
    // Clear from Redis
    const redisKeys = await this.redis.keys(`*${pattern}*`);
    if (redisKeys.length > 0) {
      await this.redis.del(...redisKeys);
    }
  }
}
```

## Security Implementation

```typescript
// middleware/Security.ts
export const securityMiddleware = {
  // JWT Authentication
  authenticate: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');
      if (!token) throw new Error('No token provided');
      
      const decoded = jwt.verify(token, config.JWT_SECRET) as JWTPayload;
      req.user = await userService.findById(decoded.userId);
      
      if (!req.user) throw new Error('User not found');
      
      next();
    } catch (error) {
      res.status(401).json({ error: 'Unauthorized' });
    }
  },
  
  // Rate limiting
  rateLimiter: rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
  }),
  
  // Input validation
  validate: (schema: Joi.Schema) => {
    return (req: Request, res: Response, next: NextFunction) => {
      const { error, value } = schema.validate(req.body);
      if (error) {
        return res.status(422).json({
          error: {
            code: 'VALIDATION_ERROR',
            message: error.details[0].message,
            details: error.details
          }
        });
      }
      req.body = value;
      next();
    };
  },
  
  // CORS configuration
  cors: cors({
    origin: (origin, callback) => {
      if (!origin || config.ALLOWED_ORIGINS.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true
  })
};
```

## Monitoring & Logging

```typescript
// monitoring/Logger.ts
export const logger = winston.createLogger({
  level: config.LOG_LEVEL,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      )
    }),
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error' 
    }),
    new winston.transports.File({ 
      filename: 'logs/combined.log' 
    })
  ]
});

// Request logging middleware
export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info({
      method: req.method,
      url: req.url,
      status: res.statusCode,
      duration,
      user: req.user?.id,
      ip: req.ip
    });
  });
  
  next();
};
```

## Deployment Configuration

```yaml
# docker-compose.yml
version: '3.8'

services:
  api:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=${DATABASE_URL}
      - REDIS_URL=${REDIS_URL}
    depends_on:
      - postgres
      - redis
    volumes:
      - ./logs:/app/logs
  
  postgres:
    image: postgres:14-alpine
    environment:
      - POSTGRES_DB=tilestoolbox
      - POSTGRES_USER=${DB_USER}
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
  
  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
  
  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - api

volumes:
  postgres_data:
  redis_data:
```

## Performance Optimizations

1. **Database Indexes**
```sql
CREATE INDEX idx_configurations_fi_id ON configurations(fi_id);
CREATE INDEX idx_configurations_active ON configurations(fi_id, is_active);
CREATE INDEX idx_config_data_lookup ON configuration_data(configuration_id, mode, audience);
CREATE INDEX idx_share_links_token ON share_links(token);
CREATE INDEX idx_audit_log_fi ON audit_log(fi_id, created_at DESC);
```

2. **Query Optimization**
- Use database views for complex queries
- Implement pagination for list endpoints
- Use SELECT specific columns instead of SELECT *
- Batch database operations where possible

3. **Caching Strategy**
- Cache configuration lists per FI (5 min TTL)
- Cache rendered previews (5 min TTL)
- Cache tile definitions (1 hour TTL)
- Use ETags for static resources

4. **Asset Optimization**
- CDN for static assets
- Gzip/Brotli compression
- Image optimization for tile assets
- Bundle and minify JavaScript/CSS