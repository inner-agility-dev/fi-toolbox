# Tile Rendering & JWT Context System

## Tile System Architecture

### Tile Definition Structure

```typescript
// types/Tiles.ts
export interface TileDefinition {
  id: string;
  type: string;
  name: string;
  category: 'financial' | 'analytics' | 'navigation' | 'custom';
  description: string;
  defaultConfig: TileConfig;
  schema: JSONSchema; // For config validation
  permissions?: string[];
  supportedModes: ('app' | 'desktop' | 'mobile')[];
  supportedAudiences: ('consumer' | 'business')[];
}

export interface TileConfig {
  // Common properties
  enabled: boolean;
  position?: { x: number; y: number };
  size?: { width: number; height: number };
  
  // Tile-specific configuration
  settings: Record<string, any>;
  
  // Display options
  showHeader?: boolean;
  showBorder?: boolean;
  className?: string;
  styles?: Record<string, string>;
}

export interface TileInstance {
  id: string;
  tileType: string;
  config: TileConfig;
  data?: any; // Runtime data from JWT context
}
```

### Available Tiles Registry

```typescript
// tiles/TileRegistry.ts
export const TILE_REGISTRY: Record<string, TileDefinition> = {
  'spending_wheel': {
    id: 'spending_wheel',
    type: 'spending_wheel',
    name: 'Spending Wheel',
    category: 'analytics',
    description: 'Donut chart visualization of spending by category',
    supportedModes: ['app', 'desktop', 'mobile'],
    supportedAudiences: ['consumer', 'business'],
    defaultConfig: {
      enabled: true,
      settings: {
        donutSize: 250,
        donutSaturation: 0.15,
        showAmount: true,
        showPercentages: false,
        timeframe: '1_month',
        categories: ['all']
      }
    },
    schema: {
      type: 'object',
      properties: {
        donutSize: { type: 'number', min: 100, max: 500 },
        donutSaturation: { type: 'number', min: 0, max: 1 },
        showAmount: { type: 'boolean' },
        showPercentages: { type: 'boolean' },
        timeframe: { 
          type: 'string', 
          enum: ['1_week', '1_month', '3_months', '6_months'] 
        }
      }
    }
  },
  
  'budget_card': {
    id: 'budget_card',
    type: 'budget_card',
    name: 'Budgets Card',
    category: 'financial',
    description: 'Budget overview and progress tracking',
    supportedModes: ['app', 'desktop', 'mobile'],
    supportedAudiences: ['consumer'],
    defaultConfig: {
      enabled: true,
      settings: {
        showProgress: true,
        showRemaining: true,
        highlightOverspent: true,
        budgetPeriod: 'monthly'
      }
    }
  },
  
  'cashflow': {
    id: 'cashflow',
    type: 'cashflow',
    name: 'Cashflow',
    category: 'analytics',
    description: 'Income vs expenses visualization',
    supportedModes: ['desktop', 'mobile'],
    supportedAudiences: ['consumer', 'business'],
    defaultConfig: {
      enabled: true,
      settings: {
        chartType: 'line',
        showTrend: true,
        periodComparison: true
      }
    }
  },
  
  'goals_card': {
    id: 'goals_card',
    type: 'goals_card',
    name: 'Goals Card',
    category: 'financial',
    description: 'Financial goals tracking',
    supportedModes: ['app', 'desktop', 'mobile'],
    supportedAudiences: ['consumer'],
    defaultConfig: {
      enabled: true,
      settings: {
        showProgress: true,
        showProjectedDate: true,
        maxGoalsDisplay: 3
      }
    }
  },
  
  'net_worth': {
    id: 'net_worth',
    type: 'net_worth',
    name: 'Net Worth',
    category: 'analytics',
    description: 'Assets vs liabilities overview',
    supportedModes: ['desktop', 'mobile'],
    supportedAudiences: ['consumer', 'business'],
    defaultConfig: {
      enabled: true,
      settings: {
        showTrend: true,
        showBreakdown: false,
        trendPeriod: '12_months'
      }
    }
  },
  
  'transactions_card': {
    id: 'transactions_card',
    type: 'transactions_card',
    name: 'Transactions Card',
    category: 'financial',
    description: 'Recent transactions list',
    supportedModes: ['app', 'desktop', 'mobile'],
    supportedAudiences: ['consumer', 'business'],
    defaultConfig: {
      enabled: true,
      settings: {
        showOriginalMemo: true,
        transactionLimit: 10,
        groupByDate: true,
        showCategories: true
      }
    }
  }
};
```

