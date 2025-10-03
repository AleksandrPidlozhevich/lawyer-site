//components/ui/sheet.tsx
'use client';

import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";

const Sheet = DialogPrimitive.Root;
const SheetTrigger = DialogPrimitive.Trigger;
const SheetClose = DialogPrimitive.Close;

const SheetContent = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Content>,
    React.ComponentProps<typeof DialogPrimitive.Content> & { side?: "left" | "right"; title?: string }
>(({ className, side = "right", children, title = "Sheet", ...props }, ref) => {
    return (
        <DialogPrimitive.Portal>
            <DialogPrimitive.Overlay
                className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
            />
            <DialogPrimitive.Content
                ref={ref}
                className={cn(
                    "fixed z-50 shadow-lg p-6 w-64 h-full overflow-auto transition-transform border-l border-border",
                    "bg-white dark:bg-gray-950", 
                    side === "left" && "left-0 animate-in slide-in-from-left",
                    side === "right" && "right-0 animate-in slide-in-from-right",
                    className
                )}
                {...props}
            >
                {/*DialogTitle */}
                <DialogPrimitive.Title className="sr-only">{title}</DialogPrimitive.Title>
                {children}
            </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
    );
});
SheetContent.displayName = "SheetContent";

const SheetHeader = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => {
    return (
        <div className={cn("mb-4 flex flex-col space-y-2", className)} {...props}>
            {children}
        </div>
    );
};

const SheetTitle = ({ className, children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => {
    return (
        <h2 className={cn("text-lg font-semibold", className)} {...props}>
            {children}
        </h2>
    );
};

export { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetClose };

