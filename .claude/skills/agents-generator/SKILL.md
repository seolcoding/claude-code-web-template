---
name: agents-generator
description: Automatically generate AGENTS.md files for directories based on complexity analysis, documenting key files, patterns, and context for AI agents
triggers:
  - generate agents
  - create agents.md
  - document codebase
  - agents md
  - generate agents.md
  - codebase documentation
  - ai context files
---

# AGENTS.md Generator

Automatically generates AGENTS.md files at appropriate directory depths based on complexity analysis. Inspired by oh-my-opencode's approach to providing AI agents with contextual understanding of codebases.

## What is AGENTS.md?

AGENTS.md files provide AI agents with:
- Directory-specific context and purpose
- Key files and their roles
- Patterns and conventions used
- Dependencies and relationships
- Testing and build instructions

## Workflow

### Step 1: Analyze Target Directory

Determine scope:
```
User wants to document: [specific path or entire project]
```

If no path specified, ask:
- "Document the entire project, or a specific directory?"

### Step 2: Complexity Analysis

For each directory, calculate complexity score:

```
Score = (file_count * 1) + (subdirectory_count * 2) + (code_files * 3) + (config_files * 2)

Thresholds:
- Score >= 15: Generate AGENTS.md
- Score >= 30: Generate with detailed sections
- Score >= 50: Generate with full documentation
```

Factors to consider:
- Number of files and subdirectories
- Presence of package.json, requirements.txt, Cargo.toml, etc.
- Source code density (*.py, *.ts, *.go, *.rs, etc.)
- Configuration complexity
- Test coverage

### Step 3: Depth Decision

Generate AGENTS.md at:

1. **Project Root** (always)
   - Overall architecture
   - Tech stack
   - Getting started
   - Key directories

2. **Major Subsystems** (score >= 15)
   - src/, lib/, packages/
   - apps/, services/
   - Each package in monorepo

3. **Complex Modules** (score >= 30)
   - Feature directories with multiple files
   - Shared utilities
   - API layers

Skip generating for:
- node_modules, .git, __pycache__, venv, dist, build
- Directories with only 1-2 files
- Generated code directories
- Vendor directories

### Step 4: Generate Content

For each AGENTS.md, include relevant sections:

```markdown
# [Directory Name]

## Purpose
[One-line description of what this directory contains]

## Key Files
- `file.ts` - [description]
- `config.json` - [description]

## Patterns
- [Pattern 1]: [explanation]
- [Pattern 2]: [explanation]

## Dependencies
- Internal: [related directories]
- External: [packages used]

## Testing
[How to run tests for this directory]

## Common Tasks
- [Task 1]: [how to do it]
- [Task 2]: [how to do it]
```

### Step 5: Adapt Content by Directory Type

**For API directories:**
- Endpoints and routes
- Request/response patterns
- Auth requirements
- Error handling

**For UI/Component directories:**
- Component hierarchy
- State management
- Styling approach
- Accessibility notes

**For Data/Model directories:**
- Schema definitions
- Migrations
- Relationships
- Validation rules

**For Config directories:**
- Environment variables
- Build configurations
- Deployment settings

**For Test directories:**
- Test organization
- Mocking strategies
- Coverage requirements

### Step 6: Review and Confirm

Before writing, show the user:
```
Will generate AGENTS.md files at:
1. / (root) - Full project documentation
2. /src - Source code overview
3. /src/api - API layer details
4. /src/components - UI components guide

Proceed? (yes/no/customize)
```

## Output Format

Each AGENTS.md follows this structure:

```markdown
# [Directory Name]

> [Brief tagline describing purpose]

## Overview
[2-3 sentences about this directory's role]

## Structure
[Tree view or list of key subdirectories]

## Key Files
| File | Purpose |
|------|---------|
| file.ts | Description |

## Patterns & Conventions
### [Pattern Name]
[Explanation with example if helpful]

## Dependencies
### Internal
- `../shared` - Shared utilities

### External
- `package-name` - Why it's used

## Development
### Running
\`\`\`bash
command here
\`\`\`

### Testing
\`\`\`bash
command here
\`\`\`

## Notes for AI Agents
- [Important context that helps AI understand this code]
- [Edge cases or gotchas]
- [Preferred approaches for modifications]
```

## Interactive Prompts

Always confirm before writing:
- "Found 5 directories needing AGENTS.md. Generate all?"
- "This directory has unusual structure. What's its purpose?"
- "Existing AGENTS.md found. Update or skip?"

## Examples

### Monorepo
```
/
  AGENTS.md              <- Project overview, workspace setup
  /packages
    /core
      AGENTS.md          <- Core library docs
    /web
      AGENTS.md          <- Web app specifics
    /cli
      AGENTS.md          <- CLI tool docs
```

### Standard Project
```
/
  AGENTS.md              <- Project overview
  /src
    AGENTS.md            <- Source structure
    /api
      AGENTS.md          <- API documentation
    /components
      AGENTS.md          <- Component patterns
```

## Best Practices

1. **Be Concise**: AI agents have context limits
2. **Be Specific**: Include exact commands and paths
3. **Be Current**: Update when structure changes
4. **Be Practical**: Focus on what helps with actual tasks

## Regeneration

To update existing AGENTS.md files:
- "regenerate agents" - Update all
- "update agents for /src" - Update specific directory
- "refresh agents" - Check for structural changes
