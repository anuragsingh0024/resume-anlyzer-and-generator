import React from 'react';
import { Search } from 'lucide-react';

const ScanningAnimation = ({ isScanning }) => {
    if (!isScanning) {
        return (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-40">
                <div className="p-6 bg-border-muted/20 rounded-full">
                    <Search className="w-12 h-12 text-text-secondary" />
                </div>
                <div>
                    <h3 className="text-xl font-bold">Ready to Scan</h3>
                    <p className="text-sm text-text-secondary mt-2 tracking-wide">
                        Upload your PDF to see the AI magic.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col space-y-6 relative">
            {/* The Moving Scanner Line */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-accent shadow-[0_0_25px_#9bffce] z-30 animate-scan" />

            {/* Mock Resume Content Shimmer */}
            <div className="space-y-6 mt-8">
                <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded bg-border-muted/40 animate-pulse" />
                    <div className="space-y-2 flex-1">
                        <div className="h-4 w-1/2 bg-border-muted/50 rounded animate-pulse" />
                        <div className="h-3 w-1/3 bg-border-muted/30 rounded animate-pulse" />
                    </div>
                </div>

                <div className="space-y-3 pt-6">
                    <div className="h-3 w-full bg-border-muted/20 rounded animate-pulse" />
                    <div className="h-3 w-full bg-border-muted/20 rounded animate-pulse" />
                    <div className="h-3 w-4/5 bg-border-muted/20 rounded animate-pulse" />
                </div>

                {/* AI Skill Tags Bubbling Up */}
                <div className="grid grid-cols-2 gap-3 pt-8">
                    {['Parsing Core...', 'Detecting Skills...', 'ATS Check...', 'Formatting...'].map((text, i) => (
                        <div key={i} className="px-3 py-2 border border-primary/20 bg-primary/5 rounded-md text-[10px] font-mono text-primary animate-bounce" style={{ animationDelay: `${i * 0.2}s` }}>
                            {text}
                        </div>
                    ))}
                </div>

                {/* Bottom Progress Bar */}
                <div className="absolute bottom-4 left-0 right-0 space-y-2">
                    <div className="flex justify-between text-[10px] font-mono text-accent uppercase tracking-widest">
                        <span>Neural Engine Active</span>
                        <span>Running...</span>
                    </div>
                    <div className="w-full h-1 bg-border-muted/30 rounded-full overflow-hidden">
                        <div className="h-full bg-accent animate-progress" />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ScanningAnimation;