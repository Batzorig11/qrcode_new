"use client";

import React, { useState, useRef } from 'react';
import { QRCodeCanvas } from 'qrcode.react';
import { Download, Link as LinkIcon, Palette, Maximize, Settings2 } from 'lucide-react';

export default function QRGenerator() {
  const [url, setUrl] = useState('https://google.com');
  const [fgColor, setFgColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [size, setSize] = useState(256);
  const [level, setLevel] = useState<'L' | 'M' | 'Q' | 'H'>('M');
  const [includeMargin, setIncludeMargin] = useState(true);

  const qrRef = useRef<HTMLDivElement>(null);

  const downloadQR = () => {
    const canvas = qrRef.current?.querySelector('canvas');
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = url;
      link.download = `qr-code-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start justify-center p-4 md:p-8 max-w-6xl mx-auto">
      {/* Controls Card */}
      <div className="w-full lg:w-2/3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-6 md:p-8 shadow-2xl">
        <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
          <Settings2 className="w-6 h-6" />
          Customize Your QR Code
        </h2>

        <div className="space-y-6">
          {/* URL Input */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-indigo-100 flex items-center gap-2">
              <LinkIcon className="w-4 h-4" />
              Content (URL or Text)
            </label>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Enter your link or text here..."
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Colors */}
            <div className="space-y-4">
              <label className="text-sm font-medium text-indigo-100 flex items-center gap-2">
                <Palette className="w-4 h-4" />
                Appearance
              </label>
              <div className="flex gap-4">
                <div className="flex-1 space-y-2">
                  <span className="text-xs text-indigo-200">Foreground</span>
                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-2">
                    <input
                      type="color"
                      value={fgColor}
                      onChange={(e) => setFgColor(e.target.value)}
                      className="w-8 h-8 bg-transparent cursor-pointer rounded overflow-hidden"
                    />
                    <input 
                      type="text" 
                      value={fgColor} 
                      onChange={(e) => setFgColor(e.target.value)}
                      className="bg-transparent text-white text-xs w-full focus:outline-none uppercase"
                    />
                  </div>
                </div>
                <div className="flex-1 space-y-2">
                  <span className="text-xs text-indigo-200">Background</span>
                  <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl p-2">
                    <input
                      type="color"
                      value={bgColor}
                      onChange={(e) => setBgColor(e.target.value)}
                      className="w-8 h-8 bg-transparent cursor-pointer rounded overflow-hidden"
                    />
                    <input 
                      type="text" 
                      value={bgColor} 
                      onChange={(e) => setBgColor(e.target.value)}
                      className="bg-transparent text-white text-xs w-full focus:outline-none uppercase"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Size & Quality */}
            <div className="space-y-4">
              <label className="text-sm font-medium text-indigo-100 flex items-center gap-2">
                <Maximize className="w-4 h-4" />
                Settings
              </label>
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-indigo-200">
                    <span>Size</span>
                    <span>{size}px</span>
                  </div>
                  <input
                    type="range"
                    min="128"
                    max="512"
                    step="8"
                    value={size}
                    onChange={(e) => setSize(Number(e.target.value))}
                    className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                  />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1 space-y-1">
                    <span className="text-xs text-indigo-200">Correction</span>
                    <select
                      value={level}
                      onChange={(e) => setLevel(e.target.value as 'L' | 'M' | 'Q' | 'H')}
                      className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-white text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    >
                      <option value="L">Low (7%)</option>
                      <option value="M">Medium (15%)</option>
                      <option value="Q">Quartile (25%)</option>
                      <option value="H">High (30%)</option>
                    </select>
                  </div>
                  <div className="flex items-end pb-1">
                    <label className="flex items-center gap-2 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={includeMargin}
                        onChange={(e) => setIncludeMargin(e.target.checked)}
                        className="w-4 h-4 rounded border-white/10 bg-white/5 text-indigo-600 focus:ring-indigo-500"
                      />
                      <span className="text-xs text-indigo-200 group-hover:text-white transition-colors">Margin</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Card */}
      <div className="w-full lg:w-1/3 flex flex-col gap-6">
        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 shadow-2xl flex flex-col items-center justify-center">
          <div 
            ref={qrRef}
            className="bg-white p-4 rounded-2xl shadow-inner mb-8 transition-all duration-300 hover:scale-[1.02]"
            style={{ backgroundColor: bgColor }}
          >
            <QRCodeCanvas
              value={url || ' '}
              size={size}
              fgColor={fgColor}
              bgColor={bgColor}
              level={level}
              includeMargin={includeMargin}
            />
          </div>
          
          <button
            onClick={downloadQR}
            disabled={!url}
            className="w-full group relative flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 px-6 rounded-2xl transition-all shadow-lg shadow-indigo-500/25 active:scale-95 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            <Download className="w-5 h-5" />
            Download PNG
          </button>
          
          <p className="mt-4 text-xs text-indigo-200 text-center">
            Scan to test before downloading
          </p>
        </div>
      </div>
    </div>
  );
}
