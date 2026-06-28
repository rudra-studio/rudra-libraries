
export interface createRecorderProps {
  stream: MediaStream,
  onDataAvailable: (blob: Blob) => void
}

const createRecorder = (stream: MediaStream, onDataAvailable: (blob: Blob) => void) => {
  const chunks: Blob[] = [];
  const recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });

  recorder.ondataavailable = (event) => {
    if (event.data.size > 0) chunks.push(event.data);
  };

  recorder.onstop = () => {
    const blob = new Blob(chunks, { type: 'video/webm' });
    onDataAvailable(blob);
  };

  return recorder;
};

export default createRecorder;