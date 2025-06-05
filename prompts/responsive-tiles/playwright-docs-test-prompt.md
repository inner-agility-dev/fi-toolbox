# Responsive Tiles Documentation Test Prompt
**Purpose**: Comprehensive Playwright test for PROD documentation validation
**Prerequisite**: Run `npm run docs:serve` in responsive-tiles first

## Full Test Prompt

Please use Playwright to comprehensively test the responsive-tiles documentation site:

### 1. Initial Setup and Homepage Test
- Navigate to http://localhost:8080/docs/index.html
- Take a screenshot named "docs-homepage.png"
- Verify the page title contains "Responsive Tiles Documentation"
- Check that the version badge is visible and contains "v" followed by numbers
- Capture the version number shown in the badge
- Verify the sidebar is visible with navigation links

### 2. Complete Navigation Test
Test all 18 documentation pages by clicking each sidebar link in order:
1. Home (index.html) - already loaded
2. Architecture - Click and verify page loads
3. Components - Click and verify page loads
4. Development - Click and verify page loads
5. API Integration - Click and verify page loads
6. State Management - Click and verify page loads
7. Testing - Click and verify page loads
8. Performance - Click and verify page loads
9. Configuration - Click and verify page loads
10. Container Layout - Click and verify page loads
11. Developer Tools - Click and verify page loads
12. Troubleshooting - Click and verify page loads
13. Contributing - Click and verify page loads
14. GitHub Workflow - Click and verify page loads
15. GCP Deployment - Click and verify page loads
16. Local Testing - Click and verify page loads
17. Embedding Images - Click and verify page loads
18. Semantic Release - Click and verify page loads

For each page:
- Verify no 404 error
- Confirm the active navigation item is highlighted
- Check that the page has an h1 heading
- Look for any console errors

### 3. Navigation Button Test
- Return to Home (index.html)
- Click "Next →" button repeatedly to navigate through all pages sequentially
- Verify each page loads in the correct order
- On the last page, verify the "Next" button is disabled
- Click "← Previous" to go back one page
- Verify the "Previous" button works correctly

### 4. Content Validation Checks
For at least 3 different pages:
- Verify code blocks have syntax highlighting
- Check that any internal links (ending in .html) are clickable
- Verify tables (if present) are properly formatted
- Check that blockquotes have proper styling

### 5. Console and Error Check
- Open browser console
- Navigate through 5 random pages
- Capture any JavaScript errors or warnings
- Report any 404s for resources (CSS, JS, images)

### 6. Responsive Behavior Test
- Resize browser to mobile width (375px)
- Verify sidebar adapts appropriately
- Check that content remains readable
- Test navigation in mobile view

### 7. Final Validation
- Take a screenshot of one page showing code highlighting
- Generate a summary report with:
  - Total pages tested
  - Version number found
  - Any errors encountered
  - Any broken links found
  - Overall pass/fail status

### Expected Results
All 18 pages should load without errors, navigation should work smoothly, and no console errors should appear. The version number should match the current package.json version.

---

## Quick Smoke Test Prompt (2-minute version)

For rapid validation, test the responsive-tiles documentation:

1. Navigate to http://localhost:8080/docs/index.html
2. Verify homepage loads with sidebar navigation
3. Click these 5 key pages in the sidebar:
   - Architecture
   - Components  
   - API Integration
   - GitHub Workflow
   - Semantic Release
4. For each page, verify it loads without 404
5. Click "Next →" button 3 times to test sequential navigation
6. Check browser console for any errors
7. Take a screenshot of the final page
8. Report: "Documentation smoke test complete - X/5 pages passed"

This confirms core functionality in under 2 minutes.