import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { AnimationCode } from '../types';
import { Copy, Check, Code2, Palette, Zap, Download } from 'lucide-react';

interface CodePanelProps {
  code: AnimationCode;
}

export const CodePanel: React.FC<CodePanelProps> = ({ code }) => {
  const [activeTab, setActiveTab] = useState<'html' | 'css' | 'js'>('html');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy = code[activeTab];
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const fullHtml = `
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Animax Export</title>
    <style>
        body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #0a0a0a; color: white; overflow: hidden; }
        ${code.css}
    </style>
</head>
<body>
    ${code.html}
    <script>
        ${code.js}
    </script>
</body>
</html>`;
    const blob = new Blob([fullHtml], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'animax-animation.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col h-full bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-800/50 border-bottom border-zinc-800">
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('html')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-2 ${
              activeTab === 'html' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Code2 size={14} /> HTML
          </button>
          <button
            onClick={() => setActiveTab('css')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-2 ${
              activeTab === 'css' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Palette size={14} /> CSS
          </button>
          <button
            onClick={() => setActiveTab('js')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors flex items-center gap-2 ${
              activeTab === 'js' ? 'bg-zinc-700 text-white' : 'text-zinc-400 hover:text-zinc-200'
            }`}
          >
            <Zap size={14} /> JS
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            className="p-1.5 text-zinc-400 hover:text-white transition-colors"
            title="HTML Olarak İndir"
          >
            <Download size={16} />
          </button>
          <button
            onClick={handleCopy}
            className="p-1.5 text-zinc-400 hover:text-white transition-colors"
            title="Kodu Kopyala"
          >
            {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto text-sm">
        <SyntaxHighlighter
          language={activeTab}
          style={vscDarkPlus}
          customStyle={{
            margin: 0,
            padding: '1.5rem',
            background: 'transparent',
            fontSize: '0.85rem',
          }}
        >
          {code[activeTab] || `// No ${activeTab.toUpperCase()} code generated`}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};
