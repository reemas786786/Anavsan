
import React, { useState, useRef, useEffect } from 'react';
import { User } from '../types';
import { IconEdit, IconUser, IconLockClosed, IconPhoto } from '../constants';

interface ProfileSettingsPageProps {
  user: User;
  onSave: (updatedUser: User) => void;
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

const ProfileCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-surface p-6 rounded-3xl border border-border-color shadow-sm">
        <h3 className="text-lg font-semibold text-text-strong mb-6">{title}</h3>
        {children}
    </div>
);

const UserInfoSection: React.FC<{ user: User; onSave: (updatedUser: User) => void; }> = ({ user, onSave }) => {
    const [isEditingInfo, setIsEditingInfo] = useState(false);
    const [userInfo, setUserInfo] = useState({ name: user.name, email: user.email, roleTitle: user.roleTitle || '' });
    
    useEffect(() => {
        setUserInfo({ name: user.name, email: user.email, roleTitle: user.roleTitle || '' });
    }, [user]);

    const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
    };

    const handleSaveInfo = () => {
        onSave({ ...user, ...userInfo });
        setIsEditingInfo(false);
    };
    
    const InfoField: React.FC<{label: string, value: string, name: string, isEditing: boolean, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void}> = ({label, value, name, isEditing, onChange}) => (
        <div>
            <label className="block text-sm font-medium text-text-secondary">{label}</label>
            {isEditing ? (
                <input type="text" name={name} value={value} onChange={onChange} className="mt-1 w-full border border-border-color rounded-full px-3 py-2 text-sm focus:ring-primary focus:border-primary bg-input-bg" />
            ) : (
                <p className="mt-1 text-sm text-text-primary h-9 flex items-center">{value || 'Not set'}</p>
            )}
        </div>
    );
    
    return (
        <ProfileCard title="User Info">
            <div className="space-y-4">
                <InfoField label="Display Name" name="name" value={userInfo.name} isEditing={isEditingInfo} onChange={handleInfoChange} />
                <InfoField label="Email" name="email" value={userInfo.email} isEditing={isEditingInfo} onChange={handleInfoChange} />
                <InfoField label="Role Title" name="roleTitle" value={userInfo.roleTitle} isEditing={isEditingInfo} onChange={handleInfoChange} />
            </div>
            <div className="mt-6 pt-6 border-t border-border-color text-right">
                {isEditingInfo ? (
                     <button onClick={handleSaveInfo} className="text-sm font-semibold text-white bg-primary hover:bg-primary-hover px-4 py-2 rounded-full">Save Changes</button>
                ) : (
                    <button onClick={() => setIsEditingInfo(true)} className="text-sm font-semibold px-4 py-2 rounded-full border border-border-color hover:bg-gray-50 flex items-center gap-2 ml-auto">
                        <IconEdit className="h-4 w-4" /> Edit
                    </button>
                )}
            </div>
        </ProfileCard>
    );
};

const ChangePasswordSection: React.FC = () => {
    const [passwords, setPasswords] = useState({ old: '', new: '', confirm: '' });

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswords({ ...passwords, [e.target.name]: e.target.value });
    };

    const handleUpdatePassword = () => {
        if (passwords.new !== passwords.confirm) {
            alert("New passwords do not match.");
            return;
        }
        if (passwords.new.length < 8) {
             alert("Password must be at least 8 characters long.");
            return;
        }
        alert("Password updated successfully (mock).");
        setPasswords({ old: '', new: '', confirm: '' });
    };

    return (
        <ProfileCard title="Change Password">
             <>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-text-secondary">Current Password</label>
                        <input type="password" name="old" value={passwords.old} onChange={handlePasswordChange} className="mt-1 w-full border border-border-color rounded-full px-3 py-2 text-sm focus:ring-primary focus:border-primary bg-input-bg" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-secondary">New Password</label>
                        <input type="password" name="new" value={passwords.new} onChange={handlePasswordChange} className="mt-1 w-full border border-border-color rounded-full px-3 py-2 text-sm focus:ring-primary focus:border-primary bg-input-bg" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-text-secondary">Confirm New Password</label>
                        <input type="password" name="confirm" value={passwords.confirm} onChange={handlePasswordChange} className="mt-1 w-full border border-border-color rounded-full px-3 py-2 text-sm focus:ring-primary focus:border-primary bg-input-bg" />
                    </div>
                </div>
                <div className="mt-6 pt-6 border-t border-border-color flex justify-end items-center">
                    <button onClick={handleUpdatePassword} className="text-sm font-semibold text-white bg-primary hover:bg-primary-hover px-4 py-2 rounded-full">Update Password</button>
                </div>
            </>
        </ProfileCard>
    );
};


const BrandSettingsSection: React.FC = () => {
    const [logo, setLogo] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (event) => {
                setLogo(event.target?.result as string);
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };
    
    return (
        <ProfileCard title="Brand Settings">
            <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border border-border-color">
                    {logo ? <img src={logo} alt="Logo Preview" className="w-full h-full object-cover" /> : <span className="text-xs text-text-muted">Logo</span>}
                </div>
                <div>
                    <p className="text-sm text-text-secondary mb-2">Upload your company logo (PNG or SVG recommended).</p>
                     <input type="file" accept="image/png, image/svg+xml" onChange={handleLogoUpload} ref={fileInputRef} className="hidden" />
                    <button onClick={() => fileInputRef.current?.click()} className="text-sm font-semibold px-4 py-2 rounded-full border border-border-color hover:bg-gray-50">
                        {logo ? 'Replace Logo' : 'Upload Logo'}
                    </button>
                </div>
            </div>
        </ProfileCard>
    );
};


const ProfileSettingsPage: React.FC<ProfileSettingsPageProps> = ({ user, onSave, onBack }) => {
    const [activeSection, setActiveSection] = useState('User Info');
    
    const settingsNavItems = [
        { name: 'User Info', icon: IconUser },
        { name: 'Change Password', icon: IconLockClosed },
        { name: 'Brand Settings', icon: IconPhoto },
    ];
    
    const renderContent = () => {
        switch(activeSection) {
            case 'User Info': return <UserInfoSection user={user} onSave={onSave} />;
            case 'Change Password': return <ChangePasswordSection />;
            case 'Brand Settings': return <BrandSettingsSection />;
            default: return null;
        }
    };

    return (
        <div className="flex flex-col h-full bg-background">
            <div className="bg-surface w-full py-4 px-6 border-b border-border-color flex-shrink-0">
                <Breadcrumb items={[{ label: 'Dashboard', onClick: onBack }, { label: 'Profile Settings' }]} />
            </div>
            <div className="flex flex-1 overflow-hidden">
                <aside className="w-64 bg-surface flex-shrink-0 border-r border-border-color p-4">
                    <nav className="mt-4">
                        <ul className="space-y-1">
                            {settingsNavItems.map(item => (
                                <li key={item.name}>
                                    <button
                                        onClick={() => setActiveSection(item.name)}
                                        className={`w-full flex items-center gap-2 text-left px-3 py-2 rounded-full text-sm font-medium transition-colors ${activeSection === item.name ? 'bg-primary/10 text-primary' : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'}`}
                                    >
                                        <item.icon className={`h-4 w-4 shrink-0 ${activeSection === item.name ? 'text-primary' : 'text-text-secondary'}`} />
                                        {item.name}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </aside>
                <main className="flex-1 overflow-y-auto p-4">
                    <div className="max-w-3xl">
                        {renderContent()}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ProfileSettingsPage;
