# Utils Documentation

This document provides detailed documentation for the utility functions and modules in the Responsive Tiles application. These utilities provide commonly used functionality across the application.

## Utils Structure

The utils directory contains various utility modules organized by purpose:

```
src/utils/
├── arrays.js               # Array manipulation utilities
├── auth.js                 # Authentication utilities
├── csv.js                  # CSV manipulation utilities
├── data.js                 # Data manipulation utilities
├── datadog.js              # Datadog integration
├── dates.js                # Date manipulation utilities
├── env.js                  # Environment utilities
├── formats.js              # Formatting utilities
├── ga.js                   # Google Analytics integration
├── gradients.js            # SVG gradient utilities
├── ids.js                  # ID generation utilities
├── patterns.js             # SVG pattern utilities
├── promises.js             # Promise utilities
├── regex.js                # Regular expression utilities
├── selection.js            # Selection utilities
├── strings.js              # String manipulation utilities
├── svg.js                  # SVG utilities
├── symbols.js              # Symbol utilities
├── timeFormats.js          # Time formatting utilities
├── types.js                # Type checking utilities
├── webtrends.js            # Webtrends integration
└── validation/             # Validation utilities
    ├── Field.js            # Field validation
    └── validators.js       # Validator functions
```

## Array Utilities

`arrays.js` provides functions for manipulating arrays.

### Key Functions

#### `includes`

Checks if an array includes an element that matches a predicate function.

```javascript
/**
 * Checks if array includes an element that matches the predicate
 * @param {Array} array - The array to check
 * @param {Function} predicate - The function to test with
 * @returns {boolean} True if a match is found
 */
export function includes(array, predicate) {
  return array.some(predicate);
}
```

**Example:**
```javascript
const numbers = [1, 2, 3, 4, 5];
const hasEven = includes(numbers, num => num % 2 === 0); // true
```

#### `arraysEqual`

Compares two arrays for equality.

```javascript
/**
 * Checks if two arrays are equal
 * @param {Array} a - First array
 * @param {Array} b - Second array
 * @returns {boolean} True if arrays are equal
 */
export function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length !== b.length) return false;

  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}
```

**Example:**
```javascript
arraysEqual([1, 2, 3], [1, 2, 3]); // true
arraysEqual([1, 2, 3], [1, 2, 4]); // false
```

#### `arrayClone`

Creates a deep copy of an array.

```javascript
/**
 * Creates a deep copy of an array
 * @param {Array} arr - The array to clone
 * @returns {Array} A deep copy of the array
 */
export function arrayClone(arr) {
  return JSON.parse(JSON.stringify(arr));
}
```

**Example:**
```javascript
const original = [1, 2, { a: 3 }];
const clone = arrayClone(original);
clone[2].a = 4; // Doesn't affect original
```

#### `fieldSorter`

Creates a sorting function for array of objects based on field names.

```javascript
/**
 * Creates a sorting function for object arrays based on multiple fields
 * @param {string[]} fields - Field names to sort by, prefix with - for descending
 * @returns {Function} Sorting function for use with Array.sort()
 */
export const fieldSorter = fields => (a, b) => {
  // Iterate through the fields and return the first non-zero comparison
  for (let i = 0; i < fields.length; i++) {
    let field = fields[i];
    let dir = 1;

    if (field[0] === '-') {
      dir = -1;
      field = field.substring(1);
    }

    if (a[field] > b[field]) return dir;
    if (a[field] < b[field]) return -dir;
  }
  
  return 0;
};
```

**Example:**
```javascript
const people = [
  { name: 'John', age: 30 },
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 30 }
];

// Sort by age (ascending) then name (descending)
people.sort(fieldSorter(['age', '-name']));
// Result: [{ name: 'Alice', age: 25 }, { name: 'John', age: 30 }, { name: 'Bob', age: 30 }]
```

#### `sortBy`

Sorts an array of objects by a specific field.

