import { useApp } from '../context/AppContext';
import { IconUpload, IconPhoto, IconVideo, IconSparkles } from '@tabler/icons-react';

function formatBytes(bytes) {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}

export default function Dashboard() {
  const { state, dispatch } = useApp();

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer?.files?.[0];
    if (!file) return;
    // Trigger the hidden input processing via synthetic set
    const input = document.getElementById('file-input');
    const dt = new DataTransfer();
    dt.items.add(file);
    input.files = dt.files;
    input.dispatchEvent(new Event('change', { bubbles: true }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const openFilePicker = () => {
    document.getElementById('file-input')?.click();
  };

  const features = [
    { icon: 'hdr_auto', title: 'AI Upscaling', desc: 'Real-ESRGAN & BasicVSR++ models' },
    { icon: 'face_retouching_natural', title: 'Face Enhance', desc: 'GFPGAN face restoration' },
    { icon: 'slow_motion_video', title: 'Frame Interpolation', desc: 'RIFE smooth motion synthesis' },
    { icon: 'memory', title: 'GPU Accelerated', desc: 'CUDA, MPS, or smart CPU fallback' },
  ];

  return (
    <div className="max-w-[960px] mx-auto px-6 py-12">
      {/* Hero */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-container/60 text-on-primary-container text-xs font-semibold mb-6">
          <IconSparkles size={14} />
          AI-Powered Upscaling Engine
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold text-on-surface mb-4 tracking-tight leading-tight">
          Upscale your {state.mode === 'image' ? 'images' : 'videos'}
          <br />
          <span className="bg-gradient-to-r from-primary to-emerald-500 bg-clip-text text-transparent">
            with AI precision
          </span>
        </h1>
        <p className="text-on-surface-variant text-base max-w-lg mx-auto leading-relaxed">
          {state.mode === 'image'
            ? 'Enhance resolution up to 16× with Real-ESRGAN, restore faces with GFPGAN, and export in any format.'
            : 'Upscale video to 4K/8K with temporal-aware BasicVSR++, interpolate frames with RIFE, and preserve motion fidelity.'}
        </p>
      </div>

      {/* Upload Zone */}
      <div
        id="upload-zone"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={openFilePicker}
        className="glass-card rounded-3xl p-12 text-center cursor-pointer
                   hover:border-primary/40 hover:bg-primary-container/10
                   transition-all duration-300 group mb-12"
      >
        <div className="animate-float mb-6">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-primary-container to-primary-container/60 flex items-center justify-center shadow-lg">
            {state.mode === 'image' ? (
              <IconPhoto size={36} className="text-primary" stroke={1.5} />
            ) : (
              <IconVideo size={36} className="text-primary" stroke={1.5} />
            )}
          </div>
        </div>

        <h2 className="text-xl font-bold text-on-surface mb-2">
          Drop your {state.mode === 'image' ? 'image' : 'video'} here
        </h2>
        <p className="text-on-surface-variant text-sm mb-6">
          or <span className="text-primary font-semibold underline underline-offset-2">browse files</span>
        </p>

        <div className="flex items-center justify-center gap-4 text-xs text-on-surface-variant/70">
          <span className="flex items-center gap-1">
            <IconUpload size={14} />
            Max 500 MB
          </span>
          <span className="w-px h-3 bg-outline-variant" />
          <span>
            {state.mode === 'image'
              ? 'JPEG, PNG, WebP, HEIC, TIFF, BMP, AVIF'
              : 'MP4, MOV, MKV, AVI, WebM'}
          </span>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {features.map((f) => (
          <div
            key={f.title}
            className="glass-card rounded-2xl p-5 text-center hover:scale-[1.03] transition-transform duration-300"
          >
            <span className="material-symbols-outlined text-primary text-[28px] mb-3 block">{f.icon}</span>
            <h3 className="font-semibold text-sm text-on-surface mb-1">{f.title}</h3>
            <p className="text-xs text-on-surface-variant leading-snug">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Footer hint */}
      <p className="text-center text-xs text-on-surface-variant/50 mt-12">
        Press <kbd className="px-1.5 py-0.5 rounded bg-surface-container-high text-[10px] font-mono">⌘O</kbd> to open file picker &nbsp;·&nbsp;
        <kbd className="px-1.5 py-0.5 rounded bg-surface-container-high text-[10px] font-mono">⌘1</kbd> Image &nbsp;
        <kbd className="px-1.5 py-0.5 rounded bg-surface-container-high text-[10px] font-mono">⌘2</kbd> Video
      </p>
    </div>
  );
}
