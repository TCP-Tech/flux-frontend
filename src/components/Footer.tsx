import { FaDiscord, FaFacebook, FaTwitter, FaInstagram, FaHeart, FaCode } from 'react-icons/fa'

const socialMediaLinks = [
  { href: 'https://www.facebook.com', icon: <FaFacebook size={24} />, label: 'Facebook' },
  { href: 'https://www.twitter.com', icon: <FaTwitter size={24} />, label: 'Twitter' },
  { href: 'https://www.instagram.com', icon: <FaInstagram size={24} />, label: 'Instagram' },
  { href: 'https://www.discord.com', icon: <FaDiscord size={24} />, label: 'Discord' },
]

function Footer() {
  return (
    <>
      {/* Social Media Links - Bottom Left */}
      <div className="absolute bottom-36 left-12 z-20 hidden md:flex flex-col space-y-4">
        <div className="w-[2px] h-10 bg-gradient-to-b from-neutral-600 to-transparent ml-[11px]" />
        {socialMediaLinks.map((link, index) => (
          <a
            key={index}
            href={link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-500 hover:text-primary-400 transition-all duration-300 hover:scale-110 hover:drop-shadow-[0_0_8px_rgba(99,102,241,0.6)]"
            aria-label={link.label}
          >
            {link.icon}
          </a>
        ))}
        <div className="w-[2px] h-10 bg-gradient-to-t from-neutral-600 to-transparent ml-[11px]" />
      </div>

      {/* Copyright Footer */}
      <footer className="absolute bottom-0 left-0 right-0 z-20">
        <div className="border-t border-neutral-800/50 bg-neutral-950/95 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6 py-6">
            {/* Main Footer Content */}
            <div className="flex flex-col items-center space-y-4">
              {/* Branding & Copyright */}
              <div className="text-center">
                <p className="text-sm text-neutral-400 mb-2">
                  &copy; {new Date().getFullYear()} Flux. Built for competitive programmers.
                </p>
                <div className="flex items-center justify-center flex-wrap gap-2 text-xs text-neutral-500">
                  <span className="flex items-center gap-1.5">
                    Crafted with <FaHeart className="text-red-500 animate-pulse" size={12} /> by
                  </span>
                  <span className="font-semibold text-primary-400">Skills and Mentorship Team</span>
                </div>
              </div>

              {/* Organization Badge */}
              <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-neutral-800 bg-neutral-900/50 backdrop-blur-sm">
                <FaCode className="text-secondary-400" size={14} />
                <span className="text-xs font-medium text-neutral-300">
                  Turing Club of Programmers
                </span>
                <span className="text-xs text-neutral-600">•</span>
                <span className="text-xs text-neutral-400">NIT Raipur</span>
              </div>

              {/* Links */}
              <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
                <a
                  href="https://github.com/turing-club"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-500 hover:text-primary-400 transition-colors duration-300"
                >
                  GitHub
                </a>
                <span className="text-neutral-700">•</span>
                <a
                  href="#about"
                  className="text-neutral-500 hover:text-primary-400 transition-colors duration-300"
                >
                  About
                </a>
                <span className="text-neutral-700">•</span>
                <a
                  href="#contact"
                  className="text-neutral-500 hover:text-primary-400 transition-colors duration-300"
                >
                  Contact
                </a>
                <span className="text-neutral-700">•</span>
                <a
                  href="#privacy"
                  className="text-neutral-500 hover:text-primary-400 transition-colors duration-300"
                >
                  Privacy
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}

export default Footer
