import { FeatureSchema, MiscType, Normalized } from "./feature";
import { NoPrefixNameType } from "./helper";
import { joinPathFragments, Tree } from "@nx/devkit";
import { addToIndex } from "./utils";

const helperText = (options: Normalized<FeatureSchema & NoPrefixNameType>) => {
  return `export function ${options.noPrefixPropertyName}() {
    throw new Error("not implemented");
  }
  `
}

const typeText = (options: Normalized<FeatureSchema & NoPrefixNameType>) => {
  return `export interface ${options.noPrefixConstantName} {}`
}

const constantText = (options: Normalized<FeatureSchema & NoPrefixNameType>) => {
  return `export const ${options.noPrefixConstantName} = null`;
}

const mapperText = (options: Normalized<FeatureSchema & NoPrefixNameType>) =>{
  return `export function mapTo${options.noPrefixClassName}(data: any) {
    
    return {
      ...data,
    }
  }
  `
}

function addMiscFile(host: Tree, options: Normalized<FeatureSchema & NoPrefixNameType>, name: MiscType) {

  const miscText: Record<MiscType, string> = {
    constant: constantText(options),
    helper: helperText(options),
    mapper: mapperText(options),
    type: typeText(options)
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

  addToIndex(host, {
    ...options,
    filePath: name
  })
}

export function addMiscFiles(host: Tree, options: Normalized<FeatureSchema & NoPrefixNameType>) {

  if (options.helper) {
    addMiscFile(host, options, "helper");
  }

  if (options.constant) {
    addMiscFile(host, options, "constant");
  }

  if (options.mapper) {
    addMiscFile(host, options, "mapper");
  }

  if (options.type) {
    addMiscFile(host, options, "type");
  }
}
