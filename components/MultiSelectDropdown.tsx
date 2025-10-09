import React, { useState, useRef, useEffect } from 'react';
import { IconChevronDown, IconCheck } from '../constants';

interface MultiSelectDropdownProps {
    options: string[];
    selectedOptions: string[];
    onChange: (selected: string[]) => void;
}

const MultiSelectDropdown: React.FC<MultiSelectDropdownProps> = ({ options, selectedOptions, onChange }) => {
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

    const handleOptionClick = (option: string) => {
        if (option === 'All') {
            onChange([]); // 'All' corresponds to an empty selection array.
        } else {
            // If the clicked option is already selected, deselect it (toggling back to 'All').
            if (selectedOptions.length === 1 && selectedOptions[0] === option) {
                onChange([]);
            } else {
                // Otherwise, make it the only selected option.
                onChange([option]);
            }
        }
    };

    const isSelected = (option: string) => {
        if (option === 'All') {
            return selectedOptions.length === 0;
        }
        return selectedOptions.includes(option);
    };

    const displayValue = () => {
        if (selectedOptions.length === 0) {
            return 'All';
        }
        // With single-select logic, there will only ever be one item.
        return selectedOptions[0];
    };

    const allOptions = ['All', ...options];

    return (
        <div className="relative" ref={wrapperRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-between gap-2 text-sm font-bold text-text-primary focus:outline-none rounded-lg min-w-[100px]"
                aria-haspopup="listbox"
                aria-expanded={isOpen}
            >
                <span className="truncate flex-grow text-left">{displayValue()}</span>
                <IconChevronDown className={`h-4 w-4 text-text-muted transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
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