# Merge Conflict Resolution Guide

## Conflict in index.html

The merge conflict occurs because:
- **main branch**: Has the original OpusAudit application in `index.html` (single-file app with embedded functionality)
- **PR branch**: Has restructured to use `index.html` as a landing page and `app.html` as the enhanced application

## Resolution: Use PR Branch Version

**Accept the PR branch version** of `index.html` (the landing page) because:

1. The enhanced application functionality from the original index.html is now in `app.html` (with ClaudeIt branding)
2. The new `index.html` serves as a professional landing page with:
   - Quick launch buttons
   - Feature overview
   - Links to all implementations
   - Better user experience for sharing

## What Happened to the Original Functionality?

The original OpusAudit application functionality has been:
- **Rebranded** to ClaudeIt
- **Enhanced** with additional features (API Gateway, Jobs Queue, Incident Tracking)
- **Moved** to `app.html` (97KB single-file application)
- All OpusAudit references changed to ClaudeIt throughout

## Files in PR Branch

- `index.html` - Landing page (9KB) ✅ **Use this version**
- `app.html` - Enhanced ClaudeIt application (97KB)
- `implementations/index-full.html` - Full implementation (backward compatible)
- `implementations/index-lite.html` - Lite implementation
- `implementations/index-enhanced.html` - Same as app.html

## Resolving the Conflict in GitHub

When merging the PR, choose: **"Use copilot/setup-auditing-for-anthropic-api version"** for index.html

This will:
- Replace the old OpusAudit single-file app with the new landing page
- Preserve all functionality in app.html with ClaudeIt branding
- Enable GitHub Pages deployment with a professional landing page

## Command Line Resolution (if needed)

```bash
# Accept our version (PR branch)
git checkout --ours index.html
git add index.html
git commit -m "Resolve merge conflict: Use landing page version of index.html"
```

## Verification After Merge

After merging, verify:
1. `index.html` is the landing page
2. `app.html` contains the enhanced application
3. All OpusAudit references are changed to ClaudeIt
4. GitHub Pages deploys correctly
