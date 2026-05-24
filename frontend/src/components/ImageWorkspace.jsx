import { useRef, useState, useCallback, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import SettingsPanel from './SettingsPanel';
import ProcessingOverlay from './ProcessingOverlay';
import { IconArrowLeft, IconDownload, IconPlayerPlay } from '@tabler/icons-react';

export default function ImageWorkspace() {
  const { state, dispatch, startUpscale } = useApp();
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const sliderPos = state.comparisonSliderPos;

  // Draw comparison canvas
  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !state.filePreviewUrl) return;

    const ctx = canvas.getContext('2d');
    const imgOriginal = new Image();
    const imgEnhanced = new Image();

    let originalLoaded = false;
    let enhancedLoaded = false;

    const onAllLoaded = () => {
      const container = containerRef.current;
      if (!container) return;

      const aspect = imgOriginal.width / imgOriginal.height;
      const cw = container.clientWidth;
      const ch = container.clientHeight;
      let dw, dh;

      if (cw / ch > aspect) {
        dh = ch;
        dw = ch * aspect;
      } else {
        dw = cw;
        dh = cw / aspect;
      }

      canvas.width = dw;
      canvas.height = dh;

      const splitX = (sliderPos / 100) * dw;

      // Left side — "original" (slightly blurred via CSS filter simulation)
      ctx.save();
      ctx.beginPath();
      ctx.rect(0, 0, splitX, dh);
      ctx.clip();
      ctx.filter = 'blur(0.5px) saturate(0.85)';
      ctx.drawImage(imgOriginal, 0, 0, dw, dh);
      ctx.restore();

      // Right side — "enhanced" (actual upscaled image if job_status is done, else simulated sharp filter)
      ctx.save();
      ctx.beginPath();
      ctx.rect(splitX, 0, dw - splitX, dh);
      ctx.clip();
      if (state.jobStatus === 'done' && enhancedLoaded) {
        ctx.drawImage(imgEnhanced, 0, 0, dw, dh);
      } else {
        ctx.filter = 'contrast(1.08) saturate(1.12)';
        ctx.drawImage(imgOriginal, 0, 0, dw, dh);
      }
      ctx.restore();

      // Divider line
      ctx.strokeStyle = 'rgba(255,255,255,0.9)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(splitX, 0);
      ctx.lineTo(splitX, dh);
      ctx.stroke();

      // Labels
      ctx.font = '600 11px Sora, sans-serif';
      ctx.textBaseline = 'top';

      // Left label
      ctx.fillStyle = 'rgba(0,0,0,0.5)';
      ctx.fillRect(8, 8, 60, 22);
      ctx.fillStyle = '#fff';
      ctx.fillText('Original', 14, 13);

      // Right label
      const rightLabelX = dw - 72;
      ctx.fillStyle = 'rgba(0,110,32,0.7)';
      ctx.fillRect(rightLabelX, 8, 64, 22);
      ctx.fillStyle = '#fff';
      ctx.fillText('Enhanced', rightLabelX + 6, 13);
    };

    imgOriginal.onload = () => {
      originalLoaded = true;
      if (state.jobStatus === 'done' && state.jobResult?.downloadUrl) {
        if (enhancedLoaded) {
          onAllLoaded();
        }
      } else {
        onAllLoaded();
      }
    };

    if (state.jobStatus === 'done' && state.jobResult?.downloadUrl) {
      imgEnhanced.onload = () => {
        enhancedLoaded = true;
        if (originalLoaded) {
          onAllLoaded();
        }
      };
      imgEnhanced.src = state.jobResult.downloadUrl;
    }

    imgOriginal.src = state.filePreviewUrl;
  }, [state.filePreviewUrl, state.jobStatus, state.jobResult, sliderPos]);

  useEffect(() => {
    drawCanvas();
    window.addEventListener('resize', drawCanvas);
    return () => window.removeEventListener('resize', drawCanvas);
  }, [drawCanvas]);

  // Slider interaction
  const handlePointerDown = (e) => {
    setIsDragging(true);
    updateSlider(e);
  };

  const handlePointerMove = (e) => {
    if (!isDragging) return;
    updateSlider(e);
  };

  const handlePointerUp = () => setIsDragging(false);

  const updateSlider = (e) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    dispatch({ type: 'SET_COMPARISON_SLIDER', payload: (x / rect.width) * 100 });
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
      return () => {
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
      };
    }
  }, [isDragging]);

  const scaleMultiplier = state.imageScale === 'custom' ? state.imageCustomScale : parseInt(state.imageScale);
  const outputW = (state.fileInfo?.width || 0) * scaleMultiplier;
  const outputH = (state.fileInfo?.height || 0) * scaleMultiplier;

  const isProcessing = state.jobStatus === 'processing' || state.jobStatus === 'uploading';

  return (
    <div className="flex h-[calc(100vh-72px)]">
      {/* Canvas Area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-outline-variant/20">
          <div className="flex items-center gap-3">
            <button
              id="back-to-dashboard-btn"
              onClick={() => dispatch({ type: 'CLEAR_FILE' })}
              className="bouncy-btn w-9 h-9 rounded-xl flex items-center justify-center hover:bg-surface-container-high transition-colors text-on-surface-variant"
            >
              <IconArrowLeft size={18} />
            </button>
            <div>
              <p className="text-sm font-semibold text-on-surface truncate max-w-[240px]">{state.fileInfo?.name}</p>
              <p className="text-xs text-on-surface-variant">
                {state.fileInfo?.width}×{state.fileInfo?.height} → {outputW}×{outputH}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {state.jobStatus === 'done' && state.jobResult?.downloadUrl && (
              <a
                id="download-btn"
                href={state.jobResult.downloadUrl}
                download
                className="bouncy-btn flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-on-primary text-sm font-semibold shadow-lg hover:shadow-xl transition-shadow"
              >
                <IconDownload size={16} />
                Download
              </a>
            )}
            {state.jobStatus === 'idle' && (
              <button
                id="start-upscale-btn"
                onClick={startUpscale}
                className="bouncy-btn flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-on-primary text-sm font-semibold shadow-lg hover:shadow-xl transition-shadow"
              >
                <IconPlayerPlay size={16} />
                Upscale
              </button>
            )}
          </div>
        </div>

        {/* Canvas */}
        <div
          ref={containerRef}
          className="flex-1 flex items-center justify-center bg-surface-container-low/50 relative cursor-col-resize select-none overflow-hidden"
          onPointerDown={handlePointerDown}
        >
          <canvas ref={canvasRef} className="rounded-xl shadow-2xl max-w-full max-h-full" />

          {/* Slider handle */}
          <div
            className="absolute top-0 bottom-0 pointer-events-none"
            style={{ left: `${sliderPos}%`, transform: 'translateX(-50%)' }}
          >
            <div className="w-8 h-8 rounded-full bg-white shadow-lg border-2 border-primary absolute top-1/2 -translate-y-1/2 -translate-x-1/2 left-1/2 slider-handle flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-[16px]">drag_handle</span>
            </div>
          </div>

          {isProcessing && <ProcessingOverlay />}
        </div>
      </div>

      {/* Settings Sidebar */}
      <SettingsPanel mode="image" />
    </div>
  );
}
