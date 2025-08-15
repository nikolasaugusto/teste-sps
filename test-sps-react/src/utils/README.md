# Sistema de Validação de Senha

Este módulo fornece uma solução completa e configurável para validação de senhas com requisitos de segurança avançados.

## Funcionalidades

### ✅ Requisitos de Segurança Configuráveis

- **Comprimento mínimo e máximo** (padrão: 8-128 caracteres)
- **Letras maiúsculas e minúsculas** obrigatórias
- **Números** obrigatórios
- **Caracteres especiais** obrigatórios
- **Proibição de senhas comuns** (ex: "123456", "password")
- **Detecção de caracteres sequenciais** (ex: "123", "abc", "qwe")
- **Detecção de caracteres repetidos** (ex: "aaa", "111")

### 📊 Sistema de Pontuação

- Calcula uma pontuação de 0-100 baseada na força da senha
- Classifica a senha como: Muito Fraca, Fraca, Média, Forte, Muito Forte
- Considera múltiplos fatores para determinar a força

### 🔧 Geração de Senhas Fortes

- Gera senhas que atendem a todos os requisitos de segurança
- Configurável para diferentes níveis de complexidade
- Garante aleatoriedade e segurança

## Como Usar

### Validação Básica

```javascript
import { validatePassword } from "./utils/passwordValidation";

const result = validatePassword("MinhaSenha123!");

if (result.isValid) {
  console.log("Senha válida!");
  console.log("Força:", result.strength);
  console.log("Pontuação:", result.score);
} else {
  console.log("Erros:", result.errors);
  console.log("Avisos:", result.warnings);
}
```

### Configuração Personalizada

```javascript
const customConfig = {
  minLength: 10,
  maxLength: 50,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: false, // Não requer caracteres especiais
  preventCommonPasswords: true,
  preventSequentialChars: true,
  preventRepeatedChars: true,
};

const result = validatePassword("MinhaSenha123", customConfig);
```

### Geração de Senha Forte

```javascript
import { generateStrongPassword } from "./utils/passwordValidation";

// Gerar senha com configurações padrão
const password = generateStrongPassword();

// Gerar senha com configurações personalizadas
const customPassword = generateStrongPassword({
  minLength: 16,
  requireSpecialChars: true,
});
```

### Componente React

```javascript
import PasswordStrengthMeter from "./components/PasswordStrengthMeter";

function MyForm() {
  const [password, setPassword] = useState("");

  return (
    <div>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {password && (
        <PasswordStrengthMeter password={password} config={{ minLength: 10 }} />
      )}
    </div>
  );
}
```

## Configurações Padrão

```javascript
const DEFAULT_PASSWORD_CONFIG = {
  minLength: 8, // Comprimento mínimo
  maxLength: 128, // Comprimento máximo
  requireUppercase: true, // Requer letras maiúsculas
  requireLowercase: true, // Requer letras minúsculas
  requireNumbers: true, // Requer números
  requireSpecialChars: true, // Requer caracteres especiais
  preventCommonPasswords: true, // Bloqueia senhas comuns
  preventSequentialChars: true, // Detecta sequências
  preventRepeatedChars: true, // Detecta repetições
};
```

## Caracteres Especiais Suportados

```
!@#$%^&*()_+-=[]{}|;:,.<>?
```

## Senhas Comuns Bloqueadas

O sistema inclui uma lista extensa de senhas comuns que são automaticamente bloqueadas, incluindo:

- Sequências numéricas: "123456", "123456789", etc.
- Palavras comuns: "password", "qwerty", "admin", etc.
- Padrões de teclado: "qwertyuiop", "asdfghjkl", etc.
- Combinações simples: "abc123", "password123", etc.

## Resultado da Validação

A função `validatePassword` retorna um objeto com:

```javascript
{
  isValid: boolean,           // Se a senha é válida
  errors: string[],          // Lista de erros críticos
  warnings: string[],        // Lista de avisos
  checks: {                  // Status de cada verificação
    length: boolean,
    uppercase: boolean,
    lowercase: boolean,
    numbers: boolean,
    specialChars: boolean,
    commonPassword: boolean,
    sequentialChars: boolean,
    repeatedChars: boolean
  },
  score: number,             // Pontuação de 0-100
  strength: string           // Classificação da força
}
```

## Testes

Execute os testes unitários:

```bash
npm test -- --testPathPattern=passwordValidation
```

Os testes cobrem:

- Validação de senhas válidas e inválidas
- Detecção de todos os tipos de erro
- Geração de senhas fortes
- Configurações personalizadas
- Casos extremos e edge cases

## Boas Práticas

1. **Sempre valide no frontend e backend** - A validação do frontend melhora a UX, mas nunca confie apenas nela
2. **Use configurações apropriadas** - Ajuste os requisitos baseado no contexto da aplicação
3. **Forneça feedback claro** - Use o componente `PasswordStrengthMeter` para dar feedback visual
4. **Mantenha a lista de senhas comuns atualizada** - Adicione novas senhas comuns conforme necessário
5. **Teste regularmente** - Execute os testes unitários para garantir que tudo funciona corretamente

## Segurança

- ✅ Validação robusta de entrada
- ✅ Detecção de padrões comuns de ataque
- ✅ Sistema de pontuação baseado em múltiplos fatores
- ✅ Configurações flexíveis para diferentes contextos
- ✅ Testes abrangentes para garantir qualidade
- ✅ Documentação completa para facilitar manutenção
