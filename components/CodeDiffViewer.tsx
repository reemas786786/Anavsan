
import React from 'react';

interface CodeDiffViewerProps {
    oldCode: string;
    newCode: string;
}

const CodeDiffViewer: React.FC<CodeDiffViewerProps> = ({ oldCode, newCode }) => {
    return (
        <div className="font-mono text-xs border border-border-color rounded-lg overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
                {/* Header */}
                <div className="bg-surface-nested p-2 border-b border-border-color font-semibold text-text-secondary">Before</div>
                <div className="bg-surface-nested p-2 border-b border-border-color font-semibold text-text-secondary border-l border-border-color">After</div>

                {/* Body */}
                <div className="bg-[#fef6f6] dark:bg-[#2c1d1d] relative">
                    <pre className="p-2 whitespace-pre-wrap break-all leading-relaxed"><code>{oldCode}</code></pre>
                </div>
                 <div className="bg-[#f0f9f3] dark:bg-[#1a2c21] border-l border-border-color relative">
                    <pre className="p-2 whitespace-pre-wrap break-all leading-relaxed"><code>{newCode}</code></pre>
                </div>
            </div>
        </div>
    );
};

export default CodeDiffViewer;
