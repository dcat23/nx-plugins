import { HookGeneratorSchema } from "../schema";
import { noPrefixName } from "../../../lib/helper";
import { NormalizedFeature } from "../../../lib/feature";

type PrefixNameType =  Partial<ReturnType<typeof noPrefixName>>
export function mutationOptions(options: NormalizedFeature & HookGeneratorSchema & PrefixNameType) {
  if (!options.mutation) {
    return {
      mutationFunction: "",
      mutationImport: ""
    }
  }
  return {
    mutationImport: `import { useMutation } from "@tanstack/react-query";\n`,
    mutationFunction: `
    const m = useMutation<${options.noPrefixClassName}>({
      mutationFn: async () => {
          return ${options.noPrefixPropertyName}();
      },
  
      onSuccess: (data) => {
          toast.success(\`${options.fileName} \${data}\`);
          console.log("${options.fileName}", data);
      },
  
      onError: (error) => {
          toast.error(\`\${error.message}\`);
          console.error("${options.fileName}", error);
      },
    });

    `
  }
}

export function queryOptions(options: NormalizedFeature & HookGeneratorSchema & PrefixNameType) {
  if (!options.query) {
    return {
      queryImport: "",
      queryFunction: ""
    }
  }
  return {
    queryImport: `import { useQuery } from "@tanstack/react-query";\n`,
    queryFunction: `
    const q = useQuery<${options.noPrefixClassName}>({
      queryKey: ["${options.noPrefixFileName}"],
      queryFn: async () => {
          return ${options.noPrefixPropertyName}();
      },
      enabled: true
    });
    `
  }
}
