import { AuthService } from './auth.service.js';
import { UnauthorizedException } from '@nestjs/common';

const prismaMock = {
  refreshToken: {
    findUnique: jest.fn(),
    update: jest.fn(),
    create: jest.fn(),
  },
};

const usersServiceMock = {
  findByEmail: jest.fn(),
  createUser: jest.fn(),
};

const jwtServiceMock = {
  signAsync: jest.fn(),
  verifyAsync: jest.fn(),
};

const configServiceMock = {
  get: jest.fn(),
  getOrThrow: jest.fn(),
};

describe('AuthService', () => {
  it('throws on invalid refresh token', async () => {
    configServiceMock.getOrThrow.mockReturnValue('secret');
    configServiceMock.get.mockReturnValue(900);
    jwtServiceMock.verifyAsync.mockResolvedValue({
      tokenType: 'refresh',
      jti: 'jti',
      sub: 'user',
      email: 'a@b.com',
    });
    prismaMock.refreshToken.findUnique.mockResolvedValue(null);

    const service = new AuthService(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      usersServiceMock as any,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      jwtServiceMock as any,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      prismaMock as any,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      configServiceMock as any,
    );

    await expect(service.refresh({ refreshToken: 'bad' })).rejects.toBeInstanceOf(
      UnauthorizedException,
    );
  });
});
