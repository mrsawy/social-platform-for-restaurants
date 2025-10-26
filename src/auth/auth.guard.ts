import {
    CanActivate,
    ExecutionContext,
    Injectable,
    InternalServerErrorException,
    UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';


@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly authService: AuthService,
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        if (context.getType() === 'http') {
            return await this.handleHttpRequest(context);
        } else {
            throw new InternalServerErrorException(
                'unimplemented communication context',
            );
        }
    }

    private async handleHttpRequest(
        context: ExecutionContext,
    ): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);
        if (!token) {
            throw new UnauthorizedException('No token provided');
        }

        try {
            const payload = this.authService.verifyToken(token);
            request.user = payload;
            return true;
        } catch (error) {
            console.error('Token verification failed:', error);
            throw new UnauthorizedException('Invalid token ::=>', error.message);
        }
    }
    private extractTokenFromHeader(request: any): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}
