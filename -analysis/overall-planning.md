
# Introduction

I'm attempting to create a test project to leverage Claude Code 4's Parallel Tool Calling.

Read: https://docs.anthropic.com/en/docs/claude-code/tutorials#run-parallel-claude-code-sessions-with-git-worktrees

And then I've also learned the following from a Anthropic We Site:
```reference
🔧 Parallel Tool Calling
Trigger: When multiple independent tasks can run at the same time.

“"
```

## Prompts
### Project Prompts
#### PRD Creation
##### backend
/Users/LenMiller/code/banno/fi-toolbox/backend
##### frontend
/Users/LenMiller/code/banno/fi-toolbox/frontend
#### SDLC Creation
#### Parallelize Claude Code 
For maximum efficiency, whenever you need to perform multiple independent operations, invoke all relevant tools simultaneously rather than sequentially.


## Ideation
I'm working on a PRD and then a SDLC... and I'm a user of Claude Code, is there a way to write a prompt that will look at these two modified beyond traditional PRD and SDLC documents and create a plan that has parllell task up to four (where this could be a parameter) so I can then run a app that runs these in parallell

https://docs.anthropic.com/en/docs/claude-code/tutorials#create-custom-slash-commands

#Pre-Reqs
create prd
create sdlc

