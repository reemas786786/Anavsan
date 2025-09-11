import React, { useState } from 'react';
import { SQLFile } from '../types';

// FIX: Added props interface to accept `sqlFiles` and `onSaveQueryClick` to resolve type error when used in AccountView.
interface QueryWorkspaceProps {
    sqlFiles: SQLFile[];
    onSaveQueryClick: () => void;
}

// FIX: Updated Tag component to handle optional tag property as per SQLVersion type.
const Tag: React.FC<{ tag?: string }> = ({ tag }) => {
    if (!tag) {
        return null;
    }
    const baseClasses = "px-2 py-0.5 text-xs rounded-full font-medium";
    let colorClasses = "bg-gray-100 text-gray-800"; // Default for Archived/Staging
    if (tag === 'Production') {
        colorClasses = "bg-status-success-light text-status-success-dark";
    }
    return <span className={`${baseClasses} ${colorClasses}`}>{tag}</span>
}

const QueryWorkspace: React.FC<QueryWorkspaceProps> = ({ sqlFiles, onSaveQueryClick }) => {
    // FIX: Used sqlFiles from props instead of hardcoded dummy data, with a fallback for empty arrays.
    const [selectedFile, setSelectedFile] = useState<SQLFile | null>(sqlFiles[0] || null);
    const [selectedVersions, setSelectedVersions] = useState<Set<string>>(new Set());

    const handleVersionSelect = (versionId: string) => {
        const newSelection = new Set(selectedVersions);
        if (newSelection.has(versionId)) {
            newSelection.delete(versionId);
        } else {
            if (newSelection.size < 2) {
                newSelection.add(versionId);
            } else {
                // Optional: show a notification that max 2 can be selected
            }
        }
        setSelectedVersions(newSelection);
    };
    
    const handleSelectFile = (file: SQLFile) => {
        setSelectedFile(file);
        setSelectedVersions(new Set()); // Reset selections when file changes
    }

    return (
        <div className="space-y-4">
            <h1 className="text-2xl font-bold text-text-primary">Query Workspace</h1>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-full">
                {/* File List */}
                <div className="lg:col-span-1 bg-surface rounded-3xl border border-border-color p-4">
                    <h4 className="font-semibold text-text-strong px-2 mb-4 text-base">Saved Queries</h4>
                    <ul>
                        {/* FIX: Used `sqlFiles` from props instead of `sqlFilesData`. */}
                        {sqlFiles.map(file => (
                            <li key={file.id}>
                                <button 
                                    onClick={() => handleSelectFile(file)}
                                    className={`w-full text-left px-2 py-1.5 rounded-md text-sm transition-colors ${selectedFile?.id === file.id ? 'bg-primary/10 text-primary font-semibold' : 'hover:bg-surface-hover text-text-secondary'}`}
                                >
                                    {file.name}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Version List */}
                <div className="lg:col-span-2 bg-surface rounded-3xl border border-border-color p-4">
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <h4 className="text-base font-semibold text-text-strong">{selectedFile?.name}</h4>
                            <p className="text-sm text-text-secondary">Select up to 2 versions to compare.</p>
                        </div>
                        <button 
                            disabled={selectedVersions.size !== 2} 
                            className="px-4 py-2 text-sm font-semibold text-white bg-primary rounded-full shadow-sm hover:bg-primary-hover disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
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
                                    <tr key={v.id} className="border-t border-border-color hover:bg-surface-hover">
                                        <td className="p-2">
                                            <input 
                                                type="checkbox" 
                                                checked={selectedVersions.has(v.id)} 
                                                onChange={() => handleVersionSelect(v.id)} 
                                                className="h-4 w-4 rounded text-gray-700 border-gray-300 focus:ring-primary" 
                                            />
                                        </td>
                                        <td className="p-2 font-medium text-text-primary">v{v.version}</td>
                                        <td className="p-2 text-text-secondary">{v.date}</td>
                                        <td className="p-2"><Tag tag={v.tag} /></td>
                                        <td className="p-2 text-text-secondary">{v.description}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QueryWorkspace;
