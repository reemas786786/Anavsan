import React, { useState } from 'react';
import { sqlFilesData } from '../data/dummyData';
import { SQLFile, SQLVersion } from '../types';

const QueryWorkspace: React.FC = () => {
    const [selectedFile, setSelectedFile] = useState<SQLFile | null>(sqlFilesData[0]);
    const [selectedVersions, setSelectedVersions] = useState<Set<string>>(new Set());
    const [isComparing, setIsComparing] = useState(false);

    const handleVersionSelect = (versionId: string) => {
        const newSelection = new Set(selectedVersions);
        if (newSelection.has(versionId)) {
            newSelection.delete(versionId);
        } else {
            if (newSelection.size < 2) {
                newSelection.add(versionId);
            }
        }
        setSelectedVersions(newSelection);
    };

    if (isComparing) {
        return <ComparisonView onBack={() => setIsComparing(false)} versionIds={Array.from(selectedVersions)} />;
    }

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
            {/* File List */}
            <div className="lg:col-span-1 bg-surface rounded-xl border border-border-color p-4">
                <h3 className="font-semibold text-text-primary px-2 mb-2">Saved Queries</h3>
                <ul>
                    {sqlFilesData.map(file => (
                        <li key={file.id}>
                            <button 
                                onClick={() => setSelectedFile(file)}
                                className={`w-full text-left px-2 py-1.5 rounded-md text-sm ${selectedFile?.id === file.id ? 'bg-primary/10 text-primary font-medium' : 'hover:bg-gray-100 text-text-secondary'}`}
                            >
                                {file.name}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* Version List */}
            <div className="lg:col-span-2 bg-surface rounded-xl border border-border-color p-6">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h2 className="text-lg font-semibold text-text-primary">{selectedFile?.name}</h2>
                        <p className="text-sm text-text-secondary">Select up to 2 versions to compare.</p>
                    </div>
                    <button 
                        onClick={() => setIsComparing(true)}
                        disabled={selectedVersions.size !== 2} 
                        className="px-4 py-2 text-sm font-semibold text-white bg-primary rounded-lg shadow-sm hover:bg-primary-hover disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        Compare Versions
                    </button>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="text-left text-xs text-text-secondary uppercase">
                            <tr>
                                <th className="p-2 w-8"></th>
                                <th className="p-2">Version</th>
                                <th className="p-2">Date</th>
                                <th className="p-2">Tag</th>
                                <th className="p-2">Description</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedFile?.versions.map(v => (
                                <tr key={v.id} className="border-t border-border-color">
                                    <td className="p-2"><input type="checkbox" checked={selectedVersions.has(v.id)} onChange={() => handleVersionSelect(v.id)} className="rounded text-primary focus:ring-primary" /></td>
                                    <td className="p-2 font-medium text-text-primary">v{v.version}</td>
                                    <td className="p-2 text-text-secondary">{v.date}</td>
                                    <td className="p-2"><span className={`px-2 py-0.5 text-xs rounded-full ${v.tag === 'Production' ? 'bg-status-success-light text-status-success-dark' : 'bg-gray-100 text-gray-800'}`}>{v.tag}</span></td>
                                    <td className="p-2 text-text-secondary">{v.description}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

const ComparisonView: React.FC<{onBack: () => void, versionIds: string[]}> = ({ onBack, versionIds }) => (
    <div>
        <button onClick={onBack} className="text-sm font-semibold text-link mb-4">&larr; Back to Version List</button>
        <div className="bg-surface rounded-xl border border-border-color p-6">
            <h2 className="text-lg font-semibold text-text-primary">Comparing Versions</h2>
            <p className="text-sm text-text-secondary mb-4">Showing differences between selected versions ({versionIds.join(', ')}).</p>
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg font-mono text-xs">
                    <h3 className="font-semibold mb-2">Version A</h3>
                    <pre><code>-- SQL code for version A will be displayed here in a side-by-side diff view.</code></pre>
                </div>
                 <div className="bg-gray-50 p-4 rounded-lg font-mono text-xs">
                    <h3 className="font-semibold mb-2">Version B</h3>
                    <pre><code>-- SQL code for version B will be displayed here in a side-by-side diff view.</code></pre>
                </div>
            </div>
        </div>
    </div>
);


export default QueryWorkspace;
