import { RecorderResult, RecordingOptions } from "src/definitions";

const recRecorder = (options: RecordingOptions): RecorderResult => {
  const cmd = "rec";

  let args: string[] = [
    "-q", // show no progress
    "-r",
    options.sampleRate.toString(), // sample rate
    "-c",
    options.channels.toString(), // channels
    "-e",
    "signed-integer", // sample encoding
    "-b",
    "16", // precision (bits)
    "-t",
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
      options.silence?.toString() ?? "1.0",
      thresholdEnd.toString(),
    ]);
  }

  return { cmd, args };
};

export default recRecorder;
