"use client";

import React, { useState, useRef, ChangeEvent } from 'react';
import { QRCodeCanvas, QRCodeSVG } from 'qrcode.react';
import { Download, Link as LinkIcon, Palette, Maximize, Settings2, Image as ImageIcon, Trash2, RotateCcw, Wifi, Mail, Phone, MessageSquare, Type } from 'lucide-react';

type ContentType = 'url' | 'wifi' | 'email' | 'phone' | 'sms';
type ErrorLevel = 'L' | 'M' | 'Q' | 'H';
type RenderMode = 'canvas' | 'svg';

export default function QRGenerator() {
  const [contentType, setContentType] = useState<ContentType>('url');
  const [url, setUrl] = useState('https://google.com');
  
  // WiFi State
  const [wifiSSID, setWifiSSID] = useState('');
  const [wifiPassword, setWifiPassword] = useState('');
  const [wifiEncryption, setWifiEncryption] = useState('WPA');
  const [wifiHidden, setWifiHidden] = useState(false);

  // Email State
  const [emailAddress, setEmailAddress] = useState('');
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');

  // Phone State
  const [phoneNumber, setPhoneNumber] = useState('');

  // SMS State
  const [smsNumber, setSmsNumber] = useState('');
  const [smsMessage, setSmsMessage] = useState('');

  const [fgColor, setFgColor] = useState('#2e3440');
  const [bgColor, setBgColor] = useState('#eceff4');
  const [size, setSize] = useState(256);
  const [level, setLevel] = useState<ErrorLevel>('H');
  const [marginSize, setMarginSize] = useState(2);
  const [logo, setLogo] = useState<string | null>(null);
  const [logoSize, setLogoSize] = useState(20);
  const [logoOpacity, setLogoOpacity] = useState(1);
  const [excavate, setExcavate] = useState(true);
  const [renderAs, setRenderAs] = useState<RenderMode>('canvas');

  const qrRef = useRef<HTMLDivElement>(null);

  const resetToDefaults = () => {
    setContentType('url');
    setUrl('https://google.com');
    setWifiSSID('');
    setWifiPassword('');
    setWifiEncryption('WPA');
    setWifiHidden(false);
    setEmailAddress('');
    setEmailSubject('');
    setEmailBody('');
    setPhoneNumber('');
    setSmsNumber('');
    setSmsMessage('');
    setFgColor('#2e3440');
    setBgColor('#eceff4');
    setSize(256);
    setLevel('H');
    setMarginSize(2);
    setLogo(null);
    setLogoSize(20);
    setLogoOpacity(1);
    setExcavate(true);
    setRenderAs('canvas');
  };

  const swapColors = () => {
    const temp = fgColor;
    setFgColor(bgColor);
    setBgColor(temp);
  };

  const getQRValue = () => {
    switch (contentType) {
      case 'wifi':
        return `WIFI:T:${wifiEncryption};S:${wifiSSID};P:${wifiPassword};H:${wifiHidden};;`;
      case 'email':
        return `mailto:${emailAddress}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      case 'phone':
        return `tel:${phoneNumber}`;
      case 'sms':
        return `smsto:${smsNumber}:${smsMessage}`;
      default:
        return url || ' ';
    }
  };

  const handleLogoUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogo(null);
  };

  const downloadQR = (format: 'png' | 'svg') => {
    if (!qrRef.current) return;

    if (format === 'png') {
      const canvas = qrRef.current.querySelector('canvas');
      if (canvas) {
        const url = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = url;
        link.download = `qr-code-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        alert('Please switch to Canvas mode for PNG download');
      }
    } else if (format === 'svg') {
      const svg = qrRef.current.querySelector('svg');
      if (svg) {
        const svgData = new XMLSerializer().serializeToString(svg);
        const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
        const url = URL.createObjectURL(svgBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `qr-code-${Date.now()}.svg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else {
        alert('Please switch to SVG mode for SVG download');
      }
    }
  };

  const imageSettings = logo ? {
    src: logo,
    x: undefined,
    y: undefined,
    height: (size * logoSize) / 100,
    width: (size * logoSize) / 100,
    opacity: logoOpacity,
    excavate: excavate,
  } : undefined;

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-stretch justify-center p-4 md:p-6 max-w-7xl mx-auto h-full overflow-hidden">
      {/* 1. Content Panel (Far Left) - Fixed 25% */}
      <div className="w-full lg:w-1/4 space-y-4 flex flex-col">
        <div className="bg-[#3b4252] border border-[#4c566a] rounded-3xl p-6 shadow-2xl flex flex-col h-full overflow-hidden">
          <h3 className="text-lg font-bold text-[#eceff4] mb-6 flex items-center gap-2 shrink-0">
            {contentType === 'url' && <LinkIcon className="w-5 h-5 text-[#88c0d0]" />}
            {contentType === 'wifi' && <Wifi className="w-5 h-5 text-[#88c0d0]" />}
            {contentType === 'email' && <Mail className="w-5 h-5 text-[#88c0d0]" />}
            {contentType === 'phone' && <Phone className="w-5 h-5 text-[#88c0d0]" />}
            {contentType === 'sms' && <MessageSquare className="w-5 h-5 text-[#88c0d0]" />}
            QR Content
          </h3>
          
          <div className="space-y-5 overflow-y-auto custom-scrollbar pr-1 flex-1">
            {contentType === 'url' && (
              <div className="space-y-2 animate-in fade-in duration-300">
                <span className="text-[10px] uppercase font-bold text-[#d8dee9]/70">URL or Text</span>
                <textarea
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Enter link or text..."
                  className="w-full bg-[#2e3440] border border-[#4c566a] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#88c0d0] shadow-inner h-48 resize-none"
                />
              </div>
            )}

            {contentType === 'wifi' && (
              <div className="space-y-5 animate-in fade-in duration-300">
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold text-[#d8dee9]/70">SSID</span>
                  <input
                    type="text"
                    value={wifiSSID}
                    onChange={(e) => setWifiSSID(e.target.value)}
                    placeholder="Network Name"
                    className="w-full bg-[#2e3440] border border-[#4c566a] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#88c0d0] shadow-inner"
                  />
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold text-[#d8dee9]/70">Password</span>
                  <input
                    type="password"
                    value={wifiPassword}
                    onChange={(e) => setWifiPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full bg-[#2e3440] border border-[#4c566a] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#88c0d0] shadow-inner"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3 items-end">
                  <div className="space-y-2">
                    <span className="text-[10px] uppercase font-bold text-[#d8dee9]/70">Auth</span>
                    <select
                      value={wifiEncryption}
                      onChange={(e) => setWifiEncryption(e.target.value)}
                      className="w-full bg-[#2e3440] border border-[#4c566a] rounded-xl p-2 text-white text-xs focus:outline-none"
                    >
                      <option value="WPA">WPA</option>
                      <option value="WEP">WEP</option>
                      <option value="nopass">None</option>
                    </select>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer group pb-2.5">
                    <input
                      type="checkbox"
                      checked={wifiHidden}
                      onChange={(e) => setWifiHidden(e.target.checked)}
                      className="w-4 h-4 rounded border-[#4c566a] bg-[#2e3440] text-[#88c0d0] focus:ring-[#88c0d0]"
                    />
                    <span className="text-xs text-[#d8dee9] group-hover:text-[#eceff4] transition-colors">Hidden</span>
                  </label>
                </div>
              </div>
            )}

            {contentType === 'email' && (
              <div className="space-y-5 animate-in fade-in duration-300">
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold text-[#d8dee9]/70">To Email</span>
                  <input
                    type="email"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    placeholder="hello@example.com"
                    className="w-full bg-[#2e3440] border border-[#4c566a] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#88c0d0] shadow-inner"
                  />
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold text-[#d8dee9]/70">Subject</span>
                  <input
                    type="text"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                    placeholder="Subject"
                    className="w-full bg-[#2e3440] border border-[#4c566a] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#88c0d0] shadow-inner"
                  />
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold text-[#d8dee9]/70">Body</span>
                  <textarea
                    value={emailBody}
                    onChange={(e) => setEmailBody(e.target.value)}
                    placeholder="Message..."
                    className="w-full bg-[#2e3440] border border-[#4c566a] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#88c0d0] h-32 shadow-inner resize-none"
                  />
                </div>
              </div>
            )}

            {contentType === 'phone' && (
              <div className="space-y-2 animate-in fade-in duration-300">
                <span className="text-[10px] uppercase font-bold text-[#d8dee9]/70">Phone Number</span>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+1 234 567 890"
                  className="w-full bg-[#2e3440] border border-[#4c566a] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#88c0d0] shadow-inner"
                />
              </div>
            )}

            {contentType === 'sms' && (
              <div className="space-y-5 animate-in fade-in duration-300">
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold text-[#d8dee9]/70">To Number</span>
                  <input
                    type="tel"
                    value={smsNumber}
                    onChange={(e) => setSmsNumber(e.target.value)}
                    placeholder="+1 234 567 890"
                    className="w-full bg-[#2e3440] border border-[#4c566a] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#88c0d0] shadow-inner"
                  />
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold text-[#d8dee9]/70">Message</span>
                  <textarea
                    value={smsMessage}
                    onChange={(e) => setSmsMessage(e.target.value)}
                    placeholder="SMS text..."
                    className="w-full bg-[#2e3440] border border-[#4c566a] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-1 focus:ring-[#88c0d0] h-32 shadow-inner resize-none"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Main Controls (Middle) - Fixed 50% */}
      <div className="w-full lg:w-1/2 bg-[#3b4252] border border-[#4c566a] rounded-3xl p-6 md:p-8 shadow-2xl flex flex-col transition-all duration-500 h-full overflow-hidden shrink-0">
        <div className="flex items-center justify-between mb-8 shrink-0">
          <h2 className="text-xl font-bold text-[#eceff4] flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-[#88c0d0]" />
            Customization
          </h2>
          <button
            onClick={resetToDefaults}
            className="flex items-center gap-2 text-[10px] font-bold text-[#88c0d0] hover:text-[#eceff4] transition-colors bg-[#434c5e] hover:bg-[#4c566a] px-3 py-1.5 rounded-lg border border-[#4c566a]"
          >
            <RotateCcw className="w-3 h-3" />
            RESET
          </button>
        </div>

        <div className="flex-1 flex flex-col justify-between overflow-hidden">
          {/* Content Type Selector */}
          <div className="space-y-4 shrink-0">
            <label className="text-xs font-semibold text-[#d8dee9] flex items-center gap-2">
              <Type className="w-3 h-3 text-[#88c0d0]" />
              Format
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[
                { id: 'url', icon: LinkIcon, label: 'URL' },
                { id: 'wifi', icon: Wifi, label: 'WiFi' },
                { id: 'email', icon: Mail, label: 'Email' },
                { id: 'phone', icon: Phone, label: 'Phone' },
                { id: 'sms', icon: MessageSquare, label: 'SMS' },
              ].map((type) => (
                <button
                  key={type.id}
                  onClick={() => setContentType(type.id as ContentType)}
                  className={`flex flex-col items-center justify-center gap-1.5 p-2.5 rounded-xl border transition-all ${
                    contentType === type.id
                      ? 'bg-[#88c0d0] border-[#88c0d0] text-[#2e3440] shadow-lg'
                      : 'bg-[#2e3440] border-[#4c566a] text-[#d8dee9]/60 hover:text-[#eceff4] hover:bg-[#434c5e]'
                  }`}
                >
                  <type.icon className="w-4 h-4" />
                  <span className="text-[9px] font-bold uppercase tracking-wider">{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 flex-1 py-8 min-h-0 overflow-hidden">
            {/* Design & Colors */}
            <div className="space-y-8 flex flex-col">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[#d8dee9] flex items-center gap-2">
                    <Palette className="w-3 h-3 text-[#88c0d0]" />
                    Colors
                  </label>
                  <button 
                    onClick={swapColors}
                    className="text-[9px] font-bold text-[#88c0d0] hover:text-[#eceff4] transition-colors flex items-center gap-1 bg-[#2e3440] px-2 py-1 rounded-md border border-[#4c566a]"
                  >
                    SWAP
                  </button>
                </div>
                <div className="grid grid-cols-1 gap-2.5">
                  <div className="flex items-center gap-2 bg-[#2e3440] border border-[#4c566a] rounded-lg p-2">
                    <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="w-6 h-6 bg-transparent cursor-pointer rounded border-0" />
                    <span className="text-xs font-mono text-[#d8dee9] uppercase">{fgColor}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-[#2e3440] border border-[#4c566a] rounded-lg p-2">
                    <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-6 h-6 bg-transparent cursor-pointer rounded border-0" />
                    <span className="text-xs font-mono text-[#d8dee9] uppercase">{bgColor}</span>
                  </div>
                </div>
              </div>

              {/* Logo Upload - Expanded */}
              <div className="space-y-4 pt-2">
                <label className="text-xs font-semibold text-[#d8dee9] flex items-center gap-2">
                  <ImageIcon className="w-3 h-3 text-[#88c0d0]" />
                  Logo Settings
                </label>
                {!logo ? (
                  <div className="relative group">
                    <input type="file" accept="image/*" onChange={handleLogoUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                    <div className="w-full bg-[#2e3440] border border-dashed border-[#4c566a] group-hover:border-[#88c0d0]/50 rounded-xl py-8 text-center transition-all">
                      <p className="text-xs text-[#d8dee9]/50">Upload Logo</p>
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#2e3440] border border-[#4c566a] rounded-xl p-4 space-y-4">
                    <div className="flex items-center justify-between border-b border-[#4c566a] pb-3">
                      <div className="flex items-center gap-3">
                        <img src={logo} alt="Logo" className="w-10 h-10 rounded border border-[#4c566a] bg-[#3b4252] object-contain" />
                        <span className="text-[10px] uppercase font-bold text-[#d8dee9]/70">Custom Logo</span>
                      </div>
                      <button onClick={removeLogo} className="p-2 hover:bg-[#bf616a]/20 text-[#bf616a] rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <div className="flex justify-between text-[9px] uppercase font-bold text-[#d8dee9]/60">
                          <span>Size</span>
                          <span>{logoSize}%</span>
                        </div>
                        <input type="range" min="10" max="30" value={logoSize} onChange={(e) => setLogoSize(Number(e.target.value))} className="w-full h-1 bg-[#4c566a] rounded-lg appearance-none cursor-pointer accent-[#88c0d0]" />
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-[9px] uppercase font-bold text-[#d8dee9]/60">
                          <span>Opacity</span>
                          <span>{Math.round(logoOpacity * 100)}%</span>
                        </div>
                        <input type="range" min="0.1" max="1" step="0.05" value={logoOpacity} onChange={(e) => setLogoOpacity(Number(e.target.value))} className="w-full h-1 bg-[#4c566a] rounded-lg appearance-none cursor-pointer accent-[#88c0d0]" />
                      </div>

                      <label className="flex items-center gap-2 cursor-pointer group pt-1">
                        <input
                          type="checkbox"
                          checked={excavate}
                          onChange={(e) => setExcavate(e.target.checked)}
                          className="w-3.5 h-3.5 rounded border-[#4c566a] bg-[#3b4252] text-[#88c0d0] focus:ring-[#88c0d0]"
                        />
                        <span className="text-[10px] text-[#d8dee9] group-hover:text-[#eceff4] transition-colors uppercase font-bold tracking-wider">Excavate Logo</span>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Layout & Export */}
            <div className="space-y-8">
              <div className="space-y-4">
                <label className="text-sm font-semibold text-[#d8dee9] flex items-center gap-2">
                  <Maximize className="w-3 h-3 text-[#88c0d0]" />
                  Resolution & Frame
                </label>
                <div className="bg-[#2e3440] border border-[#4c566a] rounded-xl p-5 space-y-6">
                  <div className="space-y-3">
                    <div className="flex justify-between text-[10px] uppercase font-bold text-[#d8dee9]/60 tracking-widest">
                      <span>Resolution</span>
                      <span className="text-[#88c0d0]">{size}x{size}px</span>
                    </div>
                    <input type="range" min="128" max="1024" step="64" value={size} onChange={(e) => setSize(Number(e.target.value))} className="w-full h-1.5 bg-[#4c566a] rounded-lg appearance-none cursor-pointer accent-[#88c0d0]" />
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between text-[10px] uppercase font-bold text-[#d8dee9]/60 tracking-widest">
                      <span>Quiet Zone</span>
                      <span className="text-[#88c0d0]">{marginSize} units</span>
                    </div>
                    <input type="range" min="0" max="10" value={marginSize} onChange={(e) => setMarginSize(Number(e.target.value))} className="w-full h-1.5 bg-[#4c566a] rounded-lg appearance-none cursor-pointer accent-[#88c0d0]" />
                  </div>
                </div>
              </div>

              <div className="space-y-3 pt-2">
                <div className="flex p-1 bg-[#2e3440] border border-[#4c566a] rounded-xl">
                  {(['canvas', 'svg'] as RenderMode[]).map(mode => (
                    <button
                      key={mode}
                      onClick={() => setRenderAs(mode)}
                      className={`flex-1 py-2.5 px-3 rounded-lg text-xs font-bold uppercase transition-all ${
                        renderAs === mode ? 'bg-[#88c0d0] text-[#2e3440] shadow-md' : 'text-[#d8dee9]/50 hover:text-white'
                      }`}
                    >
                      {mode}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Preview Card (Right) - Fixed 25% */}
      <div className="w-full lg:w-1/4 flex flex-col transition-all duration-500 h-full overflow-hidden">
        <div className="bg-[#3b4252] border border-[#4c566a] rounded-3xl p-6 shadow-2xl flex flex-col items-center justify-center h-full">
          <div 
            ref={qrRef}
            className="bg-[#eceff4] p-3 rounded-2xl shadow-2xl mb-6 transition-all duration-500 hover:scale-[1.05] relative group flex-shrink-0 w-[240px] h-[240px] flex items-center justify-center overflow-hidden"
          >
            {renderAs === 'canvas' ? (
              <QRCodeCanvas
                value={getQRValue()}
                size={size}
                fgColor={fgColor}
                bgColor={bgColor}
                level={level}
                marginSize={marginSize}
                imageSettings={imageSettings}
                style={{ width: '100%', height: '100%' }}
              />
            ) : (
              <QRCodeSVG
                value={getQRValue()}
                size={size}
                fgColor={fgColor}
                bgColor={bgColor}
                level={level}
                marginSize={marginSize}
                imageSettings={imageSettings}
                style={{ width: '100%', height: '100%' }}
              />
            )}
            <div className="absolute inset-0 rounded-3xl border-2 border-[#88c0d0]/0 group-hover:border-[#88c0d0]/20 transition-all pointer-events-none" />
          </div>
          
          <div className="w-full space-y-3">
            <button
              onClick={() => downloadQR(renderAs === 'canvas' ? 'png' : 'svg')}
              disabled={!getQRValue() || getQRValue().trim() === ''}
              className="w-full group relative flex items-center justify-center gap-2 bg-[#88c0d0] hover:bg-[#81a1c1] disabled:opacity-50 disabled:cursor-not-allowed text-[#2e3440] font-bold py-4 px-6 rounded-2xl transition-all active:scale-95 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <Download className="w-5 h-5" />
              Download {renderAs === 'canvas' ? 'PNG' : 'SVG'}
            </button>
            
            <p className="text-[10px] text-[#d8dee9]/50 text-center uppercase tracking-widest font-bold">
              Live Preview
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
