# Docker Environments

This guide explains the Docker environments available for the Responsive Tiles project.

## Available Docker Environments

The Responsive Tiles project provides two Docker environments:

1. **Basic GCP Testing Environment** - For GCP deployment testing
2. **Enhanced Git-Enabled Environment** - For complete end-to-end testing

## Basic GCP Testing Environment

The basic environment includes:

- Node.js for building the application
- Google Cloud SDK for GCP deployment testing
- HTTP server for viewing the application

### Starting the Basic Environment

```bash
chmod +x scripts/gcp-docker/start-docker-env.sh
./scripts/gcp-docker/start-docker-env.sh
```

### Components

- **Dockerfile**: `/scripts/gcp-docker/Dockerfile`
- **Start Script**: `/scripts/gcp-docker/start-docker-env.sh`
- **Deployment Script**: `/scripts/gcp-docker/simulate-deployment.sh`
- **Cleanup Script**: `/scripts/gcp-docker/cleanup-test-buckets.sh`

## Enhanced Git-Enabled Environment

The enhanced environment adds:

- Gitea Git server with web UI
- act for running GitHub Actions locally
- Automatic Git synchronization
- Custom bootstrap capabilities

### Starting the Enhanced Environment

```bash
chmod +x scripts/gcp-docker/start-git-environment.sh
./scripts/gcp-docker/start-git-environment.sh
```

### Components

- **Dockerfile**: `/scripts/gcp-docker/Dockerfile.enhanced`
- **Start Script**: `/scripts/gcp-docker/start-git-environment.sh`
- **Docker Compose**: `/scripts/gcp-docker/docker-compose.yml`
- **Git Sync Script**: `/scripts/gcp-docker/git-sync.sh`
- **Custom Bootstrap**: `/scripts/gcp-docker/custom-bootstrap.sh`

## Customizing Docker Environments

### Custom Bootstrap Script

The custom bootstrap script runs when the container starts and can be customized:

```bash
vim scripts/gcp-docker/custom-bootstrap.sh
```

This script allows you to:

1. Create symlinks
2. Set environment variables
3. Install additional tools
4. Configure aliases
5. Set up your workspace

### Docker Compose Configuration

You can customize the Docker Compose configuration:

```bash
vim scripts/gcp-docker/docker-compose.yml
```

This allows you to:

1. Change port mappings
2. Add additional volumes
3. Set environment variables
4. Add services

## Common Docker Operations

### Viewing Container Status

```bash
docker ps
```

### Stopping Containers

```bash
docker stop responsive-tiles-gcp-test
```

### Viewing Container Logs

```bash
docker logs -f responsive-tiles-gcp-test
```

### Removing Containers

```bash
docker rm responsive-tiles-gcp-test
```

### Rebuilding Images

```bash
# For the basic environment
cd scripts/gcp-docker
docker build -t responsive-tiles-gcp-test .

# For the enhanced environment
cd scripts/gcp-docker
docker build -f Dockerfile.enhanced -t responsive-tiles-git-env .
```

## Troubleshooting

### Build Issues

If Docker build fails:

1. Check Docker logs: `docker logs -f responsive-tiles-gcp-test`
2. Verify Dockerfile syntax
3. Ensure Docker has sufficient resources

### Container Access Issues

If you can't access services:

1. Check port mappings: `docker port responsive-tiles-gcp-test`
2. Verify services are running inside the container
3. Check if another service is using the same ports

### Volume Mounting Issues

If volumes don't mount correctly:

1. Check Docker permissions
2. Verify paths are correct
3. Try using absolute paths