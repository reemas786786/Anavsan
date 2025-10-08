import React, { useState, useRef, useEffect } from 'react';
import { IconChevronDown, IconCheck } from '../constants';

interface MultiSelectDropdownProps {
    label: string;
    options: string[];
    selectedOptions: string[];
    onChange: (selected: string[]) => void;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({ label, options, selectedOptions, onChange }) => {
    const [isOpen, setIsOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const allAreSelected = selectedOptions.length === options.length;
    const noneAreSelected = selectedOptions.length === 0;

    const handleOptionClick = (option: string) => {
        let newSelection: string[];
        if (option === 'All') {
            if (allAreSelected) {
                newSelection = [];
            } else {
                newSelection = options;
            }
        } else {
            if (selectedOptions.includes(option)) {
                newSelection = selectedOptions.filter(item => item !== option);
            } else {
                newSelection = [...selectedOptions, option];
            }
        }
        onChange(newSelection);
    };

    const isSelected = (option: string) => {
        if (option === 'All') return allAreSelected && options.length > 0;
        return selectedOptions.includes(option);
    };

    const displayValue = () => {
        if (noneAreSelected || allAreSelected) {
            return 'All';
        }
        if (selectedOptions.length === 1) {
            return selectedOptions[0];
        }
        return `${selectedOptions.length} selected`;
    };

    const allOptions = ['All', ...options];

    return (
        <div className="relative" ref={wrapperRef}>
            <div className="bg-background rounded-lg flex items-center">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center justify-between gap-2 text-sm font-semibold text-text-primary focus:outline-none w-40 px-3 py-2"
                    aria-haspopup="listbox"
                    aria-expanded={isOpen}
                >
                    <span className="text-sm text-text-secondary font-normal">{label}:</span>
                    <span className="truncate flex-grow text-left">{displayValue()}</span>
                    <IconChevronDown className={`h-4 w-4 text-text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                </button>
            </div>
            {isOpen && (
                <div className="absolute top-full mt-1 w-56 bg-surface rounded-lg shadow-lg z-20 border border-border-color">
                    <ul className="py-1 max-h-60 overflow-y-auto" role="listbox">
                        {allOptions.map(option => {
                            const selected = isSelected(option);
                            return (
                                <li key={option}>
                                    <button
                                        onClick={() => handleOptionClick(option)}
                                        className={`w-full text-left flex items-center gap-3 px-3 py-2 text-sm transition-colors ${selected ? 'bg-primary/10' : 'hover:bg-surface-hover'}`}
                                        role="option"
                                        aria-selected={selected}
                                    >
                                        <div className={`w-4 h-4 rounded border flex items-center justify-center flex-shrink-0 ${selected ? 'bg-primary border-primary' : 'border-text-muted'}`}>
                                            {selected && <IconCheck className="w-3 h-3 text-white" />}
                                        </div>
                                        <span className={`truncate ${selected ? 'font-semibold text-primary' : 'text-text-primary'}`}>
                                            {option}
                                        </span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default MultiSelectDropdown;
