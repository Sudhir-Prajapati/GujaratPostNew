'use client';

import React, { useState, useRef } from 'react';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  RotateCcw,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Link as LinkIcon,
  Image as ImageIcon,
  Code,
  Eye,
  Eraser,
} from 'lucide-react';

interface RichTextAreaProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  rows?: number;
  label?: string;
  required?: boolean;
}

export default function RichTextArea({
  value,
  onChange,
  placeholder = 'Write content here...',
  rows = 6,
  label,
  required = false,
}: RichTextAreaProps) {
  const [showSource, setShowSource] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Helper to wrap selected text with open and close tags
  const applyTag = (openTag: string, closeTag: string, defaultText = 'text') => {
    const el = textareaRef.current;
    if (!el) {
      onChange(`${value}${openTag}${defaultText}${closeTag}`);
      return;
    }

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = value.substring(start, end) || defaultText;
    const replacement = `${openTag}${selected}${closeTag}`;
    const newValue = value.substring(0, start) + replacement + value.substring(end);

    onChange(newValue);

    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + openTag.length, start + openTag.length + selected.length);
    }, 10);
  };

  // Insert list items
  const applyList = (type: 'ul' | 'ol') => {
    const el = textareaRef.current;
    if (!el) return;

    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = value.substring(start, end);

    let listHtml = '';
    if (selected.trim()) {
      const lines = selected.split('\n').filter((l) => l.trim());
      const items = lines.map((l) => `  <li>${l.replace(/^[-•*1-9.]+\s*/, '')}</li>`).join('\n');
      listHtml = `<${type}>\n${items}\n</${type}>`;
    } else {
      listHtml = `<${type}>\n  <li>List item 1</li>\n  <li>List item 2</li>\n</${type}>`;
    }

    const newValue = value.substring(0, start) + listHtml + value.substring(end);
    onChange(newValue);
  };

  // Insert quote
  const applyQuote = () => {
    const el = textareaRef.current;
    const start = el ? el.selectionStart : 0;
    const end = el ? el.selectionEnd : 0;
    const selected = value.substring(start, end) || 'Important quote statement...';
    const quoteHtml = `<blockquote>\n  "${selected}"\n</blockquote>`;
    const newValue = value.substring(0, start) + quoteHtml + value.substring(end);
    onChange(newValue);
  };

  // Insert heading
  const applyHeading = (level: number) => {
    applyTag(`<h${level}>`, `</h${level}>`, `Heading ${level}`);
  };

  // Insert link
  const applyLink = () => {
    const url = prompt('Enter website link / URL:', 'https://');
    if (!url) return;
    applyTag(`<a href="${url}" target="_blank" rel="noopener">`, '</a>', 'Click here');
  };

  // Insert image
  const applyImage = () => {
    const url = prompt('Enter image URL:', 'https://');
    if (!url) return;
    const alt = prompt('Enter image caption / alt text:', 'Photo') || 'Photo';
    const imgMarkdown = `![${alt}](${url})`;
    const el = textareaRef.current;
    const start = el ? el.selectionStart : value.length;
    const newValue = value.substring(0, start) + `\n${imgMarkdown}\n` + value.substring(start);
    onChange(newValue);
  };

  // Text alignment
  const applyAlign = (align: 'left' | 'center' | 'right' | 'justify') => {
    applyTag(`<p style="text-align: ${align}">`, '</p>', 'Aligned paragraph text');
  };

  // Clear tags
  const clearFormatting = () => {
    const el = textareaRef.current;
    if (!el) return;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = value.substring(start, end);
    if (!selected) {
      const stripped = value.replace(/<[^>]*>?/gm, '').replace(/!\[.*?\]\(.*?\)/g, '');
      onChange(stripped);
      return;
    }
    const stripped = selected.replace(/<[^>]*>?/gm, '').replace(/!\[.*?\]\(.*?\)/g, '');
    const newValue = value.substring(0, start) + stripped + value.substring(end);
    onChange(newValue);
  };

  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label className="block text-xs font-extrabold text-zinc-700 uppercase tracking-wider dark:text-zinc-300">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="rounded-xl border border-zinc-200 bg-white overflow-hidden shadow-sm dark:border-zinc-800 dark:bg-zinc-900 transition-all focus-within:border-primary">
        
        {/* WYSIWYG Formatting Toolbar */}
        <div className="flex flex-wrap items-center gap-1 border-b border-zinc-200 bg-zinc-100/90 p-2 dark:border-zinc-800 dark:bg-zinc-950/60 select-none">
          
          {/* Group 1: Text Styles */}
          <div className="flex items-center rounded-lg bg-white p-0.5 border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 shadow-2xs">
            <button
              type="button"
              onClick={() => applyTag('<b>', '</b>', 'bold text')}
              title="Bold (B)"
              className="rounded p-1.5 hover:bg-zinc-100 text-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <Bold className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => applyTag('<i>', '</i>', 'italic text')}
              title="Italic (I)"
              className="rounded p-1.5 hover:bg-zinc-100 text-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <Italic className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => applyTag('<u>', '</u>', 'underlined text')}
              title="Underline (U)"
              className="rounded p-1.5 hover:bg-zinc-100 text-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <UnderlineIcon className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => applyTag('<s>', '</s>', 'strikethrough text')}
              title="Strikethrough (S)"
              className="rounded p-1.5 hover:bg-zinc-100 text-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <Strikethrough className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={clearFormatting}
              title="Remove Formatting (Tx)"
              className="rounded p-1.5 hover:bg-red-50 text-red-600 dark:hover:bg-red-950/40"
            >
              <Eraser className="h-4 w-4" />
            </button>
          </div>

          <div className="h-5 w-[1px] bg-zinc-300 dark:bg-zinc-800 mx-0.5" />

          {/* Group 2: Headings */}
          <div className="flex items-center rounded-lg bg-white p-0.5 border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 shadow-2xs">
            <button
              type="button"
              onClick={() => applyHeading(1)}
              title="Heading 1 (H1)"
              className="rounded p-1.5 hover:bg-zinc-100 text-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <Heading1 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => applyHeading(2)}
              title="Heading 2 (H2)"
              className="rounded p-1.5 hover:bg-zinc-100 text-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <Heading2 className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => applyHeading(3)}
              title="Heading 3 (H3)"
              className="rounded p-1.5 hover:bg-zinc-100 text-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <Heading3 className="h-4 w-4" />
            </button>
          </div>

          <div className="h-5 w-[1px] bg-zinc-300 dark:bg-zinc-800 mx-0.5" />

          {/* Group 3: Lists & Quotes */}
          <div className="flex items-center rounded-lg bg-white p-0.5 border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 shadow-2xs">
            <button
              type="button"
              onClick={() => applyList('ul')}
              title="Bullet List (::)"
              className="rounded p-1.5 hover:bg-zinc-100 text-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => applyList('ol')}
              title="Numbered List (1=)"
              className="rounded p-1.5 hover:bg-zinc-100 text-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <ListOrdered className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={applyQuote}
              title="Blockquote Quote Box (&quot;&quot;)"
              className="rounded p-1.5 hover:bg-zinc-100 text-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <Quote className="h-4 w-4" />
            </button>
          </div>

          <div className="h-5 w-[1px] bg-zinc-300 dark:bg-zinc-800 mx-0.5" />

          {/* Group 4: Text Alignments */}
          <div className="flex items-center rounded-lg bg-white p-0.5 border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 shadow-2xs">
            <button
              type="button"
              onClick={() => applyAlign('left')}
              title="Align Left"
              className="rounded p-1.5 hover:bg-zinc-100 text-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <AlignLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => applyAlign('center')}
              title="Align Center"
              className="rounded p-1.5 hover:bg-zinc-100 text-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <AlignCenter className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => applyAlign('right')}
              title="Align Right"
              className="rounded p-1.5 hover:bg-zinc-100 text-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <AlignRight className="h-4 w-4" />
            </button>
          </div>

          <div className="h-5 w-[1px] bg-zinc-300 dark:bg-zinc-800 mx-0.5" />

          {/* Group 5: Insert Links & Images */}
          <div className="flex items-center rounded-lg bg-white p-0.5 border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 shadow-2xs">
            <button
              type="button"
              onClick={applyLink}
              title="Insert Link (🔗)"
              className="rounded p-1.5 hover:bg-zinc-100 text-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <LinkIcon className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={applyImage}
              title="Insert Image (🖼️)"
              className="rounded p-1.5 hover:bg-zinc-100 text-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <ImageIcon className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1" />

          {/* Toggle View Mode (Raw Source / Live Preview) */}
          <button
            type="button"
            onClick={() => setShowSource(!showSource)}
            className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold transition-all border ${
              showSource
                ? 'bg-zinc-900 text-white border-zinc-900 dark:bg-white dark:text-zinc-900 dark:border-white shadow-sm'
                : 'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50 dark:bg-zinc-900 dark:text-zinc-300 dark:border-zinc-800'
            }`}
          >
            {showSource ? <Eye className="h-3.5 w-3.5" /> : <Code className="h-3.5 w-3.5" />}
            <span>{showSource ? 'Live Preview' : 'Source Code'}</span>
          </button>
        </div>

        {/* Input Area / Live Preview */}
        {showSource ? (
          <div
            className="p-4 min-h-[140px] prose dark:prose-invert max-w-none text-sm text-zinc-900 dark:text-zinc-100 bg-zinc-50/50 dark:bg-zinc-950/20"
            dangerouslySetInnerHTML={{
              __html: value
                ? value
                    .replace(/\n\n+/g, '</p><p>')
                    .replace(/\n/g, '<br/>')
                    .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="rounded-lg my-2 max-h-64 object-cover" />')
                : `<span className="text-zinc-400 italic">${placeholder}</span>`,
            }}
          />
        ) : (
          <textarea
            ref={textareaRef}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            required={required}
            className="w-full bg-white px-4 py-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:outline-none dark:bg-zinc-900 dark:text-zinc-100 font-sans leading-relaxed"
          />
        )}
      </div>
    </div>
  );
}
