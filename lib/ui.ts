import colors from "colors";
import * as readline from "readline";
import type { SessionHistoryEntry } from "definitions";
import Logger from "lib/logger";

export default class UI {
  static async promptForUserInput(
    promptText: string,
    sendCommand: string | null = null,
    endCommand: string = "/bye"
  ) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    return new Promise<string>((resolve, _reject) => {
      let prmpt = `${promptText}`;
      prmpt += `(${
        sendCommand ? `Type ${sendCommand}` : "Press enter"
      } to send message or ${endCommand} to exit)`;

      this.yellow(prmpt);

      rl.prompt();

      let buffer = "";
      let timeout: Timer | null = null;

      rl.on("line", function (line: string) {
        if (line === "") {
          return;
        }

        if (line === endCommand) {
          rl.close();
          process.exit(0);
        }

        buffer += line + "\n";

        if (timeout) {
          clearTimeout(timeout);
        }

        timeout = setTimeout(() => {
          resolve(buffer.trim());
          rl.close();
        }, 100);
      });
    });
  }

  static green(txt: string) {
    console.log(colors.green(txt));
  }

  static blue(txt: string) {
    console.log(colors.blue(txt));
  }

  static yellow(txt: string) {
    console.log(colors.yellow(txt));
  }

  static red(txt: string) {
    console.error(colors.red(txt));
  }

  static render(msg: SessionHistoryEntry) {
    for (const content of msg.content) {
      if (content.type === "text") {
        if (msg.role === "assistant") {
          this.green(`${content.text}`);
        }
        if (msg.role === "user") {
          this.blue(`${content.text}`);
        }
      }
    }
    Logger.debug(JSON.stringify(msg.content));
  }
}
