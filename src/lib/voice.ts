// @ts-ignore
import recorder from "node-record-lpcm16";
import fs from "fs";
import { SpeechClient } from "@google-cloud/speech";
import UI from "./ui";

const TIMEOUT_ONE_MIN_IN_SECONDS = 59500;

class VoiceInterface {
  private client: SpeechClient;

  private constructor() {
    this.client = new SpeechClient();
  }

  async transcribeAudio(): Promise<string> {
    return new Promise((resolve, reject) => {
      UI.green("Listening. Press Enter to stop recording.");

      let recording = recorder.record({
        sampleRate: 16000,
        channels: 1,
        verbose: true,
        audioType: "wav",
        recordProgram: "rec",
        // endOnSilence: true,
        // silence: "2.0",
      });

      let tmpFile = fs
        .createWriteStream("voice-tmp.wav", {
          encoding: "binary",
        })
        .on("finish", async () => {
          const request = {
            audio: {
              content: fs.readFileSync("voice-tmp.wav").toString("base64"),
            },
            config: {
              encoding: "LINEAR16" as const,
              sampleRateHertz: 16000,
              languageCode: "en-US",
            },
            interimResults: false,
          };
          const [response] = await this.client.recognize(request);
          const transcription = response
            .results!.map((result) => result.alternatives![0].transcript)
            .join("\n");
          resolve(transcription);
        });

      recording.stream().pipe(tmpFile).on("error", console.error);

      process.stdin.setRawMode(true);
      process.stdin.resume();
      // TODO: I think this is getting registered over a nd over again each time this function is called
      process.stdin.on("data", (key) => {
        if (key.toString() === "\r" || key.toString() === "\u0003") {
          console.log("\nStopping recording...");
          recording.stop();
          tmpFile.end();
          process.stdin.pause();
          if (key.toString() === "\u0003") {
            process.exit();
          }
        }
      });
      if (
        !process.stdin
          .listeners("data")
          .some((listener) => listener.name === "stopRecordingHandler")
      ) {
        const stopRecordingHandler = (key: Buffer) => {
          if (key.toString() === "\r" || key.toString() === "\u0003") {
            console.log("\nStopping recording...");
            recording.stop();
            tmpFile.end();
            process.stdin.pause();
            if (key.toString() === "\u0003") {
              process.exit();
            }
          }
        };
        process.stdin.on("data", stopRecordingHandler);
      }

      setTimeout(() => {
        UI.red("Recording timed out after 60 seconds. Stopping recording...");
        recording.stop();
        tmpFile.end();
      }, TIMEOUT_ONE_MIN_IN_SECONDS);
    });
  }

  static async create() {
    return new VoiceInterface();
  }
}

export default VoiceInterface;
