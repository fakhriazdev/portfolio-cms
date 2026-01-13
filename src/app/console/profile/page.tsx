'use client';

import React, { useEffect, useMemo, useState, useTransition } from 'react';
import { Save, Upload, RotateCcw, Trash2 } from 'lucide-react';
import { useFormik } from 'formik';
import FancyBg from '@/src/app/components/ui/FancyBg';
import { getHeader, saveProfile } from '@/src/app/actions/profile'; // ⬅️ Server Actions

interface PageData {
    name: string;
    role: string;
    bio: string;         // maps -> headerInfo.description
    title: string;
    profileImage: string; // maps -> headerInfo.avatarUrl (preview)
}

export default function Page() {
    const [time, setTime] = useState('');
    const [isPending, startTransition] = useTransition();

    // clock
    useEffect(() => {
        const fmt = () =>
            new Intl.DateTimeFormat('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
                timeZone: 'Asia/Jakarta',
            }).format(new Date());
        setTime(fmt());
        const id = setInterval(() => setTime(fmt()), 60_000);
        return () => clearInterval(id);
    }, []);

    // loading/saving/error state
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // source of truth for header preview (diset ketika berhasil save / initial fetch)
    const [profile, setProfile] = useState<PageData>({
        name: 'Fakhri Az',
        role: 'Fullstack Developer',
        bio: 'I create responsive, dynamic websites with clean design, intuitive navigation, and optimized performance — built to deliver results and help your brand grow.',
        title: 'Focus on Impact, Results-driven Web Development.',
        profileImage:
            'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=300',
    });

    // file asli untuk upload + flag remove
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [avatarRemoved, setAvatarRemoved] = useState(false);

    // mapping server -> client form data
    const fromServer = (row: any | null): PageData => ({
        name: row?.name ?? '',
        role: row?.role ?? '',
        bio: row?.description ?? '',
        title: row?.title ?? '',
        profileImage: row?.avatarUrl ?? '',
    });

    // initial fetch
    useEffect(() => {
        setLoading(true);
        setError(null);
        startTransition(async () => {
            try {
                const row = await getHeader();
                if (row) {
                    const mapped = fromServer(row);
                    setProfile(mapped);
                    formik.resetForm({ values: mapped });
                    setSelectedFile(null);
                    setAvatarRemoved(false);
                }
            } catch (e: any) {
                setError(e?.message || 'Failed to load profile');
            } finally {
                setLoading(false);
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); // sekali saat mount

    // ---- FORMIK ----
    const formik = useFormik<PageData>({
        enableReinitialize: true,         // sync dengan profile (setelah fetch/save)
        initialValues: profile,
        validate: (v) => {
            const errors: Partial<Record<keyof PageData, string>> = {};
            if (!v.name.trim()) errors.name = 'Name is required';
            if (!v.role.trim()) errors.role = 'Role is required';
            if (!v.title.trim()) errors.title = 'Title is required';
            if (!v.bio.trim()) errors.bio = 'Bio is required';
            return errors;
        },

        onSubmit: async (values) => {
            setSaving(true);
            setError(null);
            try {
                const payloadText = {
                    title: values.title,
                    description: values.bio,
                    name: values.name,
                    role: values.role,
                    avatarAlt: values.name ? `Profile photo of ${values.name}` : undefined,
                };

                const opts = { clearAvatar: avatarRemoved && !selectedFile };

                const fresh = await saveProfile(payloadText as any, selectedFile ?? undefined, opts);
                const mapped = fromServer(fresh);

                // update header preview & form state
                setProfile(mapped);
                formik.resetForm({ values: mapped });
                setSelectedFile(null);
                setAvatarRemoved(false);
            } catch (e: any) {
                setError(e?.message || 'Failed to save profile');
            } finally {
                setSaving(false);
            }
        },
    });

    const preview: PageData = React.useMemo(
        () => ({ ...profile, ...formik.values }),
        [profile, formik.values]
    );

    // file handlers
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            formik.setFieldValue('profileImage', (ev.target?.result as string) || '');
        };
        reader.readAsDataURL(file);
        setSelectedFile(file);
        setAvatarRemoved(false);
    };

    const handleRemoveImage = () => {
        setSelectedFile(null);
        setAvatarRemoved(true);
        formik.setFieldValue('profileImage', '');
    };

    const onReset = () => {
        formik.resetForm({ values: profile });
        setSelectedFile(null);
        setAvatarRemoved(false);
        setError(null);
    };

    const isBusy = useMemo(() => loading || saving || isPending, [loading, saving, isPending]);

    return (
        <div className="space-y-2">
            {/* Toolbar */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Page Management</h1>
                    <p className="mt-1 text-gray-600">Manage your personal profile information.</p>
                </div>
            </div>

            {/* Header (view only) */}
            <header className="relative z-10 mb-2 overflow-hidden rounded-3xl md:mx-auto md:mt-5 md:h-96">
                <FancyBg />
                <div className="absolute inset-0 z-10 bg-foreground/50 backdrop-blur-lg" />
                <div className="relative z-20 flex h-full justify-center pb-10">
                    <div className="relative flex w-full flex-col items-stretch justify-between gap-6 px-4 py-10 font-sans md:flex-row md:items-center md:gap-8 md:px-8">
                        {/* Left: Title & Bio */}
                        <div className="space-y-4 text-left md:max-w-2xl md:space-y-6">
                            <h1 className="text-4xl font-bold leading-tight text-text-primary md:text-4xl md:font-bold">
                                {loading ? (
                                    <span className="inline-block h-8 w-72 animate-pulse rounded bg-gray-300" />
                                ) : (
                                    preview.title
                                )}
                            </h1>
                            <h2 className="text-[16px] font-medium leading-relaxed text-text-secondary md:text-[16px]">
                                {loading ? (
                                    <span className="inline-block h-16 w-full animate-pulse rounded bg-gray-200" />
                                ) : (
                                    preview.bio
                                )}
                            </h2>
                        </div>

                        {/* Right: Avatar & Name */}
                        <div className="flex items-center md:flex-col gap-2 md:gap-6">
                            <div className="relative flex h-16 w-16 md:h-32 md:w-32 items-center justify-start md:justify-center rounded-full bg-background">
                                {loading ? (
                                    <div className="h-16 w-16 md:h-32 md:w-32 animate-pulse rounded-full bg-gray-300" />
                                ) : preview.profileImage ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                        src={preview.profileImage}
                                        alt="Profile"
                                        className="h-16 w-16 md:h-32 md:w-32 rounded-full border-4 border-white object-cover shadow-lg"
                                    />
                                ) : (
                                    <div className="grid h-16 w-16 md:h-32 md:w-32 place-items-center rounded-full border-4 border-white bg-gray-200 text-gray-500 shadow-lg">
                                        No Image
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col items-center md:min-w-[12rem]">
                <span className="text-[16px] font-semibold text-text-primary md:text-lg">
                  {loading ? <span className="inline-block h-5 w-40 animate-pulse rounded bg-gray-300" /> : preview.name}
                </span>
                                <span className="text-center text-sm font-medium text-text-secondary/60 md:text-[16px]">
                  {loading ? <span className="inline-block h-4 w-28 animate-pulse rounded bg-gray-200" /> : preview.role}
                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Info strip */}
                <div className="absolute bottom-0 left-1/2 z-30 mx-auto flex h-14 -translate-x-1/2 items-center gap-3 rounded-t-3xl border-x-10 border-t-10 border-gray-200 px-2 py-2 text-text-primary backdrop-blur-sm md:h-16">
                    <div className="pointer-events-none absolute -left-[40px] bottom-0 h-[30px] w-[30px] rounded-full bg-transparent shadow-[10px_10px_0_#EAEBEF]" />
                    <div className="pointer-events-none absolute -right-[40px] bottom-0 h-[30px] w-[30px] rounded-full bg-transparent shadow-[-10px_10px_0_#EAEBEF]" />
                    <div className="pointer-events-none absolute right-[0px] bottom-0 h-[30px] w-[30px] rounded-full bg-transparent shadow-[10px_10px_0_#EAEBEF]" />
                    <div className="pointer-events-none absolute left-[0px] bottom-0 h-[30px] w-[30px] rounded-full bg-transparent shadow-[-10px_10px_0_#EAEBEF]" />
                    <div className="min-w-24 text-center text-sm font-semibold md:text-[16px]">Bogor, IDN</div>
                    <div className="min-w-24 text-center text-sm font-semibold md:text-[16px]" suppressHydrationWarning>
                        {time} 😴
                    </div>
                    <div className="min-w-24 text-center text-sm font-semibold text-green-500 md:text-[16px]">Available</div>
                </div>
            </header>

            {/* Formik Form */}
            <section className="w-full rounded-2xl border border-gray-200 bg-white p-4 shadow-sm md:mx-auto">
                <h3 className="text-lg font-semibold text-gray-900">Edit Profile</h3>
                <p className="mt-1 text-sm text-gray-500">Changes will reflect in the header above after saving.</p>

                {error && (
                    <div className="mt-4 rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
                        {error}
                    </div>
                )}

                <form onSubmit={formik.handleSubmit} className="mt-4 space-y-4">
                    {/* Name & Role */}
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                Name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                placeholder="Your name"
                                disabled={isBusy}
                            />
                            {formik.touched.name && formik.errors.name && (
                                <p className="mt-1 text-sm text-red-600">{formik.errors.name}</p>
                            )}
                        </div>
                        <div>
                            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                                Role
                            </label>
                            <input
                                id="role"
                                name="role"
                                type="text"
                                value={formik.values.role}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                placeholder="e.g., Fullstack Developer"
                                disabled={isBusy}
                            />
                            {formik.touched.role && formik.errors.role && (
                                <p className="mt-1 text-sm text-red-600">{formik.errors.role}</p>
                            )}
                        </div>
                    </div>

                    {/* Title */}
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                            Title (headline)
                        </label>
                        <input
                            id="title"
                            name="title"
                            type="text"
                            value={formik.values.title}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            placeholder="e.g., Senior Full-Stack Developer"
                            disabled={isBusy}
                        />
                        {formik.touched.title && formik.errors.title && (
                            <p className="mt-1 text-sm text-red-600">{formik.errors.title}</p>
                        )}
                    </div>

                    {/* Bio */}
                    <div>
                        <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                            Bio
                        </label>
                        <textarea
                            id="bio"
                            name="bio"
                            value={formik.values.bio}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            rows={5}
                            className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-gray-900 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            placeholder="Tell a short story about yourself..."
                            disabled={isBusy}
                        />
                        {formik.touched.bio && formik.errors.bio && (
                            <p className="mt-1 text-sm text-red-600">{formik.errors.bio}</p>
                        )}
                    </div>

                    {/* Profile Image */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Profile Image</label>
                        <div className="mt-2 flex items-center gap-4">
                            <div className="h-20 w-20 overflow-hidden rounded-full border border-gray-200 bg-gray-100">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={
                                        formik.values.profileImage ||
                                        'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="80" height="80"><rect width="100%" height="100%" fill="%23f3f4f6"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="10" fill="%239ca3af">No Image</text></svg>'
                                    }
                                    alt="Preview"
                                    className="h-full w-full object-cover"
                                />
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                                <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50">
                                    <Upload className="h-4 w-4" />
                                    <span>Upload</span>
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        disabled={isBusy}
                                    />
                                </label>

                                {formik.values.profileImage && (
                                    <button
                                        type="button"
                                        onClick={handleRemoveImage}
                                        className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
                                        disabled={isBusy}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        Remove
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-2 pt-2">
                        <button
                            type="button"
                            onClick={onReset}
                            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-50"
                            disabled={isBusy}
                        >
                            <RotateCcw className="h-4 w-4" />
                            Reset
                        </button>
                        <button
                            type="submit"
                            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
                            disabled={isBusy}
                        >
                            <Save className="h-4 w-4" />
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
}
