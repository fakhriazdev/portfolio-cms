'use client';

import React, { PropsWithChildren } from 'react';
import ConsoleNav from '@/src/app/components/ConsoleNav';

export default function ConsoleLayout({ children }: PropsWithChildren) {

    return (
        <div className="max-w-5xl min-h-screen mx-auto px-2">
            <div className="flex gap-2 pb-24 mt-5 md:mt-10">
                <ConsoleNav />
                <main className="w-full">
                    <div className="">{children}</div>
                </main>
            </div>
        </div>
    );
}
