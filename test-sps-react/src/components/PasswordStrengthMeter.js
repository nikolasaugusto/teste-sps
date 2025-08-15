import React from 'react';
import { validatePassword } from '../utils/passwordValidation';

const PasswordStrengthMeter = ({ password, config = {} }) => {
    const validation = validatePassword(password, config);

    const getStrengthColor = (strength) => {
        switch (strength) {
            case 'Muito Forte': return '#00ff00';
            case 'Forte': return '#90EE90';
            case 'Média': return '#FFD700';
            case 'Fraca': return '#FFA500';
            case 'Muito Fraca': return '#FF0000';
            default: return '#ccc';
        }
    };

    const getCheckIcon = (isValid) => {
        return isValid ? '✓' : '✗';
    };

    const getCheckColor = (isValid) => {
        return isValid ? '#00ff00' : '#ff0000';
    };

    return (
        <div className="password-strength-meter">
            {/* Barra de força da senha */}
            <div className="strength-bar-container">
                <div className="strength-bar">
                    <div
                        className="strength-fill"
                        style={{
                            width: `${validation.score}%`,
                            backgroundColor: getStrengthColor(validation.strength)
                        }}
                    />
                </div>
                <span className="strength-text">
                    Força: {validation.strength} ({validation.score}/100)
                </span>
            </div>

            {/* Lista de requisitos */}
            <div className="requirements-list">
                <h4>Requisitos de Segurança:</h4>

                <div className="requirement-item">
                    <span
                        className="check-icon"
                        style={{ color: getCheckColor(validation.checks.length) }}
                    >
                        {getCheckIcon(validation.checks.length)}
                    </span>
                    <span>Mínimo de {config.minLength || 8} caracteres</span>
                </div>

                <div className="requirement-item">
                    <span
                        className="check-icon"
                        style={{ color: getCheckColor(validation.checks.uppercase) }}
                    >
                        {getCheckIcon(validation.checks.uppercase)}
                    </span>
                    <span>Pelo menos uma letra maiúscula</span>
                </div>

                <div className="requirement-item">
                    <span
                        className="check-icon"
                        style={{ color: getCheckColor(validation.checks.lowercase) }}
                    >
                        {getCheckIcon(validation.checks.lowercase)}
                    </span>
                    <span>Pelo menos uma letra minúscula</span>
                </div>

                <div className="requirement-item">
                    <span
                        className="check-icon"
                        style={{ color: getCheckColor(validation.checks.numbers) }}
                    >
                        {getCheckIcon(validation.checks.numbers)}
                    </span>
                    <span>Pelo menos um número</span>
                </div>

                <div className="requirement-item">
                    <span
                        className="check-icon"
                        style={{ color: getCheckColor(validation.checks.specialChars) }}
                    >
                        {getCheckIcon(validation.checks.specialChars)}
                    </span>
                    <span>Pelo menos um caractere especial (!@#$%^&*()_+-=[]{ }|;:,.)</span>
                </div>

                <div className="requirement-item">
                    <span
                        className="check-icon"
                        style={{ color: getCheckColor(validation.checks.commonPassword) }}
                    >
                        {getCheckIcon(validation.checks.commonPassword)}
                    </span>
                    <span>Não pode ser uma senha comum</span>
                </div>

                <div className="requirement-item">
                    <span
                        className="check-icon"
                        style={{ color: getCheckColor(validation.checks.sequentialChars) }}
                    >
                        {getCheckIcon(validation.checks.sequentialChars)}
                    </span>
                    <span>Sem caracteres sequenciais (123, abc, qwe)</span>
                </div>

                <div className="requirement-item">
                    <span
                        className="check-icon"
                        style={{ color: getCheckColor(validation.checks.repeatedChars) }}
                    >
                        {getCheckIcon(validation.checks.repeatedChars)}
                    </span>
                    <span>Sem caracteres repetidos (aaa, 111)</span>
                </div>
            </div>

            {/* Mensagens de erro */}
            {validation.errors.length > 0 && (
                <div className="error-messages">
                    <h4>Erros:</h4>
                    <ul>
                        {validation.errors.map((error, index) => (
                            <li key={index} className="error-item">{error}</li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Avisos */}
            {validation.warnings.length > 0 && (
                <div className="warning-messages">
                    <h4>Avisos:</h4>
                    <ul>
                        {validation.warnings.map((warning, index) => (
                            <li key={index} className="warning-item">{warning}</li>
                        ))}
                    </ul>
                </div>
            )}


        </div>
    );
};

export default PasswordStrengthMeter;
