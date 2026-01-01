# Initialize Project with Framework

Initialize a new project with the specified framework.

Usage: `/init-project <framework>`

$ARGUMENTS should be one of:
- `react` - Vite + React + TypeScript
- `vue` - Vite + Vue + TypeScript
- `svelte` - Vite + Svelte + TypeScript
- `next` - Next.js + TypeScript
- `astro` - Astro + TypeScript

## Steps

1. Parse the framework from $ARGUMENTS
2. Run the appropriate create command:

```bash
# React
npm create vite@latest . -- --template react-ts

# Vue
npm create vite@latest . -- --template vue-ts

# Svelte
npm create vite@latest . -- --template svelte-ts

# Next.js
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir

# Astro
npm create astro@latest . -- --template basics --typescript strict
```

3. Install dependencies: `npm install`
4. Update netlify.toml build command if needed
5. Create initial commit
