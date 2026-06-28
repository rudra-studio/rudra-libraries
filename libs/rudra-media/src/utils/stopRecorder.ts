export interface stopRecorderProps {
  recorder: MediaRecorder
}
const stopRecorder = ({recorder}: stopRecorderProps) => {
  if (recorder.state !== 'inactive') {
    recorder.stop();
  }
};

export default stopRecorder;