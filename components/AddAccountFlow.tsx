
import React, { useState } from 'react';

interface AddAccountFlowProps {
    onCancel: () => void;
    onAddAccount: (data: { name: string }) => void;
}

const Step1 = ({ accountName, setAccountName }: { accountName: string; setAccountName: (name: string) => void; }) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="col-span-2">
            <label htmlFor="accountName" className="block text-sm font-medium text-text-secondary mb-1">Friendly Account Name</label>
            <input 
                type="text" 
                id="accountName" 
                className="w-full border border-border-color rounded-full px-3 py-2 text-sm focus:ring-primary focus:border-primary bg-input-bg placeholder-text-secondary" 
                placeholder="e.g., Production Environment"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
            />
        </div>
        <div>
            <label htmlFor="identifier" className="block text-sm font-medium text-text-secondary mb-1">Account Identifier</label>
            <input type="text" id="identifier" className="w-full border border-border-color rounded-full px-3 py-2 text-sm focus:ring-primary focus:border-primary bg-input-bg placeholder-text-secondary" placeholder="acme.us-east-1" />
        </div>
        <div>
            <label htmlFor="username" className="block text-sm font-medium text-text-secondary mb-1">Username</label>
            <input type="text" id="username" className="w-full border border-border-color rounded-full px-3 py-2 text-sm focus:ring-primary focus:border-primary bg-input-bg placeholder-text-secondary" placeholder="ANAVSAN_USER" />
        </div>
         <div className="col-span-2">
            <label className="block text-sm font-medium text-text-secondary mb-2">Authentication Method</label>
            <div className="flex gap-4">
                <label className="flex items-center"><input type="radio" name="auth" className="text-primary focus:ring-primary mr-2" defaultChecked/> Password</label>
                <label className="flex items-center"><input type="radio" name="auth" className="text-primary focus:ring-primary mr-2" /> Key Pair</label>
            </div>
        </div>
        <div className="col-span-2">
            <label htmlFor="password" className="block text-sm font-medium text-text-secondary mb-1">Password</label>
            <input type="password" id="password" className="w-full border border-border-color rounded-full px-3 py-2 text-sm focus:ring-primary focus:border-primary bg-input-bg" />
        </div>
    </div>
);


const Step2 = () => (
     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
            <label htmlFor="role" className="block text-sm font-medium text-text-secondary mb-1">Role</label>
            <input type="text" id="role" className="w-full border border-border-color rounded-full px-3 py-2 text-sm focus:ring-primary focus:border-primary bg-input-bg placeholder-text-secondary" placeholder="ANAVSAN_ROLE" />
        </div>
        <div>
            <label htmlFor="warehouse" className="block text-sm font-medium text-text-secondary mb-1">Warehouse Name</label>
            <input type="text" id="warehouse" className="w-full border border-border-color rounded-full px-3 py-2 text-sm focus:ring-primary focus:border-primary bg-input-bg placeholder-text-secondary" placeholder="ANAVSAN_WAREHOUSE" />
        </div>
        <div className="col-span-2 mt-2">
            <p className="text-sm text-text-secondary">
                Need help with setup? Follow our <a href="#" className="text-link hover:underline font-medium">Quick Guide</a> to create the necessary roles and permissions in Snowflake.
            </p>
        </div>
    </div>
);


const AddAccountFlow: React.FC<AddAccountFlowProps> = ({ onCancel, onAddAccount }) => {
    const [step, setStep] = useState(1);
    const [accountName, setAccountName] = useState('');

    const handleNext = () => setStep(step + 1);
    const handleBack = () => setStep(step - 1);

    const handleAdd = () => {
        if (!accountName.trim()) {
            return;
        }
        onAddAccount({ name: accountName });
    };

    return (
        <div className="flex flex-col h-full">
            <div className="p-8 space-y-6 flex-grow">
                <p className="text-sm text-text-secondary">
                    {step === 1 
                        ? "Provide your account details to establish a connection." 
                        : "Configure connection settings for Anavsan."}
                </p>
                {step === 1 && <Step1 accountName={accountName} setAccountName={setAccountName} />}
                {step === 2 && <Step2 />}
            </div>

            <div className="p-6 bg-background flex justify-between items-center flex-shrink-0">
                <div>
                    <button onClick={onCancel} className="text-sm font-semibold text-text-secondary hover:text-text-primary">Cancel</button>
                </div>
                <div className="flex items-center gap-3">
                    {step > 1 && <button onClick={handleBack} className="text-sm font-semibold px-4 py-2 rounded-full border border-border-color hover:bg-gray-50">Back</button>}
                    {step === 1 && <button onClick={handleNext} className="text-sm font-semibold text-white bg-primary hover:bg-primary-hover px-4 py-2 rounded-full">Next</button>}
                    {step === 2 && <button onClick={handleAdd} className="text-sm font-semibold text-white bg-primary hover:bg-primary-hover px-4 py-2 rounded-full">Add Account</button>}
                </div>
            </div>
        </div>
    );
};

export default AddAccountFlow;
