import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { signInWithGoogle, logOut } from '../lib/firebase';
import { Stethoscope, Menu, X, LogIn, User, Calendar, LogOut, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export default function Layout() {
  const { user, loading, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      // Add a slight delay to ensure the DOM is ready after navigation
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location.pathname, location.hash]);

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error(err);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/#about' },
    { name: 'Reviews', path: '/#reviews' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-teal-200">
      <header className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled 
          ? "bg-white/80 backdrop-blur-lg shadow-sm border-b border-slate-200" 
          : "bg-transparent border-b-0 py-2"
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="p-2 bg-teal-50 rounded-2xl group-hover:bg-teal-100 transition-colors shadow-sm border border-teal-100">
                <Stethoscope className="w-6 h-6 text-teal-600" />
              </div>
              <div>
                <h1 className="font-display font-bold text-xl text-slate-900 tracking-tight leading-tight">Sai Krupa</h1>
                <p className="text-[10px] uppercase tracking-widest text-teal-600 font-semibold leading-none">Dental Care</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-slate-600 hover:text-teal-600 font-medium text-sm transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            <div className="hidden md:flex items-center gap-4">
              {!loading && (
                user ? (
                  <div className="flex items-center gap-4">
                    <Link
                      to="/portal"
                      className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-teal-600 px-3 py-2 rounded-xl hover:bg-slate-100 transition-all"
                    >
                      <User className="w-4 h-4" />
                      Patient Portal
                    </Link>
                    <button
                      onClick={logOut}
                      className="inline-flex items-center gap-2 justify-center rounded-2xl bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-900 transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={handleLogin}
                    className="inline-flex items-center gap-2 justify-center rounded-2xl bg-teal-600 px-5 py-2.5 text-sm font-medium text-white shadow-lg shadow-teal-100 hover:bg-teal-700 transition-all hover:-translate-y-0.5"
                  >
                    <LogIn className="w-4 h-4" />
                    Sign In
                  </button>
                )
              )}
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-x-0 top-20 z-40 bg-white border-b border-slate-200 shadow-lg md:hidden"
          >
            <div className="p-4 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-base font-medium text-slate-900 bg-slate-50 rounded-xl"
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-slate-100">
                {user ? (
                  <div className="space-y-3">
                    <Link
                      to="/portal"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 text-base font-medium text-teal-700 bg-teal-50 rounded-xl w-full"
                    >
                      <User className="w-5 h-5" />
                      Patient Portal
                    </Link>
                    <button
                      onClick={() => { logOut(); setMobileMenuOpen(false); }}
                      className="flex items-center gap-3 px-4 py-3 w-full text-base font-medium text-rose-600 bg-rose-50 rounded-xl"
                    >
                      <LogOut className="w-5 h-5" />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => { handleLogin(); setMobileMenuOpen(false); }}
                    className="w-full flex items-center justify-center gap-2 rounded-xl bg-teal-600 px-5 py-3 text-base font-medium text-white shadow-sm hover:bg-teal-700"
                  >
                    <LogIn className="w-5 h-5" />
                    Sign In
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-1 mt-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex-1 flex flex-col h-full"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <footer className="relative bg-slate-950 py-16 text-slate-400 mt-20 overflow-hidden border-t border-slate-800">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-teal-900/20 rounded-full blur-[100px] pointer-events-none"></div>
          <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-900/10 rounded-full blur-[100px] pointer-events-none"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-3 gap-8 relative z-10">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-6 group">
              <div className="p-2 bg-teal-500/10 rounded-xl group-hover:bg-teal-500/20 transition-colors">
                <Stethoscope className="w-6 h-6 text-teal-400" />
              </div>
              <div>
                <span className="font-display font-bold text-2xl text-white tracking-tight leading-none block">Sai Krupa</span>
                <span className="text-[10px] uppercase tracking-widest text-teal-500 font-semibold leading-none">Dental Care</span>
              </div>
            </Link>
            <p className="text-sm border-l-2 border-teal-500/50 pl-4 mb-6 leading-relaxed">
              Quality treatment worth the price.<br/>
              We care for your smile.
            </p>
            <div className="flex gap-2">
              <span className="text-xs px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-md text-slate-300">LGBTQ+ friendly</span>
              <span className="text-xs px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-md text-slate-300">Women-owned</span>
            </div>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-6 flex items-center gap-2">Clinic Hours</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex justify-between items-center bg-slate-900/50 p-3 rounded-lg border border-slate-800/50">
                <span className="text-slate-300">Mon - Sun</span> 
                <span className="font-medium text-white">6:00 AM - 1:30 PM</span>
              </li>
              <li className="flex justify-between items-center bg-slate-900/50 p-3 rounded-lg border border-slate-800/50">
                <span className="text-slate-500">Evening</span> 
                <span className="font-medium text-white">5:30 PM - 9:00 PM</span>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-white font-semibold mb-6">Location</h3>
            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800/50">
              <p className="text-sm mb-2 text-slate-300">
                Nilakantheswar marg,<br />
                Borigumma, Odisha 764056
              </p>
              <a href="https://maps.google.com/?q=Sai+Krupa+Dental+Care,Borigumma" target="_blank" rel="noreferrer" className="text-xs text-teal-400 hover:text-teal-300 transition-colors inline-block mt-1">2HX3+5X Borigumma, Odisha</a>
            </div>
          </div>
          <div className="md:col-span-3 pt-6 mt-8 border-t border-slate-800/50 flex justify-between items-center">
            <p className="text-xs text-slate-500">© 2026 Sai Krupa Dental Care. All rights reserved.</p>
            <Link to="/admin" className="text-xs font-medium text-slate-500 hover:text-teal-400 flex items-center gap-2 transition-colors px-3 py-1.5 rounded-lg hover:bg-slate-800/50">
              <ShieldAlert className="w-3.5 h-3.5" />
              Admin Portal
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
