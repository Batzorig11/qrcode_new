import QRGenerator from "@/components/QRGenerator";
import QRDecoder from "@/components/QRDecoder";
import { QrCode } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0f172a] bg-gradient-to-br from-[#0f172a] via-[#1e1b4b] to-[#312e81] selection:bg-indigo-500/30">
      {/* Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 py-12 px-4 md:py-20">
        <header className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center justify-center p-3 bg-white/5 border border-white/10 rounded-2xl mb-4 backdrop-blur-sm">
            <QrCode className="w-8 h-8 text-indigo-400" />
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight">
            Instant <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">QR Studio</span>
          </h1>
          <p className="text-indigo-200/60 text-lg md:text-xl max-w-2xl mx-auto font-medium">
            Create custom QR codes and decode saved QR images in seconds.
          </p>
        </header>

        <QRGenerator />
        <div className="mt-8">
          <QRDecoder />
        </div>

        <footer className="mt-20 text-center text-indigo-200/40 text-sm">
          <p>© {new Date().getFullYear()} QR Studio. Built with Next.js and Tailwind CSS.</p>
        </footer>
      </div>
    </main>
  );
}
