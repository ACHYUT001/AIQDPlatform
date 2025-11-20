import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu } from 'lucide-react'

export function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/50 backdrop-blur-xl supports-[backdrop-filter]:bg-background/20">
            <div className="container mx-auto flex h-20 items-center justify-between px-4">
                <Link href="/" className="flex items-center space-x-2 group">
                    <span className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent group-hover:text-glow transition-all duration-300">
                        AIQD
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-8">
                    <Link href="#product" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                        Product
                    </Link>
                    <Link href="#testimonials" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                        Stories
                    </Link>
                    <Link href="#contact" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                        Contact
                    </Link>
                </nav>

                <div className="hidden md:flex items-center space-x-4">
                    <Link href="/login">
                        <Button variant="ghost" className="text-muted-foreground hover:text-white hover:bg-white/5">
                            Sign In
                        </Button>
                    </Link>
                    <Link href="/onboarding">
                        <Button className="bg-primary text-black hover:bg-primary/90 shadow-[0_0_15px_rgba(0,255,163,0.3)] hover:shadow-[0_0_25px_rgba(0,255,163,0.5)] transition-all">
                            Join as Contributor
                        </Button>
                    </Link>
                </div>

                {/* Mobile Navigation */}
                <Sheet>
                    <SheetTrigger asChild className="md:hidden">
                        <Button variant="ghost" size="icon" className="text-muted-foreground">
                            <Menu className="h-6 w-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="bg-black/95 border-l border-white/10 backdrop-blur-xl">
                        <div className="flex flex-col space-y-6 mt-8">
                            <Link href="#product" className="text-lg font-medium text-muted-foreground hover:text-primary">
                                Product
                            </Link>
                            <Link href="#testimonials" className="text-lg font-medium text-muted-foreground hover:text-primary">
                                Stories
                            </Link>
                            <Link href="#contact" className="text-lg font-medium text-muted-foreground hover:text-primary">
                                Contact
                            </Link>
                            <div className="h-px bg-white/10" />
                            <Link href="/login">
                                <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-white hover:bg-white/5">
                                    Sign In
                                </Button>
                            </Link>
                            <Link href="/onboarding">
                                <Button className="w-full bg-primary text-black hover:bg-primary/90">
                                    Join as Contributor
                                </Button>
                            </Link>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </header>
    )
}