```javascript
/**
 * Sorts an array of objects by a specific field
 * @param {Array<Object>} array - Array of objects to sort
 * @param {string} key - Field to sort by
 * @returns {Array<Object>} Sorted array
 */
export function sortBy(array, key) {
  return [...array].sort((a, b) => {
    if (a[key] < b[key]) return -1;
    if (a[key] > b[key]) return 1;
    return 0;
  });
}
```

**Example:**
```javascript
const people = [
  { name: 'John', age: 30 },
  { name: 'Alice', age: 25 },
  { name: 'Bob', age: 35 }
];

const sortedByName = sortBy(people, 'name');
// Result: [{ name: 'Alice', age: 25 }, { name: 'Bob', age: 35 }, { name: 'John', age: 30 }]
```

#### `groupBy`

Groups an array of objects by a specific field.

```javascript
/**
 * Groups an array of objects by a specific field
 * @param {Array<Object>} array - Array of objects to group
 * @param {string} key - Field to group by
 * @returns {Object} Object with groups as keys and arrays as values
 */
export function groupBy(array, key) {
  return array.reduce((result, item) => {
    const groupKey = item[key];
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {});
}
```

**Example:**
```javascript
const transactions = [
  { id: 1, category: 'food', amount: 30 },
  { id: 2, category: 'transport', amount: 20 },
  { id: 3, category: 'food', amount: 15 }
];

const grouped = groupBy(transactions, 'category');
// Result: {
//   food: [
//     { id: 1, category: 'food', amount: 30 },
//     { id: 3, category: 'food', amount: 15 }
//   ],
//   transport: [
//     { id: 2, category: 'transport', amount: 20 }
//   ]
// }
```

#### `unique`

Returns an array with only unique values.

```javascript
/**
 * Returns an array with only unique values
 * @param {Array} array - The array to process
 * @param {string} [key] - Optional key for arrays of objects
 * @returns {Array} Array with only unique values
 */
export function unique(array, key) {
  if (key) {
    const seen = new Set();
    return array.filter(item => {
      const value = item[key];
      if (seen.has(value)) return false;
      seen.add(value);
      return true;
    });
  }
  return [...new Set(array)];
}
```

**Example:**
```javascript
unique([1, 2, 2, 3, 3, 3]); // [1, 2, 3]

const users = [
  { id: 1, name: 'John' },
  { id: 2, name: 'Alice' },
  { id: 1, name: 'John' }
];

unique(users, 'id'); // [{ id: 1, name: 'John' }, { id: 2, name: 'Alice' }]
```

## Date Utilities

`dates.js` provides functions for manipulating and formatting dates.

### Constants

```javascript
// Date range constants
export const ONE_DAY = 'ONE_DAY';
export const ONE_WEEK = 'ONE_WEEK';
export const TWO_WEEKS = 'TWO_WEEKS';
export const ONE_MONTH = 'ONE_MONTH';
export const THREE_MONTHS = 'THREE_MONTHS';
export const SIX_MONTHS = 'SIX_MONTHS';
export const ONE_YEAR = 'ONE_YEAR';
export const YTD = 'YTD';
export const ALL = 'ALL';

// Day constants
export const SUNDAY = 0;
export const MONDAY = 1;
export const TUESDAY = 2;
export const WEDNESDAY = 3;
export const THURSDAY = 4;
export const FRIDAY = 5;
export const SATURDAY = 6;
```

### Key Functions

#### `formatDate`

Formats a date according to the specified format.

```javascript
/**
 * Formats a date according to the specified format
 * @param {Date|string|number} date - The date to format
 * @param {string} [format='yyyy-MM-dd'] - The format string
 * @returns {string} The formatted date string
 */
export function formatDate(date, format = 'yyyy-MM-dd') {
  if (!date) return '';
  
  const dateObj = date instanceof Date ? date : new Date(date);
  
  if (isNaN(dateObj.getTime())) return '';
  
  const tokens = {
    yyyy: dateObj.getFullYear(),
    MM: String(dateObj.getMonth() + 1).padStart(2, '0'),
    dd: String(dateObj.getDate()).padStart(2, '0'),
    HH: String(dateObj.getHours()).padStart(2, '0'),
    mm: String(dateObj.getMinutes()).padStart(2, '0'),
    ss: String(dateObj.getSeconds()).padStart(2, '0')
  };
  
  return format.replace(/yyyy|MM|dd|HH|mm|ss/g, match => tokens[match]);
}
```

