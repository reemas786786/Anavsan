import React, { useState, useMemo } from 'react';
import { QueryListItem, User, UserRole, AssignmentPriority } from '../types';

interface AssignQueryFlowProps {
    query: QueryListItem;
    users: User[];
    onCancel: () => void;
    onAssign: (assignmentDetails: { assignee: string; priority: AssignmentPriority; message: string; }) => void;
}

const AssignQueryFlow: React.FC<AssignQueryFlowProps> = ({ query, users, onCancel, onAssign }) => {
    const dataEngineers = users.filter(u => u.role === 'Admin' || u.role === 'Analyst');

    const executedUser = useMemo(() => users.find(u => u.name === query.user), [users, query.user]);

    const [assigneeInput, setAssigneeInput] = useState(executedUser ? executedUser.email : '');
    const [priority, setPriority] = useState<AssignmentPriority>('Medium');
    const [message, setMessage] = useState('');

    const isNewUser = useMemo(() => {
        if (executedUser || !assigneeInput || !assigneeInput.includes('@')) return false;
        return !users.some(u => u.email.toLowerCase() === assigneeInput.toLowerCase());
    }, [assigneeInput, users, executedUser]);

    const handleSubmit = () => {
        if (!assigneeInput) {
            alert("Please select or enter a user to assign the query to.");
            return;
        }

        const assigneePayload = executedUser ? executedUser.id : assigneeInput;
        
        onAssign({ assignee: assigneePayload, priority, message });
    };

    return (
        <div className="flex flex-col h-full">
            <div className="p-8 space-y-6 flex-grow">
                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Query</label>
                    <pre className="bg-input-bg p-3 rounded-lg border border-border-color text-xs text-text-primary overflow-auto max-h-40 whitespace-pre-wrap">
                        <code>{query.queryText}</code>
                    </pre>
                </div>

                <div>
                    <label className="block text-sm font-medium text-text-secondary mb-1">Warehouse</label>
                    <div className="bg-input-bg p-3 rounded-full border border-border-color text-sm text-text-primary">
                        {query.warehouse}
                    </div>
                </div>

                <div>
                    <label htmlFor="assignee-input" className="block text-sm font-medium text-text-secondary mb-1">
                        Assign to
                    </label>
                    {executedUser ? (
                        <>
                            <input
                                id="assignee-input"
                                type="text"
                                value={executedUser.name}
                                disabled
                                className="w-full border border-border-color rounded-full px-3 py-2 text-sm bg-surface-nested cursor-not-allowed"
                            />
                            <p className="mt-2 text-xs text-text-muted">
                                Only the executed user can be assigned this query.
                            </p>
                        </>
                    ) : (
                        <>
                            <input
                                id="assignee-input"
                                type="email"
                                list="data-engineers"
                                value={assigneeInput}
                                onChange={(e) => setAssigneeInput(e.target.value)}
                                className="w-full border border-border-color rounded-full px-3 py-2 text-sm focus:ring-primary focus:border-primary bg-input-bg"
                                placeholder="Select user or enter new email..."
                            />
                            <datalist id="data-engineers">
                                {dataEngineers.map(user => (
                                    <option key={user.id} value={user.email}>{user.name}</option>
                                ))}
                            </datalist>
                            {isNewUser && (
                                <p className="mt-2 text-xs text-text-muted">
                                    An invitation will be sent to this email. They’ll need to sign up to access the assigned query.
                                </p>
                            )}
                        </>
                    )}
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
                        placeholder="e.g., Please analyze and optimize before next sync."
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