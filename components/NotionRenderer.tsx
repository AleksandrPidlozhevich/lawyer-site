// components/NotionRenderer.tsx
import React from 'react';
import Image from 'next/image';

interface RichText {
  type?: string;
  text?: {
    content: string;
    link?: {
      url: string;
    };
  };
  plain_text: string;
  href?: string;
  annotations?: {
    bold?: boolean;
    italic?: boolean;
    strikethrough?: boolean;
    underline?: boolean;
    code?: boolean;
    color?: string;
  };
}

interface RichTextItem {
  plain_text: string;
  href?: string;
  annotations?: {
    bold?: boolean;
    italic?: boolean;
    strikethrough?: boolean;
    underline?: boolean;
    code?: boolean;
  };
}

interface NotionBlock {
  id: string;
  type: string;
  has_children?: boolean;
  children?: NotionBlock[];
  paragraph?: {
    rich_text: RichTextItem[];
  };
  heading_1?: {
    rich_text: RichTextItem[];
    is_toggleable?: boolean;
  };
  heading_2?: {
    rich_text: RichTextItem[];
    is_toggleable?: boolean;
  };
  heading_3?: {
    rich_text: RichTextItem[];
    is_toggleable?: boolean;
  };
  bulleted_list_item?: {
    rich_text: RichTextItem[];
  };
  numbered_list_item?: {
    rich_text: RichTextItem[];
  };
  quote?: {
    rich_text: RichTextItem[];
  };
  code?: {
    rich_text: RichTextItem[];
    language?: string;
  };
  image?: {
    type?: string;
    file?: {
      url: string;
    };
    external?: {
      url: string;
    };
    caption?: RichTextItem[];
  };
  callout?: {
    rich_text: RichTextItem[];
    icon?: {
      type?: string;
      emoji?: string;
    };
  };
}

interface NotionRendererProps {
  blocks: NotionBlock[];
}

const renderRichText = (richTextArray: RichText[]) => {
  return richTextArray.map((richText, index) => {
    const {
      annotations = {},
      text,
      plain_text,
      href,
    } = richText;
    const { bold = false, code = false, color = 'default', italic = false, strikethrough = false, underline = false } = annotations;

    let element = <span key={index}>{plain_text}</span>;

    if (text?.link || href) {
      element = (
        <a
          key={index}
          href={text?.link?.url || href || '#'}
          className="text-blue-600 hover:text-blue-800 underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          {plain_text}
        </a>
      );
    }

    if (code) {
      element = (
        <code key={index} className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-sm font-mono">
          {plain_text}
        </code>
      );
    }

    if (bold) {
      element = <strong key={index}>{element}</strong>;
    }

    if (italic) {
      element = <em key={index}>{element}</em>;
    }

    if (strikethrough) {
      element = <del key={index}>{element}</del>;
    }

    if (underline) {
      element = <u key={index}>{element}</u>;
    }

    return element;
  });
};

