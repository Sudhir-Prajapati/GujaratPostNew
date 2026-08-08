'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  AlignLeft,
  AlignCenter,
  AlignRight,
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
  rows = 5,
  label,
  required = false,
}: RichTextAreaProps) {
  const [showSource, setShowSource] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);

  // Sync internal HTML content with prop value when value changes externally
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value, showSource]);

  // Execute browser formatting command on contentEditable div
  const execCmd = (command: string, arg: string | undefined = undefined) => {
    if (showSource) setShowSource(false);
    
    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.focus();
      }
      document.execCommand(command, false, arg);
      if (editorRef.current) {
        onChange(editorRef.current.innerHTML);
      }
    }, 10);
  };

  // Insert Link
  const applyLink = () => {
    const url = prompt('Enter website link / URL:', 'https://');
    if (url) execCmd('createLink', url);
  };

  // Insert Image
  const applyImage = () => {
    const url = prompt('Enter image URL:', 'https://');
    if (url) execCmd('insertImage', url);
  };

  // Handle typing inside contentEditable container
  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
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
              onClick={() => execCmd('bold')}
              title="Bold (B)"
              className="rounded p-1.5 hover:bg-zinc-100 text-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 font-bold"
            >
              <Bold className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => execCmd('italic')}
              title="Italic (I)"
              className="rounded p-1.5 hover:bg-zinc-100 text-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <Italic className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => execCmd('underline')}
              title="Underline (U)"
              className="rounded p-1.5 hover:bg-zinc-100 text-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <UnderlineIcon className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => execCmd('strikeThrough')}
              title="Strikethrough (S)"
              className="rounded p-1.5 hover:bg-zinc-100 text-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <Strikethrough className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => execCmd('removeFormat')}
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
              onClick={() => execCmd('formatBlock', '<h1>')}
              title="Heading 1 (H1)"
              className="rounded p-1.5 hover:bg-zinc-100 text-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 font-extrabold text-xs"
            >
              H1
            </button>
            <button
              type="button"
              onClick={() => execCmd('formatBlock', '<h2>')}
              title="Heading 2 (H2)"
              className="rounded p-1.5 hover:bg-zinc-100 text-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 font-extrabold text-xs"
            >
              H2
            </button>
            <button
              type="button"
              onClick={() => execCmd('formatBlock', '<h3>')}
              title="Heading 3 (H3)"
              className="rounded p-1.5 hover:bg-zinc-100 text-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800 font-extrabold text-xs"
            >
              H3
            </button>
          </div>

          <div className="h-5 w-[1px] bg-zinc-300 dark:bg-zinc-800 mx-0.5" />

          {/* Group 3: Lists & Quotes */}
          <div className="flex items-center rounded-lg bg-white p-0.5 border border-zinc-200 dark:bg-zinc-900 dark:border-zinc-800 shadow-2xs">
            <button
              type="button"
              onClick={() => execCmd('insertUnorderedList')}
              title="Bullet List (::)"
              className="rounded p-1.5 hover:bg-zinc-100 text-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => execCmd('insertOrderedList')}
              title="Numbered List (1=)"
              className="rounded p-1.5 hover:bg-zinc-100 text-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <ListOrdered className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => execCmd('formatBlock', 'blockquote')}
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
              onClick={() => execCmd('justifyLeft')}
              title="Align Left"
              className="rounded p-1.5 hover:bg-zinc-100 text-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <AlignLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => execCmd('justifyCenter')}
              title="Align Center"
              className="rounded p-1.5 hover:bg-zinc-100 text-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <AlignCenter className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => execCmd('justifyRight')}
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

          {/* Toggle View Mode Button (Switch to Raw Source Code if needed) */}
          <button
            type="button"
            onClick={() => setShowSource(!showSource)}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all border bg-zinc-900 text-white border-zinc-900 hover:bg-zinc-800 dark:bg-white dark:text-zinc-900 dark:border-white shadow-sm"
          >
            {showSource ? (
              <>
                <Eye className="h-3.5 w-3.5" />
                <span>Visual Editor</span>
              </>
            ) : (
              <>
                <Code className="h-3.5 w-3.5" />
                <span>Source Code</span>
              </>
            )}
          </button>
        </div>

        {/* Display Area: Visual WYSIWYG Editable Div vs Raw HTML Textarea */}
        {showSource ? (
          <textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            rows={rows}
            required={required}
            className="w-full bg-white px-4 py-3 text-sm font-mono text-zinc-900 placeholder:text-zinc-400 focus:outline-none dark:bg-zinc-900 dark:text-zinc-100 leading-relaxed"
          />
        ) : (
          <div
            ref={editorRef}
            contentEditable
            onInput={handleInput}
            onBlur={handleInput}
            style={{ minHeight: `${rows * 28}px` }}
            className="w-full bg-white px-4 py-3 text-sm text-zinc-900 focus:outline-none dark:bg-zinc-900 dark:text-zinc-100 font-sans leading-relaxed prose dark:prose-invert max-w-none empty:before:content-[attr(data-placeholder)] empty:before:text-zinc-400 empty:before:italic"
            data-placeholder={placeholder}
          />
        )}
      </div>
    </div>
  );
}
