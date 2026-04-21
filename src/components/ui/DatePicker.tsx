"use client"

import * as React from "react"
import { format } from "date-fns"
import { ChevronDownIcon } from "lucide-react"

import { Button } from "@/components/ui/Button"
import { Calendar } from "@/components/ui/Calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

export function DatePicker({
    value,
    onChange,
}: {
    value?: Date
    onChange: (date?: Date) => void
}) {
    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    data-empty={!value}
                    className="w-full justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
                >
                    {value ? format(value, "PPP") : <span>Pick a date</span>}
                    <ChevronDownIcon />
                </Button>
            </PopoverTrigger>

            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={value}
                    onSelect={onChange}
                    defaultMonth={value}
                />
            </PopoverContent>
        </Popover>
    )
}
