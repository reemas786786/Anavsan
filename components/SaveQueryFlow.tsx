

import React, { useState } from 'react';
import { SQLFile } from '../types';
import TagSelector from './TagSelector';

interface SaveQueryFlowProps {
  files: SQLFile[];
  onCancel: () => void;
  onSave: (data: { saveType: 'new' | 'existing'; fileName: string; fileId?: string; description: string; tag: string; }) => void;
}

const SaveQueryFlow: React.FC<SaveQueryFlowProps> = ({ files, onCancel, onSave }) => {
    const [saveType, setSaveType] = useState<'existing' | 'new'>(files.length > 0 ? 'existing' : 'new');
    const [selectedFileId, setSelectedFileId] = useState<string>(files.length > 0 ? files[0].id : '');
    const [newFileName, setNewFileName] = useState('');
    const [description, setDescription] = useState('');
    const [selectedTag, setSelectedTag] = useState('Production');

    const availableTags = ['Production', 'Staging', 'Archived', 'Optimizer', 'Analyzer'];

    const handleSubmit = () => {
        if (saveType === 'new') {
            if (!newFileName.trim()) return; // Basic validation
            onSave({
                saveType: 'new',
                fileName: newFileName,
                description,
                tag: selectedTag
            });
        } else {
            if (!selectedFileId) return;
            const selectedFile = files.find(f => f.id === selectedFileId);
            if (!selectedFile) return;
            onSave({
                saveType: 'existing',
                fileName: selectedFile.name,
                fileId: selectedFileId,
                description,
                tag: selectedTag
            });
        }
    };

    return (
        <div className="flex flex-col h-full">
            <div className="p-8 space-y-6 flex-grow">
                {/* Save Type Radio */}
                <fieldset>
                    <legend className="block text-sm font-medium text-text-secondary mb-2">Save option</legend>
                    <div className="flex gap-6">
                        <div className="flex items-center">
                            <input id="save-existing" name="save-type" type="radio" value="existing" checked={saveType === 'existing'} onChange={() => setSaveType('existing')} className="h-4 w-4 text-primary border-gray-300 focus:ring-primary" disabled={files.length === 0} />
                            <label htmlFor="save-existing" className={`ml-2 block text-sm ${files.length === 0 ? 'text-text-muted' : 'text-text-primary'}`}>Save to existing file</label>
                        </div>
                        <div className="flex items-center">
                            <input id="save-new" name="save-type" type="radio" value="new" checked={saveType === 'new'} onChange={() => setSaveType('new')} className="h-4 w-4 text-primary border-gray-300 focus:ring-primary" />
                            <label htmlFor="save-new" className="ml-2 block text-sm text-text-primary">Save as new file</label>
                        </div>
                    </div>
                </fieldset>

                {/* Dynamic Input */}
                {saveType === 'existing' ? (
                    <div>
                        <label htmlFor="file-select" className="block text-sm font-medium text-text-secondary mb-1">Select a file</label>
                        <select
                            id="file-select"
                            value={selectedFileId}
                            onChange={(e) => setSelectedFileId(e.target.value)}
                            className="w-full border border-border-color rounded-full px-3 py-2 text-sm focus:ring-primary focus:border-primary bg-input-bg"
                        >
                            {files.map(file => <option key={file.id} value={file.id}>{file.name}</option>)}
                        </select>
                    </div>
                ) : (
                    <div>
                        <label htmlFor="new-file-name" className="block text-sm font-medium text-text-secondary mb-1">New file name</label>
                        <input
                            type="text"
                            id="new-file-name"
                            value={newFileName}
                            onChange={(e) => setNewFileName(e.target.value)}
                            className="w-full border border-border-color rounded-full px-3 py-2 text-sm focus:ring-primary focus:border-primary bg-input-bg placeholder-text-secondary"
                            placeholder="e.g., my_optimized_query.sql"
                        />
                    </div>
                )}
                
                {/* Description */}
                <div>
                     <label htmlFor="description" className="block text-sm font-medium text-text-secondary mb-1">Description (optional)</label>
                     <textarea
                        id="description"
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full border border-border-color rounded-3xl px-3 py-2 text-sm focus:ring-primary focus:border-primary bg-input-bg placeholder-text-secondary"
                        placeholder="Describe the changes in this version..."
                     />
                </div>

                {/* Tag Selector */}
                <TagSelector tags={availableTags} selectedTag={selectedTag} onSelectTag={setSelectedTag} />

            </div>
            <div className="p-6 bg-background flex justify-end items-center gap-3 flex-shrink-0">
                <button onClick={onCancel} className="text-sm font-semibold px-4 py-2 rounded-full border border-border-color hover:bg-gray-50">Cancel</button>
                <button onClick={handleSubmit} className="text-sm font-semibold text-white bg-primary hover:bg-primary-hover px-4 py-2 rounded-full">Save Query</button>
            </div>
        </div>
    );
};

export default SaveQueryFlow;
