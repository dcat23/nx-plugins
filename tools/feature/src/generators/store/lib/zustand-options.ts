import { Normalized } from "../../../lib/feature";
import { StoreGeneratorSchema } from "../schema";

export function zustandCreateMethod(options: Normalized<StoreGeneratorSchema>): string {
  const { className, propertyName, persist } = options;
  return persist ? `
create<I${className}Store>()(
  persist(
    (set) => ({
      ${propertyName}: null,
      isLoading: false,
      set${className}: (${propertyName}) => set({ ${propertyName} }),
      toggleLoading: () => set(({ isLoading }) => ({ isLoading: !isLoading })),
    }),
    {
      name: '${propertyName}-storage',
    }
  )
); 
` : `
create<I${className}Store>((set, get) => ({
  ${propertyName}: null,
  isLoading: false,
  set${className}: (${propertyName}: ${className}) => set({ ${propertyName} }),
  toggleLoading: () => set(({ isLoading }) => ({ isLoading: !isLoading })),
}));  
`
}
