import { FeatureSchema, MiscType, Normalized } from "./feature";
import { joinPathFragments, Tree } from "@nx/devkit";
import { Filtered } from "./add-to-index";

const helperText = (options: Normalized<FeatureSchema>) => {
  return `export function ${options.noPrefixPropertyName}Helper() {
  throw new Error("not implemented");
}
`}

const typeText = (options: Normalized<FeatureSchema>) => {
  return `export interface ${options.noPrefixClassName} {}`
}

const constantText = (options: Normalized<FeatureSchema>) => {
  return `export const ${options.noPrefixConstantName} = null`;
}

const mapperText = (options: Normalized<FeatureSchema>) =>{
  return `export function mapTo${options.noPrefixClassName}(data: any): ${options.noPrefixClassName} {
  
  return {
    ...data,
  }
}
`
}

export function isMiscType(key: string): key is MiscType {
  return ["types", "helper", "mapper", "constant"].includes(key);
}

function addMiscFile(host: Tree, options: Normalized<FeatureSchema>, name: MiscType) {

  const miscText: Record<MiscType, string> = {
    constant: constantText(options),
    helper: helperText(options),
    mapper: mapperText(options),
    types: typeText(options)
  }

  const file = joinPathFragments(
    options.indexPath,
    `${name}.ts`,
  )

  const text = miscText[name]

  if (!host.exists(file)) {
    host.write(file, text)
    return;
  }

  const source = host.read(file, "utf-8");

  if (!source.includes(text)) {
    const output = source.concat("\n", text, "\n")
    host.write(file, output)
  }
}

export function filterMiscOptions(options: Normalized<FeatureSchema>) {
  return Object.entries(options as Filtered<typeof options, MiscType>)
    .filter(([key, value]) => isMiscType(key) && Boolean(value))
    .map(([key]) => key as MiscType)
}

export function addMiscFiles(host: Tree, options: Normalized<FeatureSchema>) {
  filterMiscOptions(options)
    .forEach((option) => {
      addMiscFile(host, options, option)
    })
}
