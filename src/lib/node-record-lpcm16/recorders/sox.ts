import { RecordingOptions, RecorderResult } from "src/definitions";

const soxRecorder = (options: RecordingOptions): RecorderResult => {
  const cmd = "sox";

  let args: string[] = [
    "--default-device",
    "--no-show-progress", // show no progress
    "--rate",
    options.sampleRate.toString(), // sample rate
    "--channels",
    options.channels.toString(), // channels
    "--encoding",
    "signed-integer", // sample encoding
    "--bits",
    "16", // precision (bits)
    "--type",
    options.audioType, // audio type
    "-", // pipe
  ];

  if (options.endOnSilence) {
    const thresholdStart = options.thresholdStart || `${options.threshold}%`;
    const thresholdEnd = options.thresholdEnd || `${options.threshold}%`;
    args = args.concat([
      "silence",
      "1",
      "0.1",
      thresholdStart.toString(),
      "1",
      options.silence.toString(),
      thresholdEnd.toString(),
    ]);
  }

  const spawnOptions: { env?: NodeJS.ProcessEnv } = {};

  if (options.device) {
    spawnOptions.env = { ...process.env, AUDIODEV: options.device };
  }

  return { cmd, args, spawnOptions };
};

export default soxRecorder;
