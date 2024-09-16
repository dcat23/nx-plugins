import { toast } from 'sonner';
import { upload } from '../api';
import { useMutation } from '@tanstack/react-query';

export function useUpload() {
  const m = useMutation<Upload>({
    mutationFn: async () => {
      return upload();
    },

    onSuccess: (data) => {
      toast.success(`use-upload ${data}`);
      console.log('use-upload', data);
    },

    onError: (error) => {
      toast.error(`${error.message}`);
      console.error('use-upload', error);
    },
  });

  return {};
}
