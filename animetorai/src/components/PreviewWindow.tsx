import React, { useEffect, useRef, useState } from 'react';
import { AnimationCode } from '../types';
import { AlertCircle, RefreshCw, Loader2, Download, Video, Square } from 'lucide-react';

interface PreviewWindowProps {
  code: AnimationCode | null;
  isLoading?: boolean;
}

export const PreviewWindow: React.FC<PreviewWindowProps> = ({ code, isLoading }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeError, setIframeError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    try {
      // Note: In a real environment, we'd use getDisplayMedia or captureStream on a canvas.
      // Since we're in an iframe, we'll use getDisplayMedia to capture the screen area.
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { displaySurface: 'browser', logicalSurface: true } as any,
        audio: false
      });
      
      const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'animax-kayit.webm';
        a.click();
        URL.revokeObjectURL(url);
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Recording error:', err);
      alert('Ekran kaydı başlatılamadı. Lütfen izin verdiğinizden emin olun.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleDownload = () => {
    if (!code) return;
    const fullHtml = `
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Animax Export</title>
    <style>
        body { margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh; background: #0a0a0a; color: white; overflow: hidden; font-family: system-ui, sans-serif; }
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
    a.download = 'animasyon.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  useEffect(() => {
    if (!iframeRef.current || !code || isLoading) return;

    const doc = iframeRef.current.contentDocument;
    if (!doc) return;

    setIframeError(null);

    const content = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { 
              margin: 0; 
              display: flex; 
              justify-content: center; 
              align-items: center; 
              min-height: 100vh; 
              background: #0a0a0a;
              color: white;
              font-family: system-ui, -apple-system, sans-serif;
              overflow: hidden;
            }
            #error-display {
              display: none;
              position: fixed;
              bottom: 10px;
              left: 10px;
              right: 10px;
              background: rgba(220, 38, 38, 0.9);
              color: white;
              padding: 8px 12px;
              border-radius: 6px;
              font-size: 12px;
              z-index: 9999;
            }
            #watermark {
              position: fixed;
              bottom: 20px;
              right: 20px;
              font-family: 'Inter', sans-serif;
              font-weight: 900;
              font-size: 14px;
              letter-spacing: 2px;
              color: rgba(255, 255, 255, 0.2);
              pointer-events: none;
              z-index: 9998;
              text-transform: uppercase;
              display: flex;
              align-items: center;
              gap: 8px;
            }
            ${code.css}
          </style>
        </head>
        <body>
          <div id="error-display"></div>
          <div id="watermark">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
            ANIMAX
          </div>
          ${code.html}
          <script>
            window.onerror = function(msg, url, lineNo, columnNo, error) {
              const display = document.getElementById('error-display');
              if (display) {
                display.style.display = 'block';
                display.textContent = 'Hata: ' + msg;
              }
              return false;
            };
            try {
              ${code.js}
            } catch (e) {
              console.error('Animation JS Error:', e);
              const display = document.getElementById('error-display');
              if (display) {
                display.style.display = 'block';
                display.textContent = 'JS Hatası: ' + e.message;
              }
            }
          </script>
        </body>
      </html>
    `;

    try {
      doc.open();
      doc.write(content);
      doc.close();
    } catch (err) {
      console.error('Iframe write error:', err);
      setIframeError('Önizleme yüklenirken bir hata oluştu.');
    }
  }, [code, isLoading]);

  if (isLoading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900/50 rounded-2xl border border-zinc-800 border-dashed animate-pulse">
        <Loader2 className="text-emerald-500 animate-spin mb-4" size={32} />
        <p className="text-zinc-400 font-medium">Animasyon Hazırlanıyor...</p>
      </div>
    );
  }

  if (iframeError) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900/50 rounded-2xl border border-red-900/30 border-dashed p-6 text-center">
        <AlertCircle className="text-red-500 mb-4" size={32} />
        <p className="text-zinc-300 font-medium mb-2">Önizleme Hatası</p>
        <p className="text-zinc-500 text-sm mb-4">{iframeError}</p>
        <button 
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 text-xs text-zinc-400 hover:text-white transition-colors"
        >
          <RefreshCw size={14} /> Sayfayı Yenile
        </button>
      </div>
    );
  }

  if (!code) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-zinc-900/50 rounded-2xl border border-zinc-800 border-dashed p-6 text-center">
        <div className="w-16 h-16 bg-zinc-800 rounded-full flex items-center justify-center mb-6">
          <RefreshCw className="text-zinc-600" size={24} />
        </div>
        <h3 className="text-zinc-300 font-semibold mb-2">Henüz Animasyon Yok</h3>
        <p className="text-zinc-500 text-sm max-w-xs">
          Soldaki kutucuğa bir şeyler yazın ve "Animasyonu Oluştur" butonuna basın.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-zinc-950 rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl relative group">
      <iframe
        ref={iframeRef}
        title="Animation Preview"
        className="w-full h-full border-none"
        sandbox="allow-scripts"
      />
      <div className="absolute top-4 right-4 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        {!isRecording ? (
          <button
            onClick={startRecording}
            className="bg-zinc-800 hover:bg-zinc-700 text-white p-2 rounded-full shadow-lg transition-all active:scale-95 flex items-center gap-2 px-3"
            title="Video Olarak Kaydet"
          >
            <Video size={16} className="text-red-500" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Kaydet</span>
          </button>
        ) : (
          <button
            onClick={stopRecording}
            className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-all active:scale-95 flex items-center gap-2 px-3 animate-pulse"
            title="Kaydı Durdur"
          >
            <Square size={16} fill="white" />
            <span className="text-[10px] font-bold uppercase tracking-wider">Durdur</span>
          </button>
        )}
        <button
          onClick={handleDownload}
          className="bg-fuchsia-500 hover:bg-fuchsia-400 text-white p-2 rounded-full shadow-lg transition-all active:scale-95"
          title="HTML Olarak İndir"
        >
          <Download size={16} />
        </button>
      </div>
    </div>
  );
};
