import { scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

const scryptAsync = promisify(scrypt);

export class PasswordService {
  static async toHash(password: string): Promise<string> {
    const salt = randomBytes(8).toString('hex');
    const buf = (await scryptAsync(password, salt, 64)) as Buffer;

    return `${buf.toString('hex')}.${salt}`;
  }

  static async compare(storedPassword: string, suppliedPassword: string): Promise<boolean> {
    const [hashedPassword, salt] = storedPassword.split('.');
    const buf = (await scryptAsync(suppliedPassword, salt, 64)) as Buffer;

    return buf.toString('hex') === hashedPassword;
  }

  static validateStrength(password: string): { isValid: boolean; reasons: string[] } {
    const reasons: string[] = [];
    
    if (password.length < 4) {
      reasons.push('Password must be at least 4 characters long');
    }
    
    if (password.length > 20) {
      reasons.push('Password must be no more than 20 characters long');
    }
    
    return {
      isValid: reasons.length === 0,
      reasons
    };
  }
}

export const Password = PasswordService;