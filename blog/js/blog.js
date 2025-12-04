// blog.js - Blog functionality for markdown parsing and post listing

// Initialize markdown parser
function initMarkdownParser() {
    if (typeof marked !== 'undefined' && marked) {
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
        // Use absolute paths for reliability
        const postsJsonPath = '/blog/posts/posts.json';
        const postsBasePath = '/blog/posts/';

        console.log('Loading posts from:', postsJsonPath);

        let postsList = null;
        let postsListResponse = null;

        try {
            postsListResponse = await fetch(postsJsonPath);
            if (postsListResponse.ok) {
                postsList = await postsListResponse.json();
                console.log('Successfully loaded posts.json with', postsList.length, 'posts');
            } else {
                console.error('Failed to load posts.json:', postsListResponse.status, postsListResponse.statusText);
                throw new Error(`HTTP ${postsListResponse.status}: ${postsListResponse.statusText}`);
            }
        } catch (e) {
            console.error('Error fetching posts.json:', e);
            postsContainer.innerHTML = '<div class="blog-empty"><i class="fas fa-exclamation-triangle"></i><p>Error loading posts. Check console for details.</p></div>';
            return;
        }
        
        if (!postsList || postsList.length === 0) {
            postsContainer.innerHTML = '<div class="blog-empty"><i class="fas fa-file-alt"></i><p>No posts available yet.</p></div>';
            return;
        }

        // Load each post from the posts directory
        const posts = await Promise.all(
            postsList.map(async (postFile) => {
                const postPath = `${postsBasePath}${postFile}`;

                try {
                    console.log(`Loading post ${postFile} from:`, postPath);
                    const response = await fetch(postPath);
                    if (response.ok) {
                        const content = await response.text();
                        const { frontMatter, content: markdownContent } = parseFrontMatter(content);

                        console.log(`Successfully loaded post ${postFile}`);
                        return {
                            slug: postFile.replace('.md', ''),
                            title: frontMatter.title || 'Untitled',
                            date: frontMatter.date || new Date().toISOString(),
                            excerpt: frontMatter.excerpt || getExcerpt(markdownContent),
                            author: frontMatter.author || 'App4it Team',
                            tags: frontMatter.tags ? frontMatter.tags.split(',').map(t => t.trim()) : [],
                            content: markdownContent
                        };
                    } else {
                        console.error(`Failed to load ${postFile}:`, response.status, response.statusText);
                        return null;
                    }
                } catch (e) {
                    console.error(`Error loading ${postFile}:`, e);
                    return null;
                }
            })
        );
        
        // Filter out null posts and sort by date (newest first)
        const validPosts = posts.filter(p => p !== null).sort((a, b) => {
            return new Date(b.date) - new Date(a.date);
        });
        
        console.log('Loaded posts:', validPosts.length, 'out of', postsList.length);
        console.log('Valid posts:', validPosts);
        
        if (validPosts.length === 0) {
            console.error('No valid posts found. All posts:', posts);
            postsContainer.innerHTML = '<div class="blog-empty"><i class="fas fa-file-alt"></i><p>No posts available yet.</p></div>';
            return;
        }
        
        // Render posts
        console.log('Rendering posts...');
        renderBlogPosts(validPosts);
        
    } catch (error) {
        console.error('Error loading blog posts:', error);
        postsContainer.innerHTML = `<div class="blog-empty"><i class="fas fa-exclamation-triangle"></i><p>Error loading posts. Please try again later.</p><small style="color: #666; margin-top: 0.5rem;">${error.message}</small></div>`;
    }
}

// Render blog posts to the page
function renderBlogPosts(posts) {
    console.log('renderBlogPosts called with', posts.length, 'posts');
    const postsContainer = document.getElementById('blog-posts-container');
    if (!postsContainer) {
        console.error('blog-posts-container not found!');
        return;
    }
    
    const postsGrid = document.createElement('div');
    postsGrid.className = 'blog-posts-grid';
    
    posts.forEach(post => {
        console.log('Rendering post:', post.title, post.slug);
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

    console.log('loadBlogPost called with slug:', slug);
    console.log('postContainer found:', !!postContainer);
    console.log('postHeader found:', !!postHeader);
    console.log('marked available:', typeof marked, marked);

    if (!postContainer) {
        console.error('postContainer not found!');
        return;
    }

    postContainer.innerHTML = '<div class="blog-loading"><i class="fas fa-spinner"></i><p>Loading post...</p></div>';

    try {
        // Use absolute path to ensure it works from any page
        const postPath = `/blog/posts/${slug}.md`;

        console.log('Loading post:', slug, 'from:', postPath);

        const response = await fetch(postPath);
        console.log('Fetch response:', response.status, response.statusText);

        if (!response.ok) {
            throw new Error(`Failed to load post: ${response.status} ${response.statusText}`);
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
            console.log('Marked not ready, waiting...');
            setTimeout(() => {
                if (initMarkdownParser()) {
                    console.log('Marked loaded successfully, rendering content');
                    renderPostContent(markdownContent, postContainer);
                } else {
                    console.error('Marked failed to load after waiting');
                    postContainer.innerHTML = '<p>Error: Markdown parser not loaded. Please refresh the page.</p>';
                }
            }, 500); // Increased timeout to 500ms
        } else {
            console.log('Marked ready, rendering content immediately');
            renderPostContent(markdownContent, postContainer);
        }
        
    } catch (error) {
        console.error('Error loading blog post:', error);
        console.error('Error details:', error.message, error.stack);
        postContainer.innerHTML = `<div class="blog-empty"><i class="fas fa-exclamation-triangle"></i><p>Post not found or error loading post.</p><small style="color: #666; margin-top: 0.5rem;">Error: ${error.message}</small></div>`;
    }
}

// Render post content
function renderPostContent(markdownContent, container) {
    if (typeof marked === 'undefined' || !marked) {
        container.innerHTML = '<p>Error: Markdown parser not available.</p>';
        return;
    }

    const html = marked.parse(markdownContent);
    container.innerHTML = `<div class="blog-post-content">${html}</div>`;
}

// Initialize blog functionality
document.addEventListener('DOMContentLoaded', () => {
    console.log('Blog JS initialized');
    console.log('Current URL:', window.location.href);
    console.log('Current pathname:', window.location.pathname);

    // Check if we're on the blog index page
    const postsContainer = document.getElementById('blog-posts-container');
    if (postsContainer) {
        console.log('Found blog-posts-container, loading posts...');
        loadBlogPosts();
    } else {
        console.log('blog-posts-container not found');
    }

    // Check if we're on a post page
    const urlParams = new URLSearchParams(window.location.search);
    const slug = urlParams.get('slug');
    console.log('URL search params:', window.location.search);
    console.log('Slug parameter:', slug);

    if (slug) {
        console.log('Found slug in URL, loading post:', slug);
        loadBlogPost(slug);
    } else {
        console.log('No slug parameter found in URL');
    }
});

