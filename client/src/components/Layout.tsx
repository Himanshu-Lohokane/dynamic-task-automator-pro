import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MessageCircle, 
  FileText, 
  Image, 
  Video, 
  Music, 
  Folder,
  Menu,
  X,
  Bot,
  Settings,
  Moon,
  Sun,
  Monitor,
  User,
  LogOut,
  ChevronDown
} from 'lucide-react';
import { useTheme } from '@/components/ThemeProvider';
import { useAuth } from '@/components/Auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/hooks/use-toast';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
  };

  const getThemeIcon = () => {
    if (theme === 'dark') return <Moon className="w-4 h-4" />;
    if (theme === 'light') return <Sun className="w-4 h-4" />;
    return <Monitor className="w-4 h-4" />;
  };

  const cycleTheme = () => {
    if (theme === 'light') setTheme('dark');
    else if (theme === 'dark') setTheme('system');
    else setTheme('light');
  };

  const tabs = [
    {
      id: 'chat',
      label: 'AI Chat',
      icon: MessageCircle,
      color: 'from-blue-500 to-purple-600',
      description: 'Chat with AI assistant'
    },
    {
      id: 'pdf',
      label: 'PDF Upload',
      icon: FileText,
      color: 'from-green-500 to-blue-600',
      description: 'Save PDFs to knowledge base'
    },
    {
      id: 'image',
      label: 'Image Upload',
      icon: Image,
      color: 'from-purple-500 to-pink-600',
      description: 'Save images to knowledge base'
    },
    {
      id: 'video',
      label: 'Video Upload',
      icon: Video,
      color: 'from-blue-500 to-cyan-600',
      description: 'Save videos to knowledge base'
    },
    {
      id: 'audio',
      label: 'Audio Upload',
      icon: Music,
      color: 'from-emerald-500 to-teal-600',
      description: 'Save audio to knowledge base'
    },
    {
      id: 'documents',
      label: 'Library',
      icon: Folder,
      color: 'from-slate-500 to-gray-600',
      description: 'View uploaded documents'
    }
  ];

  const activeTabData = tabs.find(tab => tab.id === activeTab) || tabs[0];

  return (
    <div className="h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex flex-col overflow-hidden transition-colors">
      {/* Header */}
      <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-b border-gray-200/50 dark:border-slate-700/50 shadow-sm transition-colors">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 bg-gradient-to-r ${activeTabData.color} rounded-full flex items-center justify-center`}>
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white gradient-text">Singularity</h1>
              <p className="text-sm text-gray-600 dark:text-gray-300">Advanced RAG Multimodal AI Agent</p>
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            data-testid="mobile-menu-toggle"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>

          {/* User Menu & Theme Toggle & Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={cycleTheme}
              className="mr-2"
              data-testid="theme-toggle"
            >
              {getThemeIcon()}
            </Button>
            
            {/* Navigation Tabs */}
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              
              return (
                <Button
                  key={tab.id}
                  variant={isActive ? "default" : "ghost"}
                  size="sm"
                  onClick={() => onTabChange(tab.id)}
                  className={`flex items-center gap-2 transition-all duration-200 ${
                    isActive 
                      ? `bg-gradient-to-r ${tab.color} text-white shadow-lg hover:shadow-xl` 
                      : 'hover:bg-gray-100 dark:hover:bg-slate-700'
                  }`}
                  data-testid={`nav-${tab.id}-button`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden lg:inline">{tab.label}</span>
                </Button>
              );
            })}

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-2 ml-2 px-3"
                  data-testid="user-menu-trigger"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="hidden lg:flex flex-col items-start">
                    <span className="text-sm font-medium">{user?.email?.split('@')[0] || 'User'}</span>
                    <span className="text-xs text-muted-foreground">Online</span>
                  </div>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.email?.split('@')[0] || 'User'}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="cursor-pointer text-red-600 focus:text-red-600 dark:text-red-400"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200/50 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm">
            <div className="grid grid-cols-1 gap-1 p-2">
              {/* Mobile Theme Toggle */}
              <Button
                variant="ghost"
                onClick={cycleTheme}
                className="justify-start gap-3 h-12 mb-2"
                data-testid="mobile-theme-toggle"
              >
                {getThemeIcon()}
                <span>Change Theme</span>
              </Button>
              
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                return (
                  <Button
                    key={tab.id}
                    variant={isActive ? "default" : "ghost"}
                    onClick={() => {
                      onTabChange(tab.id);
                      setIsMobileMenuOpen(false);
                    }}
                    className={`justify-start gap-3 h-12 transition-all duration-200 ${
                      isActive 
                        ? `bg-gradient-to-r ${tab.color} text-white` 
                        : 'hover:bg-gray-100 dark:hover:bg-slate-700'
                    }`}
                    data-testid={`mobile-nav-${tab.id}-button`}
                  >
                    <Icon className="w-5 h-5" />
                    <div className="text-left">
                      <div className="font-medium">{tab.label}</div>
                      <div className={`text-xs ${isActive ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'}`}>
                        {tab.description}
                      </div>
                    </div>
                  </Button>
                );
              })}
              
              {/* Mobile User Section */}
              <div className="border-t border-gray-200/50 dark:border-slate-700/50 pt-2 mt-2">
                <div className="flex items-center gap-3 px-3 py-2 text-sm">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{user?.email?.split('@')[0] || 'User'}</div>
                    <div className="text-xs text-muted-foreground">{user?.email}</div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="justify-start gap-3 h-10 w-full text-red-600 hover:text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                  data-testid="mobile-logout-button"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Log out</span>
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Active Tab Indicator */}
        <div className="px-4 pb-2 hidden md:block">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${activeTabData.color}`} />
            <span className="text-sm font-medium text-gray-700">{activeTabData.label}</span>
            <span className="text-xs text-gray-500">•</span>
            <span className="text-xs text-gray-500">{activeTabData.description}</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        {children}
      </div>
    </div>
  );
};

export default Layout;