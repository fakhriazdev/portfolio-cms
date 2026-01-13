'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { logoutAction } from '@/src/app/actions/auth';
import { useFormStatus } from 'react-dom';
import {
    LayoutDashboard, User, Briefcase, FolderOpen, BookOpen, MessageSquare, LogOut,
} from 'lucide-react';

type MenuItem = {
    id: string;
    name: string;
    href: string;
    icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
};

const menu: MenuItem[] = [
    { id: 'dashboard',   name: 'Dashboard',   href: '/console',             icon: LayoutDashboard },
    { id: 'profile',     name: 'Profile',     href: '/console/profile',     icon: User },
    { id: 'experience-types.ts',  name: 'Experience',  href: '/console/experience',  icon: Briefcase },
    { id: 'project',     name: 'Project',     href: '/console/project',     icon: FolderOpen },
    { id: 'blog',        name: 'Blog',        href: '/console/blog',        icon: BookOpen },
    { id: 'testimonial', name: 'Testimonial', href: '/console/testimonial', icon: MessageSquare },
];

const isActive = (pathname: string, href: string) =>
    pathname === href || pathname.startsWith(href + '/');

function LogoutButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="mt-2 flex w-full items-center rounded-lg px-3 py-2 text-sm text-gray-600 transition-colors
                 hover:bg-red-50 hover:text-red-600 disabled:opacity-70 disabled:cursor-not-allowed"
            aria-busy={pending}
        >
            <LogOut className="h-5 w-5" />
            <span className="ml-3 font-medium truncate">{pending ? 'Logging out...' : 'Logout'}</span>
        </button>
    );
}

export default function ConsoleNav() {
    const pathname = usePathname();

    return (
        <>
            {/* ===== Desktop Sidebar ===== */}
            <aside className="sticky top-10 self-start hidden h-full w-64 shrink-0 rounded-lg border border-gray-200 bg-white shadow-sm lg:block" aria-label="Sidebar">
                <div className="border-b border-gray-200 p-3">
                    <div className="grid h-9 w-9 place-items-center rounded-lg bg-blue-600 text-sm font-bold text-white">PF</div>
                    <div className="mt-3 text-sm font-semibold text-gray-900">Portfolio CMS</div>
                    <div className="text-xs text-gray-500">Content Management</div>
                </div>

                <nav className="p-3">
                    <ul className="space-y-2">
                        {menu.map((m) => {
                            const Icon = m.icon;
                            const active = isActive(pathname, m.href);
                            return (
                                <li key={m.id}>
                                    <Link
                                        href={m.href}
                                        aria-current={active ? 'page' : undefined}
                                        className={`flex items-center rounded-lg px-3 py-2 text-sm transition-colors
                      ${active ? 'bg-blue-50 text-blue-600 border border-blue-200' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                    `}
                                    >
                                        <Icon className="h-5 w-5 shrink-0" />
                                        <span className="ml-3 font-medium truncate">{m.name}</span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                <div className="border-t border-gray-200 p-3">
                    {/* ✅ Pakai Server Action langsung (POST default), hindari atribut method untuk cegah mismatch */}
                    <form action={logoutAction}>
                        <LogoutButton />
                    </form>
                </div>
            </aside>

            {/* ===== Mobile Bottom Nav ===== */}
            <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-200 bg-white shadow-[0_-2px_8px_rgba(0,0,0,0.05)] lg:hidden" role="navigation" aria-label="Bottom Navigation">
                <ul className="mx-auto flex max-w-5xl items-center justify-between px-3 py-2">
                    {menu.map((m) => {
                        const Icon = m.icon;
                        const active = isActive(pathname, m.href);
                        return (
                            <li key={m.id} className="flex-1">
                                <Link
                                    href={m.href}
                                    aria-current={active ? 'page' : undefined}
                                    className={`flex flex-col items-center justify-center gap-1 rounded-md px-2 py-1 text-xs
                    ${active ? 'text-blue-600' : 'text-gray-500 hover:text-gray-800'}
                  `}
                                >
                                    <Icon className="h-5 w-5" />
                                    <span className="leading-none">{m.name}</span>
                                </Link>
                            </li>
                        );
                    })}
                    {/* Logout di bottom bar juga via action */}
                    <li className="flex-1">
                        <form action={logoutAction} className="flex justify-center">
                            <button type="submit" className="flex flex-col items-center justify-center gap-1 rounded-md px-2 py-1 text-xs text-gray-500 hover:text-red-600">
                                <LogOut className="h-5 w-5" />
                                <span className="leading-none">Logout</span>
                            </button>
                        </form>
                    </li>
                </ul>
            </nav>
        </>
    );
}
