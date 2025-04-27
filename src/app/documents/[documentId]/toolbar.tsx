'use client';

import {
  AlignCenterIcon,
  AlignJustifyIcon,
  AlignLeftIcon,
  AlignRightIcon,
  BoldIcon,
  ChevronDownIcon,
  ClipboardIcon,
  // New icons for added features
  CodeIcon,
  CopyIcon,
  DownloadIcon,
  EyeIcon,
  FileIcon,
  HelpCircleIcon,
  HighlighterIcon,
  HistoryIcon,
  ImageIcon,
  IndentIcon,
  ItalicIcon,
  KeyboardIcon,
  LayoutIcon,
  Link2Icon,
  ListCollapseIcon,
  ListIcon,
  ListOrderedIcon,
  ListTodoIcon,
  type LucideIcon,
  MessageSquarePlusIcon,
  MinusIcon,
  OutdentIcon,
  PanelLeftIcon,
  PlusIcon,
  PrinterIcon,
  QuoteIcon,
  Redo2Icon,
  RemoveFormattingIcon,
  RotateCcwIcon,
  ScissorsIcon,
  SearchIcon,
  SettingsIcon,
  SpellCheckIcon,
  StrikethroughIcon,
  SubscriptIcon,
  SuperscriptIcon,
  TableIcon,
  UnderlineIcon,
  Undo2Icon,
  UploadIcon,
} from 'lucide-react';
import React, { useState } from 'react';
import { useEffect as reactUseEffect } from 'react';
import { type ColorResult, TwitterPicker } from 'react-color';

import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { useEditorStore } from '@/store/use-editor-store';

