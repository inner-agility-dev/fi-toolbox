# Image Creation Instructions (2025-04-16)

This file contains instructions for creating images needed in the documentation.

## Image Requirements

### 1. Image: ToolboxUI

- **Document**: DEVELOPER-TOOLS.md
- **Description**: Screenshot of the Toolbox interface showing the JSON editor and preview panel
- **Filename**: ToolboxUI.png
- **Location**: Place in `docs/images/` directory
- **Recommended Format**: PNG with transparent background
- **Recommended Size**: 800-1200px width, appropriate height

### 2. Image: TestHarnessUI

- **Document**: DEVELOPER-TOOLS.md
- **Description**: Screenshot of the Test Harness showing multiple tiles in a grid layout
- **Filename**: TestHarnessUI.png
- **Location**: Place in `docs/images/` directory
- **Recommended Format**: PNG with transparent background
- **Recommended Size**: 800-1200px width, appropriate height

### 3. Image: ToolboxUsage

- **Document**: DEVELOPER-TOOLS.md
- **Description**: Screenshot showing a developer using the Toolbox to configure a financial component
- **Filename**: ToolboxUsage.png
- **Location**: Place in `docs/images/` directory
- **Recommended Format**: PNG with transparent background
- **Recommended Size**: 800-1200px width, appropriate height

### 4. Image: TestHarnessUsage

- **Document**: DEVELOPER-TOOLS.md
- **Description**: Screenshot showing multiple tiles arranged in the Test Harness grid layout
- **Filename**: TestHarnessUsage.png
- **Location**: Place in `docs/images/` directory
- **Recommended Format**: PNG with transparent background
- **Recommended Size**: 800-1200px width, appropriate height

### 5. Image: ImageID

- **Document**: EMBED-IMAGES.md
- **Description**: Description of the image
- **Filename**: ImageID.png
- **Location**: Place in `docs/images/` directory
- **Recommended Format**: PNG with transparent background
- **Recommended Size**: 800-1200px width, appropriate height

### 6. Image: ToolboxUI

- **Document**: EMBED-IMAGES.md
- **Description**: Screenshot of the Toolbox interface showing the JSON editor and preview panel
- **Filename**: ToolboxUI.png
- **Location**: Place in `docs/images/` directory
- **Recommended Format**: PNG with transparent background
- **Recommended Size**: 800-1200px width, appropriate height

### 7. Image: CICDConcept

- **Document**: GITHUB-WORKFLOW.md
- **Description**: A conceptual diagram showing the flow from code commit through testing to deployment across environments
- **Filename**: CICDConcept.png
- **Location**: Place in `docs/images/` directory
- **Recommended Format**: PNG with transparent background
- **Recommended Size**: 800-1200px width, appropriate height

### 8. Image: TestResults

- **Document**: GITHUB-WORKFLOW.md
- **Description**: Screenshot showing test results output from the GitHub Actions console
- **Filename**: TestResults.png
- **Location**: Place in `docs/images/` directory
- **Recommended Format**: PNG with transparent background
- **Recommended Size**: 800-1200px width, appropriate height

### 9. Image: GitHubEnvironments

- **Document**: GITHUB-WORKFLOW.md
- **Description**: Screenshot showing the GitHub Environments configuration with protection rules
- **Filename**: GitHubEnvironments.png
- **Location**: Place in `docs/images/` directory
- **Recommended Format**: PNG with transparent background
- **Recommended Size**: 800-1200px width, appropriate height

### 10. Image: DeploymentStructure

- **Document**: GITHUB-WORKFLOW.md
- **Description**: Visual representation of the deployed directory structure in GCS
- **Filename**: DeploymentStructure.png
- **Location**: Place in `docs/images/` directory
- **Recommended Format**: PNG with transparent background
- **Recommended Size**: 800-1200px width, appropriate height

### 11. Image: SlackNotifications

- **Document**: GITHUB-WORKFLOW.md
- **Description**: Example of Slack notifications from successful and failed deployments
- **Filename**: SlackNotifications.png
- **Location**: Place in `docs/images/` directory
- **Recommended Format**: PNG with transparent background
- **Recommended Size**: 800-1200px width, appropriate height

### 12. Image: SetupScriptRunning

- **Document**: GITHUB-WORKFLOW.md
- **Description**: Terminal output showing the script running and configuring GitHub
- **Filename**: SetupScriptRunning.png
- **Location**: Place in `docs/images/` directory
- **Recommended Format**: PNG with transparent background
- **Recommended Size**: 800-1200px width, appropriate height

### 13. Image: VerificationOutput

- **Document**: GITHUB-WORKFLOW.md
- **Description**: Terminal output showing the verification results
- **Filename**: VerificationOutput.png
- **Location**: Place in `docs/images/` directory
- **Recommended Format**: PNG with transparent background
- **Recommended Size**: 800-1200px width, appropriate height

## Completion Steps

1. Create each image according to the specifications above
2. Save the images in the `docs/images/` directory with the exact filename specified
3. Run `node scripts/image-manager.js update` to update the documentation with the new images

## Image Placement Verification

After completing the steps above, you can generate the HTML documentation to verify:

```bash
npm run docs
```

Then check the generated HTML files in the `docs/development-html/` directory.
