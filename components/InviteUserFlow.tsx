
import React, { useState } from 'react';
import { UserRole } from '../types';

interface InviteUserFlowProps {
    onCancel: () => void;
    onSendInvite: (data: { email: string; role: UserRole; message: string; }) => void;
}

const InviteUserFlow: React.FC<InviteUserFlowProps> = ({ onCancel, onSendInvite }) => {
    const [email, setEmail] = useState('');
    const [role, setRole] = useState<UserRole>('Analyst');
    const [message, setMessage] = useState('');

    const handleSubmit = () => {
        if (!email) {
            // Add more robust validation as needed
            return;
        }
        onSendInvite({ email, role, message });
    };

    return (
        <div className="flex flex-col h-full">
            <div className="p-8 space-y-6 flex-grow">
                <p className="text-sm text-text-secondary">
                    Enter the details of the user you'd like to invite to your Anavsan account.
                </p>
                
                <div>
                    <label htmlFor="email" className="block text-sm font-medium text-text-secondary mb-1">
                        Email ID
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border border-border-color rounded-full px-3 py-2 text-sm focus:ring-primary focus:border-primary bg-input-bg placeholder-text-secondary"
                        placeholder="e.g., jane.doe@example.com"
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

                <div>
                    <label htmlFor="message" className="block text-sm font-medium text-text-secondary mb-1">
                        Message (optional)
                    </label>
                    <textarea
                        id="message"
                        rows={4}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="w-full border border-border-color rounded-xl px-3 py-2 text-sm focus:ring-primary focus:border-primary bg-input-bg placeholder-text-secondary"
                        placeholder="Add a custom note for the invited user..."
                    />
                </div>
            </div>

            <div className="p-6 bg-background border-t border-border-color flex justify-end items-center gap-3 flex-shrink-0">
                <button
                    onClick={onCancel}
                    className="text-sm font-semibold px-4 py-2 rounded-full border border-border-color hover:bg-gray-50"
                    aria-label="Cancel invitation"
                >
                    Cancel
                </button>
                <button
                    onClick={handleSubmit}
                    className="text-sm font-semibold text-white bg-primary hover:bg-primary-hover px-4 py-2 rounded-full"
                    aria-label="Send user invitation"
                >
                    Send Invite
                </button>
            </div>
        </div>
    );
};

export default InviteUserFlow;
