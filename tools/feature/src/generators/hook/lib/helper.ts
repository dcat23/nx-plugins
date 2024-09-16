import { HookGeneratorSchema } from "../schema";
import { NoPrefixNameType } from "../../../lib/helper";
import { Normalized } from "../../../lib/feature";


export function mutationOptions(options: Normalized<HookGeneratorSchema & NoPrefixNameType>) {
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

export function queryOptions(options: Normalized<HookGeneratorSchema & NoPrefixNameType>) {
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
