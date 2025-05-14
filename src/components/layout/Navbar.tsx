'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Menu, X, Bell, User } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const pathname = usePathname();

  // Handle navbar background change on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 w-full z-50 transition-all duration-500 ${
          isScrolled ? 'bg-black/90 backdrop-blur-md' : 'bg-gradient-to-b from-black/80 to-transparent'
        }`}
      >
        <div className="px-6 flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-[#e50914]">WATCHI</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <Link 
              href="/" 
              className={`text-sm font-medium hover:text-white/80 transition ${
                pathname === '/' ? 'text-white' : 'text-white/70'
              }`}
            >
              Home
            </Link>
            <Link 
              href="/anime" 
              className={`text-sm font-medium hover:text-white/80 transition ${
                pathname.startsWith('/anime') ? 'text-white' : 'text-white/70'
              }`}
            >
              Anime
            </Link>
            <Link 
              href="/genres" 
              className={`text-sm font-medium hover:text-white/80 transition ${
                pathname.startsWith('/genres') ? 'text-white' : 'text-white/70'
              }`}
            >
              Genres
            </Link>
            <Link 
              href="/my-list" 
              className={`text-sm font-medium hover:text-white/80 transition ${
                pathname.startsWith('/my-list') ? 'text-white' : 'text-white/70'
              }`}
            >
              My List
            </Link>
          </nav>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            {/* Search Toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-1 text-white/80 hover:text-white"
            >
              <Search size={20} />
            </motion.button>

            {/* Notifications */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="hidden md:block p-1 text-white/80 hover:text-white"
            >
              <Bell size={20} />
            </motion.button>

            {/* Profile */}
            <motion.div whileHover={{ scale: 1.1 }} className="hidden md:block">
              <Link href="/profile" className="flex items-center">
                <div className="w-7 h-7 rounded-full bg-gray-600 flex items-center justify-center overflow-hidden">
                  <User size={18} className="text-white" />
                </div>
              </Link>
            </motion.div>

            {/* Mobile menu button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-1 text-white/80 hover:text-white"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </motion.button>
          </div>
        </div>

        {/* Full-screen search */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="absolute top-16 inset-x-0 bg-black/90 backdrop-blur-md p-4"
            >
              <div className="container mx-auto">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search anime..."
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-md py-2 pl-10 pr-4 text-white focus:outline-none focus:ring-1 focus:ring-[#e50914]"
                    autoFocus
                  />
                  <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
                  <button
                    onClick={() => setIsSearchOpen(false)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-white"
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'tween' }}
            className="fixed top-16 right-0 bottom-0 w-64 bg-black/90 backdrop-blur-md z-50 shadow-xl"
          >
            <div className="flex flex-col p-4 gap-6">
              <Link 
                href="/" 
                className={`text-base font-medium hover:text-[#e50914] transition ${
                  pathname === '/' ? 'text-[#e50914]' : 'text-white'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                href="/anime" 
                className={`text-base font-medium hover:text-[#e50914] transition ${
                  pathname.startsWith('/anime') ? 'text-[#e50914]' : 'text-white'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Anime
              </Link>
              <Link 
                href="/genres" 
                className={`text-base font-medium hover:text-[#e50914] transition ${
                  pathname.startsWith('/genres') ? 'text-[#e50914]' : 'text-white'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Genres
              </Link>
              <Link 
                href="/my-list" 
                className={`text-base font-medium hover:text-[#e50914] transition ${
                  pathname.startsWith('/my-list') ? 'text-[#e50914]' : 'text-white'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                My List
              </Link>
              <Link 
                href="/profile" 
                className={`text-base font-medium hover:text-[#e50914] transition ${
                  pathname.startsWith('/profile') ? 'text-[#e50914]' : 'text-white'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Profile
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Push content down to account for fixed navbar */}
      <div className="h-16" />
    </>
  );
} 