## JWT Context System

### JWT Structure for Tiles

```typescript
// types/JWTContext.ts
export interface TilesJWTPayload {
  // Standard JWT claims
  iss: string;  // Issuer
  sub: string;  // Subject (user ID)
  aud: string;  // Audience
  exp: number;  // Expiration
  iat: number;  // Issued at
  
  // Tiles-specific context
  context: {
    user: {
      id: string;
      name: string;
      email: string;
      preferences?: UserPreferences;
    };
    
    institution: {
      id: string;
      name: string;
      logo?: string;
    };
    
    accounts?: Account[];
    
    financialData?: {
      transactions?: Transaction[];
      balances?: Balance[];
      budgets?: Budget[];
      goals?: Goal[];
      spending?: SpendingData;
      netWorth?: NetWorthData;
    };
    
    permissions?: string[];
    features?: string[];
  };
}

export interface UserPreferences {
  currency: string;
  locale: string;
  timezone: string;
  dateFormat: string;
}

export interface Account {
  id: string;
  name: string;
  type: 'checking' | 'savings' | 'credit' | 'investment' | 'loan';
  balance: number;
  currency: string;
  lastUpdated: string;
}

export interface SpendingData {
  categories: Array<{
    name: string;
    amount: number;
    percentage: number;
    color?: string;
  }>;
  total: number;
  period: string;
}
```

### JWT Processing Service

```typescript
// services/JWTContextService.ts
export class JWTContextService {
  private jwtSecret: string;
  
  constructor() {
    this.jwtSecret = config.JWT_PREVIEW_SECRET;
  }
  
  /**
   * Decode and validate JWT for preview context
   */
  async decodePreviewJWT(token: string): Promise<TilesJWTPayload> {
    try {
      // Verify JWT signature
      const decoded = jwt.verify(token, this.jwtSecret) as any;
      
      // Validate structure
      if (!decoded.context) {
        throw new Error('Invalid JWT structure: missing context');
      }
      
      // Validate required fields
      this.validateJWTPayload(decoded);
      
      // Process financial data if present
      if (decoded.context.financialData) {
        decoded.context.financialData = this.processFinancialData(
          decoded.context.financialData
        );
      }
      
      return decoded as TilesJWTPayload;
    } catch (error) {
      console.error('JWT decode error:', error);
      throw new Error('Invalid JWT token');
    }
  }
  
  /**
   * Generate sample JWT for testing
   */
  generateSampleJWT(options: SampleJWTOptions = {}): string {
    const now = Math.floor(Date.now() / 1000);
    
    const payload: TilesJWTPayload = {
      iss: 'tilestoolbox-preview',
      sub: options.userId || 'sample-user-123',
      aud: 'tiles-preview',
      exp: now + 3600, // 1 hour
      iat: now,
      context: {
        user: {
          id: options.userId || 'sample-user-123',
          name: options.userName || 'John Doe',
          email: options.userEmail || 'john.doe@example.com',
          preferences: {
            currency: 'USD',
            locale: 'en-US',
            timezone: 'America/New_York',
            dateFormat: 'MM/DD/YYYY'
          }
        },
        institution: {
          id: options.institutionId || 'inst-123',
          name: options.institutionName || 'Sample Bank',
          logo: options.institutionLogo
        },
        accounts: this.generateSampleAccounts(),
        financialData: {
          spending: this.generateSampleSpending(),
          transactions: this.generateSampleTransactions(),
          budgets: this.generateSampleBudgets(),
          goals: this.generateSampleGoals(),
          netWorth: this.generateSampleNetWorth()
        },
        permissions: ['view_accounts', 'view_transactions', 'view_analytics'],
        features: ['spending_wheel', 'budgets', 'goals', 'net_worth']
      }
    };
    
    return jwt.sign(payload, this.jwtSecret);
  }
  
  private generateSampleSpending(): SpendingData {
    return {
      categories: [
        { name: 'Household', amount: 1220, percentage: 35, color: '#4A90E2' },
        { name: 'Food & Dining', amount: 856, percentage: 25, color: '#50C878' },
        { name: 'Transportation', amount: 543, percentage: 16, color: '#FFB84D' },
        { name: 'Shopping', amount: 412, percentage: 12, color: '#FF6B6B' },
        { name: 'Entertainment', amount: 275, percentage: 8, color: '#9B59B6' },
        { name: 'Other', amount: 137, percentage: 4, color: '#95A5A6' }
      ],
      total: 3443,
      period: '2024-01'
    };
  }
}
```

