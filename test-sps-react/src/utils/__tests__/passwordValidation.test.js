import { validatePassword, generateStrongPassword, DEFAULT_PASSWORD_CONFIG } from '../passwordValidation';

describe('Password Validation', () => {
    describe('validatePassword', () => {
        test('should return valid for a strong password', () => {
            const result = validatePassword('MyStrongP@ssw0rd!');

            expect(result.isValid).toBe(true);
            expect(result.errors).toHaveLength(0);
            expect(result.score).toBeGreaterThan(60);
            expect(result.strength).toBe('Forte');
        });

        test('should detect password too short', () => {
            const result = validatePassword('Abc1!');

            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('A senha deve ter pelo menos 8 caracteres');
        });

        test('should detect password too long', () => {
            const longPassword = 'A'.repeat(129);
            const result = validatePassword(longPassword);

            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('A senha deve ter no máximo 128 caracteres');
        });

        test('should detect missing uppercase letter', () => {
            const result = validatePassword('mystrongpass1!');

            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('A senha deve conter pelo menos uma letra maiúscula');
        });

        test('should detect missing lowercase letter', () => {
            const result = validatePassword('MYSTRONGPASS1!');

            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('A senha deve conter pelo menos uma letra minúscula');
        });

        test('should detect missing number', () => {
            const result = validatePassword('MyStrongPass!');

            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('A senha deve conter pelo menos um número');
        });

        test('should detect missing special character', () => {
            const result = validatePassword('MyStrongPass1');

            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('A senha deve conter pelo menos um caractere especial');
        });

        test('should detect common passwords', () => {
            const result = validatePassword('password');

            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Esta senha é muito comum e não é permitida');
        });

        test('should detect sequential characters', () => {
            const result = validatePassword('MyPass123!');

            expect(result.isValid).toBe(true);
            expect(result.warnings).toContain('A senha contém caracteres sequenciais que podem ser facilmente adivinhados');
        });

        test('should detect repeated characters', () => {
            const result = validatePassword('MyPass111!');

            expect(result.isValid).toBe(true);
            expect(result.warnings).toContain('A senha contém caracteres repetidos que podem ser facilmente adivinhados');
        });

        test('should handle empty password', () => {
            const result = validatePassword('');

            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Senha é obrigatória');
        });

        test('should handle null password', () => {
            const result = validatePassword(null);

            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Senha é obrigatória');
        });

        test('should handle undefined password', () => {
            const result = validatePassword(undefined);

            expect(result.isValid).toBe(false);
            expect(result.errors).toContain('Senha é obrigatória');
        });

        test('should work with custom configuration', () => {
            const customConfig = {
                minLength: 6,
                requireUppercase: false,
                requireSpecialChars: false
            };

            const result = validatePassword('mypass1', customConfig);

            expect(result.isValid).toBe(true);
            expect(result.errors).toHaveLength(0);
        });

        test('should calculate correct score for very strong password', () => {
            const result = validatePassword('MyV3ryStr0ngP@ssw0rd!2024');

            expect(result.score).toBeGreaterThan(80);
            expect(result.strength).toBe('Muito Forte');
        });

        test('should calculate correct score for weak password', () => {
            const result = validatePassword('weak');

            expect(result.score).toBeLessThan(20);
            expect(result.strength).toBe('Muito Fraca');
        });
    });

    describe('generateStrongPassword', () => {
        test('should generate password with default requirements', () => {
            const password = generateStrongPassword();

            const validation = validatePassword(password);
            expect(validation.isValid).toBe(true);
            expect(password.length).toBeGreaterThanOrEqual(12);
        });

        test('should generate password with custom requirements', () => {
            const customConfig = {
                minLength: 16,
                requireUppercase: true,
                requireLowercase: true,
                requireNumbers: true,
                requireSpecialChars: true
            };

            const password = generateStrongPassword(customConfig);

            const validation = validatePassword(password, customConfig);
            expect(validation.isValid).toBe(true);
            expect(password.length).toBeGreaterThanOrEqual(16);
        });

        test('should generate different passwords each time', () => {
            const password1 = generateStrongPassword();
            const password2 = generateStrongPassword();

            expect(password1).not.toBe(password2);
        });

        test('should include all required character types', () => {
            const password = generateStrongPassword();

            expect(/[A-Z]/.test(password)).toBe(true); // uppercase
            expect(/[a-z]/.test(password)).toBe(true); // lowercase
            expect(/\d/.test(password)).toBe(true); // numbers
            expect(/[!@#$%^&*()_+\-=\[\]{}|;:,.<>?]/.test(password)).toBe(true); // special chars
        });
    });

    describe('DEFAULT_PASSWORD_CONFIG', () => {
        test('should have all required properties', () => {
            expect(DEFAULT_PASSWORD_CONFIG).toHaveProperty('minLength');
            expect(DEFAULT_PASSWORD_CONFIG).toHaveProperty('maxLength');
            expect(DEFAULT_PASSWORD_CONFIG).toHaveProperty('requireUppercase');
            expect(DEFAULT_PASSWORD_CONFIG).toHaveProperty('requireLowercase');
            expect(DEFAULT_PASSWORD_CONFIG).toHaveProperty('requireNumbers');
            expect(DEFAULT_PASSWORD_CONFIG).toHaveProperty('requireSpecialChars');
            expect(DEFAULT_PASSWORD_CONFIG).toHaveProperty('preventCommonPasswords');
            expect(DEFAULT_PASSWORD_CONFIG).toHaveProperty('preventSequentialChars');
            expect(DEFAULT_PASSWORD_CONFIG).toHaveProperty('preventRepeatedChars');
        });

        test('should have reasonable default values', () => {
            expect(DEFAULT_PASSWORD_CONFIG.minLength).toBe(8);
            expect(DEFAULT_PASSWORD_CONFIG.maxLength).toBe(128);
            expect(DEFAULT_PASSWORD_CONFIG.requireUppercase).toBe(true);
            expect(DEFAULT_PASSWORD_CONFIG.requireLowercase).toBe(true);
            expect(DEFAULT_PASSWORD_CONFIG.requireNumbers).toBe(true);
            expect(DEFAULT_PASSWORD_CONFIG.requireSpecialChars).toBe(true);
            expect(DEFAULT_PASSWORD_CONFIG.preventCommonPasswords).toBe(true);
            expect(DEFAULT_PASSWORD_CONFIG.preventSequentialChars).toBe(true);
            expect(DEFAULT_PASSWORD_CONFIG.preventRepeatedChars).toBe(true);
        });
    });
});
