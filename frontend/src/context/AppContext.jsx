import { createContext, useContext, useReducer, useCallback, useRef, useEffect } from 'react';

const AppContext = createContext(null);

const initialState = {
  mode: 'image',           // 'image' | 'video'
  view: 'dashboard',       // 'dashboard' | 'workspace'

  // Hardware
  hardwareTier: 'cpu',     // 'gpu' | 'cpu'
  gpuName: 'none',

  // File
  file: null,
  filePreviewUrl: null,
  fileInfo: null,           // { name, size, width, height, duration, fps, codec }

  // Image settings
  imageScale: '4x',
  imageCustomScale: 4,
  imageModel: 'realesrgan',
  imageDeblocking: false,
  imageFaceEnhance: false,
  imageOutputFormat: 'png',
  imageOutputQuality: 95,

  // Video settings
  videoResolution: '4k',
  videoModel: 'basicvsr',
  videoFrameInterpolation: false,
  videoTargetFps: 60,
  videoCrf: 18,
  videoDeblocking: false,
  videoFaceEnhance: false,
  videoOutputFormat: 'mp4',

  // Processing
  jobId: null,
  jobStatus: 'idle',      // 'idle' | 'uploading' | 'processing' | 'done' | 'error'
  jobProgress: 0,
  jobStage: '',
  jobLogs: [],
  jobResult: null,         // { downloadUrl, outputSize, processingTime }

  // Queue
  queue: [],

  // Comparison
  comparisonSliderPos: 50,

  // Keyboard shortcuts modal
  showShortcuts: false,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_MODE':
      return { ...state, mode: action.payload, view: 'dashboard', file: null, filePreviewUrl: null, fileInfo: null, jobStatus: 'idle', jobProgress: 0, jobLogs: [], jobResult: null };

    case 'SET_VIEW':
      return { ...state, view: action.payload };

    case 'SET_FILE': {
      const { file, previewUrl, info } = action.payload;
      return { ...state, file, filePreviewUrl: previewUrl, fileInfo: info, view: 'workspace', jobStatus: 'idle', jobProgress: 0, jobLogs: [], jobResult: null };
    }

    case 'CLEAR_FILE':
      return { ...state, file: null, filePreviewUrl: null, fileInfo: null, view: 'dashboard', jobStatus: 'idle', jobProgress: 0, jobLogs: [], jobResult: null };

    // Image settings
    case 'SET_IMAGE_SCALE':
      return { ...state, imageScale: action.payload };
    case 'SET_IMAGE_CUSTOM_SCALE':
      return { ...state, imageCustomScale: action.payload };
    case 'SET_IMAGE_MODEL':
      return { ...state, imageModel: action.payload };
    case 'SET_IMAGE_DEBLOCKING':
      return { ...state, imageDeblocking: action.payload };
    case 'SET_IMAGE_FACE_ENHANCE':
      return { ...state, imageFaceEnhance: action.payload };
    case 'SET_IMAGE_OUTPUT_FORMAT':
      return { ...state, imageOutputFormat: action.payload };
    case 'SET_IMAGE_OUTPUT_QUALITY':
      return { ...state, imageOutputQuality: action.payload };

    // Video settings
    case 'SET_VIDEO_RESOLUTION':
      return { ...state, videoResolution: action.payload };
    case 'SET_VIDEO_MODEL':
      return { ...state, videoModel: action.payload };
    case 'SET_VIDEO_FRAME_INTERPOLATION':
      return { ...state, videoFrameInterpolation: action.payload };
    case 'SET_VIDEO_TARGET_FPS':
      return { ...state, videoTargetFps: action.payload };
    case 'SET_VIDEO_CRF':
      return { ...state, videoCrf: action.payload };
    case 'SET_VIDEO_DEBLOCKING':
      return { ...state, videoDeblocking: action.payload };
    case 'SET_VIDEO_FACE_ENHANCE':
      return { ...state, videoFaceEnhance: action.payload };
    case 'SET_VIDEO_OUTPUT_FORMAT':
      return { ...state, videoOutputFormat: action.payload };

    // Job lifecycle
    case 'JOB_START':
      return { ...state, jobId: action.payload, jobStatus: 'uploading', jobProgress: 0, jobStage: 'Uploading...', jobLogs: [] };
    case 'JOB_PROGRESS':
      return { ...state, jobStatus: 'processing', jobProgress: action.payload.progress, jobStage: action.payload.stage, jobLogs: [...state.jobLogs, action.payload.log].filter(Boolean) };
    case 'JOB_DONE':
      return { ...state, jobStatus: 'done', jobProgress: 100, jobStage: 'Complete', jobResult: action.payload };
    case 'JOB_ERROR':
      return { ...state, jobStatus: 'error', jobStage: action.payload };

    // Queue
    case 'QUEUE_ADD':
      return { ...state, queue: [...state.queue, action.payload] };
    case 'QUEUE_REMOVE':
      return { ...state, queue: state.queue.filter(q => q.id !== action.payload) };
    case 'QUEUE_UPDATE':
      return { ...state, queue: state.queue.map(q => q.id === action.payload.id ? { ...q, ...action.payload } : q) };

    // UI
    case 'SET_COMPARISON_SLIDER':
      return { ...state, comparisonSliderPos: action.payload };
    case 'TOGGLE_SHORTCUTS':
      return { ...state, showShortcuts: !state.showShortcuts };
    case 'SET_HARDWARE':
      return { ...state, hardwareTier: action.payload.tier, gpuName: action.payload.gpu };

    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const wsRef = useRef(null);

  const startUpscale = useCallback(async () => {
    if (!state.file) return;

    const formData = new FormData();
    formData.append('file', state.file);

    const endpoint = state.mode === 'image' ? '/api/upscale/image' : '/api/upscale/video';

    const settings = state.mode === 'image'
      ? {
          scale: state.imageScale === 'custom' ? state.imageCustomScale : parseInt(state.imageScale),
          model: state.imageModel,
          deblocking: state.imageDeblocking,
          face_enhance: state.imageFaceEnhance,
          output_format: state.imageOutputFormat,
          quality: state.imageOutputQuality,
        }
      : {
          resolution: state.videoResolution,
          model: state.videoModel,
          frame_interpolation: state.videoFrameInterpolation,
          target_fps: state.videoTargetFps,
          crf: state.videoCrf,
          deblocking: state.videoDeblocking,
          face_enhance: state.videoFaceEnhance,
          output_format: state.videoOutputFormat,
        };

    formData.append('settings', JSON.stringify(settings));

    dispatch({ type: 'JOB_START', payload: Date.now().toString(36) });

    try {
      const res = await fetch(endpoint, { method: 'POST', body: formData });
      if (!res.ok) throw new Error(`Upload failed: ${res.statusText}`);
      const data = await res.json();
      const jobId = data.job_id;

      // Connect WebSocket for progress
      const wsUrl = `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.host}/ws/progress/${jobId}`;
      if (wsRef.current) wsRef.current.close();
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.status === 'processing') {
          dispatch({ type: 'JOB_PROGRESS', payload: { progress: msg.progress, stage: msg.stage, log: msg.log } });
        } else if (msg.status === 'done') {
          dispatch({ type: 'JOB_DONE', payload: { downloadUrl: msg.download_url, outputSize: msg.output_size, processingTime: msg.processing_time } });
          ws.close();
        } else if (msg.status === 'error') {
          dispatch({ type: 'JOB_ERROR', payload: msg.message });
          ws.close();
        }
      };
      ws.onerror = () => {
        dispatch({ type: 'JOB_ERROR', payload: 'WebSocket connection lost' });
      };
    } catch (err) {
      dispatch({ type: 'JOB_ERROR', payload: err.message });
    }
  }, [state]);

  // Fetch hardware and health info on mount
  useEffect(() => {
    async function fetchHealth() {
      try {
        const res = await fetch('/api/health');
        if (res.ok) {
          const data = await res.json();
          dispatch({
            type: 'SET_HARDWARE',
            payload: {
              tier: data.gpu !== 'none' ? 'gpu' : 'cpu',
              gpu: data.gpu,
            }
          });
        }
      } catch (err) {
        console.error("Failed to fetch hardware tier", err);
      }
    }
    fetchHealth();
  }, []);

  // Cleanup WebSocket on unmount
  useEffect(() => {
    return () => { if (wsRef.current) wsRef.current.close(); };
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch, startUpscale }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
