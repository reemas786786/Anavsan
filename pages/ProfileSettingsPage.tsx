import React, { useState, useRef } from 'react';
import { User } from '../types';
import { IconUser, IconLockClosed, IconBell, IconPhoto, IconEdit, IconChevronLeft, IconChevronRight } from '../constants';
import Breadcrumb from '../components/Breadcrumb';

const IconEye: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-5 w-5"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const IconEyeOff: React.FC<{className?: string}> = ({className}) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className || "h-5 w-5"} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
);

const PasswordInput: React.FC<{ label: string, id: string, value: string, name: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }> = ({ label, id, value, name, onChange }) => {
    const [isVisible, setIsVisible] = useState(false);
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-medium text-text-secondary mb-1">{label}</label>
            <div className="relative">
                <input
                    id={id}
                    name={name}
                    type={isVisible ? 'text' : 'password'}
                    value={value}
                    onChange={onChange}
                    className="w-full bg-surface-nested border-transparent rounded-full px-4 py-3 text-sm focus:ring-1 focus:ring-primary focus:border-primary placeholder-text-secondary"
                />
                <button
                    type="button"
                    onClick={() => setIsVisible(!isVisible)}
                    className="absolute inset-y-0 right-0 px-4 flex items-center text-text-muted hover:text-text-primary"
                    aria-label={isVisible ? 'Hide password' : 'Show password'}
                >
                    {isVisible ? <IconEyeOff /> : <IconEye />}
                </button>
            </div>
        </div>
    );
};

const UserInformationSection: React.FC<{ user: User }> = ({ user }) => (
    <div>
        <h2 className="text-2xl font-bold text-text-strong mb-6">User information</h2>
        <div className="bg-surface p-8 rounded-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div>
                    <label className="block text-sm font-medium text-text-secondary">First name</label>
                    <p className="mt-1 text-text-primary">{user.name.split(' ')[0]}</p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-text-secondary">Last name</label>
                    <p className="mt-1 text-text-primary">{user.name.split(' ').slice(1).join(' ')}</p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-text-secondary">Organization</label>
                    <p className="mt-1 text-text-primary">{user.name}</p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-text-secondary">Email</label>
                    <p className="mt-1 text-text-primary">{user.email}</p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-text-secondary">Role</label>
                    <p className="mt-1 text-text-primary">{user.role}</p>
                </div>
            </div>
            <div className="mt-8 pt-6 border-t border-border-light flex justify-end">
                <button className="bg-button-secondary-bg text-primary font-semibold px-4 py-2 rounded-full flex items-center gap-2 hover:bg-button-secondary-bg-hover transition-colors">
                    <IconEdit className="h-4 w-4" />
                    Edit details
                </button>
            </div>
        </div>
    </div>
);

