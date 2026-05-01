"use client";

import { type ChangeEvent, type DragEvent, useEffect, useRef, useState } from "react";
import jsQR from "jsqr";
import {
  CircleAlert,
  CircleCheck,
  ClipboardCheck,
  ClipboardCopy,
  FileImage,
  ImageUp,
  LoaderCircle,
  RefreshCw,
  ScanQrCode,
} from "lucide-react";
import { cn } from "@/lib/utils";

type DecodeStatus = "idle" | "scanning" | "success" | "not-found" | "error";
type CopyState = "idle" | "copied" | "error";

const statusStyles: Record<DecodeStatus, string> = {
  idle: "border-[#4c566a] bg-[#3b4252] text-[#d8dee9]",
  scanning: "border-[#88c0d0]/30 bg-[#88c0d0]/10 text-[#88c0d0]",
  success: "border-[#a3be8c]/30 bg-[#a3be8c]/10 text-[#a3be8c]",
  "not-found": "border-[#ebcb8b]/30 bg-[#ebcb8b]/10 text-[#ebcb8b]",
  error: "border-[#bf616a]/30 bg-[#bf616a]/10 text-[#bf616a]",
};

const statusMessages: Record<DecodeStatus, string> = {
  idle: "Ready to scan",
  scanning: "Scanning image",
  success: "QR code decoded",
  "not-found": "No QR code found",
  error: "Could not read image",
};

async function decodeImageUrl(imageUrl: string) {
  const image = await loadImage(imageUrl);
  const maxCanvasSide = 2048;
  const imageWidth = image.naturalWidth || image.width;
  const imageHeight = image.naturalHeight || image.height;
  const scale = Math.min(1, maxCanvasSide / Math.max(imageWidth, imageHeight));
  const width = Math.max(1, Math.round(imageWidth * scale));
  const height = Math.max(1, Math.round(imageHeight * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;

  const context = canvas.getContext("2d", { willReadFrequently: true });

  if (!context) {
    throw new Error("Canvas context unavailable");
  }

  context.drawImage(image, 0, 0, width, height);

  const imageData = context.getImageData(0, 0, width, height);
  const code = jsQR(imageData.data, imageData.width, imageData.height, {
    inversionAttempts: "attemptBoth",
  });

  return code?.data ?? "";
}

function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new Image();

    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Image failed to load"));
    image.src = src;
  });
}

