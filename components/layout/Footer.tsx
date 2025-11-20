import Link from 'next/link'

export function Footer() {
    return (
        <footer className="border-t border-white/5 bg-black py-16">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    <div className="space-y-6">
                        <span className="text-2xl font-bold bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
                            AIQD
                        </span>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            Empowering the next generation of AI with high-quality, human-verified data. Join the revolution today.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold text-white mb-6">Platform</h3>
                        <ul className="space-y-4 text-sm text-muted-foreground">
                            <li><Link href="#" className="hover:text-primary transition-colors">For Contributors</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">For Clients</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Data Quality</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-white mb-6">Company</h3>
                        <ul className="space-y-4 text-sm text-muted-foreground">
                            <li><Link href="#" className="hover:text-primary transition-colors">About Us</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Careers</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Blog</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-white mb-6">Legal</h3>
                        <ul className="space-y-4 text-sm text-muted-foreground">
                            <li><Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-white/5 text-center text-sm text-muted-foreground">
                    © {new Date().getFullYear()} AIQD Platform. All rights reserved.
                </div>
            </div>
        </footer>
    )
}
