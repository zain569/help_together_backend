import { Body, Controller, Get, Post, Request, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { RegisterDto } from './dto/register.dto.js';
import { LoginAuthService, ProfileAuthService, RegisterUserService } from './auth.service.js';
import { LoginDto } from './dto/login.dto.js';
import { AuthGuard } from './guards/auth.guard.js';

@Controller('auth')
export class AuthController {
    constructor(private readonly registerUser: RegisterUserService,
        private readonly loginUser: LoginAuthService,
        private readonly ProfileUser: ProfileAuthService,
    ) { }
    @Post('register')
    @UseInterceptors(FileInterceptor('image'))
    register(
        @Body() registerdto: RegisterDto,
        @UploadedFile() image: Express.Multer.File
    ) {
        return this.registerUser.RegisterUser(registerdto, image);
    }

    @Post('login')
    login(@Body() loginDto: LoginDto) {
        return this.loginUser.LoginUser(loginDto);
    }

    @UseGuards(AuthGuard)
    @Get('profile')
    async getProfile(@Request() req: any) {
        const id = req.user.id;

        const user = await this.ProfileUser.getUserProfile(id);

        return {
            ...user,
        }
    }
}