import type { ToolArg, ToolConfig, ToolDefinition } from "src/definitions";

class Tool {
  private _definition: ToolDefinition;
  private fn: (...args: any[]) => Promise<any>;

  private constructor({ name, description, inputs, fn }: ToolConfig) {
    this._definition = {
      name: name,
      description: description,
      input_schema: {
        type: "object",
        properties: this.generateInputSchema(inputs),
        required: inputs
          .filter((input) => input.required)
          .map((input) => input.name),
      },
    };
    this.fn = fn;
  }

  get definition() {
    return this._definition;
  }

  private generateInputSchema(toolInputs: ToolArg[]) {
    const properties: Record<string, any> = {};
    toolInputs.forEach((input) => {
      properties[input.name] = {
        type: input.type,
        description: input.description,
      };
    });
    return properties;
  }

  async callFn(...args: any): Promise<any> {
    const results = await this.fn(...args);
    return results;
  }

  static create(config: ToolConfig) {
    return new Tool(config);
  }

  static mocked() {
    return new Tool({
      name: "mockedTool",
      description: "A mocked tool",
      inputs: [
        {
          name: "mockedInput",
          type: "string",
          description: "A mocked input",
          required: true,
        },
      ],
      fn: async () => "mocked result",
    });
  }
}

export default Tool;