export default function QRDecoder() {
  const [decodedText, setDecodedText] = useState("");
  const [fileName, setFileName] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  const [status, setStatus] = useState<DecodeStatus>("idle");
  const [copyState, setCopyState] = useState<CopyState>("idle");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const scanIdRef = useRef(0);
  const copyTimeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        window.clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  const processFile = async (file: File) => {
    scanIdRef.current += 1;
    const scanId = scanIdRef.current;

    setDecodedText("");
    setCopyState("idle");
    setFileName(file.name);

    if (file.type && !file.type.startsWith("image/")) {
      setPreviewUrl("");
      setStatus("error");
      return;
    }

    const nextPreviewUrl = URL.createObjectURL(file);

    setPreviewUrl(nextPreviewUrl);
    setStatus("scanning");

    try {
      const result = await decodeImageUrl(nextPreviewUrl);

      if (scanId !== scanIdRef.current) {
        return;
      }

      if (result) {
        setDecodedText(result);
        setStatus("success");
      } else {
        setStatus("not-found");
      }
    } catch {
      if (scanId === scanIdRef.current) {
        setStatus("error");
      }
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (file) {
      void processFile(file);
    }

    event.target.value = "";
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const file = event.dataTransfer.files[0];

    if (file) {
      void processFile(file);
    }
  };

  const copyDecodedText = async () => {
    if (!decodedText) {
      return;
    }

    try {
      await navigator.clipboard.writeText(decodedText);
      setCopyState("copied");
    } catch {
      setCopyState("error");
    }

    if (copyTimeoutRef.current) {
      window.clearTimeout(copyTimeoutRef.current);
    }

    copyTimeoutRef.current = window.setTimeout(() => setCopyState("idle"), 1800);
  };

  const resetDecoder = () => {
    scanIdRef.current += 1;
    setDecodedText("");
    setFileName("");
    setPreviewUrl("");
    setStatus("idle");
    setCopyState("idle");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <section className="w-full max-w-6xl mx-auto px-4 md:px-8 h-full">
      <div className="bg-[#3b4252] border border-[#4c566a] rounded-3xl p-6 md:p-8 shadow-2xl h-full flex flex-col">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6 shrink-0">
          <h2 className="text-2xl font-bold text-[#eceff4] flex items-center gap-2">
            <ScanQrCode className="w-6 h-6 text-[#88c0d0]" />
            Decode QR Code
          </h2>

          <button
            type="button"
            onClick={resetDecoder}
            className="inline-flex items-center justify-center gap-2 self-start sm:self-auto border border-[#4c566a] bg-[#434c5e] hover:bg-[#4c566a] text-[#d8dee9] font-semibold py-2.5 px-4 rounded-xl transition-all active:scale-95"
          >
            <RefreshCw className="w-4 h-4 text-[#88c0d0]" />
            Reset
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] gap-6 flex-1 min-h-0">
          <div className="space-y-4 flex flex-col">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            <div
              role="button"
              tabIndex={0}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  fileInputRef.current?.click();
                }
              }}
              onDragOver={(event) => {
                event.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={cn(
                "flex-1 cursor-pointer rounded-2xl border-2 border-dashed border-[#4c566a] bg-[#2e3440] p-6 flex flex-col items-center justify-center text-center transition-all focus:outline-none focus:ring-2 focus:ring-[#88c0d0]",
                isDragging && "border-[#88c0d0] bg-[#88c0d0]/10",
              )}
            >
              <div className="h-14 w-14 rounded-2xl bg-[#3b4252] text-[#88c0d0] flex items-center justify-center mb-4 border border-[#4c566a] shadow-lg">
                <ImageUp className="w-7 h-7" />
              </div>
              <p className="text-lg font-semibold text-[#eceff4]">Upload QR image</p>
              <p className="mt-2 text-sm text-[#d8dee9]/70 break-all">
                {fileName || "PNG, JPG, WebP, or GIF"}
              </p>
            </div>

            <div className={cn("rounded-2xl border px-4 py-3 flex items-center gap-3 shrink-0", statusStyles[status])}>
              {status === "scanning" ? (
                <LoaderCircle className="w-5 h-5 shrink-0 animate-spin" />
              ) : status === "success" ? (
                <CircleCheck className="w-5 h-5 shrink-0" />
              ) : status === "idle" ? (
                <FileImage className="w-5 h-5 shrink-0" />
              ) : (
                <CircleAlert className="w-5 h-5 shrink-0" />
              )}
              <span className="text-sm font-medium">{statusMessages[status]}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 flex flex-col">
            <div className="flex-1 rounded-2xl border border-[#4c566a] bg-[#2e3440] p-4 flex items-center justify-center overflow-hidden shadow-inner min-h-[200px]">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt={fileName ? `Uploaded QR source: ${fileName}` : "Uploaded QR source"}
                  className="max-h-full w-full rounded-xl object-contain shadow-2xl"
                />
              ) : (
                <div className="text-center text-[#4c566a]">
                  <ScanQrCode className="mx-auto mb-3 h-12 w-12 opacity-20" />
                  <span className="text-sm font-medium">Image Preview</span>
                </div>
              )}
            </div>

            <div className="space-y-3 shrink-0">
              <div className="flex items-center justify-between gap-3">
                <label htmlFor="decoded-content" className="text-sm font-medium text-[#d8dee9]">
                  Decoded content
                </label>
                <button
                  type="button"
                  onClick={copyDecodedText}
                  disabled={!decodedText}
                  className="inline-flex min-w-24 items-center justify-center gap-2 rounded-xl border border-[#4c566a] bg-[#434c5e] px-3 py-2 text-sm font-semibold text-[#d8dee9] transition-all hover:bg-[#4c566a] disabled:cursor-not-allowed disabled:opacity-45 active:scale-95"
                >
                  {copyState === "copied" ? (
                    <ClipboardCheck className="w-4 h-4 text-[#a3be8c]" />
                  ) : (
                    <ClipboardCopy className="w-4 h-4 text-[#88c0d0]" />
                  )}
                  {copyState === "copied" ? "Copied" : "Copy"}
                </button>
              </div>

              <textarea
                id="decoded-content"
                readOnly
                value={decodedText}
                placeholder="Decoded text appears here"
                className="min-h-24 w-full resize-y rounded-2xl border border-[#4c566a] bg-[#2e3440] p-4 text-sm leading-6 text-[#eceff4] placeholder:text-[#4c566a] focus:outline-none focus:ring-2 focus:ring-[#88c0d0] shadow-inner"
              />

              {copyState === "error" ? (
                <p className="text-sm text-[#bf616a]">Clipboard access was blocked.</p>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
