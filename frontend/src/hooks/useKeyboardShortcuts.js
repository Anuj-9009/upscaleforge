import { useEffect, useCallback } from 'react';
import { useApp } from '../context/AppContext';

export function useKeyboardShortcuts() {
  const { state, dispatch, startUpscale } = useApp();

  const handleKeyDown = useCallback((e) => {
    const isMod = e.metaKey || e.ctrlKey;

    // ⌘O / Ctrl+O — Open file picker
    if (isMod && e.key === 'o') {
      e.preventDefault();
      const input = document.getElementById('file-input');
      if (input) input.click();
    }

    // ⌘1 — Switch to Image mode
    if (isMod && e.key === '1') {
      e.preventDefault();
      dispatch({ type: 'SET_MODE', payload: 'image' });
    }

    // ⌘2 — Switch to Video mode
    if (isMod && e.key === '2') {
      e.preventDefault();
      dispatch({ type: 'SET_MODE', payload: 'video' });
    }

    // Space — Play/pause video
    if (e.key === ' ' && state.mode === 'video' && state.view === 'workspace') {
      e.preventDefault();
      const video = document.getElementById('video-preview');
      if (video) video.paused ? video.play() : video.pause();
    }

    // ⌘Enter — Start upscaling
    if (isMod && e.key === 'Enter' && state.file && state.jobStatus === 'idle') {
      e.preventDefault();
      startUpscale();
    }

    // Escape — Close modals
    if (e.key === 'Escape') {
      if (state.showShortcuts) dispatch({ type: 'TOGGLE_SHORTCUTS' });
    }

    // ⌘D — Download
    if (isMod && e.key === 'd' && state.jobStatus === 'done' && state.jobResult?.downloadUrl) {
      e.preventDefault();
      const a = document.createElement('a');
      a.href = state.jobResult.downloadUrl;
      a.download = '';
      a.click();
    }
  }, [state, dispatch, startUpscale]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);
}