## Tile Rendering Engine

```typescript
// rendering/TileRenderer.ts
export class TileRenderer {
  private tileComponents: Map<string, TileComponent>;
  private contextProcessor: ContextProcessor;
  
  constructor() {
    this.tileComponents = new Map();
    this.contextProcessor = new ContextProcessor();
    this.registerTileComponents();
  }
  
  /**
   * Render tiles based on configuration and JWT context
   */
  async renderTiles(params: RenderParams): Promise<RenderedOutput> {
    const { configuration, mode, audience, jwtContext } = params;
    
    // Get tile configuration for specific mode/audience
    const tileConfig = configuration.tile_structure;
    
    // Process JWT context to extract relevant data
    const processedContext = this.contextProcessor.process(jwtContext);
    
    // Build tile instances
    const tileInstances = this.buildTileInstances(
      tileConfig,
      processedContext,
      mode,
      audience
    );
    
    // Render each tile
    const renderedTiles = await Promise.all(
      tileInstances.map(tile => this.renderTile(tile, processedContext))
    );
    
    // Compose final output
    return this.composeOutput(renderedTiles, tileConfig.layout);
  }
  
  private async renderTile(
    instance: TileInstance, 
    context: ProcessedContext
  ): Promise<RenderedTile> {
    const component = this.tileComponents.get(instance.tileType);
    if (!component) {
      console.warn(`Unknown tile type: ${instance.tileType}`);
      return this.renderErrorTile(instance);
    }
    
    try {
      // Extract relevant data for this tile
      const tileData = this.extractTileData(instance.tileType, context);
      
      // Apply tile-specific configuration
      const config = this.mergeTileConfig(
        component.defaultConfig,
        instance.config
      );
      
      // Render the tile
      const rendered = await component.render({
        instance,
        config,
        data: tileData,
        context: context.user
      });
      
      return {
        id: instance.id,
        type: instance.tileType,
        html: rendered.html,
        styles: rendered.styles,
        scripts: rendered.scripts,
        dependencies: rendered.dependencies
      };
    } catch (error) {
      console.error(`Error rendering tile ${instance.id}:`, error);
      return this.renderErrorTile(instance);
    }
  }
  
  private extractTileData(tileType: string, context: ProcessedContext): any {
    const dataExtractors: Record<string, (ctx: ProcessedContext) => any> = {
      'spending_wheel': (ctx) => ({
        spending: ctx.financialData?.spending,
        accounts: ctx.accounts,
        period: ctx.currentPeriod
      }),
      
      'budget_card': (ctx) => ({
        budgets: ctx.financialData?.budgets,
        spending: ctx.financialData?.spending,
        period: ctx.currentPeriod
      }),
      
      'transactions_card': (ctx) => ({
        transactions: ctx.financialData?.transactions,
        accounts: ctx.accounts
      }),
      
      'net_worth': (ctx) => ({
        netWorth: ctx.financialData?.netWorth,
        accounts: ctx.accounts,
        trend: ctx.financialData?.netWorthTrend
      }),
      
      'goals_card': (ctx) => ({
        goals: ctx.financialData?.goals,
        accounts: ctx.accounts
      })
    };
    
    const extractor = dataExtractors[tileType];
    return extractor ? extractor(context) : {};
  }
}
```

## Tile Templates

