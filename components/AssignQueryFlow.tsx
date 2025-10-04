
import React, { useState } from 'react';
import { QueryListItem, User, UserRole, AssignmentPriority } from '../types';

interface AssignQueryFlowProps {
    query: QueryListItem;
    users: User[];
    onCancel: () => void;
    onAssign: (assignmentDetails: { assigneeId: string; priority: AssignmentPriority; message: string; }) => void;
}

const AssignQueryFlow: React.FC<AssignQueryFlowProps> = ({ query, users, onCancel, onAssign }) => {
    const dataEngineers = users.filter(u => u.role === 'Admin' || u.role === 'Analyst');

    const [assigneeId, setAssigneeId] = useState<string>(dataEngineers.length > 0 ? dataEngineers[0].id : '');
    const [priority, setPriority] = useState<AssignmentPriority>('Medium');
    const [message, setMessage] = useState('');

    const handleSubmit = () => {
        if (!assigneeId) {
            alert("Please select a user to assign the query to.");
            return;
        }
        onAssign({ assigneeId, priority, message });
    };

    return (
        <div className="flex flex-col h-full">
            <div className="p-8 space-y-6 flex-grow">
                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Query</label>
                    <pre className="bg-input-bg p-3 rounded-lg border border-border-color text-xs text-text-primary overflow-x-auto">
                        <code>{query.queryText}</code>
                    </pre>
                </div>

                <div>
                    <label htmlFor="assignee" className="block text-sm font-medium text-text-secondary mb-1">
                        Assign to Data Engineer
                    </label>
                    <select
                        id="assignee"
                        value={assigneeId}
                        onChange={(e) => setAssigneeId(e.target.value)}
                        className="w-full border border-border-color rounded-full px-3 py-2 text-sm focus:ring-primary focus:border-primary bg-input-bg"
                    >
                        {dataEngineers.map(user => (
                            <option key={user.id} value={user.id}>{user.name}</option>
                        ))}
                    </select>
                </div>

                <fieldset>
                    <legend className="block text-sm font-medium text-text-secondary mb-2">Priority</legend>
                    <div className="flex gap-4">
                        {(['Low', 'Medium', 'High'] as AssignmentPriority[]).map(p => (
                            <label key={p} className="flex items-center">
                                <input
                                    type="radio"
                                    name="priority"
                                    value={p}
                                    checked={priority === p}
                                    onChange={() => setPriority(p)}
                                    className="h-4 w-4 text-primary border-gray-300 focus:ring-primary"
                                />
                                <span className="ml-2 text-sm text-text-primary">{p}</span>
                            </label>
                        ))}
                    </div>
                </fieldset>
                
                <div>
                     <label htmlFor="message" className="block text-sm font-medium text-text-secondary mb-1">Message / Context (optional)</label>
                     <textarea
                        id="message"
                        rows={4}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full border border-border-color rounded-3xl px-3 py-2 text-sm focus:ring-primary focus:border-primary bg-input-bg placeholder-text-secondary"
                        placeholder="e.g., This query is consuming 12k credits, check for joins..."
                     />
                </div>
            </div>

            <div className="p-6 bg-background border-t border-border-color flex justify-end items-center gap-3 flex-shrink-0">
                <button onClick={onCancel} className="text-sm font-semibold px-4 py-2 rounded-full border border-border-color hover:bg-gray-50">Cancel</button>
                <button onClick={handleSubmit} className="text-sm font-semibold text-white bg-primary hover:bg-primary-hover px-4 py-2 rounded-full">Assign Query</button>
            </div>
        </div>
    );
};

export default AssignQueryFlow;
