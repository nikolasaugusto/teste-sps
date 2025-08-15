import { validatePassword, generateStrongPassword } from './passwordValidation';

/**
 * Exemplos de uso da validação de senha
 */

// Exemplo 1: Validação básica
export const exemploValidacaoBasica = () => {
    console.log('=== Exemplo 1: Validação Básica ===');

    const senhas = [
        'senha123',           // Senha fraca
        'MinhaSenha123!',     // Senha forte
        'password',           // Senha comum (bloqueada)
        '123456',             // Senha comum (bloqueada)
        'MyV3ryStr0ngP@ssw0rd!2024' // Senha muito forte
    ];

    senhas.forEach(senha => {
        const resultado = validatePassword(senha);
        console.log(`\nSenha: "${senha}"`);
        console.log(`Válida: ${resultado.isValid}`);
        console.log(`Força: ${resultado.strength} (${resultado.score}/100)`);

        if (resultado.errors.length > 0) {
            console.log('Erros:', resultado.errors);
        }

        if (resultado.warnings.length > 0) {
            console.log('Avisos:', resultado.warnings);
        }
    });
};

// Exemplo 2: Configuração personalizada
export const exemploConfiguracaoPersonalizada = () => {
    console.log('\n=== Exemplo 2: Configuração Personalizada ===');

    const configPersonalizada = {
        minLength: 6,
        requireUppercase: false,
        requireSpecialChars: false,
        preventCommonPasswords: true
    };

    const senha = 'minhasenha123';
    const resultado = validatePassword(senha, configPersonalizada);

    console.log(`Senha: "${senha}"`);
    console.log(`Configuração:`, configPersonalizada);
    console.log(`Válida: ${resultado.isValid}`);
    console.log(`Força: ${resultado.strength} (${resultado.score}/100)`);
};

// Exemplo 3: Geração de senhas fortes
export const exemploGeracaoSenhas = () => {
    console.log('\n=== Exemplo 3: Geração de Senhas Fortes ===');

    // Gerar senha com configurações padrão
    const senhaPadrao = generateStrongPassword();
    console.log(`Senha gerada (padrão): "${senhaPadrao}"`);

    // Gerar senha com configurações personalizadas
    const configPersonalizada = {
        minLength: 16,
        requireSpecialChars: true
    };

    const senhaPersonalizada = generateStrongPassword(configPersonalizada);
    console.log(`Senha gerada (personalizada): "${senhaPersonalizada}"`);

    // Validar as senhas geradas
    const validacaoPadrao = validatePassword(senhaPadrao);
    const validacaoPersonalizada = validatePassword(senhaPersonalizada, configPersonalizada);

    console.log(`\nValidação senha padrão: ${validacaoPadrao.isValid} - ${validacaoPadrao.strength}`);
    console.log(`Validação senha personalizada: ${validacaoPersonalizada.isValid} - ${validacaoPersonalizada.strength}`);
};

// Exemplo 4: Teste de diferentes tipos de erro
export const exemploTesteErros = () => {
    console.log('\n=== Exemplo 4: Teste de Diferentes Tipos de Erro ===');

    const casosTeste = [
        { senha: '', descricao: 'Senha vazia' },
        { senha: 'abc', descricao: 'Senha muito curta' },
        { senha: 'abcdefgh', descricao: 'Sem maiúsculas, números ou caracteres especiais' },
        { senha: 'ABCDEFGH', descricao: 'Sem minúsculas, números ou caracteres especiais' },
        { senha: '12345678', descricao: 'Apenas números' },
        { senha: '!@#$%^&*', descricao: 'Apenas caracteres especiais' },
        { senha: 'password', descricao: 'Senha comum' },
        { senha: 'MyPass123!', descricao: 'Com caracteres sequenciais (123)' },
        { senha: 'MyPass111!', descricao: 'Com caracteres repetidos (111)' }
    ];

    casosTeste.forEach(caso => {
        const resultado = validatePassword(caso.senha);
        console.log(`\n${caso.descricao}: "${caso.senha}"`);
        console.log(`Válida: ${resultado.isValid}`);

        if (resultado.errors.length > 0) {
            console.log('Erros:', resultado.errors);
        }

        if (resultado.warnings.length > 0) {
            console.log('Avisos:', resultado.warnings);
        }
    });
};

// Exemplo 5: Comparação de força de senhas
export const exemploComparacaoForca = () => {
    console.log('\n=== Exemplo 5: Comparação de Força de Senhas ===');

    const senhas = [
        '123456',
        'password',
        'abc123',
        'MyPass123',
        'MyPass123!',
        'MyV3ryStr0ngP@ssw0rd!2024',
        'Kj9#mN2$pQ7@vX5&hL8*wE3!rT6^yU1'
    ];

    const resultados = senhas.map(senha => ({
        senha,
        resultado: validatePassword(senha)
    }));

    // Ordenar por pontuação
    resultados.sort((a, b) => b.resultado.score - a.resultado.score);

    console.log('Ranking de força das senhas:');
    resultados.forEach((item, index) => {
        console.log(`${index + 1}. "${item.senha}" - ${item.resultado.strength} (${item.resultado.score}/100)`);
    });
};

// Função para executar todos os exemplos
export const executarTodosExemplos = () => {
    console.log('🚀 Executando exemplos de validação de senha...\n');

    exemploValidacaoBasica();
    exemploConfiguracaoPersonalizada();
    exemploGeracaoSenhas();
    exemploTesteErros();
    exemploComparacaoForca();

    console.log('\n✅ Todos os exemplos foram executados!');
};

// Exportar para uso no console do navegador
if (typeof window !== 'undefined') {
    window.passwordValidationExamples = {
        exemploValidacaoBasica,
        exemploConfiguracaoPersonalizada,
        exemploGeracaoSenhas,
        exemploTesteErros,
        exemploComparacaoForca,
        executarTodosExemplos
    };

    console.log('📚 Exemplos de validação de senha carregados!');
    console.log('Execute: passwordValidationExamples.executarTodosExemplos()');
}
