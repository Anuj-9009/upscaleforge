import { useApp } from '../context/AppContext';

export default function HiddenFileInput() {
  const { state, dispatch } = useApp();

  const imageFormats = '.jpg,.jpeg,.png,.webp,.heic,.tiff,.bmp,.avif';
  const videoFormats = '.mp4,.mov,.mkv,.avi,.webm';

  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);

    if (state.mode === 'image') {
      const img = new Image();
      img.onload = () => {
        dispatch({
          type: 'SET_FILE',
          payload: {
            file,
            previewUrl,
            info: { name: file.name, size: file.size, width: img.width, height: img.height },
          },
        });
      };
      img.src = previewUrl;
    } else {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        dispatch({
          type: 'SET_FILE',
          payload: {
            file,
            previewUrl,
            info: {
              name: file.name,
              size: file.size,
              width: video.videoWidth,
              height: video.videoHeight,
              duration: video.duration,
            },
          },
        });
      };
      video.src = previewUrl;
    }

    // Reset input so re-selecting the same file fires onChange
    e.target.value = '';
  };

  return (
    <input
      id="file-input"
      type="file"
      className="hidden"
      accept={state.mode === 'image' ? imageFormats : videoFormats}
      onChange={handleChange}
    />
  );
}
