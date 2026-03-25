'use client';

import { useEffect, useState } from 'react';
import { Accordion } from '@/components/ui/Accordion';
import { Switch } from '@/components/ui/Switch';
import { useMutation } from '@tanstack/react-query';
import { useUser } from '@/providers/userProvider';
import { updateProfileServices } from '@/lib/api/common';
import { X } from 'lucide-react';

const services = [
    { id: 'rcs', name: 'RCS', serviceId: 1 },
    { id: 'whatsapp', name: 'WhatsApp', serviceId: 2 },
];

export function ServiceModalContent({ onClose }: { onClose: () => void }) {
    const { profile, refetchProfile } = useUser();
    const [enabled, setEnabled] = useState<Record<string, boolean>>({});

    useEffect(() => {
        if (!profile?.userService?.services) return;

        const initialState: Record<string, boolean> = {};

        profile.userService.services.forEach((s) => {
            const key = s.serviceName.toLowerCase();
            initialState[key] = s.mappedStatus === 'active';
        });

        setEnabled(initialState);
    }, [profile]);

    const mutation = useMutation({
        mutationFn: (payload: any[]) => updateProfileServices(profile!.profileId, payload),
        onSuccess: async () => { await refetchProfile(); onClose(); },
        onError: (err) => { console.error("Service update failed", err) },
    });

    const handleSave = () => {
        const payload = services
            .filter((service) => enabled[service.id])
            .map((service) => ({
                serviceId: service.serviceId,
                status: "active",
            }));

        mutation.mutate(payload);
    };

    const items = services.map((service) => ({
        id: service.id,

        header: <span className="font-medium">{service.name}</span>,

        rightContent: (
            <div onClick={(e) => e.stopPropagation()}>
                <Switch
                    enabled={!!enabled[service.id]}
                    onChange={(val) =>
                        setEnabled((prev) => ({ ...prev, [service.id]: val }))
                    }
                />
            </div>
        ),

        content: <div className="text-sm text-gray-500">Manage {service.name}</div>,
    }));

    return (
        <div>
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Manage Services</h2>
                <button
                    onClick={onClose}
                    className="p-1 rounded hover:bg-gray-100"
                >
                    <X className="h-5 w-5 text-gray-500" />
                </button>
            </div>
            <Accordion items={items} />
            <div className="mt-6 flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={mutation.isPending}
                    className="px-4 py-2 rounded bg-black text-white disabled:opacity-50">
                    {mutation.isPending ? 'Saving...' : 'Save'}
                </button>
            </div>
        </div>
    );
}