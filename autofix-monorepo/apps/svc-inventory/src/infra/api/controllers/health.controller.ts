import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

/**
 * HealthController
 * Provides health check endpoints for monitoring
 */
@ApiTags('Health')
@Controller('health')
export class HealthController {
    @Get()
    @ApiOperation({ summary: 'Health check endpoint' })
    @ApiResponse({ status: 200, description: 'Service is healthy' })
    check() {
        return {
            status: 'ok',
            service: 'svc-inventory',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
        };
    }

    @Get('ready')
    @ApiOperation({ summary: 'Readiness check endpoint' })
    @ApiResponse({ status: 200, description: 'Service is ready' })
    ready() {
        return {
            status: 'ready',
            service: 'svc-inventory',
            timestamp: new Date().toISOString(),
        };
    }

    @Get('live')
    @ApiOperation({ summary: 'Liveness check endpoint' })
    @ApiResponse({ status: 200, description: 'Service is alive' })
    live() {
        return {
            status: 'alive',
            service: 'svc-inventory',
            timestamp: new Date().toISOString(),
        };
    }
}
