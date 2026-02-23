import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Health')
@Controller('health')
export class AppController {
    @Get()
    @ApiOperation({ summary: 'Check service health' })
    @ApiResponse({ status: 200, description: 'Service is healthy' })
    getHealth() {
        return {
            status: 'ok',
            timestamp: new Date().toISOString(),
            service: 'svc-notification'
        };
    }
}
