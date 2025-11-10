# Git Hooks Setup Guide

This project uses Git hooks to ensure code quality before commits.

## Installation

Run the following command to install the required dependencies:

```bash
npm install --save-dev husky lint-staged
```

## What Gets Checked

### Pre-commit Hook

Before each commit, the following checks run automatically:

1. **ESLint** - Lints and auto-fixes changed TypeScript files
2. **TypeScript Type Check** - Validates all TypeScript types

### How It Works

```
git commit
    ↓
Pre-commit hook runs
    ↓
1. ESLint checks changed files (auto-fix enabled)
    ↓
2. TypeScript type check (all files)
    ↓
If all pass → Commit succeeds ✅
If any fail → Commit blocked ❌
```

## Manual Commands

You can run these checks manually at any time:

```bash
# Run lint on all files
npm run lint

# Run type check
npm run type-check

# Run both
npm run lint && npm run type-check
```

## Bypassing Hooks (Not Recommended)

In emergency situations, you can bypass hooks with:

```bash
git commit --no-verify -m "emergency fix"
```

**Warning:** Only use this in exceptional cases. The CI will still run these checks.

## Configuration Files

- `.husky/pre-commit` - Pre-commit hook script
- `package.json` - lint-staged configuration
- `eslint.config.js` - ESLint rules
- `tsconfig.json` - TypeScript configuration

## Troubleshooting

### Hooks not running

1. Make sure husky is installed:
   ```bash
   npm install
   ```

2. Verify hook files are executable:
   ```bash
   chmod +x .husky/pre-commit
   chmod +x .husky/_/husky.sh
   ```

3. Check if hooks are enabled:
   ```bash
   git config core.hooksPath
   ```
   Should output: `.husky`

### Type check fails

Run the type check manually to see detailed errors:
```bash
npm run type-check
```

### ESLint fails

Run lint manually to see and fix errors:
```bash
npm run lint
```

## Benefits

- ✅ Catch errors before they reach CI
- ✅ Maintain consistent code style
- ✅ Faster feedback loop
- ✅ Prevent broken commits
- ✅ Auto-fix common issues

