
export interface requestStreamProps {
  constraints: MediaStreamConstraints
}
const requestStream = async ({ constraints }: requestStreamProps): Promise<MediaStream> => {
  return await navigator.mediaDevices.getUserMedia(constraints);
};

export default requestStream;