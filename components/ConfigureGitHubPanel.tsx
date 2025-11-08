
import React, { useState, useEffect, useMemo } from 'react';
import { IconChevronDown, IconSearch, IconClose } from '../constants';

// --- ICONS ---
const IconFolder: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
    </svg>
);

const IconFile: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
    </svg>
);

// --- DUMMY DATA ---
const githubOrgs = [
    { id: 'personal', name: 'Personal Account' },
    { id: 'anavsan-org', name: 'anavsan-org' },
    { id: 'acme-corp', name: 'acme-corp' },
];

const githubRepos: { [key: string]: string[] } = {
    'personal': ['dotfiles', 'my-website', 'project-x'],
    'anavsan-org': ['production-queries', 'data-pipelines', 'infrastructure', 'docs'],
    'acme-corp': ['monorepo', 'legacy-system', 'marketing-site'],
};

const githubFileTree: { [key: string]: any } = {
  'production-queries': {
    'src': {
      'queries': {
        'main.sql': { type: 'file' },
        'helpers.sql': { type: 'file' },
        'deprecated': {
          type: 'dir',
          children: { 'old_query.sql': { type: 'file' } }
        }
      },
      'utils.js': { type: 'file' }
    },
    'README.md': { type: 'file' },
    '.gitignore': { type: 'file' }
  },
};

const getFilesForPath = (repo: string, path: string[]) => {
    if (!githubFileTree[repo]) return [];
    
    let currentLevel = githubFileTree[repo];
    for (const segment of path) {
        if (currentLevel[segment] && currentLevel[segment].type === 'dir') {
            currentLevel = currentLevel[segment].children;
        } else {
            return []; // Invalid path
        }
    }
    
    return Object.entries(currentLevel).map(([name, obj]: [string, any]) => ({
        name,
        type: obj.type === 'dir' ? 'dir' : 'file',
    }));
};

const LoadingSpinner: React.FC = () => (
    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
);

// --- COMPONENT PROPS ---
interface ConfigureGitHubPanelProps {
    onCancel: () => void;
    onSave: (repoFullName: string, filePath: string | null) => void;
    connectedRepo: string | null;
    connectedFilePath: string | null;
}

