"use client"

import Link from "next/link"
import { useState } from "react"
import { Menu } from "lucide-react"
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { useIsMobile } from "@/hooks/use-mobile"
import { siteConfig } from "@/config/site"
import { ThemeToggle } from "./ThemeToggle"

export const Header = () => {
    const [open, setOpen] = useState(false)
    const isMobile = useIsMobile()

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container max-w-screen-xl mx-auto px-4 flex h-16 items-center justify-between">
                <Link href="/" className="font-bold text-lg">
                    {siteConfig.logo}
                </Link>

                {!isMobile && (
                    <NavigationMenu>
                        <NavigationMenuList>
                            {siteConfig.navigation.map((item) => (
                                <NavigationMenuItem key={item.href}>
                                    <NavigationMenuLink className={navigationMenuTriggerStyle()} asChild>
                                        <Link href={item.href}>{item.name}</Link>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                            ))}
                            <NavigationMenuItem>
                                <ThemeToggle />
                            </NavigationMenuItem>
                        </NavigationMenuList>
                    </NavigationMenu>
                )}

                {isMobile && (
                    <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <Sheet open={open} onOpenChange={setOpen}>
                            <SheetTitle className="sr-only">Menu</SheetTitle>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="md:hidden" aria-label="Toggle menu">
                                    <Menu className="h-5 w-5" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[300px] sm:w-[400px] p-4">
                                <nav className="flex flex-col gap-4 mt-8">
                                    {siteConfig.navigation.map((item) => (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setOpen(false)}
                                            className="text-lg font-medium hover:text-primary transition-colors"
                                        >
                                            {item.name}
                                        </Link>
                                    ))}
                                </nav>
                            </SheetContent>
                        </Sheet>
                    </div>
                )}
            </div>
        </header>
    )
}
