import { names } from "@nx/devkit";

export function noPrefixName(prefixedName: string) {
  const noPrefix = prefixedName
    .replace(/^(use|get|create|add|remove|delete)/, "")
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
