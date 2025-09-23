import React from 'react';

interface BreadcrumbItem {
    label: string;
    onClick?: () => void;
}

interface BreadcrumbProps {
    items: BreadcrumbItem[];
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({ items }) => {
    if (items.length === 0) {
        return null;
    }

    return (
        <nav aria-label="breadcrumb" className="text-sm text-text-secondary">
            {items.map((item, index) => (
                <span key={index} className="inline-flex items-center">
                    {index > 0 && <span className="mx-2">/</span>}
                    {item.onClick && index < items.length - 1 ? (
                        <button onClick={item.onClick} className="hover:underline text-link transition-colors">
                            {item.label}
                        </button>
                    ) : (
                        <span 
                            className="text-text-primary font-medium"
                            aria-current={index === items.length - 1 ? 'page' : undefined}
                        >
                            {item.label}
                        </span>
                    )}
                </span>
            ))}
        </nav>
    );
};

export default Breadcrumb;
