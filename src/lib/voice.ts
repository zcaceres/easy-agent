// @ts-ignore
import recorder from "node-record-lpcm16";
import fs from "fs";
import { SpeechClient } from "@google-cloud/speech";
import UI from "./ui";

const TIMEOUT_ONE_MIN_IN_SECONDS = 59500;
const SAMPLE_RATE_HERTZ = 16000;
const TMP_FILE_PATH = "voice-tmp.wav";
const LANGUAGE_CODE = "en-US";

class VoiceInterface {
  private client: SpeechClient;

  private constructor() {
    this.client = new SpeechClient();
  }

  createRecorder() {
    return recorder.record({
      sampleRate: SAMPLE_RATE_HERTZ,
      channels: 1,
      // verbose: true,
      audioType: "wav",
      recordProgram: "sox",
    });
  }

  createTmpFile() {
    return fs.createWriteStream(TMP_FILE_PATH, {
      encoding: "binary",
    });
  }

  async getTranscript() {
    const request = {
      audio: {
        content: fs.readFileSync(TMP_FILE_PATH).toString("base64"),
      },
      config: {
        encoding: "LINEAR16" as const,
        sampleRateHertz: SAMPLE_RATE_HERTZ,
        languageCode: LANGUAGE_CODE,
      },
      interimResults: false,
    };
    const [response] = await this.client.recognize(request);
    return response
      .results!.map((result) => result.alternatives![0].transcript)
      .join("\n");
  }

  async transcribeAudio(): Promise<string> {
    return new Promise((resolve, reject) => {
      UI.green(
        "Press SPACEBAR to start recording. Press ENTER to stop recording.",
      );

      let recording: any;
      let tmpFile: fs.WriteStream;
      let timeout: NodeJS.Timeout;

      const startRecording = () => {
        UI.green("Press Enter to stop recording.");
        recording = this.createRecorder();
        tmpFile = this.createTmpFile();

        recording
          .stream()
          .pipe(tmpFile)
          .on("error", (err: any) => reject(err));

        tmpFile
          .on("finish", async () => {
            UI.green("Transcribing...");
            const transcription = await this.getTranscript();
            resolve(transcription);
          })
          .on("error", (err: any) => reject(err));

        timeout = setTimeout(() => {
          UI.red("Recording stopped after 60 seconds...");
          stopRecording();
        }, TIMEOUT_ONE_MIN_IN_SECONDS);
      };

      const stopRecording = () => {
        if (recording) {
          clearTimeout(timeout);
          recording.stop();
          tmpFile.end();
        }
        process.stdin.setRawMode(false);
        process.stdin.pause();
      };

      const handleKeyPress = (key: Buffer) => {
        if (key.toString() === " " && !recording) {
          startRecording();
        } else if (
          (key.toString() === "\r" || key.toString() === "\n") &&
          recording
        ) {
          stopRecording();
        } else if (key.toString() === "\u0003") {
          console.log("\nCtrl+C pressed. Exiting...");
          stopRecording();
          process.stdin.removeListener("data", handleKeyPress);
          process.exit();
        }
      };

      process.stdin.setRawMode(true);
      process.stdin.resume();
      process.stdin.on("data", handleKeyPress);

      process.on("SIGINT", () => {
        console.log("\nCtrl+C pressed. Exiting...");
        stopRecording();
        process.stdin.removeListener("data", handleKeyPress);
        process.exit();
      });
    });
  }

  static async create() {
    return new VoiceInterface();
  }
}

export default VoiceInterface;
