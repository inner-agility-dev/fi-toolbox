#!/bin/bash

# Create a GitHub gist with the session transcript
# You'll need to run this command manually

# First, check if there's an existing public gist to delete
echo "Checking for existing public gists..."
echo "To list your gists: gh gist list"
echo "To delete a public gist: gh gist delete GIST_ID"
echo ""

# Create the private gist
echo "Creating PRIVATE gist with session transcript..."
gh gist create agent-1-session-transcript-2025-06-05.md \
  --desc "AGENT-1 Session Transcript: TypeScript Migration of sync-repos.js (Ticket: PVTI_lAHOAALNNc4A6pIXzgbKFeo)" \
  --secret

echo ""
echo "After creating the gist, you can add it to the ticket with:"
echo "gh issue comment ISSUE_NUMBER --body 'Session transcript: GIST_URL'"
echo ""
echo "Note: Always use --secret flag for work-related gists to keep them private!"