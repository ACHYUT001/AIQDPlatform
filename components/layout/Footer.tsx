import Link from 'next/link'

export function Footer() {
    return (
        <footer className="border-t border-white/10 bg-black py-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
                            AIQD
                        </span>
                        <p className="text-sm text-gray-400">
                            Empowering the next generation of AI with high-quality, human-verified data.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold text-white mb-4">Platform</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link href="#" className="hover:text-white transition-colors">For Contributors</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">For Clients</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Data Quality</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-white mb-4">Company</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link href="#" className="hover:text-white transition-colors">About Us</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-white mb-4">Legal</h3>
                        <ul className="space-y-2 text-sm text-gray-400">
                            <li><Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                            <li><Link href="#" className="hover:text-white transition-colors">Terms of Service</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-white/10 text-center text-sm text-gray-500">
                    © {new Date().getFullYear()} AIQD Platform. All rights reserved.
                </div>
            </div>
        </footer>
    )
}
