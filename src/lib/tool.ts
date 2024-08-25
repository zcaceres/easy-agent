import type { ToolArg, ToolConfig, ToolDefinition } from "src/definitions";

class Tool {
  definition: ToolDefinition;
  private fn: (...args: any[]) => Promise<string>;

  private constructor({ name, description, inputs, fn }: ToolConfig) {
    this.definition = {
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

  async callFn(...args: any) {
    const results = await this.fn(...args);
    return results as unknown;
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
