"use client";

import { useState } from "react";
import QRGenerator from "@/components/QRGenerator";
import QRDecoder from "@/components/QRDecoder";
import { QrCode, ScanQrCode, Sparkles } from "lucide-react";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"generate" | "decode">("generate");

  return (
    <main className="h-screen overflow-hidden flex flex-col bg-[#2e3440] text-[#eceff4] selection:bg-[#88c0d0]/30">
      {/* Subtle Nord Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#4c566a]/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#434c5e]/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 flex flex-col h-full py-6 px-4 md:py-8 overflow-y-auto custom-scrollbar">
        {/* Branding in Top Left */}
        <div className="absolute top-6 left-6 md:top-8 md:left-8 flex items-center gap-3 z-30 pointer-events-none sm:pointer-events-auto">
          <h1 className="hidden sm:block text-lg md:text-xl font-black text-[#eceff4] tracking-tight">
            Instant <span className="text-[#88c0d0]">QR Studio</span>
          </h1>
          <div className="inline-flex items-center justify-center p-2 bg-[#3b4252] border border-[#4c566a] rounded-xl backdrop-blur-md shadow-xl">
            <QrCode className="w-5 h-5 text-[#88c0d0]" />
          </div>
        </div>

        {/* Spacer for Absolute Header on Mobile */}
        <div className="h-12 sm:h-0 shrink-0" />

        {/* Tab Switcher */}
        <div className="max-w-md w-full mx-auto mb-8 p-1 bg-[#3b4252] border border-[#4c566a] rounded-2xl flex gap-1.5 shrink-0 shadow-2xl">
          <button
            onClick={() => setActiveTab("generate")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold transition-all duration-300 ${
              activeTab === "generate"
                ? "bg-[#88c0d0] text-[#2e3440] shadow-lg shadow-[#88c0d0]/20"
                : "text-[#d8dee9]/50 hover:text-[#eceff4] hover:bg-[#434c5e]"
            }`}
          >
            <Sparkles className={`w-4 h-4 ${activeTab === "generate" ? "text-[#3b4252]" : ""}`} />
            Generate
          </button>
          <button
            onClick={() => setActiveTab("decode")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold transition-all duration-300 ${
              activeTab === "decode"
                ? "bg-[#88c0d0] text-[#2e3440] shadow-lg shadow-[#88c0d0]/20"
                : "text-[#d8dee9]/50 hover:text-[#eceff4] hover:bg-[#434c5e]"
            }`}
          >
            <ScanQrCode className={`w-4 h-4 ${activeTab === "decode" ? "text-[#3b4252]" : ""}`} />
            Decode
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="h-full">
            {activeTab === "generate" ? (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 h-full">
                <QRGenerator />
              </div>
            ) : (
              <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 h-full">
                <QRDecoder />
              </div>
            )}
          </div>
        </div>

        <footer className="mt-8 py-4 text-center text-[#d8dee9]/20 text-[10px] uppercase tracking-widest font-bold shrink-0">
          <p>© {new Date().getFullYear()} QR Studio • Nord Professional Toolkit</p>
        </footer>
      </div>
    </main>
  );
}
