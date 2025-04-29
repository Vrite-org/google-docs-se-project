import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { toast } from 'sonner';

import { useEditorStore } from '@/store/use-editor-store';

import { Toolbar } from './toolbar';

// Mock dependencies
jest.mock('@/store/use-editor-store', () => ({
  useEditorStore: jest.fn(),
}));

jest.mock('sonner', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

jest.mock('react-color', () => ({
  TwitterPicker: () => <div data-testid="color-picker">Color Picker</div>,
}));

// Mock fetch
global.fetch = jest.fn();

describe('Toolbar Component', () => {
  const mockEditor = {
    commands: {
      undo: jest.fn(),
      redo: jest.fn(),
      toggleBold: jest.fn(),
      toggleItalic: jest.fn(),
      toggleUnderline: jest.fn(),
      setTextAlign: jest.fn(),
      insertContent: jest.fn(),
      setFontFamily: jest.fn(),
      setParagraph: jest.fn(),
      toggleHeading: jest.fn(),
      setFontSize: jest.fn(),
      setLineHeight: jest.fn(),
      toggleBulletList: jest.fn(),
      toggleOrderedList: jest.fn(),
      setImage: jest.fn(),
      setHighlight: jest.fn(),
      focus: jest.fn(),
      chain: jest.fn().mockReturnValue({
        focus: jest.fn().mockReturnValue({
          toggleBlockquote: jest.fn().mockReturnValue({
            run: jest.fn(),
          }),
          extendMarkRange: jest.fn().mockReturnValue({
            setLink: jest.fn().mockReturnValue({
              run: jest.fn(),
            }),
          }),
          setColor: jest.fn().mockReturnValue({
            run: jest.fn(),
          }),
          toggleCodeBlock: jest.fn().mockReturnValue({
            run: jest.fn(),
          }),
          toggleSuperscript: jest.fn().mockReturnValue({
            run: jest.fn(),
          }),
          toggleSubscript: jest.fn().mockReturnValue({
            run: jest.fn(),
          }),
        }),
      }),
    },
    can: () => ({
      undo: () => true,
      redo: () => true,
      toggleBold: () => true,
      toggleItalic: () => true,
      toggleUnderline: () => true,
    }),
    isActive: jest.fn().mockReturnValue(false),
    getAttributes: jest.fn().mockImplementation((attr) => {
      if (attr === 'textStyle') return { fontFamily: 'Arial', fontSize: '16px', color: '#000000' };
      if (attr === 'highlight') return { color: '#FFFF00' };
      if (attr === 'link') return { href: 'https://example.com' };
      if (attr === 'paragraph') return { lineHeight: 'normal' };
      return {};
    }),
    getHTML: jest.fn().mockReturnValue('<p>This is some sample document content</p>'),
    state: {
      selection: { from: 0, to: 10 },
      doc: {
        textBetween: jest.fn().mockReturnValue('Sample text'),
      },
    },
    view: {
      dom: {
        getAttribute: jest.fn().mockReturnValue('false'),
        setAttribute: jest.fn(),
      },
      dispatch: jest.fn(),
    },
    setEditable: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (useEditorStore as unknown as jest.Mock).mockReturnValue({
      editor: mockEditor,
    });
    (global.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      json: jest.fn().mockResolvedValue({ text: 'Generated content' }),
    });
  });

  test('renders toolbar with all components', () => {
    render(<Toolbar />);

    // Check for main sections
    expect(screen.getByRole('button', { name: /Undo/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Bold/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Underline/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Ask Gemini AI/i })).toBeInTheDocument();
  });

  describe('GeminiAIButton', () => {
    test('renders gemini button and opens dialog when clicked', async () => {
      render(<Toolbar />);

      // Find and click the AI button
      const aiButton = screen.getByRole('button', { name: /Ask Gemini AI/i });
      fireEvent.click(aiButton);

      // Check dialog is open
      await waitFor(() => {
        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText('Ask Gemini AI')).toBeInTheDocument();
        expect(screen.getByLabelText('Your request:')).toBeInTheDocument();
      });
    });

    test('handleGenerateContent calls API with correct data and inserts content', async () => {
      render(<Toolbar />);

      // Open dialog
      fireEvent.click(screen.getByRole('button', { name: /Ask Gemini AI/i }));

      // Enter prompt
      const promptInput = screen.getByPlaceholderText(/Summarize this text/i);
      fireEvent.change(promptInput, { target: { value: 'Generate a summary' } });

      // Click generate button
      const generateButton = screen.getByRole('button', { name: /Generate$/i });
      fireEvent.click(generateButton);

      // Verify fetch was called with the right parameters
      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith('/api/gemini', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            prompt: 'Generate a summary',
            documentContent: '<p>This is some sample document content</p>',
          }),
        });
      });

      // Verify that content was inserted
      await waitFor(() => {
        expect(mockEditor.commands.insertContent).toHaveBeenCalledWith('Generated content');
        expect(toast.success).toHaveBeenCalledWith('AI content generated successfully!');
      });
    });

    test('handleGenerateContent handles API error correctly', async () => {
      // Mock fetch to return an error
      (global.fetch as jest.Mock).mockResolvedValue({
        ok: false,
        json: jest.fn().mockResolvedValue({ error: 'API error message' }),
      });

      render(<Toolbar />);

      // Open dialog
      fireEvent.click(screen.getByRole('button', { name: /Ask Gemini AI/i }));

      // Enter prompt and generate
      fireEvent.change(screen.getByPlaceholderText(/Summarize this text/i), {
        target: { value: 'Generate a summary' },
      });
      fireEvent.click(screen.getByRole('button', { name: /Generate$/i }));

      // Verify error handling
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('API error message');
        expect(mockEditor.commands.insertContent).not.toHaveBeenCalled();
      });
    });

    test('handleGenerateContent handles network error correctly', async () => {
      // Mock fetch to throw an exception
      (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      render(<Toolbar />);

      // Open dialog and submit
      fireEvent.click(screen.getByRole('button', { name: /Ask Gemini AI/i }));
      fireEvent.change(screen.getByPlaceholderText(/Summarize this text/i), {
        target: { value: 'Generate a summary' },
      });
      fireEvent.click(screen.getByRole('button', { name: /Generate$/i }));

      // Verify error handling
      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Network error');
      });
    });

    test('generate button is disabled when prompt is empty', async () => {
      render(<Toolbar />);

      // Open dialog
      fireEvent.click(screen.getByRole('button', { name: /Ask Gemini AI/i }));

      expect(screen.getByRole('button', { name: /Generate$/i })).toBeDisabled();

      // Enter prompt
      fireEvent.change(screen.getByPlaceholderText(/Summarize this text/i), {
        target: { value: 'Valid prompt' },
      });

      expect(screen.getByRole('button', { name: /Generate$/i })).not.toBeDisabled();
    });

    test('shows loading state during API call', async () => {
      (global.fetch as jest.Mock).mockImplementation(
        () =>
          new Promise((resolve) =>
            setTimeout(
              () =>
                resolve({
                  ok: true,
                  json: () => Promise.resolve({ text: 'Generated content' }),
                }),
              100,
            ),
          ),
      );

      render(<Toolbar />);

      fireEvent.click(screen.getByRole('button', { name: /Ask Gemini AI/i }));
      fireEvent.change(screen.getByPlaceholderText(/Summarize this text/i), {
        target: { value: 'Generate a summary' },
      });
      fireEvent.click(screen.getByRole('button', { name: /Generate$/i }));

      expect(screen.getByText('Generating...')).toBeInTheDocument();

      await waitFor(() => {
        expect(mockEditor.commands.insertContent).toHaveBeenCalled();
      });
    });

    test('does nothing when editor is not available', async () => {
      (useEditorStore as unknown as jest.Mock).mockReturnValue({
        editor: null,
      });

      render(<Toolbar />);

      fireEvent.click(screen.getByRole('button', { name: /Ask Gemini AI/i }));
      fireEvent.change(screen.getByPlaceholderText(/Summarize this text/i), {
        target: { value: 'Generate a summary' },
      });
      fireEvent.click(screen.getByRole('button', { name: /Generate$/i }));

      // Verify no API call was made
      await waitFor(() => {
        expect(global.fetch).not.toHaveBeenCalled();
      });
    });
  });

  test('CodeBlockButton toggles code block when clicked', () => {
    render(<Toolbar />);

    const codeBlockButton = screen.getByRole('button', { name: /Code Block/i });
    fireEvent.click(codeBlockButton);

    expect(mockEditor.commands.chain).toHaveBeenCalled();
  });

  test('BlockquoteButton toggles blockquote when clicked', () => {
    render(<Toolbar />);

    const blockquoteButton = screen.getByRole('button', { name: /Block Quote/i });
    fireEvent.click(blockquoteButton);

    expect(mockEditor.commands.chain).toHaveBeenCalled();
  });

  test('basic formatting buttons work correctly', () => {
    render(<Toolbar />);

    fireEvent.click(screen.getByRole('button', { name: /Bold/i }));
    expect(mockEditor.commands.toggleBold).toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: /Italic/i }));
    expect(mockEditor.commands.toggleItalic).toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: /Underline/i }));
    expect(mockEditor.commands.toggleUnderline).toHaveBeenCalled();
  });
});
