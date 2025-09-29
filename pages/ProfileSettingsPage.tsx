
import React, { useState, useRef, useEffect } from 'react';
import { User } from '../types';
import { IconEdit, IconUser, IconLockClosed, IconPhoto, IconChevronLeft, IconChevronRight } from '../constants';

interface ProfileSettingsPageProps {
  user: User;
  onSave: (updatedUser: User) => void;
  onBack: () => void;
  brandLogo: string | null;
  onUpdateBrandLogo: (logoUrl: string) => void;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const ProfileCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <div className="bg-surface p-4 rounded-3xl break-inside-avoid mb-4">
        <h3 className="text-lg font-semibold text-text-strong mb-4">{title}</h3>
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

    const handleCancelEdit = () => {
        setUserInfo({ name: user.name, email: user.email, roleTitle: user.roleTitle || '' });
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
        <ProfileCard title="User info">
            <div className="space-y-4">
                <InfoField label="Display Name" name="name" value={userInfo.name} isEditing={isEditingInfo} onChange={handleInfoChange} />
                <InfoField label="Email" name="email" value={userInfo.email} isEditing={isEditingInfo} onChange={handleInfoChange} />
                <InfoField label="Role Title" name="roleTitle" value={userInfo.roleTitle} isEditing={isEditingInfo} onChange={handleInfoChange} />
            </div>
            <div className="mt-4 pt-4 border-t border-border-color flex justify-end">
                {isEditingInfo ? (
                    <div className="flex items-center gap-3">
                        <button onClick={handleCancelEdit} className="text-sm font-semibold px-4 py-2 rounded-full border border-border-color hover:bg-gray-50">Cancel</button>
                        <button onClick={handleSaveInfo} className="text-sm font-semibold text-white bg-primary hover:bg-primary-hover px-4 py-2 rounded-full">Save Changes</button>
                    </div>
                ) : (
                    <button onClick={() => setIsEditingInfo(true)} className="text-sm font-semibold px-4 py-2 rounded-full border border-border-color hover:bg-gray-50 flex items-center gap-2">
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
        <ProfileCard title="Change password">
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
                <div className="mt-4 pt-4 border-t border-border-color flex justify-end items-center">
                    <button onClick={handleUpdatePassword} className="text-sm font-semibold text-white bg-primary hover:bg-primary-hover px-4 py-2 rounded-full">Update Password</button>
                </div>
            </>
        </ProfileCard>
    );
};

const AnavsanLogoPreview: React.FC<{}> = () => (
    <div className="flex items-center" title="Anavsan - Default Logo">
        <h1 className="text-xl font-bold flex items-center text-text-primary">
            <span style={{fontFamily: 'serif', background: 'linear-gradient(to bottom right, #A78BFA, #6932D5)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'}} className="text-4xl -mr-1">
                A
            </span>
            <span className="tracking-[0.1em]">
                NAVSAN
            </span>
        </h1>
    </div>
);

const BrandSettingsSection: React.FC<{ currentLogo: string | null; onSaveLogo: (logoUrl: string) => void; }> = ({ currentLogo, onSaveLogo }) => {
    const [previewLogo, setPreviewLogo] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const allowedTypes = ['image/png', 'image/jpeg', 'image/svg+xml'];
        const maxSize = 2 * 1024 * 1024; // 2MB

        if (!allowedTypes.includes(file.type)) {
            alert('Invalid file type. Please use PNG, JPG, or SVG.');
            return;
        }
        if (file.size > maxSize) {
            alert('File is too large. Max size is 2MB.');
            return;
        }

        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewLogo(reader.result as string);
        };
        reader.readAsDataURL(file);
    };
    
