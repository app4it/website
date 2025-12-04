# App4it Blog Setup Guide

## GitHub Pages Setup

For the blog to work on `blog.app4it.de`, you have two options:

### Option 1: Separate Repository (Recommended)

1. Create a new GitHub repository (e.g., `app4it-blog`)
2. Copy the contents of the `blog` folder to the root of the new repository
3. Enable GitHub Pages in the repository settings, pointing to the `main` branch
4. Add a CNAME file in the root with `blog.app4it.de`

### Option 2: Same Repository with Different Branch

1. Create a new branch called `blog` or `gh-pages-blog`
2. Copy the blog folder contents to the root of this branch
3. Configure GitHub Pages to serve from this branch
4. Add a CNAME file with `blog.app4it.de`

## Cloudflare DNS Configuration

After setting up GitHub Pages, add the following DNS record in Cloudflare:

1. Go to your Cloudflare dashboard
2. Select the `app4it.de` domain
3. Go to DNS settings
4. Add a new CNAME record:
   - **Type**: CNAME
   - **Name**: `blog`
   - **Target**: `your-username.github.io` (or your GitHub Pages URL)
   - **Proxy status**: Proxied (orange cloud) or DNS only (gray cloud) - both work
   - **TTL**: Auto

5. Save the record

## Adding New Blog Posts

1. Create a new markdown file in the `_posts` folder
2. Use the following front matter format:

```markdown
---
title: Your Post Title
date: YYYY-MM-DD
author: Author Name
excerpt: A short description of the post
tags: tag1, tag2, tag3
---

Your post content here...
```

3. Add the filename to `_posts/posts.json`:

```json
[
  "welcome-to-app4it.md",
  "getting-started-with-events.md",
  "your-new-post.md"
]
```

4. Commit and push to your repository

## Notes

- Posts are sorted by date (newest first)
- The blog uses marked.js for markdown parsing
- All posts should be in the `_posts` folder
- The `posts.json` file must list all post filenames

