import { RecorderResult, RecordingOptions } from "src/definitions";
import recRecorder from "./rec";
import arecordRecorder from "./arecord";
import soxRecorder from "./sox";

type RecorderFunction = (options: RecordingOptions) => RecorderResult;

const recorders: { [key: string]: RecorderFunction } = {
  rec: recRecorder,
  arecord: arecordRecorder,
  sox: soxRecorder,
};

function load(recorderName: string): RecorderFunction {
  const recorder = recorders[recorderName];
  if (!recorder) {
    throw new Error(`No such recorder found: ${recorderName}`);
  }
  return recorder;
}

export default {
  load,
};
