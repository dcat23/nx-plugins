import { names } from "@nx/devkit";

export type NoPrefixNameType =  ReturnType<typeof noPrefixName>

export function noPrefixName(prefixedName: string) {
  const noPrefix = prefixedName
    .replace(/^(use|with|start|update|read|submit|get|create|add|remove|delete|send)/, "")
    .replace(/(s)$/, "");
  const { name, propertyName, className, fileName, constantName } = names(noPrefix);
  return {
    noPrefixName: name,
    noPrefixPropertyName: propertyName,
    noPrefixClassName: className,
    noPrefixFileName: fileName,
    noPrefixConstantName: constantName
  }
}
