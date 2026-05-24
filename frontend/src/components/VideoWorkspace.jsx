import { useRef, useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import SettingsPanel from './SettingsPanel';
import ProcessingOverlay from './ProcessingOverlay';
import { IconArrowLeft, IconDownload, IconPlayerPlay, IconPlayerPause } from '@tabler/icons-react';

function formatDuration(sec) {
  if (!sec || !isFinite(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function VideoWorkspace() {
  const { state, dispatch, startUpscale } = useApp();
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const videoSrc = (state.jobStatus === 'done' && state.jobResult?.downloadUrl)
    ? state.jobResult.downloadUrl
    : state.filePreviewUrl;

  useEffect(() => {
    const v = videoRef.current;
    if (v) {
      v.load();
    }
  }, [videoSrc]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onTime = () => setCurrentTime(v.currentTime);
    const onMeta = () => setDuration(v.duration);

    v.addEventListener('play', onPlay);
    v.addEventListener('pause', onPause);
    v.addEventListener('timeupdate', onTime);
    v.addEventListener('loadedmetadata', onMeta);
    return () => {
      v.removeEventListener('play', onPlay);
      v.removeEventListener('pause', onPause);
      v.removeEventListener('timeupdate', onTime);
      v.removeEventListener('loadedmetadata', onMeta);
    };
  }, []);

  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    v.paused ? v.play() : v.pause();
  };

  const handleSeek = (e) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = (e.target.value / 100) * duration;
  };

  const resLabels = { '1080p': '1920×1080', '4k': '3840×2160', '8k': '7680×4320' };
  const isProcessing = state.jobStatus === 'processing' || state.jobStatus === 'uploading';

  return (
    <div className="flex h-[calc(100vh-72px)]">
      {/* Video Area */}
      <div className="flex-1 flex flex-col">
        {/* Toolbar */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-outline-variant/20">
          <div className="flex items-center gap-3">
            <button
              id="video-back-btn"
              onClick={() => dispatch({ type: 'CLEAR_FILE' })}
              className="bouncy-btn w-9 h-9 rounded-xl flex items-center justify-center hover:bg-surface-container-high transition-colors text-on-surface-variant"
            >
              <IconArrowLeft size={18} />
            </button>
            <div>
              <p className="text-sm font-semibold text-on-surface truncate max-w-[240px]">{state.fileInfo?.name}</p>
              <p className="text-xs text-on-surface-variant">
                {state.fileInfo?.width}×{state.fileInfo?.height} → {resLabels[state.videoResolution] || state.videoResolution}
                {state.fileInfo?.duration && ` · ${formatDuration(state.fileInfo.duration)}`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {state.jobStatus === 'done' && state.jobResult?.downloadUrl && (
              <a
                id="video-download-btn"
                href={state.jobResult.downloadUrl}
                download
                className="bouncy-btn flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-on-primary text-sm font-semibold shadow-lg"
              >
                <IconDownload size={16} />
                Download
              </a>
            )}
            {state.jobStatus === 'idle' && (
              <button
                id="video-start-btn"
                onClick={startUpscale}
                className="bouncy-btn flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-on-primary text-sm font-semibold shadow-lg"
              >
                <IconPlayerPlay size={16} />
                Upscale
              </button>
            )}
          </div>
        </div>

        {/* Video Player */}
        <div className="flex-1 flex items-center justify-center bg-surface-container-low/50 relative overflow-hidden">
          <video
            id="video-preview"
            ref={videoRef}
            src={videoSrc}
            className="max-w-full max-h-full rounded-xl shadow-2xl"
            playsInline
          />
          {isProcessing && <ProcessingOverlay />}
        </div>

        {/* Timeline Controls */}
        <div className="flex items-center gap-4 px-6 py-3 border-t border-outline-variant/20 bg-surface-container-lowest/60">
          <button
            id="play-pause-btn"
            onClick={togglePlay}
            className="bouncy-btn w-10 h-10 rounded-full bg-primary text-on-primary flex items-center justify-center shadow"
          >
            {isPlaying ? <IconPlayerPause size={18} /> : <IconPlayerPlay size={18} />}
          </button>

          <span className="text-xs text-on-surface-variant font-mono min-w-[40px]">
            {formatDuration(currentTime)}
          </span>

          <input
            type="range"
            min="0"
            max="100"
            value={duration ? (currentTime / duration) * 100 : 0}
            onChange={handleSeek}
            className="flex-1"
          />

          <span className="text-xs text-on-surface-variant font-mono min-w-[40px]">
            {formatDuration(duration)}
          </span>
        </div>
      </div>

      {/* Settings Sidebar */}
      <SettingsPanel mode="video" />
    </div>
  );
}
