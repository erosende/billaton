import { emptyIssuerConfig, emptyParticipant, type IssuerConfig, type Participant } from "../../../interfaces/Participant";
import { Button, ButtonGroup, Divider, Text, Popover, List } from "@mantine/core";
import { useEffect, useState } from "react";
import './IssuerData.css';
import LabelValue from "../../inputs/LabelValue";
import LabelSelect from "../../inputs/LabelSelect";
import { Pencil, Save, X } from "lucide-react";
import { participantService } from "../../../services/ParticipantService";
import { validateIssuerConfig } from "../../../utils/FormInputValidator";
import { useIdentificationTypeService } from "../../../services/IdentificationTypeService";
import type { IdentificationType } from "../../../interfaces/IdentificationType";

const IssuerData = ({
  issuer,
  isEditing,
  setIsEditing,
  onUpdate,
  setError
}: {
  issuer: Participant | null,
  isEditing: boolean,
  setIsEditing: (isEditing: boolean) => void,
  onUpdate?: () => void,
  setError?: (error: string) => void
}) => {

  const [issuerFormData, setIssuerFormData] = useState<Participant | null>(null);
  const [configFormData, setConfigFormData] = useState<IssuerConfig | null>(null);
  const [isFormValid, setIsFormValid] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [config, setConfig] = useState<IssuerConfig | null>(null);
  const [identificationTypes, setIdentificationTypes] = useState<IdentificationType[]>([]);

  const identificationTypeService = useIdentificationTypeService();

  const issuerService = participantService();

  const fetchConfig = async () => {
    try {
      const response = await issuerService.getIssuerConfig(issuer?.participantId || 0);
      setConfig(response);
    } catch (error) {
      setError?.(error as string);
    }
  }

  useEffect(() => {
    const fetchIdentificationTypes = async () => {
      const types = await identificationTypeService.getIdentificationTypes();
      setIdentificationTypes(types);
    };

    fetchIdentificationTypes();
  }, []);

  useEffect(() => {
    setIssuerFormData(issuer ? { ...issuer } : emptyParticipant);
    if (issuer === null && !isEditing) {
      setIsEditing(false);
    }
    if (issuer !== null && !isEditing) {
      fetchConfig();
    }
  }, [issuer, setIsEditing]);

  useEffect(() => {
    setConfigFormData(config ? { ...config } : emptyIssuerConfig);
  }, [config]);

  useEffect(() => {
    if (configFormData) {
      const validation = validateIssuerConfig(configFormData);
      setIsFormValid(validation.isValid);
      setValidationErrors(validation.errors);
    } else {
      setIsFormValid(false);
      setValidationErrors([]);
    }
  }, [configFormData]);

  const handleFieldChange = (fieldPath: string, value: string | number) => {
    if (!configFormData) return;

    setConfigFormData(prevData => {
      if (!prevData) return null;

      const newData = { ...prevData };
      const keys = fieldPath.split('.');
      let current: any = newData;

      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = value;

      return newData;
    });
  };

  const handleInputChange = (fieldPath: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    // For vat field, convert to number
    if (fieldPath === 'vat') {
      const numValue = parseFloat(e.target.value);
      handleFieldChange(fieldPath, isNaN(numValue) ? 0 : numValue);
    } else {
      handleFieldChange(fieldPath, e.target.value);
    }
  };

  const handleSave = async () => {
    if (!configFormData) {
      console.error('No config form data to save');
      return;
    }

    try {
      if (isEditing && issuer !== null && config !== null) {
        console.log(config)
        await issuerService.updateIssuerConfig(issuer.participantId, config.issuerConfigId, configFormData);
        console.log('Issuer config updated successfully:', configFormData);
        setIsEditing(false);
        onUpdate?.();
      }
    } catch (error) {
      console.error('Error saving issuer config:', error);
      setError?.('Error al guardar la configuración del facturador. Por favor, inténtalo de nuevo.');
    }
  }

  const handleEdit = () => {
    setIsEditing(true);
  }

  const handleCancel = () => {
    setConfigFormData(config ? { ...config } : emptyIssuerConfig);
    setIsEditing(false);
  }

  return (
    <div className="issuer-data-container">
      <div className="issuer-data-title-container">
        <h2 className="issuer-data-title">Información del facturador</h2>
        <ButtonGroup className="issuer-data-button-group">
          {isEditing ? (
            <Button
              title={isFormValid ? "Guardar" : "No se puede guardar porque no se han rellenado todos los campos obligatorios"}
              disabled={!isFormValid || (issuer === null && !isEditing)}
              variant="subtle"
              color="blue"
              leftSection={<Save size={20} />}
              size="compact-sm"
              onClick={handleSave}
            >
              Guardar
            </Button>
          ) : (
            <Button
              disabled={issuer === null}
              title={issuer === null ? "No se puede editar porque no se ha seleccionado ningún facturador" : "Editar"}
              variant="subtle"
              color="blue"
              leftSection={<Pencil size={20} />}
              size="compact-sm"
              onClick={handleEdit}
            >
              Editar
            </Button>
          )}
          {isEditing && (
            <Button
              title={"Cancelar"}
              disabled={issuer === null && !isEditing}
              variant="subtle"
              color="red"
              leftSection={<X size={20} />}
              size="compact-sm"
              onClick={handleCancel}
            >
              Cancelar
            </Button>
          )}
        </ButtonGroup>
      </div>

      <Divider />

      <div className="issuer-data-section-one">
        <LabelValue
          className="name-label"
          label="Nombre"
          value={issuerFormData?.name}
          enabled={false}
        />
        <LabelValue
          className="surnames-label"
          label="Apellidos"
          value={issuerFormData?.surnames}
          enabled={false}
        />
      </div>


      <div className="recipient-data-section-two">
        <LabelSelect
          className="identification-type-label"
          label="Tipo de identificación"
          value={issuerFormData?.identificationTypeId?.toString() || ""}
          enabled={false}
          options={identificationTypes.map((type) => ({ value: type.identificationTypeId.toString(), label: type.name }))}
        />
        <LabelValue
          className="identification-number-label"
          label={"Número de identificación"}
          value={issuerFormData?.identificationNumber || ""}
          enabled={false}
        />
      </div>

      <div className="recipient-data-section-three">
        <LabelValue
          className="email-label"
          label="Correo electrónico"
          value={issuerFormData?.email || ""}
          enabled={false}
        />
        <LabelValue
          className="phone-label"
          label="Teléfono"
          value={issuerFormData?.phoneNumber || ""}
          enabled={false}
        />
      </div>

      <p className="issuer-data-title-address">Dirección</p>
      <Divider />

      <div className="recipient-data-section-four">
        <LabelValue
          className="address-label-line-one"
          label="Línea 1"
          value={issuerFormData?.address?.addressLineOne || ""}
          enabled={false}
        />
      </div>

      <div className="recipient-data-section-five">
        <LabelValue
          className="address-label-line-two"
          label="Línea 2"
          value={issuerFormData?.address?.addressLineTwo || ""}
          enabled={false}
        />
      </div>

      <div className="recipient-data-section-six">
        <LabelValue
          className="address-label-postal-code"
          label="Código postal"
          value={issuerFormData?.address?.postalCode || ""}
          enabled={false}
        />
        <LabelValue
          className="address-label-city"
          label="Ciudad"
          value={issuerFormData?.address?.city || ""}
          enabled={false}
        />
        <LabelValue
          className="address-label-province"
          label="Provincia"
          value={issuerFormData?.address?.province || ""}
          enabled={false}
        />
      </div>

      <p className="issuer-data-title-config">Configuración</p>
      <Divider />

      <div className="issuer-data-section-seven">
        <LabelValue
          className="vat-label"
          label="* IVA"
          value={configFormData?.vat?.toString() || ""}
          enabled={isEditing}
          handleChange={handleInputChange('vat')}
        />
        <LabelValue
          className="payment-account-number-label"
          label="* Número de cuenta de pago"
          value={configFormData?.paymentAccountNumber || ""}
          enabled={isEditing}
          handleChange={handleInputChange('paymentAccountNumber')}
        />
      </div>

      {/* Validation errors popover, shown when editing and there are validation errors */}
      {isEditing && !isFormValid && validationErrors.length > 0 && (
        <Popover width={300} position="left" withArrow shadow="md">
          <Popover.Target>
            <Text size="sm" c="red" className="issuer-data-validation-errors">
              Hay {validationErrors.length} error{validationErrors.length > 1 ? 'es' : ''} en el formulario
            </Text>
          </Popover.Target>
          <Popover.Dropdown>
            <Text size="sm" fw={500} mb="xs">Errores de validación:</Text>
            <List size="sm" spacing="xs">
              {validationErrors.map((error, index) => (
                <List.Item key={index}>{error}</List.Item>
              ))}
            </List>
          </Popover.Dropdown>
        </Popover>
      )}
      {isEditing && (
        <Text size="sm" c="dimmed" className="issuer-data-required-fields">Los campos marcados con * son obligatorios</Text>
      )}

    </div>
  )
}

export default IssuerData;