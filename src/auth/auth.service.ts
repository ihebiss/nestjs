import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login(user: any) {
    const payload = { id: user._id }; // Inclure l'ID utilisateur dans le payload
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
