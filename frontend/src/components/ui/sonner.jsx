import { Toaster as SonnerToaster } from 'sonner';

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      visibleToasts={4}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast: [
            'flex flex-col gap-1',
            'bg-bg-tertiary border-l-[3px]',
            'px-4 py-3 pr-8',
            'min-w-[280px]',
            'font-mono text-[13px] text-text-primary',
            'shadow-[0_4px_16px_rgba(0,0,0,0.4)]',
            'relative',
            // slide-in from right
            'data-[sonner-toast]:animate-slide-in-right',
          ].join(' '),
          title: 'font-medium leading-snug',
          description: 'text-text-secondary text-[12px] mt-0.5',
          closeButton: [
            'absolute top-2 right-2',
            'text-text-muted hover:text-text-primary',
            'text-[11px] font-mono cursor-pointer',
            'bg-transparent border-none p-0.5 leading-none',
          ].join(' '),
        },
        duration: 4000,
      }}
      closeButton
    />
  );
}
