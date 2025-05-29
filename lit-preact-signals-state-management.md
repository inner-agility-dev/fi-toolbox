# Lit + Preact Signals State Management

## Overview

**@preact/signals** is an ultra-lightweight (~2KB gzipped) reactive state management solution that works excellently with Lit web components. It provides fine-grained reactivity without the overhead of larger state management libraries like MobX.

## Why Preact Signals for Lit?

### Size Comparison
- **@preact/signals-core**: ~2KB gzipped
- **MobX**: ~16KB gzipped
- **@lit-app/state**: ~5KB gzipped

### Key Benefits
1. **Fine-grained reactivity** - Only components using changed signals re-render
2. **Framework agnostic** - Works with Lit, React, Vue, or vanilla JS
3. **Simple API** - No decorators or complex configuration needed
4. **TypeScript support** - Full type safety out of the box
5. **No boilerplate** - Direct state mutations trigger updates automatically

## Installation

```bash
npm install @preact/signals-core @lit-labs/preact-signals
```

## Basic Usage

### 1. Create Signals

```typescript
import { signal, computed } from '@preact/signals-core';

// Create reactive state
export const count = signal(0);
export const searchQuery = signal('');
export const documents = signal<Document[]>([]);

// Create computed values
export const filteredDocuments = computed(() => {
  const query = searchQuery.value.toLowerCase();
  return documents.value.filter(doc => 
    doc.title.toLowerCase().includes(query)
  );
});
```

### 2. Use in Lit Components

```typescript
import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { SignalWatcher } from '@lit-labs/preact-signals';
import { count } from './store';

@customElement('my-counter')
export class MyCounter extends SignalWatcher(LitElement) {
  static styles = css`
    :host {
      display: block;
      padding: 16px;
    }
  `;

  render() {
    return html`
      <div>
        <p>Count: ${count.value}</p>
        <button @click=${() => count.value++}>Increment</button>
        <button @click=${() => count.value--}>Decrement</button>
      </div>
    `;
  }
}
```

## Advanced Patterns

### 1. Organized State Store

```typescript
// store/app-state.ts
import { signal, computed, effect } from '@preact/signals-core';

class AppState {
  // Auth state
  user = signal<User | null>(null);
  isAuthenticated = computed(() => this.user.value !== null);
  
  // UI state
  sidebarOpen = signal(true);
  theme = signal<'light' | 'dark'>('light');
  
  // Data state
  projects = signal<Project[]>([]);
  selectedProjectId = signal<string | null>(null);
  
  // Computed values
  selectedProject = computed(() => 
    this.projects.value.find(p => p.id === this.selectedProjectId.value)
  );
  
  // Actions
  toggleSidebar() {
    this.sidebarOpen.value = !this.sidebarOpen.value;
  }
  
  async loadProjects() {
    const response = await fetch('/api/projects');
    this.projects.value = await response.json();
  }
  
  selectProject(id: string) {
    this.selectedProjectId.value = id;
  }
}

export const appState = new AppState();

// Side effects
effect(() => {
  // Persist theme preference
  localStorage.setItem('theme', appState.theme.value);
  document.body.className = appState.theme.value;
});
```

### 2. Form State Management

```typescript
import { signal, computed } from '@preact/signals-core';

export class FormState<T> {
  data = signal<T>({} as T);
  errors = signal<Record<string, string>>({});
  touched = signal<Set<string>>(new Set());
  submitting = signal(false);
  
  isValid = computed(() => 
    Object.keys(this.errors.value).length === 0
  );
  
  setField<K extends keyof T>(field: K, value: T[K]) {
    this.data.value = { ...this.data.value, [field]: value };
    this.touched.value = new Set([...this.touched.value, field as string]);
    this.validate();
  }
  
  setError(field: string, error: string) {
    this.errors.value = { ...this.errors.value, [field]: error };
  }
  
  clearError(field: string) {
    const { [field]: _, ...rest } = this.errors.value;
    this.errors.value = rest;
  }
  
  abstract validate(): void;
}
```

### 3. Component Example with Form State

