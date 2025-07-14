import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let authService: AuthService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            create: jest.fn(),
            findByUsername: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAssync: jest.fn(),
          },
        }
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  describe('Sign Up', () => {
    it('should check for username', async () => {
      const INPUT = {
        username: 'myuser2025',
        password: 'mypassword123',
        fullName: 'Jane Deer',
      };

      const user = new User();
      user.id = 1;
      user.password = 'hashed';

      user.username = 'myusername';
      user.password = 'mypassword';

      const createSpy = jest
        .spyOn(usersService, 'create')
        .mockResolvedValue(user);
      jest.spyOn(usersService, 'findByUsername').mockResolvedValue(null);

      const createdUser = await authService.signUp({
        username: INPUT.username,
        password: INPUT.password,
        fullName: INPUT.fullName,
      });

      expect(createdUser).toBeInstanceOf(User);

      expect(createSpy).toHaveBeenCalledTimes(1);
      expect(createSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          fullName: INPUT.fullName,
        } as User),
      );
    });

    it('should create new user', async () => {
      const INPUT = {
        username: 'myuser2025',
        password: 'mypassword123',
        fullName: 'Jane Deer',
      };

      jest.spyOn(usersService, 'create').mockResolvedValue(
        new User({
          ...INPUT,
        }),
      );
      const result = await authService.signUp({
        fullName: INPUT.fullName,
        username: INPUT.username,
        password: INPUT.password,
      });

      expect(result).toBeInstanceOf(User);
    });
  });

  describe('Sign In', () => {
    it('should throw an invalid credentials exception on invalid login', async () => {
      const user = new User();
      user.id = 1;
      user.password = 'dummypassword';

      // user exists but invalid password
      jest
        .spyOn(usersService, 'findByUsername')
        .mockReturnValue(Promise.resolve(user));

      await expect(
        authService.signIn({ username: '===', password: '===' }),
      ).rejects.toThrow('Invalid Login Credentials');
    });
  });

  describe('hashPassword', () => {
    it('should return an object containing hashed and salt', async () => {
      const result = await authService.hashPassword('password');
      expect(result.length).toBeGreaterThan(0);
    });
  });
});
