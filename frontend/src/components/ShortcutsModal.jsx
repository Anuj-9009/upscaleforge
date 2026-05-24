import { useApp } from '../context/AppContext';

const shortcuts = [
  { keys: ['⌘', 'O'], action: 'Open file picker' },
  { keys: ['⌘', '1'], action: 'Switch to Image mode' },
  { keys: ['⌘', '2'], action: 'Switch to Video mode' },
  { keys: ['Space'], action: 'Play / pause video preview' },
  { keys: ['⌘', 'Enter'], action: 'Start upscaling' },
  { keys: ['Escape'], action: 'Cancel active modal' },
  { keys: ['⌘', 'D'], action: 'Download completed output' },
];

export default function ShortcutsModal() {
  const { dispatch } = useApp();

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={() => dispatch({ type: 'TOGGLE_SHORTCUTS' })}
    >
      <div
        className="glass-panel rounded-3xl p-8 max-w-md w-full mx-6 view-enter"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-on-surface">Keyboard Shortcuts</h2>
          <button
            onClick={() => dispatch({ type: 'TOGGLE_SHORTCUTS' })}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-surface-container-high transition-colors text-on-surface-variant"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="space-y-3">
          {shortcuts.map((s) => (
            <div key={s.action} className="flex items-center justify-between py-1.5">
              <span className="text-sm text-on-surface">{s.action}</span>
              <div className="flex gap-1">
                {s.keys.map((k) => (
                  <kbd
                    key={k}
                    className="px-2 py-1 rounded-lg bg-surface-container-high text-xs font-mono text-on-surface-variant min-w-[28px] text-center"
                  >
                    {k}
                  </kbd>
                ))}
              </div>
            </div>
          ))}
        </div>

        <p className="text-[10px] text-on-surface-variant/50 mt-6 text-center">
          Use Ctrl instead of ⌘ on Windows/Linux
        </p>
      </div>
    </div>
  );
}
