// @ts-ignore
import recorder from "node-record-lpcm16";
import fs from "fs";
import { SpeechClient } from "@google-cloud/speech";
import UI from "./ui";

const tmpFile = fs.createWriteStream("test.wav", { encoding: "binary" });

class VoiceInterface {
  private client: SpeechClient;

  private constructor() {
    this.client = new SpeechClient();
  }

  async transcribeAudio(): Promise<string> {
    return new Promise((resolve, _reject) => {
      const request = {
        config: {
          encoding: "LINEAR16" as const,
          sampleRateHertz: 16000,
          languageCode: "en-US",
        },
        interimResults: false,
      };

      UI.green("Listening, please speak...");

      const recognizeStream = this.client
        .streamingRecognize(request)
        .on("data", (data) => {
          console.log("data", data);
          // if (data.results[0] && data.results[0].alternatives[0]) {
          // const transcription = data.results[0].alternatives[0].transcript;
          // console.log(`Transcription: ${transcription}`);
          // recorder.stop();
          // resolve(transcription);
          // }
        })
        .on("error", console.error)
        .on("end", () => {
          console.log("Recognition stream ended");
        });

      // fs.createReadStream("test.wav")
      //   .on("data", () => console.log("data"))
      //   .on("error", (err) => console.log("error", err))
      //   .pipe(recognizeStream);

      recorder
        .record({
          sampleRateHertz: 16000,
          threshold: 0,
          verbose: true,
          // endOnSilence: true,
          recordProgram: "rec",
          // silence: "2.0",
        })
        .stream()
        // .on("data", (data: any) => console.log("data", data))
        .on("error", console.error)
        .pipe(recognizeStream);
    });
  }

  static async create() {
    return new VoiceInterface();
  }
}

export default VoiceInterface;
