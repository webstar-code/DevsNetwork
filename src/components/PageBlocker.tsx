import { useLockBody } from "../hooks/useLockBody";
import { Portal } from "./Portal";


interface PageBlockerProps {
  open: boolean;
  children: JSX.Element;
}

export function PageBlocker({ open, children }: PageBlockerProps) {
  useLockBody();
  return (
    <Portal>
      <>
        <div
          data-state={open ? "open" : "closed"}
          className="fixed inset-0 z-50 bg-primary/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
        ></div>
        <div
          data-state={open ? "open" : "closed"}
          className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg sm:max-w-md translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg md:w-full "
        >
          {children}
        </div>
      </>
    </Portal>
  );
}