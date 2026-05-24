import { useApp } from '../context/AppContext';

function formatEstTime(seconds) {
  if (seconds < 1) return '< 1s';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  if (h > 0) {
    return `${h}h ${m}m`;
  }
  if (m > 0) {
    return `${m}m ${s}s`;
  }
  return `${s}s`;
}

function SectionTitle({ icon, title }) {
  return (
    <div className="flex items-center gap-2 mb-3 mt-1">
      <span className="material-symbols-outlined text-primary text-[18px]">{icon}</span>
      <h3 className="text-xs font-bold text-on-surface uppercase tracking-wider">{title}</h3>
    </div>
  );
}

function PillGroup({ options, value, onChange, id }) {
  return (
    <div className="flex gap-1 bg-surface-container rounded-full p-1" id={id}>
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`bouncy-btn flex-1 py-1.5 px-3 rounded-full text-xs font-semibold transition-colors text-center ${
            value === opt.value
              ? 'bg-primary-container text-on-primary-container shadow-sm'
              : 'text-on-surface-variant hover:bg-surface-container-high'
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}

function Toggle({ label, checked, onChange, id }) {
  return (
    <label htmlFor={id} className="flex items-center justify-between cursor-pointer group py-1">
      <span className="text-sm text-on-surface group-hover:text-on-surface/80 transition-colors">{label}</span>
      <div className="relative">
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div className="w-10 h-[22px] rounded-full bg-surface-container-high peer-checked:bg-primary transition-colors" />
        <div className="absolute top-[3px] left-[3px] w-4 h-4 rounded-full bg-white shadow peer-checked:translate-x-[18px] transition-transform" />
      </div>
    </label>
  );
}

function ModelTile({ icon, title, desc, estTime, badgeText, badgeColor, selected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`bouncy-btn w-full text-left p-3 rounded-2xl border transition-all ${
        selected
          ? 'border-primary/40 bg-primary-container/20 shadow-sm'
          : 'border-transparent bg-surface-container/60 hover:bg-surface-container-high'
      }`}
    >
      <div className="flex items-start gap-2.5">
        <span className={`material-symbols-outlined text-[20px] mt-0.5 ${selected ? 'text-primary fill-icon' : 'text-on-surface-variant'}`}>
          {icon}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-1">
            <p className={`text-sm font-semibold truncate ${selected ? 'text-primary' : 'text-on-surface'}`}>{title}</p>
            {badgeText && (
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${badgeColor || 'bg-surface-container-highest text-on-surface-variant'}`}>
                {badgeText}
              </span>
            )}
          </div>
          <p className="text-xs text-on-surface-variant leading-snug mt-0.5">{desc}</p>
          {estTime && (
            <p className="text-[10px] font-mono text-tertiary mt-1 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[12px]">schedule</span>
              Est: {estTime}
            </p>
          )}
        </div>
      </div>
    </button>
  );
}

export default function SettingsPanel({ mode }) {
  const { state, dispatch } = useApp();

  if (mode === 'image') {
    return <ImageSettings state={state} dispatch={dispatch} />;
  }
  return <VideoSettings state={state} dispatch={dispatch} />;
}

