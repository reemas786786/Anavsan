
import React from 'react';
import { User } from '../types';

interface UserViewProps {
    user: User;
    onBack: () => void;
}

const Breadcrumb: React.FC<{ items: { label: string; onClick?: () => void }[] }> = ({ items }) => (
    <nav className="text-sm text-text-secondary">
        {items.map((item, index) => (
            <span key={index}>
                {index > 0 && <span className="mx-2">/</span>}
                {item.onClick ? (
                    <button onClick={item.onClick} className="hover:underline text-link">{item.label}</button>
                ) : (
                    <span className="text-text-primary font-medium">{item.label}</span>
                )}
            </span>
        ))}
    </nav>
);

const UserView: React.FC<UserViewProps> = ({ user, onBack }) => {
    const breadcrumbItems = [
        { label: 'Data Cloud Overview', onClick: onBack },
        { label: user.name },
    ];

    return (
        <div className="flex flex-col h-full bg-background">
            <div className="bg-surface w-full py-4 px-6 flex-shrink-0">
                <Breadcrumb items={breadcrumbItems} />
            </div>
            <main className="flex-1 overflow-y-auto p-4">
                <div className="bg-surface p-4 rounded-3xl">
                    <h1 className="text-2xl font-bold text-text-primary">{user.name}'s Overview</h1>
                    <p className="mt-2 text-text-secondary">Detailed metrics for this user, such as queries run, spend history, and optimization opportunities, will be displayed here.</p>
                </div>
            </main>
        </div>
    );
};

export default UserView;
