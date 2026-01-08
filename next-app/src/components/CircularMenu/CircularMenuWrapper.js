'use client';
import { usePathname } from 'next/navigation';
import { usePopup } from '@/context/PopupContext';
import CircularMenu from './CircularMenu';

export default function CircularMenuWrapper() {
    const pathname = usePathname();
    const { hasSeenPopup } = usePopup();

    // Don't show menu until user has clicked "Enter" on the popup
    if (!hasSeenPopup) {
        return null;
    }

    return <CircularMenu />;
}
