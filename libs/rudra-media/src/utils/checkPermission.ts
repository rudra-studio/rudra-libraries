const checkPermissions = async (): Promise<boolean> => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    // Immediately stop the tracks so we don't leave the camera light on
    stream.getTracks().forEach((track) => track.stop());
    return true;
  } catch {
    return false;
  }
};

export default checkPermissions;