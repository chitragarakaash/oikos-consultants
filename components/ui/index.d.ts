declare module '@/components/ui/dialog' {
  import { FC, ReactNode } from 'react'
  
  export const Dialog: FC<{
    children: ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
  }>
  export const DialogContent: FC<{ children: ReactNode; className?: string }>
  export const DialogHeader: FC<{ children: ReactNode; className?: string }>
  export const DialogTitle: FC<{ children: ReactNode; className?: string }>
  export const DialogDescription: FC<{ children: ReactNode; className?: string }>
}

declare module '@/components/ui/calendar' {
  import { FC } from 'react'
  import { DayPicker } from 'react-day-picker'
  
  export type CalendarProps = React.ComponentProps<typeof DayPicker>
  export const Calendar: FC<CalendarProps>
}

declare module '@/components/ui/popover' {
  import { FC, ReactNode } from 'react'
  
  export const Popover: FC<{ children: ReactNode }>
  export const PopoverTrigger: FC<{ children: ReactNode; asChild?: boolean }>
  export const PopoverContent: FC<{ children: ReactNode; className?: string; align?: string }>
} 