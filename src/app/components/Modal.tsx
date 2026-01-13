'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    size?: 'small' | 'medium' | 'large';
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'medium' }) => {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    useEffect(() => {
        if (!isOpen) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
        window.addEventListener('keydown', onKey);
        return () => {
            document.body.style.overflow = prev;
            window.removeEventListener('keydown', onKey);
        };
    }, [isOpen, onClose]);

    const sizeClasses = {
        small: 'max-w-md',
        medium: 'max-w-2xl',
        large: 'max-w-4xl',
    } as const;

    if (!isOpen || !mounted) return null;

    const content = (
        <div
            className="fixed inset-0 z-[100] flex items-start justify-center p-4 sm:p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
            onClick={onClose}
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50" />

            {/* Panel: TIDAK full height */}
            <div
                className={`relative z-[101] w-full ${sizeClasses[size]} bg-white rounded-lg shadow-xl
                    mt-10 sm:mt-16 max-h-[85vh] overflow-y-scroll grid grid-rows-[auto,1fr]`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header (tetap) */}
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                    <h3 id="modal-title" className="text-lg font-semibold text-gray-900">
                        {title}
                    </h3>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                        aria-label="Close"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body scroll saja */}
                <div className="p-4 overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );

    return createPortal(content, document.body);
};

export default Modal;
