import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu } from 'lucide-react'

export function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-xl supports-[backdrop-filter]:bg-black/20">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="flex items-center space-x-2">
                    <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                        AIQD
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-6">
                    <Link href="#product" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                        Product
                    </Link>
                    <Link href="#testimonials" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                        Stories
                    </Link>
                    <Link href="#contact" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                        Contact
                    </Link>
                </nav>

                <div className="hidden md:flex items-center space-x-4">
                    <Link href="/login">
                        <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/10">
                            Sign In
                        </Button>
                    </Link>
                    <Link href="/onboarding">
                        <Button className="bg-white text-black hover:bg-gray-200">
                            Join as Contributor
                        </Button>
                    </Link>
                </div>

                {/* Mobile Navigation */}
                <Sheet>
                    <SheetTrigger asChild className="md:hidden">
                        <Button variant="ghost" size="icon" className="text-gray-300">
                            <Menu className="h-6 w-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="right" className="bg-black border-l border-white/10">
                        <div className="flex flex-col space-y-6 mt-8">
                            <Link href="#product" className="text-lg font-medium text-gray-300 hover:text-white">
                                Product
                            </Link>
                            <Link href="#testimonials" className="text-lg font-medium text-gray-300 hover:text-white">
                                Stories
                            </Link>
                            <Link href="#contact" className="text-lg font-medium text-gray-300 hover:text-white">
                                Contact
                            </Link>
                            <div className="h-px bg-white/10" />
                            <Link href="/login">
                                <Button variant="ghost" className="w-full justify-start text-gray-300 hover:text-white hover:bg-white/10">
                                    Sign In
                                </Button>
                            </Link>
                            <Link href="/onboarding">
                                <Button className="w-full bg-white text-black hover:bg-gray-200">
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
