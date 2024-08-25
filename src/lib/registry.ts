import type { NormalizedName } from "src/definitions";
import type Agent from "src/lib/agent";
import type Tool from "src/lib/tool";

export abstract class Registry {
  abstract list(): NormalizedName[];
  abstract exists(name: string): boolean;
  abstract get(name: string): Agent | null;

  static create(_itemsToRegister: Agent[] | Tool[]): Registry {
    // Implementation of the static method
    // This method should return an instance of a concrete class that extends Registry
    throw new Error("Method not implemented.");
  }
}