// --- MAIN COMPONENT ---
const ConfigureGitHubPanel: React.FC<ConfigureGitHubPanelProps> = ({ onCancel, onSave, connectedRepo, connectedFilePath }) => {
    const [selectedOrg, setSelectedOrg] = useState('anavsan-org'); // Pre-selected as per prompt
    const [selectedRepo, setSelectedRepo] = useState('');
    const [reposForOrg, setReposForOrg] = useState<string[]>([]);
    const [isLoadingRepos, setIsLoadingRepos] = useState(false);
    const [repoSearchTerm, setRepoSearchTerm] = useState('');

    const [selectedFile, setSelectedFile] = useState<string | null>(null);
    const [isBrowserVisible, setIsBrowserVisible] = useState(false);
    const [currentPath, setCurrentPath] = useState<string[]>([]);
    const [files, setFiles] = useState<{ name: string; type: 'file' | 'dir' }[]>([]);
    const [isLoadingFiles, setIsLoadingFiles] = useState(false);

    // Pre-populate form from existing connection
    useEffect(() => {
        if (connectedRepo) {
            const [orgName, repoName] = connectedRepo.split('/');
            const orgId = githubOrgs.find(o => o.name === orgName)?.id || orgName;
            setSelectedOrg(orgId);
            setSelectedRepo(repoName);
            if (connectedFilePath) {
                setSelectedFile(connectedFilePath);
                setIsBrowserVisible(false);
            }
        }
    }, [connectedRepo, connectedFilePath]);

    // Fetch repos when org changes
    useEffect(() => {
        if (selectedOrg) {
            setIsLoadingRepos(true);
            setReposForOrg([]);
            setRepoSearchTerm('');
            setTimeout(() => {
                setReposForOrg(githubRepos[selectedOrg] || []);
                setIsLoadingRepos(false);
            }, 500);
        } else {
            setReposForOrg([]);
        }
    }, [selectedOrg]);

    // Fetch files when repo or path changes
    useEffect(() => {
        if (selectedRepo) {
            setIsLoadingFiles(true);
            setTimeout(() => {
                setFiles(getFilesForPath(selectedRepo, currentPath));
                setIsLoadingFiles(false);
            }, 300);
        }
    }, [selectedRepo, currentPath]);

    const filteredRepos = useMemo(() => {
        if (!repoSearchTerm) return reposForOrg;
        return reposForOrg.filter(repo => repo.toLowerCase().includes(repoSearchTerm.toLowerCase()));
    }, [reposForOrg, repoSearchTerm]);
    
    const handleSave = () => {
        if (selectedOrg && selectedRepo) {
            const orgName = githubOrgs.find(o => o.id === selectedOrg)?.name || selectedOrg;
            onSave(`${orgName}/${selectedRepo}`, selectedFile);
        }
    };
    
    const FileBrowser = () => (
        <div className="mt-2 border border-border-color rounded-lg max-h-60 flex flex-col">
            <div className="flex-shrink-0 p-2 border-b border-border-color flex items-center gap-2">
                <button
                    onClick={() => setCurrentPath(prev => prev.slice(0, -1))}
                    disabled={currentPath.length === 0}
                    className="text-sm font-medium text-link disabled:text-text-muted disabled:cursor-not-allowed"
                >
                    Up
                </button>
                <span className="text-sm text-text-secondary">/ {currentPath.join('/')}</span>
            </div>
            <ul className="overflow-y-auto">
                {isLoadingFiles ? (
                    <li className="p-4 text-center text-text-muted">Loading files...</li>
                ) : (
                    files.map(item => (
                        <li key={item.name}>
                            <button
                                onClick={() => {
                                    if (item.type === 'dir') {
                                        setCurrentPath(prev => [...prev, item.name]);
                                    } else {
                                        setSelectedFile([...currentPath, item.name].join('/'));
                                        setIsBrowserVisible(false);
                                    }
                                }}
                                className="w-full text-left px-4 py-2 text-sm hover:bg-surface-hover text-text-primary flex items-center gap-2"
                            >
                                {item.type === 'dir' ? <IconFolder className="h-4 w-4 text-yellow-500"/> : <IconFile className="h-4 w-4 text-gray-500"/>}
                                {item.name}
                            </button>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );

    return (
        <div className="flex flex-col h-full">
            <div className="p-8 space-y-6 flex-grow">
                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">
                        GitHub Account / Organization
                    </label>
                    <select
                        value={selectedOrg}
                        disabled // As per prompt, this is not changeable in this flow.
                        className="w-full border border-border-color rounded-full px-4 py-2.5 text-sm bg-surface-nested cursor-not-allowed"
                    >
                        {githubOrgs.map(org => <option key={org.id} value={org.id}>{org.name}</option>)}
                    </select>
                </div>
                
                <div>
                    <label htmlFor="repo-search" className="block text-sm font-medium text-text-secondary mb-1">
                        Select a Repository
                    </label>
                    <div className="relative">
                         <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            {isLoadingRepos ? <LoadingSpinner /> : <IconSearch className="h-5 w-5 text-text-muted" />}
                        </div>
                        <input
                            id="repo-search" type="text" value={repoSearchTerm} onChange={(e) => setRepoSearchTerm(e.target.value)}
                            placeholder="Search repositories..." disabled={!selectedOrg || isLoadingRepos}
                            className="w-full pl-11 pr-4 py-2.5 bg-input-bg border border-border-color rounded-full text-sm focus:ring-1 focus:ring-primary disabled:bg-gray-100"
                        />
                    </div>
                    {!isLoadingRepos && selectedOrg && (
                        <div className="mt-2 border border-border-color rounded-lg max-h-48 overflow-y-auto">
                            <ul>
                                {filteredRepos.map(repo => (
                                    <li key={repo}><button onClick={() => setSelectedRepo(repo)}
                                        className={`w-full text-left px-4 py-2 text-sm hover:bg-surface-hover ${selectedRepo === repo ? 'bg-primary/10 text-primary font-semibold' : 'text-text-primary'}`}>
                                        {repo}
                                    </button></li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                {selectedRepo && (
                     <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">File (Optional)</label>
                        {selectedFile ? (
                            <div className="flex items-center justify-between p-2 pl-4 bg-surface-nested rounded-lg border border-border-color">
                                <span className="text-sm font-mono text-text-primary">{selectedFile}</span>
                                <button onClick={() => setSelectedFile(null)} className="p-1 rounded-full text-text-muted hover:bg-surface-hover" title="Clear file selection">
                                    <IconClose className="h-4 w-4" />
                                </button>
                            </div>
                        ) : isBrowserVisible ? (
                            <FileBrowser />
                        ) : (
                            <button onClick={() => { setIsBrowserVisible(true); setCurrentPath([])}} className="text-sm font-medium text-link hover:underline">
                                Specify a file (optional)
                            </button>
                        )}
                    </div>
                )}
            </div>
            
            <div className="p-6 bg-background flex justify-end items-center gap-3 flex-shrink-0 border-t border-border-color">
                <button onClick={onCancel} className="text-sm font-semibold px-6 py-2.5 rounded-lg bg-button-secondary-bg text-primary hover:bg-button-secondary-bg-hover transition-colors">Cancel</button>
                <button onClick={handleSave} disabled={!selectedRepo}
                    className="text-sm font-semibold text-white bg-primary hover:bg-primary-hover px-6 py-2.5 rounded-lg shadow-sm disabled:bg-gray-300 disabled:cursor-not-allowed">
                    Save Connection
                </button>
            </div>
        </div>
    );
};

export default ConfigureGitHubPanel;
