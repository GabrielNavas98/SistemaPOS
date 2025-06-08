"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import {
    Command, 
    CommandEmpty, 
    CommandGroup, 
    CommandInput, 
    CommandItem, 
    Popover,
    PopoverContent,
    PopoverTrigger, 
    Button
} from "@/components/ui/index"
import { cn } from "@/lib/utils"

export interface ComboBoxOption {
    label: string
    value: string
}

interface ComboBoxProps {
    options: ComboBoxOption[]
    value?: string
    onChange: (value: string) => void
    placeholder?: string
    disabled?: boolean
}

export function ComboBox({
    options,
    value,
    onChange,
    placeholder = "Seleccionar...",
    disabled = false
}: ComboBoxProps) {
    const [open, setOpen] = React.useState(false)

    const selectedLabel = options.find((opt) => opt.value === value)?.label

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    disabled={disabled}
                    className="w-full justify-between"
                >
                    {selectedLabel || placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput placeholder="Buscar..." />
                    <CommandEmpty>No se encontró nada.</CommandEmpty>
                    <CommandGroup>
                        {options.map((option) => (
                            <CommandItem
                                key={option.value}
                                onSelect={() => {
                                    onChange(option.value)
                                    setOpen(false)
                                }}
                            >
                                <Check
                                    className={cn(
                                        "mr-2 h-4 w-4",
                                        value === option.value ? "opacity-100" : "opacity-0"
                                    )}
                                />
                                {option.label}
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>
    )
}
