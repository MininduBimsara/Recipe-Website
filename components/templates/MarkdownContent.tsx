import React from 'react';

// Regex for inline styling parsing: matches bold (**), italic (*), inline code (`), and links ([text](url))
const INLINE_REGEX = /(\*\*.*?\*\*|\*.*?\*|`.*?`|\[.*?\]\(.*?\))/g;

export function parseInlineMarkdown(text: string): React.ReactNode[] {
  if (!text) return [];

  const parts = text.split(INLINE_REGEX);

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={index} className="font-bold text-stone-900 dark:text-cream">
          {part.slice(2, -2)}
        </strong>
      );
    }
    if (part.startsWith('*') && part.endsWith('*')) {
      return <em key={index} className="italic">{part.slice(1, -1)}</em>;
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code
          key={index}
          className="px-1.5 py-0.5 bg-stone-100 dark:bg-stone-850 border border-stone-200 dark:border-stone-750 rounded font-mono text-[11.5px] text-terracotta"
        >
          {part.slice(1, -1)}
        </code>
      );
    }
    if (part.startsWith('[') && part.includes('](') && part.endsWith(')')) {
      const match = part.match(/\[([^\]]+)\]\(([^)]+)\)/);
      if (match) {
        const [, label, href] = match;
        return (
          <a
            key={index}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-terracotta hover:underline font-medium cursor-pointer"
          >
            {label}
          </a>
        );
      }
    }
    return part;
  });
}

interface MarkdownContentProps {
  content: string;
  className?: string;
}

export default function MarkdownContent({ content, className = '' }: MarkdownContentProps) {
  if (!content) return null;

  const trimmed = content.trim();

  // 1. Heading 1
  if (trimmed.startsWith('# ')) {
    return (
      <h1 className="font-serif font-black text-2xl sm:text-3xl md:text-4xl text-espresso dark:text-cream leading-tight mt-6 mb-3">
        {parseInlineMarkdown(trimmed.substring(2))}
      </h1>
    );
  }

  // 2. Heading 2
  if (trimmed.startsWith('## ')) {
    return (
      <h2 className="font-serif font-bold text-lg sm:text-xl text-espresso dark:text-cream tracking-tight border-l-3 border-terracotta pl-3 mt-5 mb-2.5">
        {parseInlineMarkdown(trimmed.substring(3))}
      </h2>
    );
  }

  // 3. Heading 3
  if (trimmed.startsWith('### ')) {
    return (
      <h3 className="font-serif font-bold text-base sm:text-lg text-espresso/90 dark:text-cream/90 tracking-tight mt-4 mb-2">
        {parseInlineMarkdown(trimmed.substring(4))}
      </h3>
    );
  }

  // 4. Blockquote
  if (trimmed.startsWith('> ')) {
    return (
      <blockquote className="my-4 p-4 bg-cream/20 dark:bg-stone-850/40 rounded-r-xl border-l-4 border-terracotta italic font-serif text-espresso/80 dark:text-stone-300 text-xs sm:text-sm leading-relaxed">
        {parseInlineMarkdown(trimmed.substring(2))}
      </blockquote>
    );
  }

  // 5. Unordered List Item
  if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
    return (
      <ul className="list-disc pl-5 my-2 space-y-1">
        <li className="font-sans text-stone-700 dark:text-stone-300 text-xs sm:text-sm leading-relaxed">
          {parseInlineMarkdown(trimmed.substring(2))}
        </li>
      </ul>
    );
  }

  // 6. Paragraph (default)
  return (
    <p className={className || "font-sans text-stone-700 dark:text-stone-300 text-xs sm:text-sm leading-relaxed text-justify"}>
      {parseInlineMarkdown(trimmed)}
    </p>
  );
}
