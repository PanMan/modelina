// npx ts-node modelina.ts
import { TypeScriptGenerator } from "../../src";
import path from "path";
import YAML from "yamljs";
import { readdirSync, rmSync, writeFileSync } from "fs";

const TYPE_OUTPUT_DIR = path.join(__dirname, "../types/mqtt/");

const cleanDir = (dir: string) => {
  if (!dir) {
    return;
  }
  readdirSync(dir).forEach((f) => rmSync(`${dir}/${f}`));
};

const generator = new TypeScriptGenerator({
  modelType: "interface",
});

export async function generate(): Promise<void> {
  // Delete all files in dir, so we have no old ones around if we change names etc
  cleanDir(TYPE_OUTPUT_DIR);

  const asyncApi = YAML.load(
    path.join(__dirname, "../spec/schemas/asyncapi.yaml")
  );

  const completeModels = await generator.generateCompleteModels(asyncApi, {
    exportType: "named",
  });

  for (const model of completeModels) {
    console.log("generating model", model.modelName);

    // write result to modelName.ts
    writeFileSync(TYPE_OUTPUT_DIR + model.modelName + ".ts", model.result);
  }
}
generate();
