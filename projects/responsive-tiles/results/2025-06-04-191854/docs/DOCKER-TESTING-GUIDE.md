# Docker Testing Guide for GitHub Workflows

This guide explains how to use Docker to test the GitHub workflows locally before pushing changes.

## Prerequisites

- Docker installed on your machine
- Basic familiarity with Docker commands
- The responsive-tiles repository checked out locally

## Setting Up the Google Cloud SDK Docker Container

### 1. Pull the Docker Image

```bash
docker pull google/cloud-sdk:latest
```

### 2. Create a Test Container

```bash
# Navigate to your repository directory
cd /path/to/responsive-tiles

# Create and start a container with the repository mounted
docker run -it --name gcp-workflow-test \
  -v $(pwd):/workspace \
  google/cloud-sdk:latest bash
```

This command:
- Creates a container named `gcp-workflow-test`
- Mounts your current directory to `/workspace` inside the container
- Opens an interactive bash session

## Inside the Container

Once inside the container, you'll see a bash prompt. Here's how to simulate various parts of the workflow:

### Setting Up the Environment

```bash
# Navigate to the workspace
cd /workspace

# Install Node.js (not included in the Google Cloud SDK image)
apt-get update
apt-get install -y curl
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# Verify Node.js installation
node --version  # Should show v20.x.x
npm --version
```

### Running Build Commands

```bash
# Install dependencies
npm ci

# Run linting
npm run lint

# Build the application
npm run build
```

### Testing GCP Deployment (Dry Run)

```bash
# Set environment variables similar to the workflow
export VERSION="2.43.50"
export MAJOR_VERSION="2"
export DEPLOY_FOLDER="qa"
export BUCKET_NAME="gzo-geezeo-tiles-zwwst63n"
export GCP_PREFIX="dev"

# Create a test file structure
mkdir -p test_dist/v${MAJOR_VERSION}
echo '<html><body>Test app</body></html>' > test_dist/v${MAJOR_VERSION}/index.html

# Create a redirect index
echo '<html><head><meta http-equiv="refresh" content="0; url=./v'${MAJOR_VERSION}'/index.html"></head><body>Redirecting to latest version...</body></html>' > test_dist/index.html

# Simulate the upload command with --dry-run (no actual upload occurs)
gsutil cp -n test_dist/v${MAJOR_VERSION}/index.html gs://${GCP_PREFIX}-digital-${BUCKET_NAME}/${DEPLOY_FOLDER}/v${MAJOR_VERSION}/index.html --dry-run

# Simulate the redirect upload
gsutil cp -n test_dist/index.html gs://${GCP_PREFIX}-digital-${BUCKET_NAME}/${DEPLOY_FOLDER}/index.html --dry-run
```

### Testing Multiple Environment Deployments

You can test the deployment logic for different environments:

```bash
# Development environment
export DEPLOY_FOLDER="qa"
export BUCKET_NAME="gzo-geezeo-tiles-zwwst63n"
export GCP_PREFIX="dev"

# Run simulation
echo "Would deploy to gs://${GCP_PREFIX}-digital-${BUCKET_NAME}/${DEPLOY_FOLDER}/v${MAJOR_VERSION}/"

# Staging environment
export DEPLOY_FOLDER="staging"
export BUCKET_NAME="gzo-geezeo-tiles-nyjcof9v"
export GCP_PREFIX="stage"

# Run simulation
echo "Would deploy to gs://${GCP_PREFIX}-digital-${BUCKET_NAME}/${DEPLOY_FOLDER}/v${MAJOR_VERSION}/"

# Production environment
export DEPLOY_FOLDER="production"
export BUCKET_NAME="gzo-geezeo-tiles-gvf7byup"
export GCP_PREFIX="prod"

# Run simulation
echo "Would deploy to gs://${GCP_PREFIX}-digital-${BUCKET_NAME}/${DEPLOY_FOLDER}/v${MAJOR_VERSION}/"
```

## Testing with Full Authentication (Optional)

If you have GCP credentials and want to test the full authentication flow:

```bash
# Authenticate with your Google account
gcloud auth login

# Now you can run commands without --dry-run to test actual uploads
# CAUTION: This will actually upload files to GCP buckets

# Example (only if you have proper permissions):
gsutil ls gs://dev-digital-gzo-geezeo-tiles-zwwst63n/qa/
```

## Complete Workflow Simulation

Create a simulation script to run through the entire workflow:

