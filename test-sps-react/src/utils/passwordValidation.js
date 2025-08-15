/**
 * Configurações padrão para validação de senha
 */
export const DEFAULT_PASSWORD_CONFIG = {
    minLength: 8,
    maxLength: 128,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
    preventCommonPasswords: true,
    preventSequentialChars: true,
    preventRepeatedChars: true
};

/**
 * Lista de senhas comuns que devem ser evitadas
 */
const COMMON_PASSWORDS = [
    "123456", "123456789", "12345678", "1234567", "password", "qwerty",
    "abc123", "password123", "admin", "letmein", "welcome", "monkey",
    "1234567890", "12345678901", "123456789012", "1234567890123",
    "111111", "000000", "123123", "123321", "654321", "666666",
    "888888", "999999", "11111111", "00000000", "123456789012345",
    "admin123", "root", "user", "guest", "test", "demo", "sample",
    "password1", "password2", "password3", "password4", "password5",
    "qwerty123", "qwertyuiop", "asdfghjkl", "zxcvbnm", "qazwsx",
    "qwertyuiop123", "asdfghjkl123", "zxcvbnm123", "qazwsx123",
    "123qwe", "qwe123", "123qwe123", "qwe123qwe", "123qwe123qwe",
    "qwe123qwe123", "123qwe123qwe123", "qwe123qwe123qwe",
    "123qwe123qwe123qwe", "qwe123qwe123qwe123", "123qwe123qwe123qwe123"
];

/**
 * Caracteres especiais válidos
 */
const SPECIAL_CHARS = "!@#$%^&*()_+-=[]{}|;:,.<>?";

/**
 * Valida uma senha de acordo com as configurações especificadas
 * @param {string} password - A senha a ser validada
 * @param {Object} config - Configurações de validação (opcional)
 * @returns {Object} - Resultado da validação com detalhes
 */
export const validatePassword = (password, config = {}) => {
    const finalConfig = { ...DEFAULT_PASSWORD_CONFIG, ...config };
    const errors = [];
    const warnings = [];
    const checks = {
        length: false,
        uppercase: false,
        lowercase: false,
        numbers: false,
        specialChars: false,
        commonPassword: false,
        sequentialChars: false,
        repeatedChars: false
    };

    // Verificar se a senha está definida
    if (!password || typeof password !== 'string') {
        return {
            isValid: false,
            errors: ['Senha é obrigatória'],
            warnings: [],
            checks,
            score: 0
        };
    }

    // 1. Verificar comprimento mínimo e máximo
    if (password.length < finalConfig.minLength) {
        errors.push(`A senha deve ter pelo menos ${finalConfig.minLength} caracteres`);
    } else if (password.length > finalConfig.maxLength) {
        errors.push(`A senha deve ter no máximo ${finalConfig.maxLength} caracteres`);
    } else {
        checks.length = true;
    }

    // 2. Verificar letras maiúsculas
    if (finalConfig.requireUppercase && !/[A-Z]/.test(password)) {
        errors.push('A senha deve conter pelo menos uma letra maiúscula');
    } else if (finalConfig.requireUppercase) {
        checks.uppercase = true;
    }

    // 3. Verificar letras minúsculas
    if (finalConfig.requireLowercase && !/[a-z]/.test(password)) {
        errors.push('A senha deve conter pelo menos uma letra minúscula');
    } else if (finalConfig.requireLowercase) {
        checks.lowercase = true;
    }

    // 4. Verificar números
    if (finalConfig.requireNumbers && !/\d/.test(password)) {
        errors.push('A senha deve conter pelo menos um número');
    } else if (finalConfig.requireNumbers) {
        checks.numbers = true;
    }

    // 5. Verificar caracteres especiais
    if (finalConfig.requireSpecialChars && !new RegExp(`[${SPECIAL_CHARS.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}]`).test(password)) {
        errors.push('A senha deve conter pelo menos um caractere especial (!@#$%^&*()_+-=[]{}|;:,.<>?)');
    } else if (finalConfig.requireSpecialChars) {
        checks.specialChars = true;
    }

    // 6. Verificar senhas comuns
    if (finalConfig.preventCommonPasswords) {
        const normalizedPassword = password.toLowerCase();
        if (COMMON_PASSWORDS.includes(normalizedPassword)) {
            errors.push('Esta senha é muito comum e não é permitida');
        } else {
            checks.commonPassword = true;
        }
    }

    // 7. Verificar caracteres sequenciais (ex: 123, abc, qwe)
    if (finalConfig.preventSequentialChars) {
        const sequentialPatterns = [
            '123', '234', '345', '456', '567', '678', '789', '890',
            'abc', 'bcd', 'cde', 'def', 'efg', 'fgh', 'ghi', 'hij', 'ijk', 'jkl', 'klm', 'lmn', 'mno', 'nop', 'opq', 'pqr', 'qrs', 'rst', 'stu', 'tuv', 'uvw', 'vwx', 'wxy', 'xyz',
            'qwe', 'wer', 'ert', 'rty', 'tyu', 'yui', 'uio', 'iop',
            'asd', 'sdf', 'dfg', 'fgh', 'ghj', 'hjk', 'jkl', 'klz',
            'zxc', 'xcv', 'cvb', 'vbn', 'bnm'
        ];

        const lowerPassword = password.toLowerCase();
        const hasSequential = sequentialPatterns.some(pattern =>
            lowerPassword.includes(pattern)
        );

        if (hasSequential) {
            warnings.push('A senha contém caracteres sequenciais que podem ser facilmente adivinhados');
        } else {
            checks.sequentialChars = true;
        }
    }

    // 8. Verificar caracteres repetidos (ex: aaa, 111, ###)
    if (finalConfig.preventRepeatedChars) {
        const repeatedPattern = /(.)\1{2,}/;
        if (repeatedPattern.test(password)) {
            warnings.push('A senha contém caracteres repetidos que podem ser facilmente adivinhados');
        } else {
            checks.repeatedChars = true;
        }
    }

    // Calcular pontuação de força da senha (0-100)
    const score = calculatePasswordScore(password, checks);

    return {
        isValid: errors.length === 0,
        errors,
        warnings,
        checks,
        score,
        strength: getPasswordStrength(score)
    };
};

