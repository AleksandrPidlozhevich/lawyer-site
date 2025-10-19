// lib/notion.ts
import { Client } from '@notionhq/client';

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

// Removed caching for debugging

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: any[];
  publishedDate: string;
  tags: string[];
  coverImage?: string;
  author: string;
  readTime: number;
}

// Get all published blog posts (from child pages)
export async function getBlogPosts(): Promise<BlogPost[]> {
  try {
    const pageId = process.env.NOTION_DATABASE_ID; // This is actually a page ID
    
    if (!pageId) {
      throw new Error('NOTION_DATABASE_ID (page ID) is not defined');
    }

    console.log('Fetching blog posts from Notion');

    // Get child pages instead of querying database
    const response = await (notion.blocks as any).children.list({
      block_id: pageId,
      page_size: 100
    });

    // Filter only child pages
    const childPages = response.results.filter((block: any) => block.type === 'child_page');

    const posts = await Promise.all(
      childPages.map(async (pageBlock: any) => {
        try {
          // Get the full page data
          const fullPage = await (notion.pages as any).retrieve({ page_id: pageBlock.id });
          const post = await convertNotionPageToBlogPost(fullPage);
          
          return post;
        } catch (error) {
          console.error('Error processing child page:', pageBlock.id, error);
          return null;
        }
      })
    );

    const filteredPosts = posts.filter((post: BlogPost | null): post is BlogPost => post !== null);
    
    return filteredPosts;
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

// Get a single blog post by slug (with caching)
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const allPosts = await getBlogPosts();
    const foundPost = allPosts.find(post => post.slug === slug);
    
    if (foundPost) {
      return foundPost;
    }
    
    return null;
  } catch (error) {
    console.error('getBlogPostBySlug: Error fetching blog post by slug:', error);
    return null;
  }
}

// Get page content (blocks)
export async function getPageContent(pageId: string): Promise<any[]> {
  try {
    const response = await notion.blocks.children.list({
      block_id: pageId,
    });

    return response.results;
  } catch (error) {
    console.error('Error fetching page content:', error);
    return [];
  }
}

// Convert Notion page to BlogPost
async function convertNotionPageToBlogPost(page: any): Promise<BlogPost | null> {
  try {
    if (!page || !page.properties) {
      return null;
    }

    const properties = page.properties;
    
    // Extract title - for child pages, the title is usually in properties.title
    let title = 'Untitled';
    
    // Try different ways to get the title
    if (properties.title?.title?.[0]?.plain_text) {
      title = properties.title.title[0].plain_text;
    } else if (properties.Title?.title?.[0]?.plain_text) {
      title = properties.Title.title[0].plain_text;
    } else if (properties.Name?.title?.[0]?.plain_text) {
      title = properties.Name.title[0].plain_text;
    } else {
      // Find any title property
      for (const [key, value] of Object.entries(properties)) {
        if (value && typeof value === 'object' && 'title' in value && Array.isArray(value.title) && value.title[0]?.plain_text) {
          title = value.title[0].plain_text;
          break;
        }
      }
    }
    
    // Extract slug - use title as fallback
    const slug = properties.Slug?.rich_text?.[0]?.plain_text || 
                 title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 
                 page.id;
    

    
    // Get page content first
    let content: any[] = [];
    try {
      content = await getPageContent(page.id);
    } catch (error) {
      content = [];
    }

    // Extract excerpt - try multiple field names or generate from content
    let excerpt = properties.Excerpt?.rich_text?.[0]?.plain_text || 
                  properties.Description?.rich_text?.[0]?.plain_text ||
                  properties.Summary?.rich_text?.[0]?.plain_text ||
                  properties.Краткое_описание?.rich_text?.[0]?.plain_text ||
                  properties.Описание?.rich_text?.[0]?.plain_text ||
                  '';
    
    // If no excerpt found, try to generate one from the first paragraph of content
    if (!excerpt && content.length > 0) {
      const firstParagraph = content.find(block => 
        block.type === 'paragraph' && 
        block.paragraph?.rich_text?.length > 0
      );
      
      if (firstParagraph) {
        const fullText = firstParagraph.paragraph.rich_text
          .map((t: any) => t.plain_text)
          .join('');
        // Take first 150 characters and add ellipsis if longer
        excerpt = fullText.length > 150 
          ? fullText.substring(0, 150).trim() + '...'
          : fullText;
      }
    }
    
    // Extract published date
    const publishedDate = properties['Published Date']?.date?.start || 
                         properties['Created']?.created_time ||
                         page.created_time;
    
    // Extract tags
    const tags = properties.Tags?.multi_select?.map((tag: any) => tag.name) || 
                properties.Category?.multi_select?.map((tag: any) => tag.name) || 
                [];
    
    // Extract author
    const author = properties.Author?.rich_text?.[0]?.plain_text || 
                  properties.Writer?.rich_text?.[0]?.plain_text ||
                  'Николай Пидложевич';
    
    // Extract cover image
    let coverImage: string | undefined = undefined;
    if (page.cover) {
      if (page.cover.type === 'external') {
        coverImage = page.cover.external.url;
      } else if (page.cover.type === 'file') {
        coverImage = page.cover.file.url;
      }
    }
    
    // Content already fetched above
    
    // Calculate read time (rough estimation: 200 words per minute)
    const wordCount = estimateWordCount(content);
    const readTime = Math.max(1, Math.ceil(wordCount / 200));

    return {
      id: page.id,
      title,
      slug,
      excerpt,
      content,
      publishedDate,
      tags,
      coverImage,
      author,
      readTime
    };
  } catch (error) {
    console.error('Error converting Notion page to blog post:', error);
    return null;
  }
}

// Estimate word count from Notion blocks
function estimateWordCount(blocks: any[]): number {
  let wordCount = 0;
  
  blocks.forEach((block: any) => {
    if (!block || !block.type) return;
    
    let text = '';
    
    switch (block.type) {
      case 'paragraph':
        text = block.paragraph?.rich_text?.map((t: any) => t.plain_text).join('') || '';
        break;
      case 'heading_1':
        text = block.heading_1?.rich_text?.map((t: any) => t.plain_text).join('') || '';
        break;
      case 'heading_2':
        text = block.heading_2?.rich_text?.map((t: any) => t.plain_text).join('') || '';
        break;
      case 'heading_3':
        text = block.heading_3?.rich_text?.map((t: any) => t.plain_text).join('') || '';
        break;
      case 'bulleted_list_item':
        text = block.bulleted_list_item?.rich_text?.map((t: any) => t.plain_text).join('') || '';
        break;
      case 'numbered_list_item':
        text = block.numbered_list_item?.rich_text?.map((t: any) => t.plain_text).join('') || '';
        break;
      case 'quote':
        text = block.quote?.rich_text?.map((t: any) => t.plain_text).join('') || '';
        break;
      case 'code':
        text = block.code?.rich_text?.map((t: any) => t.plain_text).join('') || '';
        break;
    }
    
    if (text) {
      wordCount += text.split(/\s+/).filter((word: string) => word.length > 0).length;
    }
  });
  
  return wordCount;
}

export { notion };