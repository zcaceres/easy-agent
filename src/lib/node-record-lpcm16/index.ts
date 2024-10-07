import { spawn, ChildProcess } from "child_process";
import { Readable } from "stream";
import assert from "assert";
import debug from "debug";
import recorders from "./recorders";
import { RecordingOptions, RecordingOptionsOverrides } from "src/definitions";

const log = debug("record");

export class Recording {
  private options: RecordingOptions;
  private cmd: string;
  private args: string[];
  private cmdOptions: Record<string, any>;
  private process?: ChildProcess;
  private _stream?: Readable;

  constructor(options: RecordingOptionsOverrides = {}) {
    const defaults: RecordingOptions = {
      sampleRate: 16000,
      channels: 1,
      compress: false,
      threshold: 0.5,
      thresholdStart: null,
      thresholdEnd: null,
      silence: "1.0",
      recorder: "sox",
      endOnSilence: false,
      audioType: "wav",
      device: undefined,
    };

    this.options = { ...defaults, ...options };

    const recorder = recorders.load(this.options.recorder);
    const { cmd, args, spawnOptions = {} } = recorder(this.options);

    this.cmd = cmd;
    this.args = args;
    this.cmdOptions = { encoding: "binary", stdio: "pipe", ...spawnOptions };

    log(`Started recording`);
    log(this.options);
    log(` ${this.cmd} ${this.args.join(" ")}`);

    return this.start();
  }

  start(): this {
    const { cmd, args, cmdOptions } = this;

    const cp = spawn(cmd, args, cmdOptions);
    const rec = cp.stdout as Readable;
    const err = cp.stderr as Readable;

    this.process = cp;
    this._stream = rec;

    cp.on("close", (code: number) => {
      if (code === 0) return;
      rec.emit(
        "error",
        `${this.cmd} has exited with error code ${code}.

Enable debugging with the environment variable DEBUG=record.`,
      );
    });

    err.on("data", (chunk: Buffer) => {
      log(`STDERR: ${chunk}`);
    });

    rec.on("data", (chunk: Buffer) => {
      log(`Recording ${chunk.length} bytes`);
    });

    rec.on("end", () => {
      log("Recording ended");
    });

    return this;
  }

  stop(): void {
    assert(this.process, "Recording not yet started");
    this.process.kill();
  }

  pause(): void {
    assert(this.process, "Recording not yet started");
    this.process.kill("SIGSTOP");
    this._stream?.pause();
    log("Paused recording");
  }

  resume(): void {
    assert(this.process, "Recording not yet started");
    this.process.kill("SIGCONT");
    this._stream?.resume();
    log("Resumed recording");
  }

  isPaused(): boolean {
    assert(this._stream, "Recording not yet started");
    return this._stream.isPaused();
  }

  stream(): Readable {
    assert(this._stream, "Recording not yet started");
    return this._stream;
  }
}

export const record = (...args: ConstructorParameters<typeof Recording>) =>
  new Recording(...args);

export default {
  record,
};
