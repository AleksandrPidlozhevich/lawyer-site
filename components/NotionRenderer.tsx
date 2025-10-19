// components/NotionRenderer.tsx
import React from 'react';
import Image from 'next/image';

interface RichText {
  type: string;
  text?: {
    content: string;
    link?: {
      url: string;
    };
  };
  plain_text: string;
  href?: string;
  annotations: {
    bold: boolean;
    italic: boolean;
    strikethrough: boolean;
    underline: boolean;
    code: boolean;
    color: string;
  };
}

interface NotionBlock {
  id: string;
  type: string;
  [key: string]: any;
}

interface NotionRendererProps {
  blocks: NotionBlock[];
}

const renderRichText = (richTextArray: RichText[]) => {
  return richTextArray.map((richText, index) => {
    const {
      annotations: { bold, code, color, italic, strikethrough, underline },
      text,
      plain_text,
      href,
    } = richText;

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
          {renderRichText(block.paragraph.rich_text)}
        </p>
      );

    case 'heading_1':
      return (
        <h1 key={id} className="text-3xl font-bold mb-6 mt-8">
          {renderRichText(block.heading_1.rich_text)}
        </h1>
      );

    case 'heading_2':
      return (
        <h2 key={id} className="text-2xl font-semibold mb-4 mt-6">
          {renderRichText(block.heading_2.rich_text)}
        </h2>
      );

    case 'heading_3':
      return (
        <h3 key={id} className="text-xl font-semibold mb-3 mt-5">
          {renderRichText(block.heading_3.rich_text)}
        </h3>
      );

    case 'bulleted_list_item':
      return (
        <li key={id} className="mb-2">
          {renderRichText(block.bulleted_list_item.rich_text)}
        </li>
      );

    case 'numbered_list_item':
      return (
        <li key={id} className="mb-2">
          {renderRichText(block.numbered_list_item.rich_text)}
        </li>
      );

    case 'quote':
      return (
        <blockquote key={id} className="border-l-4 border-gray-300 pl-4 italic my-4 text-gray-600 dark:text-gray-400">
          {renderRichText(block.quote.rich_text)}
        </blockquote>
      );

    case 'code':
      return (
        <pre key={id} className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto my-4">
          <code className="text-sm font-mono">
            {block.code.rich_text.map((text: RichText) => text.plain_text).join('')}
          </code>
        </pre>
      );

    case 'image':
      const src = block.image.type === 'external' 
        ? block.image.external.url 
        : block.image.file.url;
      const caption = block.image.caption.length > 0 
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
            {block.callout.icon && (
              <span className="mr-3 text-lg">
                {block.callout.icon.type === 'emoji' ? block.callout.icon.emoji : '💡'}
              </span>
            )}
            <div className="flex-1">
              {renderRichText(block.callout.rich_text)}
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