```html
<!-- templates/tiles/spending_wheel.hbs -->
<div class="tile spending-wheel-tile" data-tile-id="{{instance.id}}">
  {{#if config.showHeader}}
  <div class="tile-header">
    <h3>Spending by Category</h3>
    <div class="tile-controls">
      <select class="timeframe-selector" data-tile-control="timeframe">
        <option value="1_week" {{#eq config.settings.timeframe "1_week"}}selected{{/eq}}>1 Week</option>
        <option value="1_month" {{#eq config.settings.timeframe "1_month"}}selected{{/eq}}>1 Month</option>
        <option value="3_months" {{#eq config.settings.timeframe "3_months"}}selected{{/eq}}>3 Months</option>
        <option value="6_months" {{#eq config.settings.timeframe "6_months"}}selected{{/eq}}>6 Months</option>
      </select>
    </div>
  </div>
  {{/if}}
  
  <div class="tile-content">
    <div class="donut-chart-container">
      <svg 
        class="donut-chart" 
        width="{{config.settings.donutSize}}" 
        height="{{config.settings.donutSize}}"
        viewBox="0 0 {{config.settings.donutSize}} {{config.settings.donutSize}}"
      >
        <!-- Chart will be rendered here -->
      </svg>
      
      {{#if config.settings.showAmount}}
      <div class="chart-center">
        <div class="total-label">{{data.spending.categories.[0].name}}</div>
        <div class="total-amount">${{formatNumber data.spending.categories.[0].amount}}</div>
      </div>
      {{/if}}
    </div>
    
    {{#if config.settings.showLegend}}
    <div class="chart-legend">
      {{#each data.spending.categories}}
      <div class="legend-item">
        <span class="legend-color" style="background-color: {{color}}"></span>
        <span class="legend-label">{{name}}</span>
        {{#if ../config.settings.showPercentages}}
        <span class="legend-percentage">{{percentage}}%</span>
        {{/if}}
        <span class="legend-amount">${{formatNumber amount}}</span>
      </div>
      {{/each}}
    </div>
    {{/if}}
  </div>
</div>

<style>
.spending-wheel-tile {
  background: var(--tile-background, #ffffff);
  border-radius: var(--tile-border-radius, 8px);
  padding: var(--tile-padding, 20px);
  box-shadow: var(--tile-shadow, 0 2px 4px rgba(0,0,0,0.1));
}

.donut-chart-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.chart-center {
  position: absolute;
  text-align: center;
}

.total-label {
  font-size: 14px;
  color: var(--text-secondary, #666);
  margin-bottom: 4px;
}

.total-amount {
  font-size: 24px;
  font-weight: 600;
  color: var(--text-primary, #333);
}

.chart-legend {
  margin-top: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 10px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 2px;
  flex-shrink: 0;
}
</style>

<script>
(function() {
  const tileId = '{{instance.id}}';
  const data = {{{json data.spending}}};
  const config = {{{json config.settings}}};
  
  // Initialize donut chart
  function initDonutChart() {
    const svg = document.querySelector(`[data-tile-id="${tileId}"] .donut-chart`);
    const size = config.donutSize;
    const center = size / 2;
    const radius = size * 0.4;
    const innerRadius = radius * (1 - config.donutSaturation);
    
    // Calculate angles
    let currentAngle = -90; // Start at top
    
    data.categories.forEach((category, index) => {
      const angle = (category.percentage / 100) * 360;
      const path = createArcPath(center, center, radius, innerRadius, currentAngle, currentAngle + angle);
      
      const pathElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      pathElement.setAttribute('d', path);
      pathElement.setAttribute('fill', category.color);
      pathElement.setAttribute('class', 'chart-segment');
      pathElement.setAttribute('data-category', category.name);
      
      svg.appendChild(pathElement);
      currentAngle += angle;
    });
  }
  
  function createArcPath(cx, cy, outerRadius, innerRadius, startAngle, endAngle) {
    const startAngleRad = (startAngle * Math.PI) / 180;
    const endAngleRad = (endAngle * Math.PI) / 180;
    
    const x1 = cx + outerRadius * Math.cos(startAngleRad);
    const y1 = cy + outerRadius * Math.sin(startAngleRad);
    const x2 = cx + outerRadius * Math.cos(endAngleRad);
    const y2 = cy + outerRadius * Math.sin(endAngleRad);
    
    const x3 = cx + innerRadius * Math.cos(endAngleRad);
    const y3 = cy + innerRadius * Math.sin(endAngleRad);
    const x4 = cx + innerRadius * Math.cos(startAngleRad);
    const y4 = cy + innerRadius * Math.sin(startAngleRad);
    
    const largeArc = endAngle - startAngle > 180 ? 1 : 0;
    
    return `
      M ${x1} ${y1}
      A ${outerRadius} ${outerRadius} 0 ${largeArc} 1 ${x2} ${y2}
      L ${x3} ${y3}
      A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${x4} ${y4}
      Z
    `;
  }
  
  // Initialize on load
  initDonutChart();
  
  // Handle timeframe changes
  const timeframeSelector = document.querySelector(`[data-tile-id="${tileId}"] .timeframe-selector`);
  if (timeframeSelector) {
    timeframeSelector.addEventListener('change', (e) => {
      window.TilesToolbox.updateTileConfig(tileId, {
        settings: { timeframe: e.target.value }
      });
    });
  }
})();
</script>
```

