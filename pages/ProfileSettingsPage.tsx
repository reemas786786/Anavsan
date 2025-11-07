import React, { useState, useRef, useMemo, useEffect } from 'react';
import { User } from '../types';
import { IconUser, IconLockClosed, IconBell, IconPhoto, IconEdit, IconChevronLeft, IconChevronRight, IconAdjustments } from '../constants';

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
const ToggleSwitch: React.FC<{ enabled: boolean; setEnabled: (enabled: boolean) => void; ariaLabel: string }> = ({ enabled, setEnabled, ariaLabel }) => (
    <button
      type="button"
      onClick={() => setEnabled(!enabled)}
      className={`${
        enabled ? 'bg-status-success' : 'bg-gray-200 dark:bg-gray-500'
      } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2`}
      role="switch"
      aria-checked={enabled}
      aria-label={ariaLabel}
    >
      <span
        aria-hidden="true"
        className={`${
          enabled ? 'translate-x-5' : 'translate-x-0'
        } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
      />
    </button>
  );

const CheckboxItem: React.FC<{ id: string; name: string; label: string; description: string; checked: boolean; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; disabled?: boolean; }> = ({ id, name, label, description, checked, onChange, disabled }) => (
    <div className="flex justify-between items-start">
        <div className="text-sm">
            <label htmlFor={id} className={`font-medium ${disabled ? 'text-text-muted cursor-not-allowed' : 'text-text-strong cursor-pointer'}`}>
              {label}
            </label>
            <p className={`text-text-secondary ${disabled ? 'text-text-muted' : ''}`}>{description}</p>
        </div>
        <div className="ml-3 flex h-6 items-center">
            <input
              id={id}
              name={name}
              type="checkbox"
              checked={checked}
              onChange={onChange}
              disabled={disabled}
              className="h-4 w-4 rounded border-gray-400 text-primary focus:ring-primary disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            />
        </div>
    </div>
);

const NotificationPreferenceSection: React.FC = () => {
    const [savedPrefs, setSavedPrefs] = useState({
        emailEnabled: true,
        emailQueryAssignment: true,
        emailQueryInsights: true,
        slackEnabled: false,
        slackChannel: 'Anavsan Channel',
        slackQueryAssignment: true,
        slackQueryInsights: true,
    });
    const [tempPrefs, setTempPrefs] = useState(savedPrefs);
    const [isEditingChannel, setIsEditingChannel] = useState(false);

    const hasChanges = useMemo(() => JSON.stringify(savedPrefs) !== JSON.stringify(tempPrefs), [savedPrefs, tempPrefs]);

    const handleToggle = (key: 'emailEnabled' | 'slackEnabled') => {
        setTempPrefs(p => ({ ...p, [key]: !p[key] }));
    };

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = e.target;
        setTempPrefs(p => ({ ...p, [name]: checked }));
    };

    const handleSaveChanges = () => {
        setSavedPrefs(tempPrefs);
        setIsEditingChannel(false);
        // In a real app, this would make an API call.
        console.log("Saving preferences:", tempPrefs);
        // Could show a toast message here.
    }
    
    const handleCancelChanges = () => {
        setTempPrefs(savedPrefs);
        setIsEditingChannel(false);
    }

    return (
        <div>
            <h2 className="text-2xl font-bold text-text-strong mb-6">Notification preferences</h2>
            <div className="bg-surface p-8 rounded-2xl">
                {/* Email Notifications */}
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-text-strong">Email notifications</h3>
                    <ToggleSwitch enabled={tempPrefs.emailEnabled} setEnabled={() => handleToggle('emailEnabled')} ariaLabel="Enable email notifications" />
                </div>

                <div className={`mt-6 space-y-6 transition-opacity ${!tempPrefs.emailEnabled ? 'opacity-50' : ''}`}>
                    <CheckboxItem
                        id="emailQueryAssignment"
                        name="emailQueryAssignment"
                        label="Query assignment"
                        description="Get an email when a query is assigned to you."
                        checked={tempPrefs.emailQueryAssignment}
                        onChange={handleCheckboxChange}
                        disabled={!tempPrefs.emailEnabled}
                    />
                    <CheckboxItem
                        id="emailQueryInsights"
                        name="emailQueryInsights"
                        label="Query insights"
                        description="Receive news, feature updates, and tips from Anavsan."
                        checked={tempPrefs.emailQueryInsights}
                        onChange={handleCheckboxChange}
                        disabled={!tempPrefs.emailEnabled}
                    />
                </div>
                
                {/* Divider */}
                <div className="my-8 border-t border-border-light"></div>

                {/* Slack Notifications */}
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-text-strong">Slack notifications</h3>
                    <ToggleSwitch enabled={tempPrefs.slackEnabled} setEnabled={() => handleToggle('slackEnabled')} ariaLabel="Enable Slack notifications" />
                </div>
                
                <div className={`mt-6 space-y-6 transition-opacity ${!tempPrefs.slackEnabled ? 'opacity-50' : ''}`}>
                    {isEditingChannel ? (
                        <div className="space-y-2">
                            <label htmlFor="slack-channel-input" className="text-sm font-medium text-text-strong">Your channel name</label>
                            <input
                                id="slack-channel-input"
                                type="text"
                                value={tempPrefs.slackChannel}
                                onChange={(e) => setTempPrefs(p => ({ ...p, slackChannel: e.target.value }))}
                                className="w-full border border-border-color rounded-full px-4 py-2 text-sm focus:ring-primary focus:border-primary bg-input-bg"
                                disabled={!tempPrefs.slackEnabled}
                            />
                        </div>
                    ) : (
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm font-medium text-text-strong">Your channel name</p>
                                <p className="text-sm text-text-secondary">{tempPrefs.slackChannel}</p>
                            </div>
                            <button
                                onClick={() => setIsEditingChannel(true)}
                                disabled={!tempPrefs.slackEnabled}
                                className="flex items-center gap-2 text-sm font-semibold text-primary disabled:text-text-muted disabled:cursor-not-allowed"
                            >
                                Edit <IconEdit className="h-4 w-4" />
                            </button>
                        </div>
                    )}


                    <CheckboxItem
                        id="slackQueryAssignment"
                        name="slackQueryAssignment"
                        label="Query assignment"
                        description="Get a Slack notification when a query is assigned to you."
                        checked={tempPrefs.slackQueryAssignment}
                        onChange={handleCheckboxChange}
                        disabled={!tempPrefs.slackEnabled}
                    />
                    <CheckboxItem
                        id="slackQueryInsights"
                        name="slackQueryInsights"
                        label="Query insights"
                        description="Get Slack alerts for new query insights."
                        checked={tempPrefs.slackQueryInsights}
                        onChange={handleCheckboxChange}
                        disabled={!tempPrefs.slackEnabled}
                    />
                </div>

                <div className="mt-8 pt-6 border-t border-border-light flex justify-end gap-3">
                    {hasChanges && (
                        <button onClick={handleCancelChanges} className="bg-button-secondary-bg text-primary font-semibold px-6 py-2 rounded-full hover:bg-button-secondary-bg-hover transition-colors">
                            Cancel
                        </button>
                    )}
                    <button
                        onClick={handleSaveChanges}
                        disabled={!hasChanges}
                        className="bg-primary text-white font-semibold px-6 py-2 rounded-full hover:bg-primary-hover transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
};


const ChangeThemeSection: React.FC<{ theme: string; onThemeChange: (theme: string) => void }> = ({ theme, onThemeChange }) => {
    const themes = [
        { id: 'system', label: 'System default', description: 'Follows your operating system setting.', bg: 'bg-gradient-to-br from-white to-gray-900', border: 'border-gray-500' },
        { id: 'light', label: 'White theme', description: 'Clean and bright with brand accents.', bg: 'bg-white', border: 'border-gray-300' },
        { id: 'gray10', label: 'Gray 10', description: 'Light neutral with soft contrast.', bg: 'bg-gray-100', border: 'border-gray-300' },
        { id: 'dark', label: 'Gray 90', description: 'Dark tone for balanced focus.', bg: 'bg-gray-900', border: 'border-gray-700' },
        { id: 'black', label: 'Gray 100', description: 'Deep contrast for sharp visibility.', bg: 'bg-black', border: 'border-gray-700' },
    ];
    return (
        <div>
            <h2 className="text-2xl font-bold text-text-strong mb-6">Change theme</h2>
            <div className="bg-surface p-8 rounded-2xl">
                <div className="space-y-4">
                    {themes.map(t => (
                        <label key={t.id} className="flex items-center justify-between p-4 rounded-lg border border-border-color cursor-pointer has-[:checked]:bg-primary/10 has-[:checked]:border-primary transition-all">
                            <div className="flex items-center">
                                <div className={`w-8 h-8 rounded-full ${t.bg} ${t.border} border flex-shrink-0`}></div>
                                <div className="ml-4">
                                    <span className="font-semibold text-text-primary">{t.label}</span>
                                    <p className="text-sm text-text-secondary">{t.description}</p>
                                </div>
                            </div>
                            <input
                                type="radio"
                                name="theme"
                                value={t.id}
                                checked={theme === t.id}
                                onChange={() => onThemeChange(t.id)}
                                className="h-5 w-5 text-primary focus:ring-primary border-gray-300 ml-4 flex-shrink-0"
                            />
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );
};

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

interface ProfileSettingsPageProps {
    user: User;
    onBack: () => void;
    theme: string;
    onThemeChange: (theme: string) => void;
}


const ProfileSettingsPage: React.FC<ProfileSettingsPageProps> = ({ user, onBack, theme, onThemeChange }) => {
    const [activeSection, setActiveSection] = useState('User information');
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const navItems = [
        { name: 'User information', icon: IconUser },
        { name: 'Change password', icon: IconLockClosed },
        { name: 'Notification preference', icon: IconBell },
        { name: 'Change theme', icon: IconAdjustments },
        { name: 'Brand settings', icon: IconPhoto },
    ];

    const renderSection = () => {
        switch (activeSection) {
            case 'User information': return <UserInformationSection user={user} />;
            case 'Change password': return <ChangePasswordSection />;
            case 'Notification preference': return <NotificationPreferenceSection />;
            case 'Change theme': return <ChangeThemeSection theme={theme} onThemeChange={onThemeChange} />;
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
            <main className="flex-1 overflow-y-auto bg-background">
                <div className="p-4 md:p-8">
                    <div className="max-w-4xl space-y-12">
                        {renderSection()}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProfileSettingsPage;