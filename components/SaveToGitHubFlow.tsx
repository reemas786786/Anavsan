
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { User } from '../types';
import { IconChevronDown, IconSearch, IconGithub, IconAdd, IconClose } from '../constants';

// MOCK DATA
const githubExistingFiles = [
    'queries/daily_report.sql',
    'staging/user_segmentation.sql',
    'adhoc/investigation_2024-01-15.sql'
];

interface SaveToGitHubFlowProps {
    queryText: string;
    onCancel: () => void;
    onSave: (data: { repo: string; branch: string; filePath: string; commitMessage: string; }) => void;
    currentUser: User;
}

const SaveToGitHubFlow: React.FC<SaveToGitHubFlowProps> = ({ queryText, onCancel, onSave, currentUser }) => {
    // Hardcoded pre-configured values
    const org = 'anavsan-org';
    const repo = 'production-queries';
    const branch = 'main';

    const [fileInputMode, setFileInputMode] = useState<'select' | 'create'>('select');
    const [selectedFile, setSelectedFile] = useState(githubExistingFiles[0]);
    const [newFilePath, setNewFilePath] = useState(`queries/new-query-${new Date().toISOString().split('T')[0]}.sql`);
    const [commitMessage, setCommitMessage] = useState('Save new query from Anavsan');
    
    const isSaveDisabled = fileInputMode === 'create' ? !newFilePath.trim() : !selectedFile.trim();

    const handleSave = () => {
        if (isSaveDisabled) return;
        
        onSave({
            repo: `${org}/${repo}`,
            branch,
            filePath: fileInputMode === 'create' ? newFilePath : selectedFile,
            commitMessage
        });
    };

    return (
        <div className="flex flex-col h-full">
            <div className="p-8 space-y-6 flex-grow">
                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Saving to</label>
                    <div className="w-full border border-border-color rounded-full px-4 py-2.5 text-sm bg-surface-nested">
                        <span className="font-semibold text-text-primary">{org} / {repo} / {branch}</span>
                    </div>
                </div>

                <div>
                    <label htmlFor="file-path-input" className="block text-sm font-medium text-text-secondary mb-1">
                        File path / name
                    </label>
                    <div className="flex items-center gap-2">
                        {fileInputMode === 'select' ? (
                            <select
                                id="file-path-input"
                                value={selectedFile}
                                onChange={(e) => setSelectedFile(e.target.value)}
                                className="w-full border border-border-color rounded-full px-4 py-2.5 text-sm focus:ring-primary focus:border-primary bg-input-bg"
                            >
                                {githubExistingFiles.map(file => <option key={file} value={file}>{file}</option>)}
                            </select>
                        ) : (
                            <div className="relative flex-grow">
                                <input
                                    id="file-path-input"
                                    type="text"
                                    value={newFilePath}
                                    onChange={(e) => setNewFilePath(e.target.value)}
                                    className="w-full border border-border-color rounded-full px-4 py-2.5 text-sm focus:ring-primary focus:border-primary bg-input-bg font-mono"
                                />
                                <button 
                                    onClick={() => setFileInputMode('select')}
                                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-text-muted hover:text-text-primary"
                                    aria-label="Cancel new file"
                                    title="Cancel and select existing file"
                                >
                                    <IconClose className="h-5 w-5" />
                                </button>
                            </div>
                        )}

                        {fileInputMode === 'select' && (
                             <button 
                                onClick={() => setFileInputMode('create')}
                                className="w-10 h-10 flex items-center justify-center rounded-full border border-border-color bg-surface hover:bg-surface-hover text-text-primary transition-colors flex-shrink-0"
                                aria-label="Create new file"
                                title="Create new file"
                            >
                                <IconAdd className="h-5 w-5" />
                            </button>
                        )}
                    </div>
                </div>

                <div>
                     <label htmlFor="commit-message" className="block text-sm font-medium text-text-secondary mb-1">Commit Message (Optional)</label>
                     <textarea
                        id="commit-message"
                        rows={3}
                        value={commitMessage}
                        onChange={(e) => setCommitMessage(e.target.value)}
                        className="w-full border border-border-color rounded-2xl px-4 py-2.5 text-sm focus:ring-primary focus:border-primary bg-input-bg"
                        placeholder="e.g., Add new optimized query for monthly reporting"
                     />
                </div>
            </div>

            <div className="p-6 bg-background flex justify-end items-center gap-3 flex-shrink-0 border-t border-border-color">
                <button onClick={onCancel} className="text-sm font-semibold px-6 py-2.5 rounded-lg bg-button-secondary-bg text-primary hover:bg-button-secondary-bg-hover transition-colors">Cancel</button>
                <button
                    onClick={handleSave}
                    disabled={isSaveDisabled}
                    className="text-sm font-semibold text-white bg-primary hover:bg-primary-hover px-6 py-2.5 rounded-lg shadow-sm disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    Save
                </button>
            </div>
        </div>
    );
};

export default SaveToGitHubFlow;
