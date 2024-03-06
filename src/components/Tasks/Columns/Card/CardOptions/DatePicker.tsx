"use client";
import { CalendarDateTime, isToday as _isToday } from "@internationalized/date";
import { CalendarIcon, ClockIcon } from "lucide-react";
import { useRef, useState } from "react";
import { addDays, format } from "date-fns";
import {
  DateValue,
  TimeValue,
  useDateSegment,
  useInteractOutside,
  useLocale,
  useTimeField,
} from "react-aria";
import {
  DateFieldState,
  DatePickerStateOptions,
  DateSegment as IDateSegment,
  useDatePickerState,
  useTimeFieldState,
} from "react-stately";
// imports from shadcn/ui
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Toggle } from "@/components/ui/toggle";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DateSegmentProps {
  segment: IDateSegment;
  state: DateFieldState;
}

function DateSegment({ segment, state }: DateSegmentProps) {
  const ref = useRef(null);

  const {
    segmentProps: { ...segmentProps },
  } = useDateSegment(segment, state, ref);

  return (
    <div
      {...segmentProps}
      ref={ref}
      className={cn(
        "focus:rounded-[2px] focus:bg-accent focus:text-accent-foreground focus:outline-none",
        segment.type !== "literal" ? "px-[1px]" : "",
        segment.isPlaceholder ? "text-muted-foreground" : ""
      )}
    >
      {segment.text}
    </div>
  );
}

function TimeField({
  disabled,
  ...props
}: {
  disabled: boolean;
  value: TimeValue | null;
  onChange: (value: TimeValue) => void;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  const { locale } = useLocale();
  const state = useTimeFieldState({
    ...props,
    locale,
  });

  useTimeField(props, state, ref);

  return (
    <div
      className={cn(
        "flex items-center space-x-2 mt-1",
        disabled ? "cursor-not-allowed opacity-70" : ""
      )}
    >
      <div
        ref={ref}
        className="inline-flex h-10 w-full flex-1 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        {state.segments.map((segment, i) => (
          <DateSegment key={i} segment={segment} state={state} />
        ))}
      </div>
    </div>
  );
}

const dateToCalendarDateTime = (date: Date): CalendarDateTime => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // JavaScript months are 0-based
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  const millisecond = date.getMilliseconds();

  return new CalendarDateTime(
    year,
    month,
    day,
    hour,
    minute,
    second,
    millisecond
  );
};

type DatePickerProps = {
  value?: { date?: Date | null; };
  onChange: (value: { date: Date | null;  }) => void;
  isDisabled?: boolean;
};
const DatePicker = (props: DatePickerProps) => {
  const contentRef = useRef<HTMLDivElement | null>(null);

  const [open, setOpen] = useState(false);

  const onChangeWrapper = (value: DateValue) => {
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    props.onChange({
      date: value.toDate(timeZone),
    });
  };
  const datePickerProps: DatePickerStateOptions<CalendarDateTime> = {
    value: props.value?.date
      ? dateToCalendarDateTime(props.value.date)
      : null,
    onChange: onChangeWrapper,
    isDisabled: props.isDisabled,
    granularity: "minute",
  };

  const state = useDatePickerState(datePickerProps);
  // useInteractOutside({
  //   ref: contentRef,
  //   onInteractOutside: (e) => {
  //     setOpen(false);
  //   },
  // });
  return (
    <Popover open={open} onOpenChange={setOpen} aria-label="Date Time Picker">
      <PopoverTrigger asChild>
        <Button
          variant={props.value?.date ? "default" : "outline"}
          className={cn("", !props.value && "text-muted-foreground")}
          size={"icon"}
        >
          <CalendarIcon size={15} />
        </Button>
      </PopoverTrigger>
      <PopoverContent ref={contentRef} className="w-auto" align="start">
        <Select
          onValueChange={(value) => {
            props.onChange({
              date: new Date(
                addDays(new Date(), parseInt(value)).setHours(0, 0, 0, 0)
              ),
            });
            setOpen(true);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select" />
          </SelectTrigger>
          <SelectContent position="popper">
            <SelectItem value="0">Today</SelectItem>
            <SelectItem value="1">Tomorrow</SelectItem>
            <SelectItem value="3">In 3 days</SelectItem>
            <SelectItem value="7">In a week</SelectItem>
          </SelectContent>
        </Select>
        <Calendar
          mode="single"
          selected={props.value?.date || undefined}
          disabled={(date) => date.getTime() < new Date().setHours(0, 0, 0, 0)}
          onSelect={(value) => {
            if (value) {
              onChangeWrapper(dateToCalendarDateTime(value!));
            } else {
              props.onChange({
                date: null,
              });
            }
          }}
          initialFocus
          footer={
            <TimeField
              aria-label="Time Picker"
              value={state.timeValue}
              onChange={state.setTimeValue}
              disabled={!props.value?.date}
            />
          }
        />
      </PopoverContent>
    </Popover>
  );
};

export { DatePicker };