## HTML Export Template

```html
<!-- templates/export.hbs -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{title}} - Tiles Export</title>
    
    <style>
        /* Reset and base styles */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background-color: #f5f5f5;
            color: #333;
            line-height: 1.6;
        }
        
        /* Container styles */
        .tiles-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }
        
        /* Mode-specific styles */
        {{#eq mode "mobile"}}
        .tiles-container {
            max-width: 100%;
            padding: 10px;
        }
        {{/eq}}
        
        /* Grid layout */
        .tiles-grid {
            display: grid;
            gap: 20px;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        }
        
        {{#eq mode "desktop"}}
        .tiles-grid {
            grid-template-columns: repeat(3, 1fr);
        }
        {{/eq}}
        
        /* Include tile-specific styles */
        {{#each renderedStyles}}
        {{{this}}}
        {{/each}}
        
        /* Theme variables */
        :root {
            --primary-color: {{settings.theme.primaryColor}};
            --secondary-color: {{settings.theme.secondaryColor}};
            --text-primary: {{settings.theme.textPrimary}};
            --text-secondary: {{settings.theme.textSecondary}};
            --tile-background: {{settings.theme.tileBackground}};
            --tile-border-radius: {{settings.theme.tileBorderRadius}};
            --tile-padding: {{settings.theme.tilePadding}};
            --tile-shadow: {{settings.theme.tileShadow}};
        }
    </style>
</head>
<body data-mode="{{mode}}" data-audience="{{audience}}">
    <div class="tiles-container">
        <div class="tiles-grid">
            {{#each tiles}}
            {{{this.html}}}
            {{/each}}
        </div>
    </div>
    
    <script>
        // Global TilesToolbox namespace
        window.TilesToolbox = {
            mode: '{{mode}}',
            audience: '{{audience}}',
            config: {{{json config}}},
            
            updateTileConfig: function(tileId, updates) {
                console.log('Tile config update:', tileId, updates);
                // In export mode, just log the update
            },
            
            formatNumber: function(num) {
                return new Intl.NumberFormat('en-US', {
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                }).format(num);
            },
            
            formatCurrency: function(amount, currency = 'USD') {
                return new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: currency
                }).format(amount);
            }
        };
    </script>
    
    {{#each renderedScripts}}
    <script>
    {{{this}}}
    </script>
    {{/each}}
</body>
</html>
```

## Configuration Export Format

```json
{
  "version": "1.0.0",
  "exported_at": "2024-01-15T10:30:00Z",
  "configuration": {
    "id": "config-123",
    "name": "Q1 2024 Configuration",
    "fi": {
      "id": "fi-456",
      "name": "First National Bank"
    },
    "is_active": true,
    "modes": {
      "mobile": {
        "consumer": {
          "tile_structure": {
            "layout": "vertical",
            "tiles": [
              {
                "id": "tile-1",
                "type": "spending_wheel",
                "config": {
                  "enabled": true,
                  "position": { "order": 1 },
                  "settings": {
                    "donutSize": 250,
                    "donutSaturation": 0.15,
                    "showAmount": true,
                    "timeframe": "1_month"
                  }
                }
              },
              {
                "id": "tile-2",
                "type": "budget_card",
                "config": {
                  "enabled": true,
                  "position": { "order": 2 },
                  "settings": {
                    "showProgress": true,
                    "showRemaining": true
                  }
                }
              }
            ]
          },
          "settings": {
            "theme": {
              "primaryColor": "#4A90E2",
              "tileBackground": "#ffffff",
              "tileBorderRadius": "8px"
            }
          }
        }
      }
    }
  }
}
```