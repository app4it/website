// blog.js - Blog functionality for markdown parsing and post listing

// Markdown parser using marked.js (will be loaded via CDN)
let marked = null;

// Initialize markdown parser
function initMarkdownParser() {
    if (typeof marked !== 'undefined') {
        // Configure marked options
        marked.setOptions({
            breaks: true,
            gfm: true,
            headerIds: true,
            mangle: false
        });
        return true;
    }
    return false;
}

// Parse front matter from markdown
function parseFrontMatter(content) {
    const frontMatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
    const match = content.match(frontMatterRegex);
    
    if (match) {
        const frontMatter = {};
        const frontMatterContent = match[1];
        const markdownContent = match[2];
        
        // Parse YAML-like front matter
        frontMatterContent.split('\n').forEach(line => {
            const colonIndex = line.indexOf(':');
            if (colonIndex > 0) {
                const key = line.substring(0, colonIndex).trim();
                let value = line.substring(colonIndex + 1).trim();
                // Remove quotes if present
                value = value.replace(/^["']|["']$/g, '');
                frontMatter[key] = value;
            }
        });
        
        return { frontMatter, content: markdownContent };
    }
    
    return { frontMatter: {}, content };
}

// Get excerpt from markdown content
function getExcerpt(content, maxLength = 150) {
    // Remove markdown syntax for excerpt
    let text = content
        .replace(/^#+\s+/gm, '') // Remove headers
        .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Convert links to text
        .replace(/!\[([^\]]*)\]\([^\)]+\)/g, '') // Remove images
        .replace(/`([^`]+)`/g, '$1') // Remove code backticks
        .replace(/\*\*([^\*]+)\*\*/g, '$1') // Remove bold
        .replace(/\*([^\*]+)\*/g, '$1') // Remove italic
        .replace(/\n+/g, ' ') // Replace newlines with spaces
        .trim();
    
    if (text.length > maxLength) {
        text = text.substring(0, maxLength) + '...';
    }
    
    return text;
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Load and display blog posts
async function loadBlogPosts() {
    const postsContainer = document.getElementById('blog-posts-container');
    if (!postsContainer) return;
    
    postsContainer.innerHTML = '<div class="blog-loading"><i class="fas fa-spinner"></i><p>Loading posts...</p></div>';
    
    try {
        // Get list of markdown files from _posts directory
        // Since we can't list directory contents directly in static hosting,
        // we'll need to maintain a posts list or use a different approach
        // For now, we'll try to fetch a posts.json file that lists all posts
        // Determine base path: if we're on blog subdomain or in blog folder, use relative path
        const isBlogDomain = window.location.hostname === 'blog.app4it.de' || window.location.hostname.includes('blog.');
        const isBlogPath = window.location.pathname.includes('/blog/');
        const basePath = (isBlogDomain || isBlogPath) ? '' : 'blog/';
        const postsListResponse = await fetch(`${basePath}_posts/posts.json`);
        
        if (!postsListResponse.ok) {
            // If posts.json doesn't exist, try to load posts manually
            // This is a fallback - ideally you'd maintain a posts.json file
            postsContainer.innerHTML = '<div class="blog-empty"><i class="fas fa-file-alt"></i><p>No posts found. Add posts to the _posts folder.</p></div>';
            return;
        }
        
        const postsList = await postsListResponse.json();
        
        if (!postsList || postsList.length === 0) {
            postsContainer.innerHTML = '<div class="blog-empty"><i class="fas fa-file-alt"></i><p>No posts available yet.</p></div>';
            return;
        }
        
        // Load each post
        const posts = await Promise.all(
            postsList.map(async (postFile) => {
                try {
                    const response = await fetch(`${basePath}_posts/${postFile}`);
                    if (!response.ok) return null;
                    
                    const content = await response.text();
                    const { frontMatter, content: markdownContent } = parseFrontMatter(content);
                    
                    return {
                        slug: postFile.replace('.md', ''),
                        title: frontMatter.title || 'Untitled',
                        date: frontMatter.date || new Date().toISOString(),
                        excerpt: frontMatter.excerpt || getExcerpt(markdownContent),
                        author: frontMatter.author || 'App4it Team',
                        tags: frontMatter.tags ? frontMatter.tags.split(',').map(t => t.trim()) : [],
                        content: markdownContent
                    };
                } catch (error) {
                    console.error(`Error loading post ${postFile}:`, error);
                    return null;
                }
            })
        );
        
        // Filter out null posts and sort by date (newest first)
        const validPosts = posts.filter(p => p !== null).sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
        });
        
        if (validPosts.length === 0) {
            postsContainer.innerHTML = '<div class="blog-empty"><i class="fas fa-file-alt"></i><p>No posts available yet.</p></div>';
            return;
        }
        
        // Render posts
        renderBlogPosts(validPosts);
        
    } catch (error) {
        console.error('Error loading blog posts:', error);
        postsContainer.innerHTML = '<div class="blog-empty"><i class="fas fa-exclamation-triangle"></i><p>Error loading posts. Please try again later.</p></div>';
    }
}

// Render blog posts to the page
function renderBlogPosts(posts) {
    const postsContainer = document.getElementById('blog-posts-container');
    if (!postsContainer) return;
    
    const postsGrid = document.createElement('div');
    postsGrid.className = 'blog-posts-grid';
    
    posts.forEach(post => {
        const postCard = document.createElement('a');
        postCard.href = `post.html?slug=${post.slug}`;
        postCard.className = 'blog-post-card';
        
        postCard.innerHTML = `
            <div class="blog-post-meta">
                <div class="blog-post-date">
                    <i class="fas fa-calendar-alt"></i>
                    <span>${formatDate(post.date)}</span>
                </div>
            </div>
            <h3 class="blog-post-title">${post.title}</h3>
            <p class="blog-post-excerpt">${post.excerpt}</p>
            <span class="blog-post-read-more">
                Read more <i class="fas fa-arrow-right"></i>
            </span>
        `;
        
        postsGrid.appendChild(postCard);
    });
    
    postsContainer.innerHTML = '';
    postsContainer.appendChild(postsGrid);
}

// Load and display individual blog post
async function loadBlogPost(slug) {
    const postContainer = document.getElementById('blog-post-content');
    const postHeader = document.getElementById('blog-post-header');
    
    if (!postContainer) return;
    
    postContainer.innerHTML = '<div class="blog-loading"><i class="fas fa-spinner"></i><p>Loading post...</p></div>';
    
    try {
        // Determine base path: if we're on blog subdomain or in blog folder, use relative path
        const isBlogDomain = window.location.hostname === 'blog.app4it.de' || window.location.hostname.includes('blog.');
        const isBlogPath = window.location.pathname.includes('/blog/');
        const basePath = (isBlogDomain || isBlogPath) ? '' : 'blog/';
        const response = await fetch(`${basePath}_posts/${slug}.md`);
        if (!response.ok) {
            throw new Error('Post not found');
        }
        
        const content = await response.text();
        const { frontMatter, content: markdownContent } = parseFrontMatter(content);
        
        // Update page title
        if (frontMatter.title) {
            document.title = `${frontMatter.title} - App4it Blog`;
        }
        
        // Update header if it exists
        if (postHeader) {
            postHeader.innerHTML = `
                <h1 class="blog-post-header-title">${frontMatter.title || 'Untitled'}</h1>
                <div class="blog-post-header-meta">
                    <span><i class="fas fa-calendar-alt"></i> ${formatDate(frontMatter.date || new Date().toISOString())}</span>
                    <span><i class="fas fa-user"></i> ${frontMatter.author || 'App4it Team'}</span>
                </div>
            `;
        }
        
        // Parse and render markdown
        if (!initMarkdownParser()) {
            // If marked.js is not loaded, wait a bit and try again
            setTimeout(() => {
                if (initMarkdownParser()) {
                    renderPostContent(markdownContent, postContainer);
                } else {
                    postContainer.innerHTML = '<p>Error: Markdown parser not loaded. Please refresh the page.</p>';
                }
            }, 100);
        } else {
            renderPostContent(markdownContent, postContainer);
        }
        
    } catch (error) {
        console.error('Error loading blog post:', error);
        postContainer.innerHTML = '<div class="blog-empty"><i class="fas fa-exclamation-triangle"></i><p>Post not found or error loading post.</p></div>';
    }
}

// Render post content
function renderPostContent(markdownContent, container) {
    if (typeof marked === 'undefined') {
        container.innerHTML = '<p>Error: Markdown parser not available.</p>';
        return;
    }
    
    const html = marked.parse(markdownContent);
    container.innerHTML = `<div class="blog-post-content">${html}</div>`;
}

// Initialize blog functionality
document.addEventListener('DOMContentLoaded', () => {
    // Check if we're on the blog index page
    if (document.getElementById('blog-posts-container')) {
        loadBlogPosts();
    }
    
    // Check if we're on a post page
    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get('slug');
    if (slug) {
        loadBlogPost(slug);
    }
});

