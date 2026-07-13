import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { Strategy } from "passport-jwt";
import { UsersService } from "../../users/users.service";

function cookieExtractor(req: Request): string | null {
  return req?.cookies?.["access_token"] ?? null;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersService: UsersService) {
    super({
      jwtFromRequest: cookieExtractor,
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET ?? "",
    });
  }

  async validate(payload: { sub: number; role: string }) {
    const user = await this.usersService.findById(payload.sub);
    if (!user || user.blocked) {
      throw new UnauthorizedException();
    }
    return {
      id: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      sellerStatus: user.sellerStatus ?? null,
    };
  }
}