const ChangePasswordSection: React.FC = () => {
    const [passwords, setPasswords] = useState({
        current: '',
        new: '',
        confirm: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPasswords(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-text-strong mb-6">Change Password</h2>
            <div className="bg-surface p-8 rounded-2xl">
                <div className="max-w-md mx-auto space-y-6">
                    <PasswordInput
                        id="current-password"
                        name="current"
                        label="Current password"
                        value={passwords.current}
                        onChange={handleChange}
                    />
                    <PasswordInput
                        id="new-password"
                        name="new"
                        label="New password"
                        value={passwords.new}
                        onChange={handleChange}
                    />
                    <PasswordInput
                        id="confirm-new-password"
                        name="confirm"
                        label="Confirm new password"
                        value={passwords.confirm}
                        onChange={handleChange}
                    />
                </div>
                <div className="mt-8 pt-6 border-t border-border-light flex justify-end">
                    <button className="bg-button-secondary-bg text-primary font-semibold px-6 py-2 rounded-full hover:bg-button-secondary-bg-hover transition-colors">
                        Update Password
                    </button>
                </div>
            </div>
        </div>
    );
};
const NotificationPreferenceSection: React.FC = () => (
    <div>
        <h2 className="text-2xl font-bold text-text-strong mb-6">Notification preference</h2>
        <div className="bg-surface p-8 rounded-2xl">
            <p className="text-text-secondary">Notification preferences will be available in a future update.</p>
        </div>
    </div>
);

const BrandSettingsSection: React.FC = () => {
    const [logoPreview, setLogoPreview] = useState<string | null>(null);
    const [brandColor, setBrandColor] = useState('#6932D5'); // Default primary color
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div>
            <h2 className="text-2xl font-bold text-text-strong mb-6">Brand settings</h2>
            <div className="bg-surface p-8 rounded-2xl">
                <div className="space-y-8">
                    {/* Logo Section */}
                    <div>
                        <h3 className="text-lg font-semibold text-text-primary">Company Logo</h3>
                        <p className="text-sm text-text-secondary mt-1">This logo will be displayed in the header for all users. SVG, PNG, or JPG recommended.</p>
                        <div className="mt-4 flex items-center gap-6">
                            <div className="w-48 h-16 bg-surface-nested rounded-lg flex items-center justify-center border border-border-color">
                                {logoPreview ? (
                                    <img src={logoPreview} alt="Logo Preview" className="max-w-full max-h-full object-contain" />
                                ) : (
                                    <span className="text-sm text-text-muted">Logo preview</span>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleLogoUpload}
                                    className="hidden"
                                    accept="image/png, image/jpeg, image/svg+xml"
                                />
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="bg-button-secondary-bg text-primary font-semibold px-4 py-2 rounded-full text-sm hover:bg-button-secondary-bg-hover transition-colors"
                                >
                                    Upload logo
                                </button>
                                {logoPreview && (
                                     <button
                                        onClick={() => setLogoPreview(null)}
                                        className="text-text-secondary font-semibold px-4 py-2 rounded-full text-sm hover:bg-surface-hover transition-colors"
                                    >
                                        Remove
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Brand Color Section */}
                    <div>
                         <h3 className="text-lg font-semibold text-text-primary">Brand Color</h3>
                        <p className="text-sm text-text-secondary mt-1">Choose a primary color for your workspace theme.</p>
                        <div className="mt-4 flex items-center gap-4">
                            <div className="relative w-12 h-12">
                                <div
                                    className="absolute inset-0 rounded-full border-4 border-surface pointer-events-none z-10"
                                    style={{ backgroundColor: brandColor }}
                                ></div>
                                 <input
                                    type="color"
                                    value={brandColor}
                                    onChange={(e) => setBrandColor(e.target.value)}
                                    className="w-full h-full p-0 border-none rounded-full cursor-pointer appearance-none bg-transparent"
                                    title="Select brand color"
                                />
                            </div>
                            <input
                                type="text"
                                value={brandColor}
                                onChange={(e) => setBrandColor(e.target.value)}
                                className="w-40 border border-border-color rounded-full px-4 py-2 text-sm font-mono focus:ring-primary focus:border-primary bg-input-bg"
                                placeholder="#6932D5"
                            />
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-6 border-t border-border-light flex justify-end">
                    <button className="bg-primary text-white font-semibold px-6 py-2 rounded-full hover:bg-primary-hover transition-colors">
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};

const ProfileSettingsPage: React.FC<{
    user: User;
    onBack: () => void;
}> = ({ user, onBack }) => {
    const [activeSection, setActiveSection] = useState('User information');
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const navItems = [
        { name: 'User information', icon: IconUser },
        { name: 'Change password', icon: IconLockClosed },
        { name: 'Notification preference', icon: IconBell },
        { name: 'Brand settings', icon: IconPhoto },
    ];

    const renderSection = () => {
        switch (activeSection) {
            case 'User information': return <UserInformationSection user={user} />;
            case 'Change password': return <ChangePasswordSection />;
            case 'Notification preference': return <NotificationPreferenceSection />;
            case 'Brand settings': return <BrandSettingsSection />;
            default: return <UserInformationSection user={user} />;
        }
    };
    
    return (
        <div className="flex h-full">
            <aside className={`bg-surface flex-shrink-0 flex flex-col transition-all duration-300 ${isSidebarCollapsed ? 'w-20' : 'w-72'}`}>
                <nav className="flex-grow p-4">
                    <ul className="space-y-2">
                        {navItems.map(item => (
                            <li key={item.name}>
                                <button
                                    onClick={() => setActiveSection(item.name)}
                                    className={`w-full flex items-center text-left p-3 rounded-xl text-sm transition-colors ${
                                        activeSection === item.name 
                                        ? 'bg-[#F0EAFB] text-primary font-semibold' 
                                        : 'text-text-strong font-medium hover:bg-surface-hover'
                                    } ${isSidebarCollapsed ? 'justify-center' : ''}`}
                                    title={isSidebarCollapsed ? item.name : ''}
                                >
                                    <item.icon className={`h-5 w-5 shrink-0 ${activeSection === item.name ? 'text-primary' : 'text-text-strong'}`} />
                                    {!isSidebarCollapsed && <span className="ml-4">{item.name}</span>}
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
                <div className="mt-auto p-4">
                    <button
                        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                        className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-surface-hover"
                        title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                    >
                        {isSidebarCollapsed ? <IconChevronRight className="h-5 w-5 text-text-secondary" /> : <IconChevronLeft className="h-5 w-5 text-text-secondary" />}
                    </button>
                </div>
            </aside>
            <main className="flex-1 overflow-y-auto p-6 bg-background">
                 <Breadcrumb items={[{ label: 'Data Cloud Overview', onClick: onBack }, { label: 'Profile settings' }]} />
                <div className="mt-6">
                    {renderSection()}
                </div>
            </main>
        </div>
    );
};

export default ProfileSettingsPage;