**Example:**
```javascript
const date = new Date(2025, 3, 15); // April 15, 2025
formatDate(date); // '2025-04-15'
formatDate(date, 'MM/dd/yyyy'); // '04/15/2025'
formatDate(date, 'dd MMM yyyy'); // '15 Apr 2025'
```

#### `addDays`

Adds a specified number of days to a date.

```javascript
/**
 * Adds a specified number of days to a date
 * @param {Date} date - The date to add days to
 * @param {number} days - Number of days to add
 * @returns {Date} A new date object with days added
 */
export function addDays(date, days) {
  const result = new Date(date);
  result.setDate(date.getDate() + days);
  return result;
}
```

**Example:**
```javascript
const date = new Date(2025, 3, 15); // April 15, 2025
const newDate = addDays(date, 5); // April 20, 2025
```

#### `startOfMonth`

Returns a new date representing the start of the month.

```javascript
/**
 * Returns a new date representing the start of the month
 * @param {Date} date - The date to get the start of month from
 * @returns {Date} A new date object set to the start of the month
 */
export function startOfMonth(date) {
  const result = new Date(date);
  result.setDate(1);
  result.setHours(0, 0, 0, 0);
  return result;
}
```

**Example:**
```javascript
const date = new Date(2025, 3, 15); // April 15, 2025
const start = startOfMonth(date); // April 1, 2025 00:00:00
```

#### `endOfMonth`

Returns a new date representing the end of the month.

```javascript
/**
 * Returns a new date representing the end of the month
 * @param {Date} date - The date to get the end of month from
 * @returns {Date} A new date object set to the end of the month
 */
export function endOfMonth(date) {
  const result = new Date(date);
  result.setMonth(date.getMonth() + 1);
  result.setDate(0);
  result.setHours(23, 59, 59, 999);
  return result;
}
```

**Example:**
```javascript
const date = new Date(2025, 3, 15); // April 15, 2025
const end = endOfMonth(date); // April 30, 2025 23:59:59.999
```

#### `dateRangeForPeriod`

Returns start and end dates for a specified time period.

```javascript
/**
 * Returns start and end dates for a specified time period
 * @param {string} period - One of the date range constants
 * @param {Date} [referenceDate=new Date()] - Reference date
 * @returns {Object} Object with start and end dates
 */
export function dateRangeForPeriod(period, referenceDate = new Date()) {
  const today = new Date(referenceDate);
  today.setHours(0, 0, 0, 0);
  
  let start, end;
  
  switch (period) {
    case ONE_DAY:
      start = today;
      end = addDays(today, 1);
      break;
    case ONE_WEEK:
      start = addDays(today, -7);
      end = today;
      break;
    case TWO_WEEKS:
      start = addDays(today, -14);
      end = today;
      break;
    case ONE_MONTH:
      start = addDays(today, -30);
      end = today;
      break;
    case THREE_MONTHS:
      start = addDays(today, -90);
      end = today;
      break;
    case SIX_MONTHS:
      start = addDays(today, -180);
      end = today;
      break;
    case ONE_YEAR:
      start = addDays(today, -365);
      end = today;
      break;
    case YTD:
      start = new Date(today.getFullYear(), 0, 1);
      end = today;
      break;
    case ALL:
    default:
      start = new Date(1970, 0, 1);
      end = addDays(today, 1);
      break;
  }
  
  return { start, end };
}
```

**Example:**
```javascript
const range = dateRangeForPeriod(ONE_MONTH);
// Result: { start: (30 days ago), end: (today) }

const ytdRange = dateRangeForPeriod(YTD);
// Result: { start: (January 1 of current year), end: (today) }
```
