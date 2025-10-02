"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ModeToggle() {
    const { setTheme } = useTheme()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="muted"
                    size="icon"
                    className="cursor-pointer focus-visible:outline-none focus-visible:ring-0"
                >
                    <Sun className="h-[2rem] w-[2rem] scale-[1.5] rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                    <Moon className="absolute h-[2.5rem] w-[2.5rem] scale-0 rotate-90 transition-all dark:scale-[1.5] dark:rotate-0" />


                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setTheme("light")}>
                    Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                    Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                    System
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
