// lib/notion.ts
import { Client } from '@notionhq/client';
import { unstable_cache } from 'next/cache';

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_TOKEN,
});

// Notion API interfaces
interface NotionBlock {
  id: string;
  type: string;
  paragraph?: {
    rich_text: RichText[];
  };
  heading_1?: {
    rich_text: RichText[];
  };
  heading_2?: {
    rich_text: RichText[];
  };
  heading_3?: {
    rich_text: RichText[];
  };
  bulleted_list_item?: {
    rich_text: RichText[];
  };
  numbered_list_item?: {
    rich_text: RichText[];
  };
  quote?: {
    rich_text: RichText[];
  };
  code?: {
    rich_text: RichText[];
    language?: string;
  };
  image?: {
    file?: {
      url: string;
    };
    external?: {
      url: string;
    };
    caption?: RichText[];
  };
  callout?: {
    rich_text: RichText[];
    icon?: {
      emoji?: string;
    };
  };
}

interface RichText {
  plain_text: string;
  [key: string]: unknown;
}

interface Tag {
  name: string;
  [key: string]: unknown;
}

interface NotionPage {
  id: string;
  properties: {
    [key: string]: {
      type: string;
      title?: Array<{ plain_text: string }>;
      rich_text?: Array<{ plain_text: string }>;
      date?: { start: string };
      multi_select?: Array<{ name: string }>;
      files?: Array<{ file?: { url: string }; external?: { url: string } }>;
      created_time?: string;
    };
  };
  cover?: {
    file?: { url: string };
    external?: { url: string };
    type?: string;
  };
  created_time?: string;
}

interface NotionChildPage {
  id: string;
  type: string;
  child_page?: {
    title: string;
  };
}

interface NotionResponse {
  results: NotionChildPage[];
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: NotionBlock[];
  publishedDate: string;
  tags: string[];
  coverImage?: string;
  author: string;
  readTime: number;
}

// Get all published blog posts (from child pages)
export const getBlogPosts = unstable_cache(
  async (): Promise<BlogPost[]> => {
    try {
      const pageId = process.env.NOTION_DATABASE_ID;
      if (!pageId) {
        throw new Error('NOTION_DATABASE_ID (page ID) is not defined');
      }

      const response = await notion.blocks.children.list({
        block_id: pageId,
        page_size: 100
      }) as NotionResponse;

      const childPages = response.results.filter((block: NotionChildPage) => block.type === 'child_page');

      const posts = await Promise.all(
        childPages.map(async (pageBlock: NotionChildPage) => {
          try {
            const fullPage = await notion.pages.retrieve({ page_id: pageBlock.id }) as NotionPage;
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
  },
  ['blog-posts'],
  { revalidate: 3600, tags: ['blog-posts'] }
);

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
export async function getPageContent(pageId: string): Promise<NotionBlock[]> {
  try {
    const response = await notion.blocks.children.list({
      block_id: pageId,
    });

    return response.results as NotionBlock[];
  } catch (error) {
    console.error('Error fetching page content:', error);
    return [];
  }
}

// Convert Notion page to BlogPost
async function convertNotionPageToBlogPost(page: NotionPage): Promise<BlogPost | null> {
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
      for (const [, value] of Object.entries(properties)) {
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
    let content: NotionBlock[] = [];
    try {
      content = await getPageContent(page.id);
    } catch (_) {
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
        block.paragraph?.rich_text && 
        block.paragraph.rich_text.length > 0
      );
      
      if (firstParagraph && firstParagraph.paragraph) {
        const fullText = firstParagraph.paragraph.rich_text
          .map((t: RichText) => t.plain_text)
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
                         page.created_time ||
                         new Date().toISOString();
    
    // Extract tags
    const tags = properties.Tags?.multi_select?.map((tag: Tag) => tag.name) || 
                properties.Category?.multi_select?.map((tag: Tag) => tag.name) || 
                [];
    
    // Extract author
    const author = properties.Author?.rich_text?.[0]?.plain_text || 
                  properties.Writer?.rich_text?.[0]?.plain_text ||
                  'Николай Пидложевич';
    
    // Extract cover image
    let coverImage: string | undefined = undefined;
    if (page.cover) {
      if (page.cover.type === 'external' && page.cover.external) {
        coverImage = page.cover.external.url;
      } else if (page.cover.type === 'file' && page.cover.file) {
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
function estimateWordCount(blocks: NotionBlock[]): number {
  let wordCount = 0;
  
  blocks.forEach((block: NotionBlock) => {
    if (!block || !block.type) return;
    
    let text = '';
    
    switch (block.type) {
      case 'paragraph':
        text = (block as { paragraph?: { rich_text?: RichText[] } }).paragraph?.rich_text?.map((t: RichText) => t.plain_text).join('') || '';
        break;
      case 'heading_1':
        text = (block as { heading_1?: { rich_text?: RichText[] } }).heading_1?.rich_text?.map((t: RichText) => t.plain_text).join('') || '';
        break;
      case 'heading_2':
        text = (block as { heading_2?: { rich_text?: RichText[] } }).heading_2?.rich_text?.map((t: RichText) => t.plain_text).join('') || '';
        break;
      case 'heading_3':
        text = (block as { heading_3?: { rich_text?: RichText[] } }).heading_3?.rich_text?.map((t: RichText) => t.plain_text).join('') || '';
        break;
      case 'bulleted_list_item':
        text = (block as { bulleted_list_item?: { rich_text?: RichText[] } }).bulleted_list_item?.rich_text?.map((t: RichText) => t.plain_text).join('') || '';
        break;
      case 'numbered_list_item':
        text = (block as { numbered_list_item?: { rich_text?: RichText[] } }).numbered_list_item?.rich_text?.map((t: RichText) => t.plain_text).join('') || '';
        break;
      case 'quote':
        text = (block as { quote?: { rich_text?: RichText[] } }).quote?.rich_text?.map((t: RichText) => t.plain_text).join('') || '';
        break;
      case 'code':
        text = (block as { code?: { rich_text?: RichText[] } }).code?.rich_text?.map((t: RichText) => t.plain_text).join('') || '';
        break;
    }
    
    if (text) {
      wordCount += text.split(/\s+/).filter((word: string) => word.length > 0).length;
    }
  });
  
  return wordCount;
}

export { notion };