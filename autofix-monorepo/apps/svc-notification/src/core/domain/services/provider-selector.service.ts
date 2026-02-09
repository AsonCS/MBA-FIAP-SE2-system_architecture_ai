import { NotificationChannel } from '../aggregates';

export interface IProviderGateway {
    send(...args: any[]): Promise<string>;
    isAvailable(): Promise<boolean>;
}

export class ProviderSelector {
    private providers: Map<NotificationChannel, IProviderGateway[]>;
    private currentProviderIndex: Map<NotificationChannel, number>;

    constructor() {
        this.providers = new Map();
        this.currentProviderIndex = new Map();
    }

    registerProvider(channel: NotificationChannel, provider: IProviderGateway): void {
        if (!this.providers.has(channel)) {
            this.providers.set(channel, []);
            this.currentProviderIndex.set(channel, 0);
        }
        this.providers.get(channel)!.push(provider);
    }

    async selectProvider(channel: NotificationChannel): Promise<IProviderGateway> {
        const channelProviders = this.providers.get(channel);

        if (!channelProviders || channelProviders.length === 0) {
            throw new Error(`No providers registered for channel: ${channel}`);
        }

        // Try to find an available provider
        const startIndex = this.currentProviderIndex.get(channel) || 0;
        let attempts = 0;

        while (attempts < channelProviders.length) {
            const currentIndex = (startIndex + attempts) % channelProviders.length;
            const provider = channelProviders[currentIndex];

            try {
                const isAvailable = await provider.isAvailable();
                if (isAvailable) {
                    // Update the current index for round-robin
                    this.currentProviderIndex.set(channel, (currentIndex + 1) % channelProviders.length);
                    return provider;
                }
            } catch (error) {
                // Provider health check failed, try next one
            }

            attempts++;
        }

        // If no provider is available, return the first one and let it fail
        // This ensures we don't block the notification completely
        return channelProviders[0];
    }

    async getNextProvider(channel: NotificationChannel, failedProvider: IProviderGateway): Promise<IProviderGateway | null> {
        const channelProviders = this.providers.get(channel);

        if (!channelProviders || channelProviders.length <= 1) {
            return null; // No fallback available
        }

        // Find the next available provider that's not the failed one
        for (const provider of channelProviders) {
            if (provider !== failedProvider) {
                try {
                    const isAvailable = await provider.isAvailable();
                    if (isAvailable) {
                        return provider;
                    }
                } catch (error) {
                    continue;
                }
            }
        }

        return null;
    }

    getProviderCount(channel: NotificationChannel): number {
        return this.providers.get(channel)?.length || 0;
    }
}
