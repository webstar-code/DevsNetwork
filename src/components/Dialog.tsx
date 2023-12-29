import React, { useEffect, useState } from "react";
import { Portal } from "./Portal";
import { useLockBody } from "../hooks/useLockBody";
import { IcCLOSE } from "../assets/icons";

export function Dialog({
  open,
  onOpenChange,
  children,
}: {
  open?: boolean;
  onOpenChange?: any;
  children: JSX.Element[];
}) {
  const [isOpen, setIsOpen] = useState<boolean>(open || false);

  useEffect(() => setIsOpen(open || false), [open]);
  const handleOpen = () => {
    setIsOpen(true);
    onOpenChange && onOpenChange(true);
  };

  const handleClose = () => {
    setIsOpen(false);
    onOpenChange && onOpenChange(false);
  };

  return (
    <>
      {React.cloneElement(children[0], { onOpen: () => handleOpen() })}
      {isOpen && (
        <Portal>
          <>
            <div
              data-state={isOpen ? "open" : "closed"}
              className="fixed inset-0 z-50 bg-primary/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
            ></div>
            <div
              data-state={isOpen ? "open" : "closed"}
              className="fixed left-[50%] top-[50%] z-50 grid w-[90%] max-w-lg sm:max-w-md translate-x-[-50%] translate-y-[-50%] gap-4 border bg-white p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded-lg md:w-full "
            >
              {children.slice(1).map((i) =>
                React.cloneElement(i, {
                  onClose: () => handleClose(),
                })
              )}
              <button
                onClick={() => handleClose()}
                className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-primary transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
              >
                <img src={IcCLOSE} className="w-4 h-4" />
              </button>
            </div>
          </>
        </Portal>
      )}
    </>
  );
}

export function DialogClose({
  onClose,
  children,
}: {
  onClose?: any;
  children: JSX.Element;
}) {
  return <>{React.cloneElement(children, { onClick: onClose })}</>;
}

export function DialogTrigger({
  onOpen,
  children,
}: {
  onOpen?: any;
  children: JSX.Element;
}) {
  return <>{React.cloneElement(children, { onClick: onOpen })}</>;
}

export function DialogContent({
  onClose,
  children,
}: {
  onClose?: any;
  children: JSX.Element[];
}) {
  useLockBody();
  return (
    <>{children.map((i) => React.cloneElement(i, { onClose: onClose }))}</>
  );
}

export function DialogFooter({
  onClose,
  children,
}: {
  onClose?: any;
  children: JSX.Element[];
}) {
  return (
    <div className="flex gap-4 items-center justify-center">
      {children.map((i) => React.cloneElement(i, { onClose: onClose }))}
    </div>
  );
}

export function DialogAction({
  onClose,
  callback,
  children,
}: {
  onClose?: any;
  callback: any;
  children: JSX.Element;
}) {
  return (
    <>
      {React.cloneElement(children, {
        onClick: () => {
          callback();
          onClose();
        },
      })}
    </>
  );
}