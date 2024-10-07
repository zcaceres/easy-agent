import { RecordingOptions, RecorderResult } from "src/definitions";

const arecordRecorder = (options: RecordingOptions): RecorderResult => {
  const cmd = 'arecord';

  const args: string[] = [
    '-q', // show no progress
    '-r', options.sampleRate.toString(), // sample rate
    '-c', options.channels.toString(), // channels
    '-t', options.audioType, // audio type
    '-f', 'S16_LE', // Sample format
    '-' // pipe
  ];

  if (options.device) {
    args.unshift('-D', options.device);
  }

  return { cmd, args };
};

export default arecordRecorder;
