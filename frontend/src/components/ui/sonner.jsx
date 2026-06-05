import { Toaster as SonnerToaster } from 'sonner';

export function Toaster(props) {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            'flex flex-col gap-1 bg-bg-tertiary border-l-[3px] px-4 py-3 min-w-[280px] font-mono text-[13px] text-text-primary shadow-lg',
          title: 'font-medium',
          description: 'text-text-secondary text-[12px]',
        },
      }}
      {...props}
    />
  );
}
