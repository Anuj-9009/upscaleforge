import { useApp } from '../context/AppContext';
import { IconPhoto, IconVideo, IconKeyboard } from '@tabler/icons-react';

export default function TopNav() {
  const { state, dispatch } = useApp();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 header-glass">
      <div className="max-w-[1440px] mx-auto px-6 h-[72px] flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-lg">
            <span className="material-symbols-outlined text-on-primary text-[20px]">auto_awesome</span>
          </div>
          <span className="font-bold text-[18px] text-on-surface tracking-tight">UpscaleForge</span>
        </div>

        {/* Mode Toggle */}
        <div className="flex items-center bg-surface-container rounded-full p-1 gap-0.5">
          <button
            id="mode-image-btn"
            onClick={() => dispatch({ type: 'SET_MODE', payload: 'image' })}
            className={`bouncy-btn flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
              state.mode === 'image'
                ? 'bg-primary-container text-on-primary-container shadow-sm'
                : 'text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            <IconPhoto size={18} stroke={2} />
            Image
          </button>
          <button
            id="mode-video-btn"
            onClick={() => dispatch({ type: 'SET_MODE', payload: 'video' })}
            className={`bouncy-btn flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-colors ${
              state.mode === 'video'
                ? 'bg-primary-container text-on-primary-container shadow-sm'
                : 'text-on-surface-variant hover:bg-surface-container-high'
            }`}
          >
            <IconVideo size={18} stroke={2} />
            Video
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <button
            id="shortcuts-btn"
            onClick={() => dispatch({ type: 'TOGGLE_SHORTCUTS' })}
            className="bouncy-btn w-10 h-10 rounded-xl flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors"
            title="Keyboard Shortcuts"
          >
            <IconKeyboard size={20} stroke={1.5} />
          </button>
        </div>
      </div>
    </header>
  );
}
