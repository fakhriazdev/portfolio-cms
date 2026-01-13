'use client';

import React, { useEffect, useMemo, useState, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Edit3, Trash2, ChevronDown } from 'lucide-react';
import Modal from '../../components/Modal';
import ExperienceForm from '../../components/ExperienceForm';

import {
    listExperiences,
    createExperience,
    updateExperience,
    deleteExperience,
} from '@/src/app/actions/experience';

// ===== UI type (sesuai kebutuhan tampilan)
type UiExperience = {
    id: string;
    company: string;
    position: string;
    description: string;
    startDate: string;     // "YYYY-MM" atau "YYYY-MM-DD"
    endDate: string;       // '' jika null di DB
    current: boolean;
};

export default function Page() {
    const [experiences, setExperiences] = useState<UiExperience[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingExperience, setEditingExperience] = useState<UiExperience | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [page] = useState(1);
    const [pageSize] = useState(50);

    const [isPending, startTransition] = useTransition();
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState<string | null>(null);

    // ---- Collapsible state
    const [expandedItems, setExpandedItems] = useState<number[]>([]);
    const toggleExpanded = (index: number) => {
        setExpandedItems(prev =>
            prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
        );
    };

    // ---- Helpers
    const rowToUi = (row: any): UiExperience => ({
        id: String(row.id),
        position: row.position ?? '',
        company: row.company ?? '',
        startDate: row.startDate ?? '',
        endDate: row.endDate ?? '' /* DB bisa null */,
        current: Boolean(row.current),
        description: row.description ?? '',
    });

    const parseMonthish = (s: string) => {
        if (!s) return null;
        const normalized = /^\d{4}-\d{2}$/.test(s) ? `${s}-01` : s; // aman utk YYYY-MM
        const d = new Date(normalized);
        return isNaN(+d) ? null : d;
    };

    const formatDateRange = (startDate: string, endDate: string, current: boolean) => {
        const start = parseMonthish(startDate);
        const end = current ? null : parseMonthish(endDate);
        const fmt = (d: Date | null) =>
            d ? d.toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : 'Present';
        return `${fmt(start)} - ${fmt(end)}`;
    };

    // pecah description jadi poin dari baris baru / bullet "- / •"
    const parseDetails = (description: string) => {
        if (!description) return [];
        return description
            .split(/\r?\n/)
            .map(line => line.replace(/^\s*[-•\u2022]\s*/, '').trim())
            .filter(Boolean)
            .slice(0, 12);
    };

    // ---- Fetch list (server)
    const fetchData = (q?: string) => {
        setErr(null);
        startTransition(async () => {
            try {
                const res = await listExperiences({ page, pageSize, q });
                setExperiences(res.data.map(rowToUi));
            } catch (e: any) {
                setErr(e?.message || 'Failed to load experiences');
            } finally {
                setLoading(false);
            }
        });
    };

    // Initial load
    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Debounced search -> server
    useEffect(() => {
        const t = setTimeout(() => fetchData(searchTerm.trim() || undefined), 400);
        return () => clearTimeout(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchTerm]);

    const filteredExperiences = useMemo(() => experiences, [experiences]); // server-side filter via q

    // ---- CRUD handlers
    const handleSave = (data: {
        company: string;
        position: string;
        description: string;
        startDate: string;
        endDate: string; // '' jika current
        current: boolean;
    }) => {
        setErr(null);

        if (editingExperience) {
            // UPDATE
            const id = editingExperience.id;
            const payload = {
                company: data.company,
                position: data.position,
                description: data.description,
                startDate: data.startDate,
                endDate: data.current ? null : (data.endDate || null),
                current: data.current,
            };

            startTransition(async () => {
                try {
                    const updated = await updateExperience(id, payload);
                    if (!updated) throw new Error('Not found');
                    const ui = rowToUi(updated);
                    setExperiences(list => list.map(x => (x.id === id ? { ...x, ...ui } : x)));
                    setIsModalOpen(false);
                    setEditingExperience(null);
                } catch (e: any) {
                    setErr(e?.message || 'Failed to update experience');
                }
            });
        } else {
            // CREATE
            const payload = {
                company: data.company,
                position: data.position,
                description: data.description,
                startDate: data.startDate,
                endDate: data.current ? null : (data.endDate || null),
                current: data.current,
            };

            startTransition(async () => {
                try {
                    const created = await createExperience(payload);
                    const ui = rowToUi(created);
                    setExperiences(list => [ui, ...list]);
                    setIsModalOpen(false);
                } catch (e: any) {
                    setErr(e?.message || 'Failed to create experience');
                }
            });
        }
    };

    const handleEdit = (exp: UiExperience) => {
        setEditingExperience(exp);
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        setErr(null);
        startTransition(async () => {
            try {
                await deleteExperience(id);
                setExperiences(list => list.filter(x => x.id !== id));
            } catch (e: any) {
                setErr(e?.message || 'Failed to delete experience');
            }
        });
    };

    return (
        <div className="space-y-2">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Experience Management</h1>
                    <p className="text-gray-600 mt-1">Manage your work experience and career history.</p>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors disabled:opacity-60"
                    disabled={isPending}
                >
                    <Plus className="w-5 h-5" />
                    <span>Add Experience</span>
                </button>
            </div>

            {/* Search */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black w-5 h-5" />
                    <input
                        type="text"
                        placeholder="Search experiences by position or company..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg focus:ring-2 focus:ring-black text-black"
                        disabled={isPending}
                    />
                </div>
                {err && <p className="mt-3 text-sm text-red-600">{err}</p>}
            </div>

            {/* Experience List (collapsible + motion) */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Experience {loading ? '' : `(${filteredExperiences.length})`}
                    </h2>
                </div>

                {loading ? (
                    <div className="p-2 space-y-2">
                        <div className="h-3 w-1/3 bg-gray-200 animate-pulse rounded" />
                        <div className="h-3 w-1/2 bg-gray-200 animate-pulse rounded" />
                        <div className="h-3 w-2/3 bg-gray-200 animate-pulse rounded" />
                    </div>
                ) : (
                    <div className="p-2">
                        <div className="space-y-1">
                            {filteredExperiences.map((exp, index) => (
                                <motion.div
                                    key={exp.id}
                                    className="overflow-hidden rounded-lg"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.07 }}
                                >
                                    <motion.div
                                        className="flex flex-row justify-between sm:items-center py-2 mx-2 md:py-3 cursor-pointer border-b border-gray-200"
                                        onClick={() => toggleExpanded(index)}
                                        whileHover={{ x: 4 }}
                                        whileTap={{ scale: 0.998 }}
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggleExpanded(index)}
                                    >
                                        {/* kiri */}
                                        <div className="flex">
                                            <div className="my-auto flex items-center text-center gap-3">
                                                <div className="text-sm md:text-[14px] text-gray-500 font-medium">
                                                    {exp.position}
                                                </div>
                                                <div className="text-sm md:text-[14px] font-semibold text-gray-900">
                                                    {exp.company}
                                                </div>
                                            </div>
                                        </div>

                                        {/* kanan */}
                                        <div className="flex gap-3 items-center text-sm md:text-[14px] font-bold text-gray-900">
                                            {formatDateRange(exp.startDate, exp.endDate, exp.current)}
                                            <motion.div
                                                animate={{ rotate: expandedItems.includes(index) ? 180 : 0 }}
                                                transition={{ duration: 0.25, ease: 'easeInOut' }}
                                            >
                                                <ChevronDown className="w-4 h-4 text-gray-500 flex-shrink-0" />
                                            </motion.div>
                                        </div>
                                    </motion.div>

                                    <AnimatePresence>
                                        {expandedItems.includes(index) && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{
                                                    height: 'auto',
                                                    opacity: 1,
                                                    transition: {
                                                        height: { duration: 0.35, ease: 'easeOut' },
                                                        opacity: { duration: 0.25, delay: 0.05 },
                                                    },
                                                }}
                                                exit={{
                                                    height: 0,
                                                    opacity: 0,
                                                    transition: {
                                                        height: { duration: 0.25, ease: 'easeIn' },
                                                        opacity: { duration: 0.15 },
                                                    },
                                                }}
                                                className="overflow-hidden"
                                            >
                                                <div className="mx-2 px-4 pb-3 bg-gray-50/80 backdrop-blur-sm rounded-b-lg">
                                                    <motion.div
                                                        className="pt-3"
                                                        initial={{ y: -10 }}
                                                        animate={{ y: 0 }}
                                                        transition={{ duration: 0.25, delay: 0.05 }}
                                                    >
                                                        {/* details dari description */}
                                                        {parseDetails(exp.description).length ? (
                                                            <ul className="space-y-3">
                                                                {parseDetails(exp.description).map((detail, detailIndex) => (
                                                                    <motion.li
                                                                        key={`${exp.id}-${detailIndex}`}
                                                                        className="flex items-start gap-3"
                                                                        initial={{ opacity: 0, x: -10 }}
                                                                        animate={{ opacity: 1, x: 0 }}
                                                                        transition={{
                                                                            duration: 0.25,
                                                                            delay: 0.15 + detailIndex * 0.06,
                                                                        }}
                                                                    >
                                                                        <motion.div
                                                                            className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"
                                                                            initial={{ scale: 0 }}
                                                                            animate={{ scale: 1 }}
                                                                            transition={{
                                                                                duration: 0.18,
                                                                                delay: 0.18 + detailIndex * 0.06,
                                                                                type: 'spring',
                                                                                stiffness: 220,
                                                                            }}
                                                                        />
                                                                        <span className="text-[15px] text-gray-700 leading-relaxed">
                                      {detail}
                                    </span>
                                                                    </motion.li>
                                                                ))}
                                                            </ul>
                                                        ) : (
                                                            <p className="text-gray-600">{exp.description || 'No details provided.'}</p>
                                                        )}

                                                        {/* actions */}
                                                        <div className="mt-4 flex gap-2">
                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleEdit(exp);
                                                                }}
                                                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md border text-sm hover:bg-green-50 text-green-700 border-green-200"
                                                            >
                                                                <Edit3 className="w-4 h-4" /> Edit
                                                            </button>
                                                            <button
                                                                type="button"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    handleDelete(exp.id);
                                                                }}
                                                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-md border text-sm hover:bg-red-50 text-red-700 border-red-200"
                                                            >
                                                                <Trash2 className="w-4 h-4" /> Delete
                                                            </button>
                                                        </div>
                                                    </motion.div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))}

                            {!filteredExperiences.length && (
                                <div className="p-6 text-gray-500">No experiences found.</div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <Modal
                size={'medium'}
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setEditingExperience(null);
                }}
                title={editingExperience ? 'Edit Experience' : 'Add New Experience'}
            >
                <ExperienceForm
                    initialData={
                        editingExperience
                            ? {
                                company: editingExperience.company,
                                position: editingExperience.position,
                                description: editingExperience.description,
                                startDate: editingExperience.startDate,
                                endDate: editingExperience.current ? '' : editingExperience.endDate,
                                current: editingExperience.current,
                            }
                            : undefined
                    }
                    onSave={handleSave}
                    onCancel={() => {
                        setIsModalOpen(false);
                        setEditingExperience(null);
                    }}
                />
            </Modal>
        </div>
    );
}
