# Get Netlify Preview URL

Check the current deployment status and get the preview URL.

## Steps

1. Get current git branch name
2. Use GitHub API to find the latest commit
3. Query Netlify API for deploy status

```bash
# Get current branch
BRANCH=$(git branch --show-current)
echo "Current branch: $BRANCH"

# Get Netlify site info (requires NETLIFY_SITE_ID)
if [ -z "$NETLIFY_SITE_ID" ]; then
  echo "⚠️ NETLIFY_SITE_ID not set. Please set it in your environment."
  exit 1
fi

echo "Preview URL: https://deploy-preview-*--$NETLIFY_SITE_ID.netlify.app"
echo "Check Netlify dashboard for exact URL"
```

After getting the URL, use WebFetch to verify the deployment:
- Check if the page loads
- Look for any error messages
- Verify key elements are present
