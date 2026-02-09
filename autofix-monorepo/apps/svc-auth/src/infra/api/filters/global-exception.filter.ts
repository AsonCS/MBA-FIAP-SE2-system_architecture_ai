import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import {
    DomainException,
    UserNotFoundError,
    TenantNotFoundError,
    InvalidCredentialsError,
    DuplicateEmailError,
    DuplicateCNPJError,
    InactiveUserError,
    SuspendedTenantError,
    UnauthorizedError,
} from '@core/domain/exceptions/domain-exceptions';
import { InvalidEmailError } from '@core/domain/value-objects/email.vo';
import { InvalidPasswordError } from '@core/domain/value-objects/password.vo';
import { InvalidCPFError } from '@core/domain/value-objects/cpf.vo';
import { InvalidCNPJError } from '@core/domain/value-objects/cnpj.vo';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        let status = HttpStatus.INTERNAL_SERVER_ERROR;
        let message = 'Internal server error';

        if (exception instanceof InvalidCredentialsError || exception instanceof UnauthorizedError) {
            status = HttpStatus.UNAUTHORIZED;
            message = exception.message;
        } else if (
            exception instanceof UserNotFoundError ||
            exception instanceof TenantNotFoundError
        ) {
            status = HttpStatus.NOT_FOUND;
            message = exception.message;
        } else if (
            exception instanceof DuplicateEmailError ||
            exception instanceof DuplicateCNPJError
        ) {
            status = HttpStatus.CONFLICT;
            message = exception.message;
        } else if (
            exception instanceof InvalidEmailError ||
            exception instanceof InvalidPasswordError ||
            exception instanceof InvalidCPFError ||
            exception instanceof InvalidCNPJError
        ) {
            status = HttpStatus.BAD_REQUEST;
            message = exception.message;
        } else if (
            exception instanceof InactiveUserError ||
            exception instanceof SuspendedTenantError
        ) {
            status = HttpStatus.FORBIDDEN;
            message = exception.message;
        } else if (exception instanceof DomainException) {
            status = HttpStatus.BAD_REQUEST;
            message = exception.message;
        } else if (exception instanceof Error) {
            message = exception.message;
        }

        response.status(status).json({
            statusCode: status,
            message,
            timestamp: new Date().toISOString(),
        });
    }
}
