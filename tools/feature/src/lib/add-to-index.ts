import { joinPathFragments, Tree } from "@nx/devkit";
import { FeatureSchema, Normalized } from "./feature";
import { filterMiscOptions } from "./add-misc-file";

export type Filtered<A, T> = Pick<A, Extract<keyof A, T>>;

const asExportText = (filePath: string) => {
  return filePath ? `export * from './${filePath}';` : "";
}

function joinText(lines: string[]) {
  return lines.filter(Boolean).sort().join("\n");
}

export function addToIndex(host: Tree, options: Normalized<FeatureSchema>) {


  const indexFile = joinPathFragments(
    options.indexPath,
    "index.ts",
  )

  const exportTexts = []

  if (!options.skipExport) {
    exportTexts.push(asExportText(options.filePath))
  }


  filterMiscOptions(options)
    .map(option => asExportText(`utils/${option}`))
    .forEach(line => exportTexts.push(line));

  if (!host.exists(indexFile)) {
    host.write(indexFile, joinText(exportTexts));
    return;
  }

  let indexSource = host.read(indexFile, "utf-8");
  const indexSourceLines = new Set(indexSource.split("\n"));

  exportTexts.forEach(text => indexSourceLines.add(text));
  indexSource = joinText([...indexSourceLines])
  host.write(indexFile, indexSource);
}
