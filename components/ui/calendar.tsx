import * as React from 'react'
import { DayPicker } from 'react-day-picker'
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp } from 'lucide-react'

import { cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/button'

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <div className="v0-calendar-root">
      <style>{`
        /* Force a stable 7-column calendar grid, even if utility CSS is overridden. */
        .v0-calendar-root .v0-calendar { display: block !important; }
        .v0-calendar-root .v0-months { display: block !important; }
        .v0-calendar-root .v0-month { display: block !important; }
        .v0-calendar-root .v0-table { width: 100% !important; border-collapse: collapse !important; }

        .v0-calendar-root .v0-head-row,
        .v0-calendar-root .v0-row {
          display: grid !important;
          grid-template-columns: repeat(7, 1fr) !important;
          gap: 0.5rem !important;
          place-items: center !important;
        }

        .v0-calendar-root .v0-cell,
        .v0-calendar-root .v0-day {
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
        }

        .v0-calendar-root .v0-caption { display: flex !important; align-items: center !important; justify-content: center !important; }
        .v0-calendar-root .v0-nav { display: flex !important; align-items: center !important; gap: 0.25rem !important; }
      `}</style>

      <DayPicker
        showOutsideDays={showOutsideDays}
        className={cn('v0-calendar p-3', className)}
        classNames={{
          months: 'v0-months flex flex-col sm:flex-row gap-4',
          month: 'v0-month space-y-4',
          caption: 'v0-caption flex justify-center pt-1 relative items-center',
          caption_label: 'text-sm font-medium text-foreground',
          nav: 'v0-nav space-x-1 flex items-center',
          nav_button: cn(
            buttonVariants({ variant: 'outline', size: 'icon-sm' }),
            'h-7 w-7 bg-transparent p-0 opacity-80 hover:opacity-100',
          ),
          nav_button_previous: 'absolute left-1',
          nav_button_next: 'absolute right-1',
          table: 'v0-table w-full border-collapse',
          head_row: 'v0-head-row grid grid-cols-7 gap-2 place-items-center',
          head_cell:
            'w-full text-muted-foreground text-center font-medium text-[0.75rem] tracking-wide py-1',
          row: 'v0-row grid grid-cols-7 gap-2 place-items-center mt-2',
          cell: cn(
            'v0-cell relative p-0 text-center text-sm focus-within:relative focus-within:z-20 flex items-center justify-center',
            // ensure the "selected" circle doesn't get clipped
            '[&:has([aria-selected])]:z-20',
          ),
          day: cn(
            'v0-day',
            buttonVariants({ variant: 'ghost', size: 'icon-sm' }),
            'h-10 w-10 p-0 font-normal rounded-full',
            'hover:bg-accent/40 hover:text-foreground',
            'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
            'aria-selected:opacity-100',
          ),
          day_selected:
            'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground rounded-full',
          day_today: 'bg-muted text-foreground rounded-full',
          day_outside: 'day-outside text-muted-foreground opacity-60 aria-selected:opacity-40',
          // past/disabled days: clearly muted + unselectable look
          day_disabled: 'text-muted-foreground/60 opacity-40 cursor-not-allowed',
          day_range_middle: 'aria-selected:bg-accent aria-selected:text-accent-foreground',
          day_hidden: 'invisible',
          ...classNames,
        }}
        components={{
          Chevron: ({ orientation, className }) => {
            const cls = cn('h-4 w-4', className)
            if (orientation === 'left') return <ChevronLeft className={cls} />
            if (orientation === 'right') return <ChevronRight className={cls} />
            if (orientation === 'up') return <ChevronUp className={cls} />
            return <ChevronDown className={cls} />
          },
        }}
        {...props}
      />
    </div>
  )
}

Calendar.displayName = 'Calendar'

export { Calendar }

