export function mutationOptions(mutation: boolean) {
  if (!mutation) {
    return {
      mutationFunction: false,
      mutationImport: ""
    }
  }
  return {
    mutationImport: `import { useMutation } from "@tanstack/react-query";\n`,
    mutationFunction: true
  }
}

export function queryOptions(query: boolean) {
  if (!query) {
    return {
      queryImport: "",
      queryFunction: false
    }
  }
  return {
    queryImport: `import { useQuery } from "@tanstack/react-query";\n`,
    queryFunction: true
  }
}
