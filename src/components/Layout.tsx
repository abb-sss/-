import { Link, useLocation } from 'react-router-dom';
import { Compass, Search, PlusSquare, UserCircle, LogIn, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: '首页', path: '/', icon: Compass },
    { name: '发现资源', path: '/resources', icon: Search },
  ];

  // Mock auth state
  const isAuthenticated = true;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 glass border-b border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <Link to="/" className="flex items-center gap-2 text-primary font-bold text-xl tracking-tight">
                <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/50 shadow-[0_0_15px_rgba(59,130,246,0.5)]">
                  <span className="text-primary-foreground">IT</span>
                </div>
                <span>DevHub</span>
              </Link>
              
              <div className="hidden md:flex items-center space-x-1">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = location.pathname === link.path;
                  return (
                    <Link
                      key={link.path}
                      to={link.path}
                      className={`flex items-center gap-2 px-4 py-2 rounded-md transition-all duration-200 ${
                        isActive 
                          ? 'bg-primary/10 text-primary font-medium' 
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                      }`}
                    >
                      <Icon size={18} />
                      {link.name}
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-muted-foreground" />
                </div>
                <input
                  type="text"
                  placeholder="搜索资源、工具、教程..."
                  className="block w-64 pl-10 pr-3 py-2 border border-border rounded-full leading-5 bg-card/50 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary sm:text-sm transition-all duration-300 focus:w-72 focus:bg-card"
                />
              </div>

              <Link
                to="/publish"
                className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-full text-sm font-medium transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)] hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]"
              >
                <PlusSquare size={18} />
                发布资源
              </Link>

              {isAuthenticated ? (
                <Link to="/profile" className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-accent p-[2px]">
                    <div className="w-full h-full rounded-full bg-card flex items-center justify-center overflow-hidden">
                      <UserCircle size={24} className="text-muted-foreground" />
                    </div>
                  </div>
                </Link>
              ) : (
                <Link to="/login" className="flex items-center gap-2 text-muted-foreground hover:text-foreground px-3 py-2">
                  <LogIn size={18} />
                  登录
                </Link>
              )}
            </div>

            <div className="flex md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-muted-foreground hover:text-foreground"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden glass border-t border-border/40 absolute w-full">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon size={18} />
                    {link.name}
                  </Link>
                );
              })}
              <Link
                to="/publish"
                className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-primary hover:bg-primary/10"
                onClick={() => setIsMenuOpen(false)}
              >
                <PlusSquare size={18} />
                发布资源
              </Link>
              <Link
                to={isAuthenticated ? "/profile" : "/login"}
                className="flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-muted-foreground hover:text-foreground hover:bg-muted"
                onClick={() => setIsMenuOpen(false)}
              >
                {isAuthenticated ? <UserCircle size={18} /> : <LogIn size={18} />}
                {isAuthenticated ? '个人中心' : '登录'}
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Main content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-card/30 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-primary font-bold text-lg">
              <div className="w-6 h-6 rounded flex items-center justify-center bg-primary text-primary-foreground text-xs">
                IT
              </div>
              DevHub
            </div>
            <p className="text-muted-foreground text-sm">
              &copy; {new Date().getFullYear()} IT DevHub. 致力于为开发者提供高质量资源分享。
            </p>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">关于我们</a>
              <a href="#" className="hover:text-primary transition-colors">服务条款</a>
              <a href="#" className="hover:text-primary transition-colors">隐私政策</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
