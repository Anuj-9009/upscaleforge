import { useApp } from '../context/AppContext';

export default function ProcessingOverlay() {
  const { state } = useApp();

  return (
    <div className="absolute inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-10">
      <div className="glass-card rounded-3xl p-8 max-w-sm w-full mx-6 text-center">
        {/* Animated spinner */}
        <div className="relative w-20 h-20 mx-auto mb-6">
          <svg className="w-full h-full animate-spin" viewBox="0 0 80 80">
            <circle
              cx="40" cy="40" r="34"
              fill="none"
              stroke="rgba(0,110,32,0.15)"
              strokeWidth="6"
            />
            <circle
              cx="40" cy="40" r="34"
              fill="none"
              stroke="#006e20"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 34}`}
              strokeDashoffset={`${2 * Math.PI * 34 * (1 - state.jobProgress / 100)}`}
              className="transition-all duration-500 ease-out"
              transform="rotate(-90 40 40)"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-bold text-primary">{Math.round(state.jobProgress)}%</span>
          </div>
        </div>

        <h3 className="text-base font-bold text-on-surface mb-1">{state.jobStage || 'Processing...'}</h3>

        {/* Progress bar */}
        <div className="w-full h-1.5 rounded-full bg-surface-container-high mt-4 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-emerald-400 transition-all duration-500 ease-out"
            style={{ width: `${state.jobProgress}%` }}
          />
        </div>

        {/* Logs */}
        {state.jobLogs.length > 0 && (
          <div className="mt-4 max-h-32 overflow-y-auto custom-scrollbar text-left">
            {state.jobLogs.slice(-6).map((log, i) => (
              <p key={i} className="text-[10px] text-on-surface-variant/70 font-mono leading-relaxed truncate">
                {log}
              </p>
            ))}
          </div>
        )}

        {state.jobStatus === 'error' && (
          <div className="mt-4 px-3 py-2 rounded-xl bg-error-container/60">
            <p className="text-xs text-on-error-container font-medium">{state.jobStage}</p>
          </div>
        )}
      </div>
    </div>
  );
}
