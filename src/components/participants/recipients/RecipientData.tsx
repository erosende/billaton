import { Pencil, Save, Trash, X } from "lucide-react";
import { emptyParticipant, type Participant } from "../../../interfaces/Participant";
import './RecipientData.css';
import { Button, ButtonGroup, Divider, Modal, Text, Group, Popover, List } from "@mantine/core";
import { useEffect, useState } from "react";
import { useParticipantService } from "../../../services/ParticipantService";
import { validateRecipient } from "../../../utils/FormInputValidator";
import LabelValue from "../../inputs/LabelValue";
import LabelSelect from "../../inputs/LabelSelect";
import type { IdentificationType } from "../../../interfaces/IdentificationType";
import { useIdentificationTypeService } from "../../../services/IdentificationTypeService";

const RecipientData = ({
  recipient,
  isEditing,
  setIsEditing,
  isCreating,
  setIsCreating,
  onUpdate,
  onDelete,
  onAdd,
  setError
}: {
  recipient: Participant | null,
  isEditing: boolean,
  setIsEditing: (isEditing: boolean) => void,
  isCreating: boolean,
  setIsCreating: (isCreating: boolean) => void,
  onUpdate?: () => void,
  onDelete?: () => void,
  onAdd?: () => void,
  setError?: (error: string) => void
}) => {

  const [formData, setFormData] = useState<Participant | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [identificationTypes, setIdentificationTypes] = useState<IdentificationType[]>([]);

  const identificationTypeService = useIdentificationTypeService();

  useEffect(() => {
    setFormData(recipient ? { ...recipient } : emptyParticipant);
    if (recipient === null && !isCreating) {
      setIsEditing(false);
    }
  }, [recipient, setIsEditing, setIsCreating]);

  useEffect(() => {
    if (formData) {
      const validation = validateRecipient(formData);
      setIsFormValid(validation.isValid);
      setValidationErrors(validation.errors);
    } else {
      setIsFormValid(false);
      setValidationErrors([]);
    }
  }, [formData]);

  useEffect(() => {    
    const fetchIdentificationTypes = async () => {
      const types = await identificationTypeService.getIdentificationTypes();
      setIdentificationTypes(types);
    };
    
    fetchIdentificationTypes();
  }, []);

  const handleFieldChange = (fieldPath: string, value: string | number) => {
    if (!formData) return;

    setFormData(prevData => {
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
    handleFieldChange(fieldPath, e.target.value);
  };

  const handleSelectChange = (fieldPath: string) => (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleFieldChange(fieldPath, parseInt(e.target.value));
  };

  const handleSave = async () => {
    if (!formData) {
      console.error('No form data to save');
      return;
    }

    try {
      if (isCreating) {
        const participantSvc = useParticipantService();
      await participantSvc.createRecipientParticipant(formData);
        console.log('Participant created successfully:', formData);
        onAdd?.();
      } else {
        await useParticipantService().updateParticipant(formData.participantId, formData);
        console.log('Participant updated successfully:', formData);
        onUpdate?.();
      }

      setIsEditing(false);
      setIsCreating(false);
    } catch (error) {
      console.error('Error saving participant:', error);
      setError?.('Error al guardar el participante. Por favor, inténtalo de nuevo.');
    }
  }

  const handleCancel = () => {
    setFormData(recipient ? { ...recipient } : emptyParticipant);
    setIsEditing(false);
    setIsCreating(false);
  }

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  }

  const handleConfirmDelete = async () => {
    try {
      if (formData) {
        await useParticipantService().deleteRecipientParticipant(formData.participantId);
        onDelete?.();
      }
      console.log('Deleting participant:', formData);
      setIsDeleteModalOpen(false);
      setIsEditing(false);
    } catch (error) {
      console.error('Error deleting participant:', error);
      setError?.('Error al eliminar el participante. Por favor, inténtalo de nuevo.');
    }
  }

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
  }

  const handleEdit = () => {
    setIsEditing(true);
  }

  return (
    <>
      <div className="recipient-data-container">
        <div className="recipient-data-title-container">
          <h2 className="recipient-data-title">{isCreating ? "Crear nuevo cliente" : "Información del cliente"}</h2>
          <ButtonGroup className="recipient-data-button-group">
            {isEditing || isCreating ? (
              <Button
                title={isFormValid ? "Guardar" : "No se puede guardar porque no se han rellenado todos los campos obligatorios"}
                disabled={!isFormValid || (recipient === null && !isCreating && !isEditing)}
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
                disabled={recipient === null}
                title={recipient === null ? "No se puede editar porque no se ha seleccionado ningún cliente" : "Editar"}
                variant="subtle"
                color="blue"
                leftSection={<Pencil size={20} />}
                size="compact-sm"
                onClick={handleEdit}
              >
                Editar
              </Button>
            )}
            {isEditing || isCreating ? (
              <Button
                title={"Cancelar"}
                disabled={recipient === null && !isCreating && !isEditing}
                variant="subtle"
                color="red"
                leftSection={<X size={20} />}
                size="compact-sm"
                onClick={handleCancel}
              >
                Cancelar
              </Button>
            ) : (
              <Button
                title={recipient === null ? "No se puede eliminar porque no se ha seleccionado ningún cliente" : "Eliminar"}
                disabled={recipient === null}
                variant="subtle"
                color="red"
                leftSection={<Trash size={20} />}
                size="compact-sm"
                onClick={handleDelete}
              >
                Eliminar
              </Button>
            )}
          </ButtonGroup>
        </div>

        <Divider />

        <div className="recipient-data-section-one">
          <LabelValue
            className="name-label"
            label="* Nombre"
            value={formData?.name || ""}
            enabled={isEditing || isCreating}
            handleChange={handleInputChange('name')}
          />
          <LabelValue
            className="surnames-label"
            label="* Apellidos"
            value={formData?.surnames || ""}
            enabled={isEditing || isCreating}
            handleChange={handleInputChange('surnames')}
          />
        </div>

        <div className="recipient-data-section-two">
          <LabelSelect
            className="identification-type-label"
            label="* Tipo de identificación"
            value={formData?.identificationTypeId?.toString() || ""}
            enabled={isEditing || isCreating}
            handleChange={handleSelectChange('identificationTypeId')}
            options={identificationTypes.map((type) => ({ value: type.identificationTypeId.toString(), label: type.name }))}
          />
          <LabelValue
            className="identification-number-label"
            label={"* Número de identificación"}
            value={formData?.identificationNumber || ""}
            enabled={isEditing || isCreating}
            handleChange={handleInputChange('identificationNumber')}
          />
        </div>

        <div className="recipient-data-section-three">
          <LabelValue
            className="email-label"
            label="Correo electrónico"
            value={formData?.email || ""}
            enabled={isEditing || isCreating}
            handleChange={handleInputChange('email')}
          />
          <LabelValue
            className="phone-label"
            label="Teléfono"
            value={formData?.phoneNumber || ""}
            enabled={isEditing || isCreating}
            handleChange={handleInputChange('phoneNumber')}
          />
        </div>

        <p className="recipient-data-title-address">Dirección</p>
        <Divider />

        <div className="recipient-data-section-four">
          <LabelValue
            className="address-label-line-one"
            label="* Línea 1"
            value={formData?.address?.addressLineOne || ""}
            enabled={isEditing || isCreating}
            handleChange={handleInputChange('address.addressLineOne')}
          />
        </div>

        <div className="recipient-data-section-five">
          <LabelValue
            className="address-label-line-two"
            label="Línea 2"
            value={formData?.address?.addressLineTwo || ""}
            enabled={isEditing || isCreating}
            handleChange={handleInputChange('address.addressLineTwo')}
          />
        </div>

        <div className="recipient-data-section-six">
          <LabelValue
            className="address-label-postal-code"
            label="* Código postal"
            value={formData?.address?.postalCode || ""}
            enabled={isEditing || isCreating}
            handleChange={handleInputChange('address.postalCode')}
          />
          <LabelValue
            className="address-label-city"
            label="* Ciudad"
            value={formData?.address?.city || ""}
            enabled={isEditing || isCreating}
            handleChange={handleInputChange('address.city')}
          />
          <LabelValue
            className="address-label-province"
            label="* Provincia"
            value={formData?.address?.province || ""}
            enabled={isEditing || isCreating}
            handleChange={handleInputChange('address.province')}
          />
        </div>

        {/* This is the validation errors popover, it's only shown when the form is being edited or created and there are validation errors */}
        {(isEditing || isCreating) && !isFormValid && validationErrors.length > 0 && (
          <Popover width={300} position="left" withArrow shadow="md">
            <Popover.Target>
              <Text size="sm" c="red" className="recipient-data-validation-errors">
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
        {(isEditing || isCreating) && (
          <Text size="sm" c="dimmed" className="recipient-data-required-fields">Los campos marcados con * son obligatorios</Text>
        )}
      </div>



      <Modal
        opened={isDeleteModalOpen}
        onClose={handleCancelDelete}
        title="Confirmar eliminación"
        centered
      >
        <Text size="sm" mb="md">
          ¿Estás seguro de que quieres eliminar este cliente? Esta acción no se puede deshacer.
          <br /><br />
          Todos los documentos asociados a este cliente dejarán de ser accesibles.
        </Text>

        {formData && (
          <Text size="sm" mb="lg" c="dimmed">
            {formData.name} {formData.surnames}
          </Text>
        )}

        <Group justify="flex-end" gap="sm">
          <Button
            variant="default"
            onClick={handleCancelDelete}
          >
            Cancelar
          </Button>
          <Button
            color="red"
            onClick={handleConfirmDelete}
            leftSection={<Trash size={16} />}
          >
            Eliminar
          </Button>
        </Group>
      </Modal>
    </>
  )
}

export default RecipientData;