    const handleSaveChanges = () => {
        if (previewLogo) {
            onSaveLogo(previewLogo);
            setPreviewLogo(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
        }
    };

    const isSaveDisabled = !previewLogo;

    return (
        <ProfileCard title="Brand settings">
            <p className="text-sm text-text-secondary mb-4">Recommended: Size 200×200px · Max 2MB · PNG, JPG, or SVG.</p>
            <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="w-[300px] h-[100px] border border-border-color bg-input-bg rounded-xl flex items-center justify-center overflow-hidden">
                    {previewLogo ? (
                        <img src={previewLogo} alt="Logo Preview" className="max-w-full max-h-full object-contain" />
                    ) : currentLogo ? (
                        <img src={currentLogo} alt="Current Brand Logo" className="max-w-full max-h-full object-contain" />
                    ) : (
                        <AnavsanLogoPreview />
                    )}
                </div>

                <div className="flex items-center gap-4">
                     <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/png, image/jpeg, image/svg+xml"
                        className="hidden"
                    />
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 text-sm font-semibold text-primary border border-primary rounded-full hover:bg-primary/10 transition-colors whitespace-nowrap"
                    >
                        Change Logo
                    </button>
                    <button 
                        onClick={handleSaveChanges}
                        disabled={isSaveDisabled}
                        className={`px-4 py-2 text-sm font-semibold text-white rounded-full transition-colors whitespace-nowrap ${
                            isSaveDisabled 
                            ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                            : 'bg-primary hover:bg-primary-hover'
                        }`}
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </ProfileCard>
    );
};


const ProfileSettingsPage: React.FC<ProfileSettingsPageProps> = ({ user, onSave, onBack, brandLogo, onUpdateBrandLogo, activeSection, onSectionChange }) => {
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);

    const settingsNavItems = [
        { name: 'User Info', icon: IconUser },
        { name: 'Change Password', icon: IconLockClosed },
        { name: 'Brand Settings', icon: IconPhoto },
    ];
    
    const renderContent = () => {
        switch (activeSection) {
            case 'User Info':
                return <UserInfoSection user={user} onSave={onSave} />;
            case 'Change Password':
                return <ChangePasswordSection />;
            case 'Brand Settings':
                return <BrandSettingsSection currentLogo={brandLogo} onSaveLogo={onUpdateBrandLogo} />;
            default:
                return <UserInfoSection user={user} onSave={onSave} />;
        }
    };

    return (
        <div className="flex h-full bg-background">
            <aside className={`bg-surface flex-shrink-0 border-r border-border-color flex flex-col transition-all duration-300 ease-in-out ${isSidebarExpanded ? 'w-64' : 'w-16'}`}>
                <div className="flex-grow overflow-y-auto p-4">
                    <nav>
                        <ul className="space-y-1">
                            {settingsNavItems.map(item => (
                                <li key={item.name}>
                                    <button
                                        onClick={() => onSectionChange(item.name)}
                                        className={`w-full flex items-center text-left px-3 py-2 rounded-full text-sm transition-colors ${
                                            activeSection === item.name 
                                            ? 'bg-[#F0EAFB] text-primary font-semibold' 
                                            : 'text-text-strong font-medium hover:bg-[#e0e0e0]'
                                        }`}
                                        aria-label={item.name}
                                        title={isSidebarExpanded ? '' : item.name}
                                    >
                                        <item.icon className={`h-5 w-5 shrink-0 ${
                                            activeSection === item.name 
                                            ? 'text-primary' 
                                            : 'text-text-strong'
                                        }`} />
                                        {isSidebarExpanded && <span className="ml-3">{item.name}</span>}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
                <div className="flex-shrink-0 mt-auto p-2">
                    <div className={`border-t border-border-light ${isSidebarExpanded ? 'mx-2' : ''}`}></div>
                    <div className={`flex mt-2 ${isSidebarExpanded ? 'justify-end' : 'justify-center'}`}>
                        <button
                            onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
                            className="p-1.5 rounded-full hover:bg-surface-hover focus:outline-none focus:ring-2 focus:ring-primary"
                            aria-label={isSidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
                        >
                            {isSidebarExpanded 
                                ? <IconChevronLeft className="h-5 w-5 text-text-secondary" /> 
                                : <IconChevronRight className="h-5 w-5 text-text-secondary" />
                            }
                        </button>
                    </div>
                </div>
            </aside>
            <main className="flex-1 overflow-y-auto p-4">
                <div className="max-w-4xl mx-auto space-y-4">
                    {renderContent()}
                </div>
            </main>
        </div>
    );
};

export default ProfileSettingsPage;