```bash
# Create simulation script
cat > simulate-workflow.sh << 'EOF'
#!/bin/bash
set -e
echo "========== SIMULATING DEPLOYMENT WORKFLOW =========="

# Variables
VERSION="2.43.50"
MAJOR_VERSION="2"
ENV="development"
BUCKET_NAME="gzo-geezeo-tiles-zwwst63n"
DEPLOY_FOLDER="qa"
GCP_PREFIX="dev"

echo "\n[STEP 1] Building application (simulation)"
mkdir -p dist
echo '<html><body>Test app</body></html>' > dist/index.html
echo 'console.log("Hello world");' > dist/app.js
echo 'body { color: blue; }' > dist/styles.css
echo "✅ Build completed (simulated)"

echo "\n[STEP 2] Extracting major version"
echo "Original version: $VERSION"
echo "Extracted major version: $MAJOR_VERSION"

echo "\n[STEP 3] Determining GCP project prefix"
echo "Environment: $ENV"
echo "GCP project prefix: $GCP_PREFIX"

echo "\n[STEP 4] Authenticating to Google Cloud (simulation)"
echo "Would authenticate with Workload Identity Federation"
echo "✅ GCP authentication successful (simulated)"

echo "\n[STEP 5] Preparing redirect index"
echo "Creating redirect index.html to point to version v$MAJOR_VERSION"
echo '<html><head><meta http-equiv="refresh" content="0; url=./v'$MAJOR_VERSION'/index.html"></head><body>Redirecting to latest version...</body></html>' > dist/redirect-index.html
echo "✅ Redirect index created"

echo "\n[STEP 6] Uploading to Google Cloud Storage (simulation)"
echo "Command would be: gsutil cp -r dist/* gs://$GCP_PREFIX-digital-$BUCKET_NAME/$DEPLOY_FOLDER/v$MAJOR_VERSION/"
echo "✅ Files would be uploaded to GCS (simulated)"

echo "\n[STEP 7] Creating redirect at root level (simulation)"
echo "Command would be: gsutil cp dist/redirect-index.html gs://$GCP_PREFIX-digital-$BUCKET_NAME/$DEPLOY_FOLDER/index.html"
echo "✅ Redirect would be created (simulated)"

echo "\n[STEP 8] Creating version info file (simulation)"
echo "VERSION=$VERSION
BUILD_DATE=$(date)
COMMIT_SHA=mock-commit-sha
BUILD_RUN_ID=mock-run-id
ENVIRONMENT=${ENV^}" > dist/version-info.txt
echo "Would upload version-info.txt to gs://$GCP_PREFIX-digital-$BUCKET_NAME/$DEPLOY_FOLDER/v$MAJOR_VERSION/version-info.txt"
echo "✅ Version info would be created (simulated)"

echo "\n[STEP 9] Verifying deployment (simulation)"
echo "🔍 Verifying ${ENV^} deployment"
echo "Command would be: gsutil ls -r gs://$GCP_PREFIX-digital-$BUCKET_NAME/$DEPLOY_FOLDER/v$MAJOR_VERSION/**"
SIMULATED_COUNT=3
echo "Found $SIMULATED_COUNT files in deployment directory"

echo "\n========== DEPLOYMENT SIMULATION SUMMARY ==========="
echo "✓ Build application: SIMULATED"
echo "✓ Extract version: SIMULATED"
echo "✓ GCP Authentication: SIMULATED"
echo "✓ File uploads: SIMULATED"
echo "✓ Redirect creation: SIMULATED"
echo "✓ Version tracking: SIMULATED"
echo "✓ Deployment verification: SIMULATED"
echo "\nURL would be: https://geezeo.geezeo.banno-$ENV.com/assets/tiles/v$MAJOR_VERSION/index.html"
echo "\n✅ Deployment workflow simulation successful!"
echo "The actual workflow would execute identical steps in GitHub Actions"
echo "========================================================="
EOF

chmod +x simulate-workflow.sh
./simulate-workflow.sh
```

## Exiting and Cleaning Up

When you're done testing:

```bash
# Exit the container
exit

# Stop and remove the container
docker stop gcp-workflow-test
docker rm gcp-workflow-test
```

## Addressing Local Development Errors

### 1. Missing version.js File

This is expected - the application falls back to using package.json version.

### 2. API 404 Errors

These occur because the local environment doesn't have valid API credentials. The app falls back to mock data automatically.

### 3. Running the Development Server

For local development, use:

```bash
# Start the development server
npm start

# Access at http://localhost:8080/
```

Note: The development server will show the errors you mentioned, but should still render the application using mock data.

## Additional Tips

1. **Inspecting Logs**: While the GitHub Actions logs are nicely formatted, in your Docker container you can use `set -x` to see commands as they execute.

2. **Testing Specific Workflow Steps**: You can create separate scripts for testing specific parts of the workflow that you're most concerned about.

3. **Comparing Against Main Branch**: To compare your changes with the main branch workflow, you can checkout different branches and run the same simulation.

4. **Node Version**: Ensure you're using Node.js 20.12.1 to match the workflow configuration.