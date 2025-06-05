# Responsive Tiles Workflows

This directory contains documentation for the simplified development and deployment workflows used in the Responsive Tiles project.

## Workflow Overview

The Responsive Tiles project uses a streamlined workflow approach:

1. **Local Version Management** - Developers control version bumping locally
2. **GitHub Actions Workflows** - Three essential workflows for PR validation and deployment
3. **Build-once-deploy-many** - Single build artifact deployed to multiple environments

## Available Workflow Documentation

- [GCP Deployment](./GCP-DEPLOYMENT.md) - Details on the GitHub Actions workflows and deployment to Google Cloud Platform
- [Local Testing](./LOCAL-TESTING.md) - Instructions for local development and testing the workflows

## Key Workflow Files

The project uses three essential GitHub Actions workflow files:

1. **PR Workflow** (`.github/workflows/pr-workflow.yml`)
   - Validates PRs
   - Ensures version consistency
   - Deploys to development environment

2. **Main Deployment** (`.github/workflows/main-deployment.yml`)
   - Handles deployment to staging and production
   - Verifies git tags
   - Sequential environment deployment

3. **Merged Workflow** (`.github/workflows/merged-workflow.yml`)
   - Triggers after PR merge
   - Automates the main deployment workflow

These documents provide step-by-step instructions for common development and deployment tasks.