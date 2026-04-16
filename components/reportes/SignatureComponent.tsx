"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { Upload, PenLine, Trash2, Image as ImageIcon, X } from "lucide-react";

interface SignatureComponentProps {
  value: string | null;
  onChange: (dataUrl: string | null) => void;
}

type Tab = "upload" | "draw";

export default function SignatureComponent({ value, onChange }: SignatureComponentProps) {
  const [activeTab, setActiveTab] = useState<Tab>("draw");
  const [isDragging, setIsDragging] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);

  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "#0f172a";
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, []);

  useEffect(() => {
    if (activeTab === "draw") {
      setTimeout(() => initCanvas(), 50);
    }
  }, [activeTab, initCanvas, isFullscreen]);

  const getPos = (e: any, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if (e.touches) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY,
      };
    }

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const startDraw = (e: any) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsDrawing(true);
    lastPoint.current = getPos(e, canvas);
  };

  const draw = (e: any) => {
    e.preventDefault();

    if (!isDrawing || !canvasRef.current || !lastPoint.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const current = getPos(e, canvas);

    ctx.beginPath();
    ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
    ctx.lineTo(current.x, current.y);
    ctx.stroke();

    lastPoint.current = current;
  };

  const endDraw = () => {
    if (!isDrawing) return;

    setIsDrawing(false);
    lastPoint.current = null;

    const canvas = canvasRef.current;
    if (!canvas) return;

    onChange(canvas.toDataURL("image/png"));
  };

  const clearCanvas = () => {
    initCanvas();
    onChange(null);
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      onChange(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div className="space-y-3">

      {/* TABS */}
      <div className="flex rounded-xl overflow-hidden border border-teal-200 w-fit">
        {(["draw", "upload"] as Tab[]).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => {
              setActiveTab(tab)
              if (tab === "draw" && window.innerWidth < 768) {
                setIsFullscreen(true) // 🔥 mobile auto fullscreen
              }
            }}
            className={`flex items-center gap-2 px-4 py-2 text-sm ${
              activeTab === tab
                ? "bg-teal-500 text-white"
                : "bg-white text-slate-600"
            }`}
          >
            {tab === "draw" ? <PenLine size={15} /> : <Upload size={15} />}
            {tab === "draw" ? "Dibujar" : "Subir"}
          </button>
        ))}
      </div>

      {/* DRAW NORMAL */}
      {activeTab === "draw" && !isFullscreen && (
        <div className="space-y-2">
          <canvas
            ref={canvasRef}
            width={520}
            height={140}
            className="w-full border rounded-xl bg-white"
            onMouseDown={startDraw}
            onMouseMove={draw}
            onMouseUp={endDraw}
            onMouseLeave={endDraw}
            onTouchStart={startDraw}
            onTouchMove={draw}
            onTouchEnd={endDraw}
          />
          <button onClick={clearCanvas} className="text-xs text-rose-500">
            Limpiar firma
          </button>
        </div>
      )}

      {/* 🔥 FULLSCREEN MOBILE */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-white flex flex-col">

          {/* HEADER */}
          <div className="flex justify-between items-center p-4 border-b">
            <span className="font-semibold">Firmar</span>
            <button onClick={() => setIsFullscreen(false)}>
              <X />
            </button>
          </div>

          {/* CANVAS */}
          <div className="flex-1 flex items-center justify-center p-4">
            <canvas
              ref={canvasRef}
              width={800}
              height={400}
              className="w-full h-full border rounded-xl"
              onMouseDown={startDraw}
              onMouseMove={draw}
              onMouseUp={endDraw}
              onMouseLeave={endDraw}
              onTouchStart={startDraw}
              onTouchMove={draw}
              onTouchEnd={endDraw}
            />
          </div>

          {/* ACTIONS */}
          <div className="p-4 flex justify-between">
            <button onClick={clearCanvas} className="text-rose-500 text-sm">
              Limpiar
            </button>
            <button
              onClick={() => setIsFullscreen(false)}
              className="bg-teal-500 text-white px-4 py-2 rounded-xl text-sm"
            >
              Guardar firma
            </button>
          </div>
        </div>
      )}

      {/* UPLOAD */}
      {activeTab === 'upload' && (
        <div className="space-y-2">
          <div
            onDragOver={(e) => {
              e.preventDefault()
              setIsDragging(true)
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`flex flex-col items-center justify-center gap-2 h-32 rounded-xl border-2 border-dashed cursor-pointer transition-all ${
              isDragging
                ? 'border-teal-400 bg-teal-50'
                : 'border-teal-200 bg-white hover:border-teal-400 hover:bg-teal-50'
            }`}
          >
            <ImageIcon size={28} className="text-teal-400" />
            <p className="text-sm text-slate-500">
              Arrastrar o <span className="text-teal-600 font-medium">subir</span>
            </p>
            <p className="text-xs text-slate-400">
              PNG, JPG, SVG
            </p>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) =>
              e.target.files?.[0] && handleFile(e.target.files[0])
            }
          />

          {value && (
            <div className="flex items-center gap-2">
              <img
                src={value}
                alt="Firma"
                className="h-12 border border-teal-200 rounded-lg p-1 bg-white"
              />
              <button
                type="button"
                onClick={() => onChange(null)}
                className="flex items-center gap-1 text-xs text-rose-400 hover:text-rose-600"
              >
                <Trash2 size={13} /> Quitar
              </button>
            </div>
          )}
        </div>
      )}

      {/* PREVIEW */}
      {value && (
        <img src={value} className="h-12 border rounded-lg p-1 bg-white" />
      )}
    </div>
  );
}