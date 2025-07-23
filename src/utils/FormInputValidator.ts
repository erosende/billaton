import type { Participant, IssuerConfig } from '../interfaces/Participant';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  fieldErrors: Record<string, string>;
}

export interface ValidationRules {
  required: boolean;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => string | null;
}

export const recipientValidationRules: Record<string, ValidationRules> = {
  name: {
    required: true,
    minLength: 1,
    maxLength: 100
  },
  surnames: {
    required: true,
    minLength: 1,
    maxLength: 100
  },
  identificationTypeId: {
    required: true,
    custom: (value) => {
      if (!value || (typeof value === 'number' && value <= 0)) {
        return 'Debe seleccionar un tipo de identificación válido';
      }
      return null;
    }
  },
  identificationNumber: {
    required: true,
    minLength: 1,
    maxLength: 20
  },
  email: {
    required: true,
    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    custom: (value) => {
      if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return 'El formato del correo electrónico no es válido';
      }
      return null;
    }
  },
  phoneNumber: {
    required: true,
    minLength: 9,
    maxLength: 15,
    pattern: /^[0-9+\-\s]+$/,
    custom: (value) => {
      if (value && !/^[0-9+\-\s]+$/.test(value)) {
        return 'El teléfono solo puede contener números, espacios, + y -';
      }
      return null;
    }
  },
  'address.addressLineOne': {
    required: true,
    minLength: 1,
    maxLength: 255
  },
  'address.postalCode': {
    required: true,
    minLength: 1,
    maxLength: 10
  },
  'address.city': {
    required: true,
    minLength: 1,
    maxLength: 100
  },
  'address.province': {
    required: true,
    minLength: 1,
    maxLength: 100
  }
};

export const issuerConfigValidationRules: Record<string, ValidationRules> = {
  vat: {
    required: true,
    custom: (value) => {
      if (value === null || value === undefined || value === '') {
        return 'El IVA es obligatorio';
      }
      const numValue = Number(value);
      if (isNaN(numValue)) {
        return 'El IVA debe ser un número válido';
      }
      if (numValue < 0 || numValue > 100) {
        return 'El IVA debe estar entre 0 y 100';
      }
      return null;
    }
  },
  paymentAccountNumber: {
    required: true,
    custom: (value) => {
      if (!value || value.trim() === '') {
        return 'El número de cuenta de pago es obligatorio';
      }
      return null;
    }
  }
};

const getNestedValue = (obj: any, path: string): any => {
  return path.split('.').reduce((current, key) => current?.[key], obj);
};

const validateField = (value: any, rules: ValidationRules, fieldName: string): string | null => {
  // Check if required field is empty
  if (rules.required && (value === null || value === undefined || value === '' || value === 0)) {
    return `${getFieldDisplayName(fieldName)} es obligatorio`;
  }

  // If field is empty and not required, skip other validations
  if (!value && !rules.required) {
    return null;
  }

  // Check minimum length
  if (rules.minLength && value.toString().length < rules.minLength) {
    return `${getFieldDisplayName(fieldName)} debe tener al menos ${rules.minLength} caracteres`;
  }

  // Check maximum length
  if (rules.maxLength && value.toString().length > rules.maxLength) {
    return `${getFieldDisplayName(fieldName)} no puede tener más de ${rules.maxLength} caracteres`;
  }

  // Check pattern
  if (rules.pattern && !rules.pattern.test(value.toString())) {
    return `${getFieldDisplayName(fieldName)} tiene un formato inválido`;
  }

  // Check custom validation
  if (rules.custom) {
    const customError = rules.custom(value);
    if (customError) {
      return customError;
    }
  }

  return null;
};

const getFieldDisplayName = (fieldName: string): string => {
  const displayNames: Record<string, string> = {
    'name': 'Nombre',
    'surnames': 'Apellidos',
    'identificationTypeId': 'Tipo de identificación',
    'identificationNumber': 'Número de identificación',
    'email': 'Correo electrónico',
    'phoneNumber': 'Teléfono',
    'address.addressLineOne': 'Dirección línea 1',
    'address.postalCode': 'Código postal',
    'address.city': 'Ciudad',
    'address.province': 'Provincia',
    'vat': 'IVA',
    'paymentAccountNumber': 'Número de cuenta de pago'
  };

  return displayNames[fieldName] || fieldName;
};

export const validateRecipient = (recipient: Participant | null): ValidationResult => {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    fieldErrors: {}
  };

  if (!recipient) {
    result.isValid = false;
    result.errors.push('Los datos del participante son requeridos');
    return result;
  }

  // Validate each field according to its rules
  Object.entries(recipientValidationRules).forEach(([fieldPath, rules]) => {
    const value = getNestedValue(recipient, fieldPath);
    const error = validateField(value, rules, fieldPath);
    
    if (error) {
      result.isValid = false;
      result.errors.push(error);
      result.fieldErrors[fieldPath] = error;
    }
  });

  return result;
};

// IssuerConfig validation functions
export const validateIssuerConfig = (issuerConfig: IssuerConfig | null): ValidationResult => {
  const result: ValidationResult = {
    isValid: true,
    errors: [],
    fieldErrors: {}
  };

  if (!issuerConfig) {
    result.isValid = false;
    result.errors.push('Los datos de configuración del emisor son requeridos');
    return result;
  }

  // Validate each field according to its rules
  Object.entries(issuerConfigValidationRules).forEach(([fieldPath, rules]) => {
    const value = getNestedValue(issuerConfig, fieldPath);
    const error = validateField(value, rules, fieldPath);
    
    if (error) {
      result.isValid = false;
      result.errors.push(error);
      result.fieldErrors[fieldPath] = error;
    }
  });

  return result;
};