/**
 * Calcula a pontuação de força da senha
 * @param {string} password - A senha
 * @param {Object} checks - Os checks que passaram
 * @returns {number} - Pontuação de 0 a 100
 */
const calculatePasswordScore = (password, checks) => {
    let score = 0;

    // Pontuação base por comprimento
    if (password.length >= 8) score += 10;
    if (password.length >= 12) score += 10;
    if (password.length >= 16) score += 10;

    // Pontuação por tipos de caracteres
    if (checks.uppercase) score += 10;
    if (checks.lowercase) score += 10;
    if (checks.numbers) score += 15;
    if (checks.specialChars) score += 15;

    // Pontuação por complexidade
    const uniqueChars = new Set(password).size;
    if (uniqueChars >= password.length * 0.8) score += 10;
    if (uniqueChars >= password.length * 0.9) score += 5;

    // Penalidades
    if (!checks.commonPassword) score -= 20;
    if (!checks.sequentialChars) score -= 10;
    if (!checks.repeatedChars) score -= 10;

    return Math.max(0, Math.min(100, score));
};

/**
 * Retorna a classificação de força da senha
 * @param {number} score - Pontuação da senha
 * @returns {string} - Classificação da força
 */
const getPasswordStrength = (score) => {
    if (score >= 80) return 'Muito Forte';
    if (score >= 60) return 'Forte';
    if (score >= 40) return 'Média';
    if (score >= 20) return 'Fraca';
    return 'Muito Fraca';
};

/**
 * Gera uma senha forte baseada nas configurações
 * @param {Object} config - Configurações de validação
 * @returns {string} - Senha gerada
 */
export const generateStrongPassword = (config = {}) => {
    const finalConfig = { ...DEFAULT_PASSWORD_CONFIG, ...config };
    const length = Math.max(finalConfig.minLength, 12);

    let charset = '';
    let password = '';

    // Adicionar caracteres baseados nas configurações
    if (finalConfig.requireLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (finalConfig.requireUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (finalConfig.requireNumbers) charset += '0123456789';
    if (finalConfig.requireSpecialChars) charset += SPECIAL_CHARS;

    // Garantir pelo menos um de cada tipo requerido
    if (finalConfig.requireLowercase) password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)];
    if (finalConfig.requireUppercase) password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)];
    if (finalConfig.requireNumbers) password += '0123456789'[Math.floor(Math.random() * 10)];
    if (finalConfig.requireSpecialChars) password += SPECIAL_CHARS[Math.floor(Math.random() * SPECIAL_CHARS.length)];

    // Completar o resto da senha
    const remainingLength = length - password.length;
    for (let i = 0; i < remainingLength; i++) {
        password += charset[Math.floor(Math.random() * charset.length)];
    }

    // Embaralhar a senha
    return password.split('').sort(() => Math.random() - 0.5).join('');
};