const LineHeightButton = () => {
  const { editor } = useEditorStore();

  const lineHeights = [
    { label: 'Default', value: 'normal' },
    { label: 'Single', value: '1' },
    { label: '1.15', value: '1.15' },
    { label: '1.5', value: '1.5' },
    { label: 'Double', value: '2' },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex h-7 min-w-7 shrink-0 items-center justify-center overflow-hidden rounded-sm px-1.5 text-sm hover:bg-neutral-200">
          <ListCollapseIcon className="size-4" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="flex flex-col gap-y-1 p-1">
        {lineHeights.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => editor?.commands.setLineHeight(value)}
            className={cn(
              'flex items-center gap-x-2 rounded-sm px-2 py-1 hover:bg-neutral-200/80',
              editor?.getAttributes('paragraph').lineHeight === value && 'bg-neutral-200/80',
            )}
          >
            <span className="text-sm">{label}</span>
          </button>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const FontSizeButton = () => {
  const { editor } = useEditorStore();

  const currentSize = editor?.getAttributes('textStyle').fontSize;
  const currentFontSize = currentSize ? currentSize.replace('px', '') : '16';

  const [fontSize, setFontSize] = useState<string>(currentFontSize);
  const [inputValue, setInputValue] = useState(fontSize);
  const [isEditing, setIsEditing] = useState(false);

  const updateFontSize = (newSize: string) => {
    const size = parseInt(newSize);

    if (!Number.isNaN(size) && size > 0) {
      editor?.commands.setFontSize(`${size}px`);
      setFontSize(newSize);
      setInputValue(newSize);
      setIsEditing(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleInputBlur = () => {
    updateFontSize(inputValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      updateFontSize(inputValue);
      editor?.commands.focus();
    }
  };

  const increment = () => {
    const newSize = parseInt(fontSize) + 1;
    updateFontSize(newSize.toString());
  };

  const decrement = () => {
    const newSize = parseInt(fontSize) - 1;
    if (newSize > 0) updateFontSize(newSize.toString());
  };

  return (
    <div className="flex items-center gap-x-0.5">
      <button onClick={decrement} className="flex size-7 shrink-0 items-center justify-center rounded-sm hover:bg-neutral-200">
        <MinusIcon className="size-4" />
      </button>

      {isEditing ? (
        <input
          autoFocus
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleKeyDown}
          className="h-7 w-10 rounded-sm border border-neutral-400 bg-transparent text-center text-sm focus:outline-none focus:ring-0"
        />
      ) : (
        <button
          onClick={() => {
            setIsEditing(true);
            setFontSize(currentFontSize);
          }}
          className="h-7 w-10 cursor-text rounded-sm border border-neutral-400 bg-transparent text-center text-sm"
        >
          {currentFontSize}
        </button>
      )}

      <button onClick={increment} className="flex size-7 shrink-0 items-center justify-center rounded-sm hover:bg-neutral-200">
        <PlusIcon className="size-4" />
      </button>
    </div>
  );
};

const ListButton = () => {
  const { editor } = useEditorStore();

  const lists = [
    {
      label: 'Bullet List',
      icon: ListIcon,
      isActive: () => editor?.isActive('bulletList'),
      onClick: () => editor?.commands.toggleBulletList(),
    },
    {
      label: 'Ordered List',
      icon: ListOrderedIcon,
      isActive: () => editor?.isActive('orderedList'),
      onClick: () => editor?.commands.toggleOrderedList(),
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex h-7 min-w-7 shrink-0 items-center justify-center overflow-hidden rounded-sm px-1.5 text-sm hover:bg-neutral-200">
          <ListIcon className="size-4" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="flex flex-col gap-y-1 p-1">
        {lists.map(({ label, icon: Icon, onClick, isActive }) => (
          <button
            key={label}
            onClick={onClick}
            className={cn('flex items-center gap-x-2 rounded-sm px-2 py-1 hover:bg-neutral-200/80', isActive() && 'bg-neutral-200/80')}
          >
            <Icon className="size-4" />
            <span className="text-sm">{label}</span>
          </button>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const AlignButton = () => {
  const { editor } = useEditorStore();

  const alignments = [
    {
      label: 'Align Left',
      value: 'left',
      icon: AlignLeftIcon,
    },
    {
      label: 'Align Center',
      value: 'center',
      icon: AlignCenterIcon,
    },
    {
      label: 'Align Right',
      value: 'right',
      icon: AlignRightIcon,
    },
    {
      label: 'Align Justify',
      value: 'justify',
      icon: AlignJustifyIcon,
    },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex h-7 min-w-7 shrink-0 items-center justify-center overflow-hidden rounded-sm px-1.5 text-sm hover:bg-neutral-200">
          <AlignCenterIcon className="size-4" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="flex flex-col gap-y-1 p-1">
        {alignments.map(({ label, value, icon: Icon }) => (
          <button
            key={value}
            onClick={() => editor?.commands.setTextAlign(value)}
            className={cn(
              'flex items-center gap-x-2 rounded-sm px-2 py-1 hover:bg-neutral-200/80',
              editor?.isActive({ textAlign: value }) && 'bg-neutral-200/80',
            )}
          >
            <Icon className="size-4" />
            <span className="text-sm">{label}</span>
          </button>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const ImageButton = () => {
  const { editor } = useEditorStore();
  const [imageUrl, setImageUrl] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const onChange = (src: string, alt?: string) => {
    if (!src.trim()) return;
    editor?.commands.setImage({ src, alt });
  };

  const onUpload = () => {
    const input = document.createElement('input');

    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];

      if (file) {
        const imageUrl = URL.createObjectURL(file);
        onChange(imageUrl, 'Uploaded Image');
      }
    };

    input.click();
  };

  const handleImageUrlSubmit = () => {
    if (imageUrl) {
      onChange(imageUrl, 'URL Image');
      setImageUrl('');
      setIsDialogOpen(false);
    }
  };

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <button className="flex h-7 min-w-7 shrink-0 items-center justify-center overflow-hidden rounded-sm px-1.5 text-sm hover:bg-neutral-200">
            <ImageIcon className="size-4" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuItem onClick={onUpload}>
            <UploadIcon className="mr-2 size-4" />
            Upload
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
            <SearchIcon className="mr-2 size-4" />
            Paste image url
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Insert image URL</DialogTitle>
          </DialogHeader>

          <Input
            placeholder="Insert image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleImageUrlSubmit();
            }}
          />

          <DialogFooter>
            <Button onClick={handleImageUrlSubmit}>Insert</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

const LinkButton = () => {
  const { editor } = useEditorStore();
  const [value, setValue] = useState('');
  const [open, setOpen] = useState(false);

  const onChange = (href: string) => {
    if (!href.trim()) return;
    editor?.chain().focus().extendMarkRange('link').setLink({ href }).run();
    setValue('');
    setOpen(false);
  };

  return (
    <DropdownMenu
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if (open) setValue(editor?.getAttributes('link').href || '');
      }}
    >
      <DropdownMenuTrigger asChild>
        <button className="flex h-7 min-w-7 shrink-0 items-center justify-center overflow-hidden rounded-sm px-1.5 text-sm hover:bg-neutral-200">
          <Link2Icon className="size-4" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="p-2.5">
        <form
          onSubmit={(e) => {
            e.preventDefault();

            onChange(value);
          }}
          className="flex items-center gap-x-2"
        >
          <Input type="url" placeholder="https://example.com" value={value} onChange={(e) => setValue(e.target.value)} required />
          <Button type="submit" disabled={!value.trim()}>
            Apply
          </Button>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const HighlightColorButton = () => {
  const { editor } = useEditorStore();

  const value = editor?.getAttributes('highlight').color as string;

  const onChange = (color: ColorResult) => {
    editor?.commands.setHighlight({ color: color as unknown as string });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex h-7 min-w-7 shrink-0 items-center justify-center overflow-hidden rounded-sm px-1.5 text-sm hover:bg-neutral-200">
          <HighlighterIcon className="size-4" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="p-0">
        <TwitterPicker color={value} onChange={onChange} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const TextColorButton = () => {
  const { editor } = useEditorStore();

  const value = (editor?.getAttributes('textStyle').color as string | undefined) || '#000000';

  const onChange = (color: ColorResult) => {
    editor?.chain().focus().setColor(color.hex).run();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex h-7 min-w-7 shrink-0 flex-col items-center justify-center overflow-hidden rounded-sm px-1.5 text-sm hover:bg-neutral-200">
          <span className="text-xs">A</span>

          <div className="h-0.5 w-full" style={{ backgroundColor: value }} />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="p-0">
        <TwitterPicker color={value} onChange={onChange} />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const HeadingLevelButton = () => {
  const { editor } = useEditorStore();

  const headings = [
    { label: 'Heading 1', value: 1, fontSize: '32px' },
    { label: 'Heading 2', value: 2, fontSize: '24px' },
    { label: 'Heading 3', value: 3, fontSize: '20px' },
    { label: 'Heading 4', value: 4, fontSize: '18px' },
    { label: 'Heading 5', value: 5, fontSize: '16px' },
    { label: 'Heading 6', value: 6, fontSize: '16px' },
    { label: 'Normal text', value: 0, fontSize: '16px' },
  ] as const;

  const getCurrentHeading = () => {
    for (let level = 1; level <= headings.length; level++) {
      if (editor?.isActive('heading', { level })) {
        return `Heading ${level}`;
      }
    }

    return headings.at(-1)?.label;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex h-7 min-w-7 shrink-0 items-center justify-center overflow-hidden rounded-sm px-1.5 text-sm hover:bg-neutral-200">
          <span className="truncate">{getCurrentHeading()}</span>

          <ChevronDownIcon className="ml-2 size-4 shrink-0" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="flex flex-col gap-y-1 p-1">
        {headings.map(({ label, value, fontSize }) => (
          <DropdownMenuItem key={value} asChild>
            <button
              onClick={() => {
                if (value === 0) editor?.commands.setParagraph();
                else editor?.commands.toggleHeading({ level: value });
              }}
              className={cn(
                'flex items-center gap-x-2 rounded-sm px-2 py-1 hover:bg-neutral-200/80',
                (value === 0 && !editor?.isActive('heading')) || (editor?.isActive('heading', { level: value }) && 'bg-neutral-200/80'),
              )}
              style={{ fontSize }}
            >
              {label}
            </button>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const FontFamilyButton = () => {
  const { editor } = useEditorStore();

  const fonts = [
    { label: 'Arial', value: 'Arial' },
    { label: 'Times New Roman', value: 'Times New Roman' },
    { label: 'Courier New', value: 'Courier New' },
    { label: 'Georgia', value: 'Georgia' },
    { label: 'Verdana', value: 'Verdana' },
    // Added more font options
    { label: 'Helvetica', value: 'Helvetica' },
    { label: 'Tahoma', value: 'Tahoma' },
    { label: 'Comic Sans MS', value: 'Comic Sans MS' },
    { label: 'Impact', value: 'Impact' },
    { label: 'Lucida Sans', value: 'Lucida Sans' },
  ];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="flex h-7 w-[120px] shrink-0 items-center justify-between overflow-hidden rounded-sm px-1.5 text-sm hover:bg-neutral-200">
          <span className="truncate">{editor?.getAttributes('textStyle').fontFamily || 'Arial'}</span>

          <ChevronDownIcon className="ml-2 size-4 shrink-0" />
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className="flex flex-col gap-y-1 p-1">
        {fonts.map(({ label, value }) => (
          <DropdownMenuItem key={value} asChild>
            <button
              onClick={() => editor?.commands.setFontFamily(value)}
              className={cn(
                'flex items-center gap-x-2 rounded-sm px-2 py-1 hover:bg-neutral-200/80',
                editor?.isActive('textStyle', { fontFamily: value }) && 'bg-neutral-200/80',
                value === 'Arial' && editor?.getAttributes('textStyle').fontFamily === undefined && 'bg-neutral-200/80',
              )}
              style={{ fontFamily: value }}
            >
              <span className="text-sm">{label}</span>
            </button>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const CodeBlockButton = () => {
  const { editor } = useEditorStore();

  const handleCodeBlockInsert = () => {
    if (!editor) return;

    // Toggle code block with 'text' as default language
    editor.chain().focus().toggleCodeBlock({ language: 'text' }).run();
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={handleCodeBlockInsert}
          className={cn(
            'flex h-7 min-w-7 items-center justify-center rounded-sm text-sm hover:bg-neutral-200/80',
            editor?.isActive('codeBlock') && 'bg-neutral-200/80',
          )}
        >
          <CodeIcon className="size-4" />
        </button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Code Block</p>
      </TooltipContent>
    </Tooltip>
  );
};

const BlockquoteButton = () => {
  const { editor } = useEditorStore();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={() => {
            console.log('Toggling blockquote'); // Debug log
            editor?.chain().focus().toggleBlockquote().run();
          }}
          className={cn(
            'flex h-7 min-w-7 items-center justify-center rounded-sm text-sm hover:bg-neutral-200/80',
            editor?.isActive('blockquote') && 'bg-neutral-200/80',
          )}
        >
          <QuoteIcon className="size-4" />
        </button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Block Quote</p>
      </TooltipContent>
    </Tooltip>
  );
};

// 3. Text Transform Button
const TextTransformButton = () => {
  const { editor } = useEditorStore();

  const transforms = [
    {
      label: 'Lowercase',
      action: () => {
        const { from, to } = editor?.state.selection || {};
        if (from !== undefined && to !== undefined) {
          const text = editor?.state.doc.textBetween(from, to);
          if (text) {
            editor?.view.dispatch(editor.state.tr.insertText(text.toLowerCase(), from, to));
          }
        }
      },
    },
    {
      label: 'UPPERCASE',
      action: () => {
        const { from, to } = editor?.state.selection || {};
        if (from !== undefined && to !== undefined) {
          const text = editor?.state.doc.textBetween(from, to);
          if (text) {
            editor?.view.dispatch(editor.state.tr.insertText(text.toUpperCase(), from, to));
          }
        }
      },
    },
    {
      label: 'Title Case',
      action: () => {
        const { from, to } = editor?.state.selection || {};
        if (from !== undefined && to !== undefined) {
          const text = editor?.state.doc.textBetween(from, to);
          if (text) {
            const titleCased = text.replace(/\b\w+/g, (word) => {
              return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
            });
            editor?.view.dispatch(editor.state.tr.insertText(titleCased, from, to));
          }
        }
      },
    },
  ];

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <button className="flex h-7 min-w-7 shrink-0 items-center justify-center overflow-hidden rounded-sm px-1.5 text-sm hover:bg-neutral-200">
              <span className="font-bold text-xs">Aa</span>
            </button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Text Transform</p>
        </TooltipContent>
      </Tooltip>

      <DropdownMenuContent className="flex flex-col gap-y-1 p-1">
        {transforms.map(({ label, action }) => (
          <DropdownMenuItem key={label} asChild>
            <button onClick={action} className="flex items-center gap-x-2 rounded-sm px-2 py-1 hover:bg-neutral-200/80">
              <span className="text-sm">{label}</span>
            </button>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// 4. Table Button
const TableButton = () => {
  const { editor } = useEditorStore();
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const insertTable = () => {
    editor?.commands.insertTable({ rows, cols });
    setIsDialogOpen(false);
  };

  const tableControls = [
    { label: 'Insert Column Before', action: () => editor?.commands.addColumnBefore() },
    { label: 'Insert Column After', action: () => editor?.commands.addColumnAfter() },
    { label: 'Delete Column', action: () => editor?.commands.deleteColumn() },
    { label: 'Insert Row Before', action: () => editor?.commands.addRowBefore() },
    { label: 'Insert Row After', action: () => editor?.commands.addRowAfter() },
    { label: 'Delete Row', action: () => editor?.commands.deleteRow() },
    { label: 'Delete Table', action: () => editor?.commands.deleteTable() },
  ];

  return (
    <>
      <DropdownMenu>
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenuTrigger asChild>
              <button className="flex h-7 min-w-7 shrink-0 items-center justify-center overflow-hidden rounded-sm px-1.5 text-sm hover:bg-neutral-200">
                <TableIcon className="size-4" />
              </button>
            </DropdownMenuTrigger>
          </TooltipTrigger>
          <TooltipContent>
            <p>Table</p>
          </TooltipContent>
        </Tooltip>

        <DropdownMenuContent className="flex flex-col gap-y-1 p-1">
          <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>Insert Table</DropdownMenuItem>
          <Separator className="my-1" />
          {tableControls.map(({ label, action }) => (
            <DropdownMenuItem key={label} onClick={action}>
              {label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Insert Table</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <Label htmlFor="rows">Rows:</Label>
              <Input id="rows" type="number" min="1" max="10" value={rows} onChange={(e) => setRows(Number(e.target.value))} />
            </div>
            <div className="flex items-center gap-4">
              <Label htmlFor="cols">Columns:</Label>
              <Input id="cols" type="number" min="1" max="10" value={cols} onChange={(e) => setCols(Number(e.target.value))} />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={insertTable}>Insert</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

// 5. Indent/Outdent Button

const ScriptButton = () => {
  const { editor } = useEditorStore();

  return (
    <div className="flex items-center">
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={() => editor?.chain().focus().toggleSuperscript().run()}
            className={cn(
              'flex h-7 min-w-7 items-center justify-center rounded-sm text-sm hover:bg-neutral-200/80',
              editor?.isActive('superscript') && 'bg-neutral-200/80',
            )}
          >
            <SuperscriptIcon className="size-4" />
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Superscript</p>
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={() => editor?.chain().focus().toggleSubscript().run()}
            className={cn(
              'flex h-7 min-w-7 items-center justify-center rounded-sm text-sm hover:bg-neutral-200/80',
              editor?.isActive('subscript') && 'bg-neutral-200/80',
            )}
          >
            <SubscriptIcon className="size-4" />
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Subscript</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

// 7. Strikethrough Button
const StrikethroughButton = () => {
  const { editor } = useEditorStore();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={() => editor?.commands.toggleStrike()}
          className={cn(
            'flex h-7 min-w-7 items-center justify-center rounded-sm text-sm hover:bg-neutral-200/80',
            editor?.isActive('strike') && 'bg-neutral-200/80',
          )}
        >
          <StrikethroughIcon className="size-4" />
        </button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Strikethrough</p>
      </TooltipContent>
    </Tooltip>
  );
};

// 9. Layout Templates Button
const LayoutTemplatesButton = () => {
  const { editor } = useEditorStore();

  const templates = [
    {
      name: 'Two Columns',
      apply: () => {
        editor?.commands.insertContent(`
          <div style="display: flex; gap: 20px;">
            <div style="flex: 1;">
              <p>Left column content...</p>
            </div>
            <div style="flex: 1;">
              <p>Right column content...</p>
            </div>
          </div>
        `);
      },
    },
    {
      name: 'Three Columns',
      apply: () => {
        editor?.commands.insertContent(`
          <div style="display: flex; gap: 20px;">
            <div style="flex: 1;">
              <p>Left column content...</p>
            </div>
            <div style="flex: 1;">
              <p>Middle column content...</p>
            </div>
            <div style="flex: 1;">
              <p>Right column content...</p>
            </div>
          </div>
        `);
      },
    },
    {
      name: 'Header with Subtitle',
      apply: () => {
        editor?.commands.insertContent(`
          <h1>Main Title</h1>
          <h3>Subtitle text goes here</h3>
          <p>Body content starts here...</p>
        `);
      },
    },
    {
      name: 'Pull Quote',
      apply: () => {
        editor?.commands.insertContent(`
          <blockquote style="border-left: 4px solid #ccc; margin-left: 0; padding-left: 24px; font-style: italic;">
            <p>Insert an important quote here that stands out from the rest of the text.</p>
          </blockquote>
        `);
      },
    },
  ];

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <button className="flex h-7 min-w-7 shrink-0 items-center justify-center overflow-hidden rounded-sm px-1.5 text-sm hover:bg-neutral-200">
              <LayoutIcon className="size-4" />
            </button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Layout Templates</p>
        </TooltipContent>
      </Tooltip>

      <DropdownMenuContent className="flex flex-col gap-y-1 p-1">
        {templates.map((template) => (
          <DropdownMenuItem key={template.name} onClick={template.apply}>
            {template.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// 10. Word Count
const WordCountButton = () => {
  const { editor } = useEditorStore();
  const [stats, setStats] = useState({ words: 0, characters: 0, paragraphs: 0 });
  const [showStats, setShowStats] = useState(false);

  const countStats = () => {
    if (!editor) return;

    const text = editor.getText();
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const characters = text.length;

    // Count paragraphs by counting nodes that can be paragraphs
    let paragraphs = 0;
    editor.state.doc.descendants((node) => {
      if (node.type.name === 'paragraph' || node.type.name === 'heading') {
        paragraphs += 1;
      }
      return true;
    });

    setStats({ words, characters, paragraphs });
    setShowStats(true);
  };

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <button onClick={countStats} className="flex h-7 min-w-7 items-center justify-center rounded-sm text-sm hover:bg-neutral-200/80">
            <span className="text-xs font-bold">123</span>
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Word Count</p>
        </TooltipContent>
      </Tooltip>

      <Dialog open={showStats} onOpenChange={setShowStats}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Document Statistics</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="font-medium">Words:</div>
            <div>{stats.words}</div>
            <div className="font-medium">Characters:</div>
            <div>{stats.characters}</div>
            <div className="font-medium">Paragraphs:</div>
            <div>{stats.paragraphs}</div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

// 11. Find and Replace
// Replace the FindReplaceButton component with this improved version

const FindReplaceButton = () => {
  const { editor } = useEditorStore();
  const [open, setOpen] = useState(false);
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [activeTab, setActiveTab] = useState('find');
  const [matchCase, setMatchCase] = useState(false);
  const [currentMatchIndex, setCurrentMatchIndex] = useState(-1);
  const [matches, setMatches] = useState<{ from: number; to: number }[]>([]);
  const [message, setMessage] = useState('');

  // Clear search state when dialog closes
  useEffect(() => {
    if (!open && matches.length > 0) {
      clearHighlights();
    }
  }, [open]);

  const clearHighlights = () => {
    if (!editor) return;

    // Remove any existing search highlights
    // Clear highlights or reset selection
    editor.commands.setTextSelection({ from: 0, to: 0 });
    setMatches([]);
    setCurrentMatchIndex(-1);
    setMessage('');
  };

  // Replace the handleFind function in the FindReplaceButton component

  const handleFind = () => {
    if (!editor || !findText) return;
    clearHighlights();

    const text = editor.getText();

    // Remove word boundaries to allow finding text inside words
    const searchRegex = matchCase
      ? new RegExp(`${findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'g')
      : new RegExp(`${findText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'gi');

    // Find all matches
    const foundMatches: { from: number; to: number }[] = [];
    let match;

    while ((match = searchRegex.exec(text)) !== null) {
      foundMatches.push({
        from: match.index,
        to: match.index + match[0].length,
      });
    }

    setMatches(foundMatches);

    if (foundMatches.length > 0) {
      setCurrentMatchIndex(0);
      navigateToMatch(foundMatches[0]);
      setMessage(`Found ${foundMatches.length} matches`);
    } else {
      setMessage('No matches found');
    }
  };

  const navigateToMatch = (match: { from: number; to: number }) => {
    if (!editor) return;

    // Highlight the current match
    editor.commands.setTextSelection({
      from: match.from,
      to: match.to,
    });

    // Ensure it's visible in the viewport
    const element = editor.view.dom;
    element.focus();
  };

  const navigateNext = () => {
    if (matches.length === 0 || currentMatchIndex === -1) return;

    const nextIndex = (currentMatchIndex + 1) % matches.length;
    setCurrentMatchIndex(nextIndex);
    navigateToMatch(matches[nextIndex]);
  };

  const navigatePrev = () => {
    if (matches.length === 0 || currentMatchIndex === -1) return;

    const prevIndex = (currentMatchIndex - 1 + matches.length) % matches.length;
    setCurrentMatchIndex(prevIndex);
    navigateToMatch(matches[prevIndex]);
  };

  const handleReplace = () => {
    if (!editor || matches.length === 0 || currentMatchIndex === -1) return;

    const match = matches[currentMatchIndex];
    editor.chain().focus().deleteRange(match).insertContentAt(match.from, replaceText).run();

    // Re-run find to update matches after replacement
    handleFind();
  };

  const handleReplaceAll = () => {
    if (!editor || matches.length === 0) return;

    // Start from the end to avoid position shifts affecting earlier matches
    for (let i = matches.length - 1; i >= 0; i--) {
      const match = matches[i];
      editor.chain().focus().deleteRange(match).insertContentAt(match.from, replaceText).run();
    }

    setMessage(`Replaced ${matches.length} occurrences`);
    clearHighlights();
  };

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={() => setOpen(true)}
            className="flex h-7 min-w-7 items-center justify-center rounded-sm text-sm hover:bg-neutral-200/80"
          >
            <SearchIcon className="size-4" />
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Find and Replace</p>
        </TooltipContent>
      </Tooltip>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Find and Replace</DialogTitle>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="find">Find</TabsTrigger>
              <TabsTrigger value="replace">Replace</TabsTrigger>
            </TabsList>

            <TabsContent value="find" className="space-y-4">
              <div className="flex flex-col gap-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Find text..."
                    value={findText}
                    onChange={(e) => setFindText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleFind();
                      }
                    }}
                  />
                  <Button onClick={handleFind}>Find</Button>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="match-case" checked={matchCase} onCheckedChange={setMatchCase} />
                  <Label htmlFor="match-case">Match case</Label>
                </div>

                {matches.length > 0 && (
                  <div className="flex justify-between items-center">
                    <span>
                      {currentMatchIndex + 1} of {matches.length}
                    </span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={navigatePrev}>
                        Previous
                      </Button>
                      <Button variant="outline" size="sm" onClick={navigateNext}>
                        Next
                      </Button>
                    </div>
                  </div>
                )}

                {message && <div className="text-sm text-center">{message}</div>}
              </div>
            </TabsContent>

            <TabsContent value="replace" className="space-y-4">
              <div className="flex flex-col gap-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Find text..."
                    value={findText}
                    onChange={(e) => setFindText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleFind();
                      }
                    }}
                  />
                  <Button onClick={handleFind}>Find</Button>
                </div>

                <Input placeholder="Replace with..." value={replaceText} onChange={(e) => setReplaceText(e.target.value)} />

                <div className="flex items-center space-x-2">
                  <Switch id="match-case-replace" checked={matchCase} onCheckedChange={setMatchCase} />
                  <Label htmlFor="match-case-replace">Match case</Label>
                </div>

                {matches.length > 0 && (
                  <div className="flex justify-between items-center">
                    <span>
                      {currentMatchIndex + 1} of {matches.length}
                    </span>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={navigatePrev}>
                        Previous
                      </Button>
                      <Button variant="outline" size="sm" onClick={navigateNext}>
                        Next
                      </Button>
                    </div>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button onClick={handleReplace} disabled={matches.length === 0 || currentMatchIndex === -1}>
                    Replace
                  </Button>
                  <Button onClick={handleReplaceAll} disabled={matches.length === 0}>
                    Replace All
                  </Button>
                </div>

                {message && <div className="text-sm text-center">{message}</div>}
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>
    </>
  );
};

// 12. Clipboard Operations
const ClipboardButtons = () => {
  const { editor } = useEditorStore();

  const copyToClipboard = () => {
    const { from, to } = editor?.state.selection || {};
    if (from !== undefined && to !== undefined && from !== to) {
      const text = editor?.state.doc.textBetween(from, to);
      if (text) {
        navigator.clipboard.writeText(text);
      }
    }
  };

  const cutToClipboard = () => {
    const { from, to } = editor?.state.selection || {};
    if (from !== undefined && to !== undefined && from !== to) {
      const text = editor?.state.doc.textBetween(from, to);
      if (text) {
        navigator.clipboard.writeText(text);
        editor?.commands.deleteRange({ from, to });
      }
    }
  };

  const pasteFromClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      editor?.commands.insertContent(text);
    } catch (err) {
      console.error('Failed to read clipboard contents:', err);
    }
  };

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenuTrigger asChild>
            <button className="flex h-7 min-w-7 shrink-0 items-center justify-center overflow-hidden rounded-sm px-1.5 text-sm hover:bg-neutral-200">
              <ClipboardIcon className="size-4" />
            </button>
          </DropdownMenuTrigger>
        </TooltipTrigger>
        <TooltipContent>
          <p>Clipboard</p>
        </TooltipContent>
      </Tooltip>

      <DropdownMenuContent className="flex flex-col gap-y-1 p-1">
        <DropdownMenuItem onClick={copyToClipboard}>
          <CopyIcon className="mr-2 size-4" />
          Copy
        </DropdownMenuItem>
        <DropdownMenuItem onClick={cutToClipboard}>
          <ScissorsIcon className="mr-2 size-4" />
          Cut
        </DropdownMenuItem>
        <DropdownMenuItem onClick={pasteFromClipboard}>
          <ClipboardIcon className="mr-2 size-4" />
          Paste
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

// 15. Preview Mode
// 15. Preview Mode
const PreviewModeButton = () => {
  const { editor } = useEditorStore();
  const [isPreview, setIsPreview] = useState(false);

  const togglePreview = () => {
    if (!editor) return;

    setIsPreview(!isPreview);

    // Get the editor DOM element
    const editorElement = editor.view.dom;
    const editorParent = editorElement.parentElement;

    if (!isPreview) {
      // Enable preview mode

      // 1. Store current content in a data attribute
      const currentContent = editor.getHTML();
      editorElement.setAttribute('data-original-content', currentContent);

      // 2. Apply preview styles
      editorElement.classList.add('preview-mode');

      // 3. Make editor read-only
      editor.setEditable(false);

      // 4. Hide editor chrome (optional)
      if (editorParent) {
        editorParent.classList.add('preview-container');
      }

      // 5. Apply print-friendly styles
      const style = document.createElement('style');
      style.id = 'preview-styles';
      style.textContent = `
        .preview-mode {
          border: none !important;
          box-shadow: none !important;
          padding: 2rem !important;
          max-width: 800px !important;
          margin: 0 auto !important;
          background-color: white !important;
        }
        .preview-mode * {
          cursor: default !important;
        }
        .preview-mode .node-selection,
        .preview-mode .ProseMirror-selectednode {
          outline: none !important;
          background: transparent !important;
        }
        .preview-container .ProseMirror-gapcursor {
          display: none !important;
        }
      `;
      document.head.appendChild(style);

      // 6. Hide toolbar options that don't make sense in preview mode
      const toolbar = document.querySelector('.toolbar-container');
      if (toolbar) {
        toolbar.classList.add('preview-toolbar');
      }
    } else {
      // Disable preview mode

      // 1. Remove preview styles
      editorElement.classList.remove('preview-mode');

      // 2. Make editor editable again
      editor.setEditable(true);

      // 3. Show editor chrome
      if (editorParent) {
        editorParent.classList.remove('preview-container');
      }

      // 4. Remove print-friendly styles
      const style = document.getElementById('preview-styles');
      if (style) {
        style.remove();
      }

      // 5. Show all toolbar options
      const toolbar = document.querySelector('.toolbar-container');
      if (toolbar) {
        toolbar.classList.remove('preview-toolbar');
      }
    }
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={togglePreview}
          className={cn(
            'flex h-7 min-w-7 items-center justify-center rounded-sm text-sm hover:bg-neutral-200/80',
            isPreview && 'bg-neutral-200/80',
          )}
          aria-label={isPreview ? 'Exit Preview Mode' : 'Enter Preview Mode'}
        >
          <EyeIcon className="size-4" />
        </button>
      </TooltipTrigger>
      <TooltipContent>
        <p>{isPreview ? 'Exit Preview Mode' : 'Preview Mode'}</p>
      </TooltipContent>
    </Tooltip>
  );
};

// 16. Keyboard Shortcuts
const KeyboardShortcutsButton = () => {
  const [open, setOpen] = useState(false);

  const shortcuts = [
    { keys: 'Ctrl+B', description: 'Bold' },
    { keys: 'Ctrl+I', description: 'Italic' },
    { keys: 'Ctrl+U', description: 'Underline' },
    { keys: 'Ctrl+Z', description: 'Undo' },
    { keys: 'Ctrl+Y', description: 'Redo' },
    { keys: 'Ctrl+L', description: 'Insert Link' },
    { keys: 'Ctrl+K', description: 'Insert Code Block' },
    { keys: 'Ctrl+Alt+0', description: 'Normal Text' },
    { keys: 'Ctrl+Alt+1', description: 'Heading 1' },
    { keys: 'Ctrl+Alt+2', description: 'Heading 2' },
    { keys: 'Tab', description: 'Indent' },
    { keys: 'Shift+Tab', description: 'Outdent' },
  ];

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={() => setOpen(true)}
            className="flex h-7 min-w-7 items-center justify-center rounded-sm text-sm hover:bg-neutral-200/80"
          >
            <KeyboardIcon className="size-4" />
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Keyboard Shortcuts</p>
        </TooltipContent>
      </Tooltip>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Keyboard Shortcuts</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-y-2">
            {shortcuts.map((shortcut) => (
              <>
                <div key={shortcut.keys} className="font-mono text-sm">
                  {shortcut.keys}
                </div>
                <div className="text-sm">{shortcut.description}</div>
              </>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

// 17. Help Button
const HelpButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={() => setOpen(true)}
            className="flex h-7 min-w-7 items-center justify-center rounded-sm text-sm hover:bg-neutral-200/80"
          >
            <HelpCircleIcon className="size-4" />
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Help</p>
        </TooltipContent>
      </Tooltip>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editor Help</DialogTitle>
          </DialogHeader>

          <div className="prose prose-sm">
            <h3>Getting Started</h3>
            <p>This rich text editor provides powerful formatting capabilities for creating documents.</p>

            <h3>Basic Formatting</h3>
            <p>
              Use the toolbar buttons for basic formatting like bold, italic, and underline. You can also create lists, add links, and
              insert images.
            </p>

            <h3>Advanced Features</h3>
            <p>Explore table creation, code blocks, and layout templates for more complex documents.</p>

            <h3>Need More Help?</h3>
            <p>Check the keyboard shortcuts for quick navigation and formatting.</p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

interface ToolbarButtonProps {
  onClick?: () => void;
  isActive?: boolean;
  disabled?: boolean;
  icon: LucideIcon;
}

const ToolbarButton = ({ onClick, isActive, disabled, icon: Icon }: ToolbarButtonProps) => {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'flex h-7 min-w-7 items-center justify-center rounded-sm text-sm hover:bg-neutral-200/80 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        isActive && 'bg-neutral-200/80',
      )}
    >
      <Icon className="size-4" />
    </button>
  );
};
// Import Document Button
const ImportDocumentButton = () => {
  const { editor } = useEditorStore();
  const [isProcessing, setIsProcessing] = useState(false);

  const importDocument = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.html'; // Only accept HTML files

    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      setIsProcessing(true);

      try {
        // Handle HTML files
        const reader = new FileReader();
        reader.onload = () => {
          const content = reader.result as string;

          try {
            editor?.commands.setContent(content);
          } catch (error) {
            console.error('Error importing HTML document:', error);
            alert('Failed to import HTML document. The file might be malformed.');
          }
        };

        reader.readAsText(file);
      } catch (error) {
        console.error('Error processing document:', error);
        alert('Failed to import document.');
      } finally {
        setIsProcessing(false);
      }
    };

    input.click();
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          onClick={importDocument}
          className="flex h-7 min-w-7 items-center justify-center rounded-sm text-sm hover:bg-neutral-200/80"
          disabled={isProcessing}
        >
          {isProcessing ? <span className="animate-pulse">...</span> : <UploadIcon className="size-4" />}
        </button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Import HTML Document</p>
      </TooltipContent>
    </Tooltip>
  );
};
export const Toolbar = () => {
  const { editor } = useEditorStore();

  const sections: { label: string; icon: LucideIcon; onClick: () => void; disabled?: boolean; isActive?: boolean }[][] = [
    [
      {
        label: 'Undo',
        icon: Undo2Icon,
        disabled: !editor?.can().undo(),
        onClick: () => editor?.commands.undo(),
      },
      {
        label: 'Redo',
        icon: Redo2Icon,
        disabled: !editor?.can().redo(),
        onClick: () => editor?.commands.redo(),
      },
      {
        label: 'Print',
        icon: PrinterIcon,
        onClick: () => window.print(),
      },
      {
        label: 'Spell Check',
        icon: SpellCheckIcon,
        isActive: editor?.view.dom.getAttribute('spellcheck') === 'true',
        onClick: () => {
          const current = editor?.view.dom.getAttribute('spellcheck');
          editor?.view.dom.setAttribute('spellcheck', current === 'false' ? 'true' : 'false');
        },
      },
    ],
    [
      {
        label: 'Bold',
        icon: BoldIcon,
        isActive: editor?.isActive('bold'),
        disabled: !editor?.can().toggleBold(),
        onClick: () => editor?.commands.toggleBold(),
      },
      {
        label: 'Italic',
        icon: ItalicIcon,
        isActive: editor?.isActive('italic'),
        disabled: !editor?.can().toggleItalic(),
        onClick: () => editor?.commands.toggleItalic(),
      },
      {
        label: 'Underline',
        icon: UnderlineIcon,
        isActive: editor?.isActive('underline'),
        disabled: !editor?.can().toggleUnderline(),
        onClick: () => editor?.commands.toggleUnderline(),
      },
    ],
    [
      {
        label: 'Comment',
        icon: MessageSquarePlusIcon,
        onClick: () => editor?.commands.addPendingComment(),
        isActive: editor?.isActive('liveblocksCommentMark'),
      },
      // ...existing code...
      {
        label: 'List Todo',
        icon: ListTodoIcon,
        isActive: editor?.isActive('taskList'),
        onClick: () => editor?.commands.toggleTaskList(),
      },
      {
        label: 'Remove Formatting',
        icon: RemoveFormattingIcon,
        onClick: () => {
          editor?.commands.clearNodes();
          editor?.commands.unsetAllMarks();
        },
      },
    ],
  ];

  return (
    <TooltipProvider>
      <div className="flex w-full flex-wrap gap-y-1 border-b bg-white px-4 py-2">
        {/* First part of toolbar: Standard formatting tools */}
        <div className="flex items-center gap-x-1.5">
          {sections.map((section, i) => (
            <React.Fragment key={i}>
              <div className="flex items-center gap-x-0.5">
                {section.map((item) => (
                  <Tooltip key={item.label}>
                    <TooltipTrigger asChild>
                      <ToolbarButton disabled={item.disabled} isActive={item.isActive} onClick={item.onClick} icon={item.icon} />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{item.label}</p>
                    </TooltipContent>
                  </Tooltip>
                ))}
              </div>
              {i < sections.length - 1 && <Separator orientation="vertical" className="mx-1 h-6" />}
            </React.Fragment>
          ))}
        </div>

        <Separator orientation="vertical" className="mx-1.5 h-6" />

        {/* Font formatting section */}
        <div className="flex items-center gap-x-2">
          <HeadingLevelButton />
          <FontFamilyButton />
          <FontSizeButton />
        </div>

        <Separator orientation="vertical" className="mx-1.5 h-6" />

        {/* Text alignment and formatting */}
        <div className="flex items-center gap-x-1.5">
          <AlignButton />
          <ListButton />
          <LineHeightButton />
          <TextColorButton />
          <HighlightColorButton />
        </div>

        <Separator orientation="vertical" className="mx-1.5 h-6" />

        {/* Advanced formatting controls */}
        <div className="flex items-center gap-x-1.5">
          <LinkButton />
          <ImageButton />
          <StrikethroughButton />
          <ScriptButton />
        </div>

        <Separator orientation="vertical" className="mx-1.5 h-6" />

        {/* Document structure elements */}
        <div className="flex items-center gap-x-1.5">
          <CodeBlockButton />
          <TableButton />
          <TextTransformButton />
          <LayoutTemplatesButton />
        </div>

        <Separator orientation="vertical" className="mx-1.5 h-6" />

        {/* Document operations */}
        <div className="flex items-center gap-x-1.5">
          <PreviewModeButton />
          <ImportDocumentButton />
          <ClipboardButtons />
          <FindReplaceButton />
          <WordCountButton />
        </div>

        <Separator orientation="vertical" className="mx-1.5 h-6" />

        {/* Settings and help */}
        <div className="flex items-center gap-x-1.5">
          <KeyboardShortcutsButton />
          <HelpButton />
        </div>
      </div>
    </TooltipProvider>
  );
};

export default Toolbar;
function useEffect(callback: () => void, dependencies: any[]) {
  reactUseEffect(callback, dependencies);
}