```typescript
import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { SignalWatcher } from '@lit-labs/preact-signals';
import { FormState } from './form-state';

interface UserForm {
  name: string;
  email: string;
}

class UserFormState extends FormState<UserForm> {
  validate() {
    // Clear existing errors
    this.errors.value = {};
    
    const { name, email } = this.data.value;
    
    if (!name || name.length < 2) {
      this.setError('name', 'Name must be at least 2 characters');
    }
    
    if (!email || !email.includes('@')) {
      this.setError('email', 'Valid email required');
    }
  }
}

@customElement('user-form')
export class UserForm extends SignalWatcher(LitElement) {
  private formState = new UserFormState();
  
  static styles = css`
    .error {
      color: red;
      font-size: 0.875rem;
    }
    
    .field {
      margin-bottom: 1rem;
    }
  `;
  
  render() {
    const { data, errors, touched, isValid, submitting } = this.formState;
    
    return html`
      <form @submit=${this.handleSubmit}>
        <div class="field">
          <input
            type="text"
            placeholder="Name"
            .value=${data.value.name || ''}
            @input=${(e: InputEvent) => 
              this.formState.setField('name', (e.target as HTMLInputElement).value)
            }
          />
          ${touched.value.has('name') && errors.value.name 
            ? html`<div class="error">${errors.value.name}</div>`
            : ''}
        </div>
        
        <div class="field">
          <input
            type="email"
            placeholder="Email"
            .value=${data.value.email || ''}
            @input=${(e: InputEvent) => 
              this.formState.setField('email', (e.target as HTMLInputElement).value)
            }
          />
          ${touched.value.has('email') && errors.value.email 
            ? html`<div class="error">${errors.value.email}</div>`
            : ''}
        </div>
        
        <button 
          type="submit" 
          ?disabled=${!isValid.value || submitting.value}
        >
          ${submitting.value ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    `;
  }
  
  async handleSubmit(e: Event) {
    e.preventDefault();
    
    if (!this.formState.isValid.value) return;
    
    this.formState.submitting.value = true;
    
    try {
      // Submit form
      await fetch('/api/users', {
        method: 'POST',
        body: JSON.stringify(this.formState.data.value),
      });
      
      // Reset form
      this.formState.data.value = {} as UserForm;
      this.formState.touched.value = new Set();
    } finally {
      this.formState.submitting.value = false;
    }
  }
}
```

## Testing Signals

```typescript
import { signal, effect } from '@preact/signals-core';
import { expect } from '@open-wc/testing';

describe('Signal State', () => {
  it('should update computed values', () => {
    const count = signal(0);
    const doubled = computed(() => count.value * 2);
    
    expect(doubled.value).to.equal(0);
    
    count.value = 5;
    expect(doubled.value).to.equal(10);
  });
  
  it('should trigger effects', () => {
    const count = signal(0);
    let effectCount = 0;
    
    effect(() => {
      count.value; // Subscribe to signal
      effectCount++;
    });
    
    expect(effectCount).to.equal(1); // Initial run
    
    count.value = 1;
    expect(effectCount).to.equal(2); // Effect triggered
  });
});
```

## Migration from MobX

### MobX Pattern
```typescript
import { makeObservable, observable, action } from 'mobx';

class Store {
  count = 0;
  
  constructor() {
    makeObservable(this, {
      count: observable,
      increment: action
    });
  }
  
  increment() {
    this.count++;
  }
}
```

### Signals Pattern
```typescript
import { signal } from '@preact/signals-core';

class Store {
  count = signal(0);
  
  increment() {
    this.count.value++;
  }
}
```

## Best Practices

1. **Keep signals close to usage** - Don't create a massive global store
2. **Use computed for derived state** - Avoid duplicating state
3. **Batch updates** - Multiple signal updates in the same tick are batched
4. **Avoid signal.value in templates** - Use SignalWatcher for cleaner syntax
5. **Type your signals** - Use TypeScript generics for type safety

## Performance Tips

1. **Fine-grained subscriptions** - Components only re-render when their specific signals change
2. **Computed values are cached** - Only recalculated when dependencies change
3. **Effects are auto-disposed** - When components unmount, effects are cleaned up
4. **Minimal overhead** - Direct property access with getter/setter

## Example: Material Card Grid with Signals

```typescript
import { signal, computed } from '@preact/signals-core';
import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { SignalWatcher } from '@lit-labs/preact-signals';
import '@material/web/card/filled-card';

interface Project {
  id: string;
  name: string;
  url: string;
  branch: string;
}

// State
const projects = signal<Project[]>([]);
const filter = signal('');

const filteredProjects = computed(() => {
  const query = filter.value.toLowerCase();
  return projects.value.filter(p => 
    p.name.toLowerCase().includes(query) ||
    p.branch.toLowerCase().includes(query)
  );
});

@customElement('project-grid')
export class ProjectGrid extends SignalWatcher(LitElement) {
  static styles = css`
    .grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 16px;
      padding: 16px;
    }
    
    md-filled-card {
      cursor: pointer;
      transition: transform 0.2s;
    }
    
    md-filled-card:hover {
      transform: translateY(-4px);
    }
  `;
  
  render() {
    return html`
      <input
        type="search"
        placeholder="Filter projects..."
        @input=${(e: InputEvent) => 
          filter.value = (e.target as HTMLInputElement).value
        }
      />
      
      <div class="grid">
        ${filteredProjects.value.map(project => html`
          <md-filled-card @click=${() => window.open(project.url)}>
            <div slot="headline">${project.name}</div>
            <div slot="subhead">Branch: ${project.branch}</div>
          </md-filled-card>
        `)}
      </div>
    `;
  }
}
```

## Resources

- [Preact Signals Documentation](https://preactjs.com/guide/v10/signals/)
- [@lit-labs/preact-signals](https://github.com/lit/lit/tree/main/packages/labs/preact-signals)
- [Signals Proposal (TC39)](https://github.com/tc39/proposal-signals)