import {NormalizedSchema} from "../schema";
import {readNxJson, Tree, updateNxJson} from "@nx/devkit";

export function setDefaults(host: Tree, options: NormalizedSchema) {
  const nxJson = readNxJson(host);

  nxJson.generators ??= {};
  nxJson.generators['@dcat23/next-starter'] ??= {};
  nxJson.generators['@dcat23/next-starter'].preset ??= {};
  nxJson.generators['@dcat23/next-starter'].preset.style ??= options.style;
  nxJson.generators['@dcat23/next-starter'].preset.linter ??= options.linter;

  updateNxJson(host, nxJson);
}
