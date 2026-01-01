# Security Audit

Perform an OWASP-aligned security audit of the codebase to identify vulnerabilities, hardcoded secrets, and security misconfigurations.

## Steps

### 1. Check for Hardcoded Secrets/Credentials

Search for potential secrets in the codebase:

```bash
# Search for common secret patterns
grep -rniE "(password|secret|api[_-]?key|token|credential|private[_-]?key)\s*[:=]" --include="*.ts" --include="*.js" --include="*.tsx" --include="*.jsx" --include="*.json" --include="*.env*" --include="*.yaml" --include="*.yml" . 2>/dev/null | grep -v node_modules | grep -v ".git" | head -50

# Search for Base64-encoded strings (potential encoded secrets)
grep -rniE "['\"][A-Za-z0-9+/]{40,}[=]{0,2}['\"]" --include="*.ts" --include="*.js" --include="*.tsx" --include="*.jsx" . 2>/dev/null | grep -v node_modules | grep -v ".git" | head -20

# Search for AWS/GCP/Azure patterns
grep -rniE "(AKIA|AGPA|AIDA|AROA|AIPA|ANPA|ANVA|ASIA|AIza|sk-[a-zA-Z0-9]{48})" --include="*.ts" --include="*.js" --include="*.tsx" --include="*.jsx" --include="*.json" --include="*.env*" . 2>/dev/null | grep -v node_modules | grep -v ".git"
```

### 2. Validate Environment Variable Usage

Check for proper env var handling:

```bash
# List all .env files
find . -name ".env*" -not -path "./node_modules/*" 2>/dev/null

# Check if .env files are in .gitignore
grep -E "\.env" .gitignore 2>/dev/null || echo "WARNING: No .env entries in .gitignore"

# Search for process.env usage
grep -rniE "process\.env\." --include="*.ts" --include="*.js" --include="*.tsx" --include="*.jsx" . 2>/dev/null | grep -v node_modules | grep -v ".git"

# Check for env validation (zod, joi, etc.)
grep -rniE "(z\.string|Joi\.|yup\.|process\.env\.\w+\s*\|\|)" --include="*.ts" --include="*.js" . 2>/dev/null | grep -v node_modules | head -20
```

### 3. Check for Common Vulnerabilities

#### XSS (Cross-Site Scripting)
```bash
# dangerouslySetInnerHTML in React
grep -rni "dangerouslySetInnerHTML" --include="*.tsx" --include="*.jsx" . 2>/dev/null | grep -v node_modules

# innerHTML usage
grep -rni "\.innerHTML\s*=" --include="*.ts" --include="*.js" --include="*.tsx" --include="*.jsx" . 2>/dev/null | grep -v node_modules

# document.write
grep -rni "document\.write" --include="*.ts" --include="*.js" --include="*.tsx" --include="*.jsx" . 2>/dev/null | grep -v node_modules
```

#### Injection Vulnerabilities
```bash
# eval() usage
grep -rni "\beval\s*(" --include="*.ts" --include="*.js" --include="*.tsx" --include="*.jsx" . 2>/dev/null | grep -v node_modules

# new Function() usage
grep -rni "new\s*Function\s*(" --include="*.ts" --include="*.js" --include="*.tsx" --include="*.jsx" . 2>/dev/null | grep -v node_modules

# SQL-like patterns (template literals in queries)
grep -rniE "(query|execute|sql)\s*\(\s*\`" --include="*.ts" --include="*.js" . 2>/dev/null | grep -v node_modules
```

#### Insecure Dependencies
```bash
# Check for http:// in dependencies
grep -rniE "http://" package.json 2>/dev/null

# Check for file:// protocols
grep -rniE "file://" package.json 2>/dev/null
```

### 4. Review Dependencies for Known Issues

```bash
# Run npm audit
npm audit --json 2>/dev/null | head -100 || echo "npm audit not available"

# Check for outdated packages with security implications
npm outdated 2>/dev/null | head -30 || echo "npm outdated not available"

# Check package-lock.json exists (dependency pinning)
test -f package-lock.json && echo "package-lock.json exists" || echo "WARNING: No package-lock.json found"
```

### 5. Additional Security Checks

```bash
# Check for console.log with sensitive data patterns
grep -rniE "console\.(log|info|debug).*\b(password|token|secret|key|credential)" --include="*.ts" --include="*.js" --include="*.tsx" --include="*.jsx" . 2>/dev/null | grep -v node_modules

# Check for TODO/FIXME security comments
grep -rniE "(TODO|FIXME|XXX|HACK).*(security|auth|password|token|secret)" --include="*.ts" --include="*.js" --include="*.tsx" --include="*.jsx" . 2>/dev/null | grep -v node_modules

# Check for disabled security features
grep -rniE "(eslint-disable|@ts-ignore|@ts-nocheck)" --include="*.ts" --include="*.js" --include="*.tsx" --include="*.jsx" . 2>/dev/null | grep -v node_modules | head -20

# Check CORS configuration
grep -rniE "(cors|Access-Control-Allow-Origin)" --include="*.ts" --include="*.js" --include="*.json" . 2>/dev/null | grep -v node_modules
```

## Output Format

Generate a security report with the following structure:

```
## Security Audit Report

**Date**: [Current date]
**Project**: [Project name]

### Critical Issues
- [List any critical security issues found]

### High Priority
- [List high priority issues]

### Medium Priority
- [List medium priority issues]

### Low Priority / Informational
- [List low priority findings]

### Dependencies
- Total vulnerabilities found: [X]
- Critical: [X]
- High: [X]
- Moderate: [X]
- Low: [X]

### Recommendations
1. [Specific recommendations based on findings]
2. [Additional security hardening suggestions]

### Passed Checks
- [List security checks that passed]
```

## OWASP Top 10 Reference

This audit covers the following OWASP Top 10 (2021) categories:

- A01: Broken Access Control
- A02: Cryptographic Failures (secrets detection)
- A03: Injection (XSS, SQL, Command)
- A05: Security Misconfiguration
- A06: Vulnerable and Outdated Components
- A09: Security Logging and Monitoring Failures