const renderBlock = (block: NotionBlock) => {
  const { type, id } = block;

  switch (type) {
    case 'paragraph':
      return (
        <p key={id} className="mb-4 leading-relaxed">
          {block.paragraph?.rich_text ? renderRichText(block.paragraph.rich_text) : ''}
        </p>
      );

    case 'heading_1':
      if (block.heading_1?.is_toggleable) {
        return (
          <details key={id} className="group mb-4">
            <summary className="text-3xl font-bold mb-6 mt-8 cursor-pointer list-none flex items-center hover:text-blue-600 transition-colors">
              <span className="mr-2 transform transition-transform group-open:rotate-90 text-gray-400">▶</span>
              {block.heading_1?.rich_text ? renderRichText(block.heading_1.rich_text) : ''}
            </summary>
            <div className="pl-6 border-l-2 border-gray-100 dark:border-gray-800 ml-2">
              {block.children && <NotionRenderer blocks={block.children} />}
            </div>
          </details>
        );
      }
      return (
        <h1 key={id} className="text-3xl font-bold mb-6 mt-8">
          {block.heading_1?.rich_text ? renderRichText(block.heading_1.rich_text) : ''}
        </h1>
      );

    case 'heading_2':
      if (block.heading_2?.is_toggleable) {
        return (
          <details key={id} className="group mb-4">
            <summary className="text-2xl font-semibold mb-4 mt-6 cursor-pointer list-none flex items-center hover:text-blue-600 transition-colors">
              <span className="mr-2 transform transition-transform group-open:rotate-90 text-gray-400">▶</span>
              {block.heading_2?.rich_text ? renderRichText(block.heading_2.rich_text) : ''}
            </summary>
            <div className="pl-5 border-l-2 border-gray-100 dark:border-gray-800 ml-2">
              {block.children && <NotionRenderer blocks={block.children} />}
            </div>
          </details>
        );
      }
      return (
        <h2 key={id} className="text-2xl font-semibold mb-4 mt-6">
          {block.heading_2?.rich_text ? renderRichText(block.heading_2.rich_text) : ''}
        </h2>
      );

    case 'heading_3':
      if (block.heading_3?.is_toggleable) {
        return (
          <details key={id} className="group mb-4">
            <summary className="text-xl font-semibold mb-3 mt-4 cursor-pointer list-none flex items-center hover:text-blue-600 transition-colors">
              <span className="mr-2 transform transition-transform group-open:rotate-90 text-gray-400">▶</span>
              {block.heading_3?.rich_text ? renderRichText(block.heading_3.rich_text) : ''}
            </summary>
            <div className="pl-4 border-l-2 border-gray-100 dark:border-gray-800 ml-2">
              {block.children && <NotionRenderer blocks={block.children} />}
            </div>
          </details>
        );
      }
      return (
        <h3 key={id} className="text-xl font-semibold mb-3 mt-4">
          {block.heading_3?.rich_text ? renderRichText(block.heading_3.rich_text) : ''}
        </h3>
      );

    case 'bulleted_list_item':
      return (
        <li key={id} className="mb-2">
          {block.bulleted_list_item?.rich_text ? renderRichText(block.bulleted_list_item.rich_text) : ''}
        </li>
      );

    case 'numbered_list_item':
      return (
        <li key={id} className="mb-2">
          {block.numbered_list_item?.rich_text ? renderRichText(block.numbered_list_item.rich_text) : ''}
        </li>
      );

    case 'quote':
      return (
        <blockquote key={id} className="border-l-4 border-blue-500 pl-4 italic mb-4 bg-gray-50 dark:bg-gray-800 py-2">
          {block.quote?.rich_text ? renderRichText(block.quote.rich_text) : ''}
        </blockquote>
      );

    case 'code':
      return (
        <pre key={id} className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto my-4">
          <code className="text-sm font-mono">
            {block.code?.rich_text ? block.code.rich_text.map((text: RichText) => text.plain_text).join('') : ''}
          </code>
        </pre>
      );

    case 'image':
      if (!block.image) return null;
      
      const src = block.image.type === 'external' && block.image.external
        ? block.image.external.url 
        : block.image.file?.url;
      
      if (!src) return null;
      
      const caption = block.image.caption && block.image.caption.length > 0 
        ? block.image.caption.map((text: RichText) => text.plain_text).join('')
        : '';

      return (
        <figure key={id} className="my-6">
          <div className="relative w-full h-64 md:h-96">
            <Image
              src={src}
              alt={caption || 'Image'}
              fill
              className="object-cover rounded-lg"
            />
          </div>
          {caption && (
            <figcaption className="text-center text-sm text-gray-600 dark:text-gray-400 mt-2">
              {caption}
            </figcaption>
          )}
        </figure>
      );

    case 'divider':
      return <hr key={id} className="my-8 border-gray-300 dark:border-gray-600" />;

    case 'callout':
      return (
        <div key={id} className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-400 p-4 my-4 rounded-r-lg">
          <div className="flex items-start">
            {block.callout?.icon && (
              <span className="mr-3 text-lg">
                {block.callout.icon.type === 'emoji' ? block.callout.icon.emoji : '💡'}
              </span>
            )}
            <div className="flex-1">
              {block.callout?.rich_text ? renderRichText(block.callout.rich_text) : ''}
            </div>
          </div>
        </div>
      );

    default:
      return (
        <div key={id} className="mb-4 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded border-l-4 border-yellow-400">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Unsupported block type: {type}
          </p>
        </div>
      );
  }
};

// Group consecutive list items
const groupListItems = (blocks: NotionBlock[]) => {
  const grouped: (NotionBlock | NotionBlock[])[] = [];
  let currentList: NotionBlock[] = [];
  let currentListType: string | null = null;

  blocks.forEach((block) => {
    if (block.type === 'bulleted_list_item' || block.type === 'numbered_list_item') {
      if (currentListType === block.type) {
        currentList.push(block);
      } else {
        if (currentList.length > 0) {
          grouped.push([...currentList]);
        }
        currentList = [block];
        currentListType = block.type;
      }
    } else {
      if (currentList.length > 0) {
        grouped.push([...currentList]);
        currentList = [];
        currentListType = null;
      }
      grouped.push(block);
    }
  });

  if (currentList.length > 0) {
    grouped.push(currentList);
  }

  return grouped;
};

export default function NotionRenderer({ blocks }: NotionRendererProps) {
  const groupedBlocks = groupListItems(blocks);

  return (
    <div className="prose prose-lg dark:prose-invert max-w-none">
      {groupedBlocks.map((item, index) => {
        if (Array.isArray(item)) {
          // This is a list
          const listType = item[0].type;
          const ListComponent = listType === 'numbered_list_item' ? 'ol' : 'ul';
          
          return (
            <ListComponent key={index} className={listType === 'numbered_list_item' ? 'list-decimal list-inside mb-4' : 'list-disc list-inside mb-4'}>
              {item.map((block) => renderBlock(block))}
            </ListComponent>
          );
        } else {
          // This is a single block
          return renderBlock(item);
        }
      })}
    </div>
  );
}