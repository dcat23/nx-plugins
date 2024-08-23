import {NormalizedSchema} from "../schema";
import {readNxJson, Tree, updateNxJson} from "@nx/devkit";

export function setDefaults(host: Tree, options: NormalizedSchema) {
  const nxJson = readNxJson(host);

  nxJson.generators ??= {};
  nxJson.generators['@dcat23/next-start'] ??= {};
  nxJson.generators['@dcat23/next-start'].application ??= {};
  nxJson.generators['@dcat23/next-start'].application.style ??= options.style;
  nxJson.generators['@dcat23/next-start'].application.linter ??= options.linter;

  updateNxJson(host, nxJson);
}
