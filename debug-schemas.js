#!/usr/bin/env node

// Debug script to find which schema is causing the _def error
console.log('🔍 Starting schema validation test...');

try {
  // Check if build directory exists
  const fs = require('fs');
  if (!fs.existsSync('./build')) {
    console.log('❌ Build directory does not exist!');
    console.log('🔧 Run: npm run build');
    process.exit(1);
  }

  if (!fs.existsSync('./build/index.js')) {
    console.log('❌ Build file does not exist!');
    console.log('🔧 Run: npm run build');
    process.exit(1);
  }

  console.log('✅ Build files exist');

  console.log('1. Testing Zod import...');
  const { z } = require('zod');
  console.log('✅ Zod imported successfully');

  console.log('2. Testing issues schemas...');
  try {
    const issues = require('./build/operations/issues.js');
    console.log('✅ Issues module loaded');

    // Test each issues schema
    const issueSchemas = ['GetIssueSchema', 'ListIssuesSchema', 'CreateIssueSchema', 'UpdateIssueSchema'];
    for (const schemaName of issueSchemas) {
      if (issues[schemaName]) {
        console.log(`  ✅ ${schemaName} exists`);
        if (issues[schemaName]._def) {
          console.log(`  ✅ ${schemaName}._def exists`);
        } else {
          console.log(`  ❌ ${schemaName}._def is missing!`);
        }
      } else {
        console.log(`  ❌ ${schemaName} is missing!`);
      }
    }
  } catch (error) {
    console.log('❌ Issues module failed to load:', error.message);
  }

  console.log('3. Testing projects schemas...');
  const projects = require('./build/operations/projects.js');
  console.log('✅ Projects schemas loaded');
  
  // Test a few key project schemas
  const projectSchemas = ['GetProjectSchema', 'ListProjectsSchema', 'CreateProjectV2Schema'];
  for (const schemaName of projectSchemas) {
    if (projects[schemaName]) {
      console.log(`  ✅ ${schemaName} exists`);
      if (projects[schemaName]._def) {
        console.log(`  ✅ ${schemaName}._def exists`);
      } else {
        console.log(`  ❌ ${schemaName}._def is missing!`);
      }
    } else {
      console.log(`  ❌ ${schemaName} is missing!`);
    }
  }

  console.log('4. Testing repositories schemas...');
  const repositories = require('./build/operations/repositories.js');
  console.log('✅ Repositories schemas loaded');
  
  const repoSchemas = ['GetRepositorySchema', 'ListRepositoriesSchema'];
  for (const schemaName of repoSchemas) {
    if (repositories[schemaName]) {
      console.log(`  ✅ ${schemaName} exists`);
      if (repositories[schemaName]._def) {
        console.log(`  ✅ ${schemaName}._def exists`);
      } else {
        console.log(`  ❌ ${schemaName}._def is missing!`);
      }
    } else {
      console.log(`  ❌ ${schemaName} is missing!`);
    }
  }

  console.log('5. Testing main index...');
  const main = require('./build/index.js');
  console.log('✅ Main index loaded successfully');

} catch (error) {
  console.error('❌ Error occurred:', error.message);
  console.error('Stack trace:', error.stack);
  
  // Try to identify which specific line is causing the issue
  if (error.stack) {
    const lines = error.stack.split('\n');
    for (const line of lines) {
      if (line.includes('_def')) {
        console.error('🎯 _def error found in:', line);
      }
    }
  }
}