function ImageSettings({ state, dispatch }) {
  const scaleOptions = [
    { value: '2x', label: '2×' },
    { value: '4x', label: '4×' },
    { value: '8x', label: '8×' },
    { value: 'custom', label: 'Custom' },
  ];

  const scaleMult = state.imageScale === 'custom' ? state.imageCustomScale : parseInt(state.imageScale);
  const outW = (state.fileInfo?.width || 0) * scaleMult;
  const outH = (state.fileInfo?.height || 0) * scaleMult;

  const getEstImageTimeForModel = (modelName) => {
    if (!state.fileInfo) return 0;
    const megapixels = (state.fileInfo.width * state.fileInfo.height) / 1000000;
    const scaleMultiplier = state.imageScale === 'custom' ? state.imageCustomScale : parseInt(state.imageScale);
    const isGpu = state.hardwareTier === 'gpu';

    let baseSecondsPerMp = 1.25;
    if (modelName === 'swinir') baseSecondsPerMp = isGpu ? 4.0 : 18.0;
    else if (modelName === 'supir') baseSecondsPerMp = isGpu ? 15.0 : 90.0;
    else baseSecondsPerMp = isGpu ? 1.25 : 4.5;

    let est = megapixels * baseSecondsPerMp * (scaleMultiplier / 4);
    if (state.imageFaceEnhance) est += isGpu ? 0.8 : 3.0;
    if (state.imageDeblocking) est += isGpu ? 0.5 : 2.0;

    return Math.max(1, est);
  };

  const selectedEstSeconds = getEstImageTimeForModel(state.imageModel);
  const hardwareLabel = state.gpuName !== 'none' ? `Accelerated via ${state.gpuName}` : 'CPU processing mode';

  return (
    <aside className="w-[320px] sidebar-glass overflow-y-auto custom-scrollbar border-l border-outline-variant/20">
      <div className="p-5 space-y-6">
        {/* Scale */}
        <section>
          <SectionTitle icon="zoom_in" title="Scale" />
          <PillGroup
            id="image-scale-pills"
            options={scaleOptions}
            value={state.imageScale}
            onChange={(v) => dispatch({ type: 'SET_IMAGE_SCALE', payload: v })}
          />

          {state.imageScale === 'custom' && (
            <div className="mt-3 flex items-center gap-3">
              <input
                id="custom-scale-input"
                type="number"
                min="1.5"
                max="16"
                step="0.5"
                value={state.imageCustomScale}
                onChange={(e) => dispatch({ type: 'SET_IMAGE_CUSTOM_SCALE', payload: parseFloat(e.target.value) || 1.5 })}
                className="w-20 px-3 py-1.5 rounded-xl bg-surface-container border border-outline-variant/30 text-sm font-mono text-center focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <span className="text-xs text-on-surface-variant">× multiplier</span>
            </div>
          )}

          {state.imageScale === '8x' && (
            <p className="text-xs text-tertiary mt-2 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[14px]">warning</span>
              Requires ~3× more processing time than 4×
            </p>
          )}

          <div className="mt-3 px-3 py-2 rounded-xl bg-surface-container/60">
            <p className="text-xs text-on-surface-variant">
              Output: <span className="font-semibold text-on-surface">{outW.toLocaleString()} × {outH.toLocaleString()}</span>
            </p>
          </div>
        </section>

        {/* Model */}
        <section>
          <SectionTitle icon="psychology" title="AI Model" />
          <div className="space-y-2">
            <ModelTile
              icon="auto_awesome"
              title="Real-ESRGAN"
              desc="General purpose. Balanced speed and sharpness."
              estTime={state.fileInfo ? `~${formatEstTime(getEstImageTimeForModel('realesrgan'))}` : null}
              badgeText="Fast"
              badgeColor="bg-primary-container/30 text-on-primary-container"
              selected={state.imageModel === 'realesrgan'}
              onClick={() => dispatch({ type: 'SET_IMAGE_MODEL', payload: 'realesrgan' })}
            />
            <ModelTile
              icon="animation"
              title="Real-ESRGAN Anime"
              desc="Optimized for cartoon drawings & illustrations."
              estTime={state.fileInfo ? `~${formatEstTime(getEstImageTimeForModel('realesrgan-anime'))}` : null}
              badgeText="Fast"
              badgeColor="bg-primary-container/30 text-on-primary-container"
              selected={state.imageModel === 'realesrgan-anime'}
              onClick={() => dispatch({ type: 'SET_IMAGE_MODEL', payload: 'realesrgan-anime' })}
            />
            <ModelTile
              icon="blur_on"
              title="SwinIR (Transformer)"
              desc="Advanced attention model. Superior noise-reduction."
              estTime={state.fileInfo ? `~${formatEstTime(getEstImageTimeForModel('swinir'))}` : null}
              badgeText="Moderate"
              badgeColor="bg-tertiary-container/30 text-on-tertiary-container"
              selected={state.imageModel === 'swinir'}
              onClick={() => dispatch({ type: 'SET_IMAGE_MODEL', payload: 'swinir' })}
            />
            <ModelTile
              icon="palette"
              title="SUPIR (Generative)"
              desc="Diffusion photorealistic texture generation."
              estTime={state.fileInfo ? `~${formatEstTime(getEstImageTimeForModel('supir'))}` : null}
              badgeText="Heavy"
              badgeColor="bg-error-container/30 text-on-error-container"
              selected={state.imageModel === 'supir'}
              onClick={() => dispatch({ type: 'SET_IMAGE_MODEL', payload: 'supir' })}
            />
          </div>
        </section>

        {/* Enhancements */}
        <section>
          <SectionTitle icon="tune" title="Enhancements" />
          <div className="space-y-1">
            <Toggle
              id="image-deblocking"
              label="Deblocking"
              checked={state.imageDeblocking}
              onChange={(v) => dispatch({ type: 'SET_IMAGE_DEBLOCKING', payload: v })}
            />
            <Toggle
              id="image-face-enhance"
              label="Face Enhancement"
              checked={state.imageFaceEnhance}
              onChange={(v) => dispatch({ type: 'SET_IMAGE_FACE_ENHANCE', payload: v })}
            />
          </div>
        </section>

        {/* Output Format */}
        <section>
          <SectionTitle icon="image" title="Output Format" />
          <PillGroup
            id="image-output-format"
            options={[
              { value: 'png', label: 'PNG' },
              { value: 'jpg', label: 'JPEG' },
              { value: 'webp', label: 'WebP' },
            ]}
            value={state.imageOutputFormat}
            onChange={(v) => dispatch({ type: 'SET_IMAGE_OUTPUT_FORMAT', payload: v })}
          />

          {state.imageOutputFormat !== 'png' && (
            <div className="mt-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-on-surface-variant">Quality</span>
                <span className="text-xs font-semibold text-on-surface">{state.imageOutputQuality}%</span>
              </div>
              <input
                id="image-quality-slider"
                type="range"
                min="50"
                max="100"
                value={state.imageOutputQuality}
                onChange={(e) => dispatch({ type: 'SET_IMAGE_OUTPUT_QUALITY', payload: parseInt(e.target.value) })}
                className="w-full"
              />
            </div>
          )}
        </section>

        {/* Estimated Completion Card */}
        {state.fileInfo && (
          <section className="pt-2">
            <div className="p-3.5 rounded-2xl bg-primary/5 border border-primary/10 glass-card">
              <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-primary text-[18px]">schedule</span>
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Device-Tailored Est. Time</span>
              </div>
              <p className="text-2xl font-bold text-on-surface tracking-tight mt-1">
                ~{formatEstTime(selectedEstSeconds)}
              </p>
              <p className="text-[10px] text-on-surface-variant/80 mt-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px] text-primary fill-icon">memory</span>
                {hardwareLabel}
              </p>
            </div>
          </section>
        )}
      </div>
    </aside>
  );
}

