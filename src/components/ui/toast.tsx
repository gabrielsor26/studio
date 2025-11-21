
"use client"

import * as React from "react"
import * as ToastPrimitives from "@radix-ui/react-toast"
import { cva, type VariantProps } from "class-variance-authority"
import { X, CheckCircle, AlertTriangle, Info } from "lucide-react"

import { cn } from "@/lib/utils"

const ToastProvider = ToastPrimitives.Provider

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      "fixed top-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]",
      className
    )}
    {...props}
  />
))
ToastViewport.displayName = ToastPrimitives.Viewport.displayName

const toastVariants = cva(
  "group pointer-events-auto relative flex w-full items-start gap-4 overflow-hidden rounded-lg border p-6 pr-8 shadow-lg transition-all data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[swipe=end]:animate-out data-[state=closed]:fade-out-80 data-[state=closed]:slide-out-to-right-full data-[state=open]:slide-in-from-top-full data-[state=open]:sm:slide-in-from-bottom-full",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground",
        destructive:
          "destructive group border-destructive bg-destructive text-destructive-foreground",
        success:
          "success group border-green-500 bg-green-500 text-primary-foreground",
        warning:
          "warning group border-yellow-500 bg-yellow-500 text-primary-foreground",
        info:
          "info group border-blue-500 bg-blue-500 text-primary-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  const { duration } = props;
  const [elapsed, setElapsed] = React.useState(0);

  React.useEffect(() => {
    if (!duration || duration === Infinity) return;
    const interval = setInterval(() => {
      setElapsed((prev) => prev + 100);
    }, 100);
    return () => clearInterval(interval);
  }, [duration]);

  const progress = !duration || duration === Infinity ? 0 : (elapsed / duration) * 100;
  
  const Icon = variant === 'success' ? CheckCircle : 
               variant === 'destructive' ? AlertTriangle : 
               variant === 'warning' ? AlertTriangle : 
               variant === 'info' ? Info : null;

  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    >
      {Icon && <Icon className="h-6 w-6 shrink-0 mt-0.5" />}
      <div className="flex-grow grid gap-1.5">{props.children}</div>
      <ToastClose />
      {duration !== Infinity && (
        <div className="absolute bottom-0 left-0 h-1 w-full bg-black/10">
          <div
            className={cn("h-1", "bg-white/50")}
            style={{ width: `${100 - progress}%`, transition: 'width 0.1s linear' }}
          />
        </div>
      )}
    </ToastPrimitives.Root>
  )
})
Toast.displayName = ToastPrimitives.Root.displayName

const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Action>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    ref={ref}
    className={cn(
      "inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-secondary focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
      "group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive",
      "group-[.success]:border-muted/40 group-[.success]:hover:border-green-500/30 group-[.success]:hover:bg-green-500 group-[.success]:hover:text-primary-foreground",
      "group-[.warning]:border-muted/40 group-[.warning]:hover:border-yellow-500/30 group-[.warning]:hover:bg-yellow-500 group-[.warning]:hover:text-primary-foreground",
      "group-[.info]:border-muted/40 group-[.info]:hover:border-blue-500/30 group-[.info]:hover:bg-blue-500 group-[.info]:hover:text-primary-foreground",
      className
    )}
    {...props}
  />
))
ToastAction.displayName = ToastPrimitives.Action.displayName

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      "absolute right-2 top-2 rounded-md p-1 text-foreground/80 opacity-0 transition-opacity hover:text-foreground focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100",
      "group-[.destructive]:text-red-300 group-[.destructive]:hover:text-white group-[.destructive]:focus:ring-red-400 group-[.destructive]:focus:ring-offset-red-600",
      "group-[.success]:text-green-300 group-[.success]:hover:text-white group-[.success]:focus:ring-green-400 group-[.success]:focus:ring-offset-green-600",
      "group-[.warning]:text-yellow-300 group-[.warning]:hover:text-white group-[.warning]:focus:ring-yellow-400 group-[.warning]:focus:ring-offset-yellow-600",
      "group-[.info]:text-blue-300 group-[.info]:hover:text-white group-[.info]:focus:ring-blue-400 group-[.info]:focus:ring-offset-blue-600",
      className
    )}
    toast-close=""
    {...props}
  >
    <X className="h-4 w-4" />
  </ToastPrimitives.Close>
))
ToastClose.displayName = ToastPrimitives.Close.displayName

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn("text-base font-semibold", className)}
    {...props}
  />
))
ToastTitle.displayName = ToastPrimitives.Title.displayName

const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    ref={ref}
    className={cn("text-sm opacity-90", className)}
    {...props}
  />
))
ToastDescription.displayName = ToastPrimitives.Description.displayName

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>

type ToastActionElement = React.ReactElement<typeof ToastAction>

export {
  type ToastProps,
  type ToastActionElement,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastAction,
}
