import React, { useState } from 'react';
import { Copy, CheckCircle2, Link as LinkIcon } from 'lucide-react';

export default function Admin() {
  const [prefix, setPrefix] = useState('Mr. & Mrs.');
  const [name, setName] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [copied, setCopied] = useState(false);

  const prefixes = [
    'Mr. & Mrs.',
    'Mr.',
    'Mrs.',
    'Ms.',
    'Miss',
    'Dr.',
    'Rev.',
    'Prof.',
    'Hon.',
    'Family'
  ];

  const handleGenerate = () => {
    if (!name.trim()) return;

    const baseUrl = window.location.origin;
    const url = new URL(baseUrl);
    url.searchParams.set('prefix', prefix);
    url.searchParams.set('name', name.trim());

    setGeneratedLink(url.toString());
    setCopied(false);
  };

  const handleCopy = async () => {
    if (!generatedLink) return;
    try {
      await navigator.clipboard.writeText(generatedLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfaf5] font-montserrat flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background grain */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("/images/paper-grain.png")' }} />

      <div className="bg-white max-w-lg w-full rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.08)] border border-theme-100 p-8 md:p-12 relative z-10">
        <div className="text-center mb-10">
          <h1 className="font-cinzel text-3xl md:text-4xl text-theme-900 mb-2">Link Generator</h1>
          <p className="text-stone-500 text-xs md:text-sm tracking-widest uppercase">Admin Dashboard</p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-stone-500">
              Prefix
            </label>
            <select
              value={prefix}
              onChange={(e) => setPrefix(e.target.value)}
              className="w-full bg-stone-50 border border-theme-200 rounded-xl px-4 py-3 text-stone-700 outline-none focus:border-theme-400 focus:ring-2 focus:ring-theme-100 transition-all appearance-none"
            >
              {prefixes.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-stone-500">
              Guest Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. John Doe"
              className="w-full bg-stone-50 border border-theme-200 rounded-xl px-4 py-3 text-stone-700 outline-none focus:border-theme-400 focus:ring-2 focus:ring-theme-100 transition-all"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={!name.trim()}
            className="w-full bg-theme-800 text-white rounded-xl py-4 font-bold uppercase tracking-[0.2em] text-[11px] hover:bg-theme-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-theme-900/10 flex items-center justify-center gap-2"
          >
            <LinkIcon size={16} />
            Generate Link
          </button>

          {generatedLink && (
            <div className="mt-8 p-6 bg-stone-50 border border-theme-200 rounded-2xl relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-1 h-full bg-theme-500" />
              <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-theme-600 mb-2">Generated Link</p>
              <div className="break-all text-sm text-stone-700 font-medium bg-white border border-theme-100 p-3 rounded-lg mb-4">
                {generatedLink}
              </div>
              <button
                onClick={handleCopy}
                className="w-full bg-white border border-theme-300 text-theme-800 rounded-xl py-3 font-bold uppercase tracking-[0.1em] text-[11px] hover:bg-theme-50 transition-colors flex items-center justify-center gap-2"
              >
                {copied ? (
                  <>
                    <CheckCircle2 size={16} className="text-green-500" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy size={16} />
                    Copy Link
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
