
import React, { useState } from 'react';
import { UserRole } from '../types';

interface InviteUserFlowProps {
    onCancel: () => void;
    onAddUser: (data: { name: string; role: UserRole; }) => void;
}

const InviteUserFlow: React.FC<InviteUserFlowProps> = ({ onCancel, onAddUser }) => {
    const [name, setName] = useState('');
    const [role, setRole] = useState<UserRole>('Analyst');

    const handleSubmit = () => {
        if (!name.trim()) {
            // Add more robust validation as needed
            return;
        }
        onAddUser({ name, role });
    };

    return (
        <div className="flex flex-col h-full">
            <div className="p-8 space-y-6 flex-grow">
                <p className="text-sm text-text-secondary">
                    Add a new user to your Anavsan account and assign them a role.
                </p>
                
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-text-secondary mb-1">
                        User Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border border-border-color rounded-full px-3 py-2 text-sm focus:ring-primary focus:border-primary bg-input-bg placeholder-text-secondary"
                        placeholder="e.g., Jane Doe"
                        aria-required="true"
                    />
                </div>

                <div>
                    <label htmlFor="role" className="block text-sm font-medium text-text-secondary mb-1">
                        Role
                    </label>
                    <select
                        id="role"
                        value={role}
                        onChange={(e) => setRole(e.target.value as UserRole)}
                        className="w-full border border-border-color rounded-full px-3 py-2 text-sm focus:ring-primary focus:border-primary bg-input-bg"
                    >
                        <option>Admin</option>
                        <option>Analyst</option>
                        <option>Viewer</option>
                    </select>
                </div>
            </div>

            <div className="p-6 bg-background border-t border-border-color flex justify-end items-center gap-3 flex-shrink-0">
                <button
                    onClick={onCancel}
                    className="text-sm font-semibold px-4 py-2 rounded-full border border-border-color hover:bg-gray-50"
                    aria-label="Cancel adding user"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSubmit}
                    className="text-sm font-semibold text-white bg-primary hover:bg-primary-hover px-4 py-2 rounded-full"
                    aria-label="Save new user"
                >
                    Save
                </button>
            </div>
        </div>
    );
};

export default InviteUserFlow;