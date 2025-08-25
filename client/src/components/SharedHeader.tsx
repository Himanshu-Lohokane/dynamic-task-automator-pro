import React from 'react';
import { Switch } from '@/components/ui/switch';
import { Settings } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface SharedHeaderProps {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  isProduction: boolean;
  onProductionToggle: (checked: boolean) => void;
  testId?: string;
}

const SharedHeader: React.FC<SharedHeaderProps> = ({
  title,
  subtitle,
  icon,
  isProduction,
  onProductionToggle,
  testId = 'webhook-mode-toggle'
}) => {
  return (
    <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm border-b border-gray-200/50 dark:border-slate-700/50 p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="animate-scale-in">
            {icon}
          </div>
          <div className="animate-slide-in">
            <h1 className="text-xl font-semibold text-gray-800 dark:text-white">{title}</h1>
            <p className="text-sm text-gray-600 dark:text-gray-300">{subtitle}</p>
          </div>
        </div>
        
        {/* Webhook Mode Toggle */}
        <div className="flex items-center gap-3 animate-fade-in" data-testid={testId}>
          <div className="flex items-center gap-2">
            <Settings className="w-4 h-4 text-gray-600 dark:text-gray-300" />
            <span className={`text-sm font-medium transition-colors ${!isProduction ? 'text-orange-600 dark:text-orange-400' : 'text-gray-500 dark:text-gray-400'}`}>
              Test
            </span>
            <Switch
              checked={isProduction}
              onCheckedChange={(checked) => {
                onProductionToggle(checked);
                toast({
                  title: checked ? "Production Mode" : "Test Mode",
                  description: checked ? "Using production webhook" : "Using test webhook",
                });
              }}
              data-testid={`${testId.split('-')[0]}-production-mode-switch`}
            />
            <span className={`text-sm font-medium transition-colors ${isProduction ? 'text-green-600 dark:text-green-400' : 'text-gray-500 dark:text-gray-400'}`}>
              Production
            </span>
          </div>
        </div>
      </div>
      
      {/* Mode Indicator */}
      <div className="mt-3 animate-fade-in">
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
          isProduction 
            ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-700' 
            : 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300 border border-orange-200 dark:border-orange-700'
        }`}>
          <div className={`w-2 h-2 rounded-full animate-pulse ${
            isProduction ? 'bg-green-500' : 'bg-orange-500'
          }`} />
          {isProduction ? 'Production Mode Active' : 'Test Mode Active'}
        </div>
      </div>
    </div>
  );
};

export default SharedHeader;