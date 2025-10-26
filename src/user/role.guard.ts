import {
    CanActivate,
    ExecutionContext,
    Injectable,
    InternalServerErrorException,
    UnauthorizedException,
} from '@nestjs/common';
import { IUserRequest } from 'src/auth/types/IUserRequest.interface';
import { Roles } from './enums/roles.enum';



@Injectable()
export class ISAdmin implements CanActivate {

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
        const request = context.switchToHttp().getRequest() as IUserRequest;

        if (request.user.role !== Roles.ADMIN) {
            throw new UnauthorizedException('Unauthorized To Preform this action');
        }

        return true;

    }

}