function VideoSettings({ state, dispatch }) {
  const getEstVideoTimeForModel = (modelName) => {
    if (!state.fileInfo || !state.fileInfo.duration) return 0;
    const duration = state.fileInfo.duration;
    const isGpu = state.hardwareTier === 'gpu';
    const fps = state.videoFrameInterpolation ? state.videoTargetFps : 30;
    const totalFrames = duration * fps;

    let baseSecondsPerFrame = 0.05;
    if (modelName === 'vrt') baseSecondsPerFrame = isGpu ? 0.15 : 0.85;
    else if (modelName === 'animesr') baseSecondsPerFrame = isGpu ? 0.03 : 0.15;
    else if (modelName === 'realesrgan') baseSecondsPerFrame = isGpu ? 0.02 : 0.1;
    else baseSecondsPerFrame = isGpu ? 0.05 : 0.25;

    let resFactor = 1.0;
    if (state.videoResolution === '1080p') resFactor = 0.5;
    else if (state.videoResolution === '8k') resFactor = 4.0;

    let est = totalFrames * baseSecondsPerFrame * resFactor;
    if (state.videoFaceEnhance) est += totalFrames * (isGpu ? 0.01 : 0.04);
    if (state.videoDeblocking) est += totalFrames * (isGpu ? 0.005 : 0.02);

    return Math.max(1, est);
  };

  const selectedEstSeconds = getEstVideoTimeForModel(state.videoModel);
  const hardwareLabel = state.gpuName !== 'none' ? `Accelerated via ${state.gpuName}` : 'CPU processing mode';

  return (
    <aside className="w-[320px] sidebar-glass overflow-y-auto custom-scrollbar border-l border-outline-variant/20">
      <div className="p-5 space-y-6">
        {/* Target Resolution */}
        <section>
          <SectionTitle icon="tv" title="Target Resolution" />
          <div className="space-y-2">
            <ModelTile
              icon="hd"
              title="1080p Full HD"
              desc="1920×1080 — Fast processing, good for web."
              selected={state.videoResolution === '1080p'}
              onClick={() => dispatch({ type: 'SET_VIDEO_RESOLUTION', payload: '1080p' })}
            />
            <ModelTile
              icon="4k"
              title="4K Ultra HD"
              desc="3840×2160 — Cinema quality, recommended."
              selected={state.videoResolution === '4k'}
              onClick={() => dispatch({ type: 'SET_VIDEO_RESOLUTION', payload: '4k' })}
            />
            <ModelTile
              icon="8k"
              title="8K Super Hi-Vision"
              desc="7680×4320 — Maximum quality. Heavy processing."
              selected={state.videoResolution === '8k'}
              onClick={() => dispatch({ type: 'SET_VIDEO_RESOLUTION', payload: '8k' })}
            />
          </div>
        </section>

        {/* AI Model */}
        <section>
          <SectionTitle icon="psychology" title="AI Model" />
          <div className="space-y-2">
            <ModelTile
              icon="movie_filter"
              title="BasicVSR++"
              desc="Temporal-aware. Superior motion coherence."
              estTime={state.fileInfo ? `~${formatEstTime(getEstVideoTimeForModel('basicvsr'))}` : null}
              badgeText="Recommend"
              badgeColor="bg-primary-container/30 text-on-primary-container"
              selected={state.videoModel === 'basicvsr'}
              onClick={() => dispatch({ type: 'SET_VIDEO_MODEL', payload: 'basicvsr' })}
            />
            <ModelTile
              icon="auto_awesome"
              title="Real-ESRGAN (frame)"
              desc="Frame-by-frame scaling. Faster but slight flickering."
              estTime={state.fileInfo ? `~${formatEstTime(getEstVideoTimeForModel('realesrgan'))}` : null}
              badgeText="Fast"
              badgeColor="bg-primary-container/20 text-on-primary-container"
              selected={state.videoModel === 'realesrgan'}
              onClick={() => dispatch({ type: 'SET_VIDEO_MODEL', payload: 'realesrgan' })}
            />
            <ModelTile
              icon="psychology"
              title="VRT (Transformer)"
              desc="Cinematic attention restoration. Heavy VRAM."
              estTime={state.fileInfo ? `~${formatEstTime(getEstVideoTimeForModel('vrt'))}` : null}
              badgeText="Ultra"
              badgeColor="bg-error-container/20 text-on-error-container"
              selected={state.videoModel === 'vrt'}
              onClick={() => dispatch({ type: 'SET_VIDEO_MODEL', payload: 'vrt' })}
            />
            <ModelTile
              icon="animation"
              title="AnimeSR (Cartoon)"
              desc="Optimized for anime frame consistency."
              estTime={state.fileInfo ? `~${formatEstTime(getEstVideoTimeForModel('animesr'))}` : null}
              badgeText="Fast"
              badgeColor="bg-primary-container/20 text-on-primary-container"
              selected={state.videoModel === 'animesr'}
              onClick={() => dispatch({ type: 'SET_VIDEO_MODEL', payload: 'animesr' })}
            />
          </div>
        </section>

        {/* Frame Interpolation */}
        <section>
          <SectionTitle icon="slow_motion_video" title="Frame Interpolation" />
          <Toggle
            id="video-frame-interp"
            label="Enable RIFE interpolation"
            checked={state.videoFrameInterpolation}
            onChange={(v) => dispatch({ type: 'SET_VIDEO_FRAME_INTERPOLATION', payload: v })}
          />
          {state.videoFrameInterpolation && (
            <div className="mt-2">
              <PillGroup
                id="video-target-fps"
                options={[
                  { value: 30, label: '30 fps' },
                  { value: 60, label: '60 fps' },
                  { value: 120, label: '120 fps' },
                ]}
                value={state.videoTargetFps}
                onChange={(v) => dispatch({ type: 'SET_VIDEO_TARGET_FPS', payload: v })}
              />
            </div>
          )}
        </section>

        {/* Quality */}
        <section>
          <SectionTitle icon="high_quality" title="Quality (CRF)" />
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-on-surface-variant">Lower = better quality</span>
            <span className="text-xs font-semibold text-on-surface">{state.videoCrf}</span>
          </div>
          <input
            id="video-crf-slider"
            type="range"
            min="10"
            max="30"
            value={state.videoCrf}
            onChange={(e) => dispatch({ type: 'SET_VIDEO_CRF', payload: parseInt(e.target.value) })}
            className="w-full"
          />
          <div className="flex justify-between text-[10px] text-on-surface-variant/60 mt-0.5">
            <span>Lossless</span>
            <span>Compressed</span>
          </div>
        </section>

        {/* Enhancements */}
        <section>
          <SectionTitle icon="tune" title="Enhancements" />
          <div className="space-y-1">
            <Toggle
              id="video-deblocking"
              label="Deblocking"
              checked={state.videoDeblocking}
              onChange={(v) => dispatch({ type: 'SET_VIDEO_DEBLOCKING', payload: v })}
            />
            <Toggle
              id="video-face-enhance"
              label="Face Enhancement"
              checked={state.videoFaceEnhance}
              onChange={(v) => dispatch({ type: 'SET_VIDEO_FACE_ENHANCE', payload: v })}
            />
          </div>
        </section>

        {/* Output Format */}
        <section>
          <SectionTitle icon="video_file" title="Output Format" />
          <PillGroup
            id="video-output-format"
            options={[
              { value: 'mp4', label: 'MP4' },
              { value: 'mkv', label: 'MKV' },
              { value: 'webm', label: 'WebM' },
            ]}
            value={state.videoOutputFormat}
            onChange={(v) => dispatch({ type: 'SET_VIDEO_OUTPUT_FORMAT', payload: v })}
          />
        </section>

        {/* Estimated Completion Card */}
        {state.fileInfo && (
          <section className="pt-2">
            <div className="p-3.5 rounded-2xl bg-primary/5 border border-primary/10 glass-card">
              <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-primary text-[18px]">schedule</span>
                <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Device-Tailored Est. Time</span>
              </div>
              <p className="text-2xl font-bold text-on-surface tracking-tight mt-1">
                ~{formatEstTime(selectedEstSeconds)}
              </p>
              <p className="text-[10px] text-on-surface-variant/80 mt-1 flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px] text-primary fill-icon">memory</span>
                {hardwareLabel}
              </p>
            </div>
          </section>
        )}
      </div>
    </aside>
  );
}
