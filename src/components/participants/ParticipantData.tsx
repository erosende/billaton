import { Pencil, Save, Trash, X } from "lucide-react";
import type { Participant } from "../../interfaces/Participant";
import './ParticipantData.css';
import { Button, ButtonGroup, Divider, Modal, Text, Group } from "@mantine/core";
import { useEffect, useState } from "react";
import { participantService } from "../../services/ParticipantService";

const ParticipantData = ({
  participant,
  isEditing,
  setIsEditing
}: {
  participant: Participant | null,
  isEditing: boolean,
  setIsEditing: (isEditing: boolean) => void
  }) => {
   
    const [formData, setFormData] = useState<Participant | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    setFormData(participant ? { ...participant } : null);
    if (participant === null) {
      setIsEditing(false);
    }
  }, [participant, setIsEditing]);

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
    if (formData) {
      await participantService().updateParticipant(formData.participantId, formData);
    }
    console.log('Saving data:', formData);
    setIsEditing(false);
  }

  const handleCancel = () => {
    setFormData(participant ? { ...participant } : null);
    setIsEditing(false);
  }

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
  }

  const handleConfirmDelete = () => {
    // Here you would typically call an API to delete the participant
    console.log('Deleting participant:', formData);
    setIsDeleteModalOpen(false);
    setIsEditing(false);
  }

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
  }

  const handleEdit = () => {
    setIsEditing(true);
  }

  return (
    <>
      <div className="participant-data-container">
        <div className="participant-data-title-container">
          <h2 className="participant-data-title">Información del cliente</h2>
          <ButtonGroup className="participant-data-button-group">
            {isEditing ? (
              <Button
                disabled={participant === null}
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
                disabled={participant === null}
                variant="subtle"
                color="blue"
                leftSection={<Pencil size={20} />}
                size="compact-sm"
                onClick={handleEdit}
              >
                Editar
              </Button>
            )}
            {isEditing ? (
              <Button
                disabled={participant === null}
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
                disabled={participant === null}
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

        <div className="participant-data-section-one">
          <LabelValue 
            className="name-label" 
            label="Nombre" 
            value={formData?.name || ""} 
            isEditing={isEditing}
            handleChange={handleInputChange('name')}
          />
          <LabelValue 
            className="surnames-label" 
            label="Apellidos" 
            value={formData?.surnames || ""} 
            isEditing={isEditing} 
            handleChange={handleInputChange('surnames')}
          />
        </div>

        <div className="participant-data-section-two">
          <LabelSelect 
            className="identification-type-label" 
            label="Tipo de identificación" 
            value={formData?.identificationTypeId?.toString() || ""} 
            isEditing={isEditing} 
            handleChange={handleSelectChange('identificationTypeId')} 
          />
          <LabelValue 
            className="identification-number-label" 
            label={"Número de identificación"} 
            value={formData?.identificationNumber || ""} 
            isEditing={isEditing} 
            handleChange={handleInputChange('identificationNumber')} 
          />
        </div>

        <div className="participant-data-section-three">
          <LabelValue 
            className="email-label" 
            label="Correo electrónico" 
            value={formData?.email || ""} 
            isEditing={isEditing} 
            handleChange={handleInputChange('email')} 
          />
          <LabelValue 
            className="phone-label" 
            label="Teléfono" 
            value={formData?.phoneNumber || ""} 
            isEditing={isEditing}
            handleChange={handleInputChange('phoneNumber')}
          />
        </div>

        <p className="participant-data-title-address">Dirección</p>
        <Divider />

        <div className="participant-data-section-four">
          <LabelValue 
            className="address-label-line-one"
            label="Línea 1"
            value={formData?.address?.addressLineOne || ""}
            isEditing={isEditing}
            handleChange={handleInputChange('address.addressLineOne')}
          />
        </div>

        <div className="participant-data-section-five">
          <LabelValue 
            className="address-label-line-two" 
            label="Línea 2" 
            value={formData?.address?.addressLineTwo || ""} 
            isEditing={isEditing} 
            handleChange={handleInputChange('address.addressLineTwo')} 
          />
        </div>

        <div className="participant-data-section-six">
          <LabelValue 
            className="address-label-postal-code" 
            label="Código postal" 
            value={formData?.address?.postalCode || ""} 
            isEditing={isEditing} 
            handleChange={handleInputChange('address.postalCode')} 
          />
          <LabelValue 
            className="address-label-city" 
            label="Ciudad" 
            value={formData?.address?.city || ""} 
            isEditing={isEditing} 
            handleChange={handleInputChange('address.city')} 
          />
          <LabelValue 
            className="address-label-province" 
            label="Provincia" 
            value={formData?.address?.province || ""} 
            isEditing={isEditing}
            handleChange={handleInputChange('address.province')} 
          />
        </div>
      </div>
      
      <Modal
        opened={isDeleteModalOpen}
        onClose={handleCancelDelete}
        title="Confirmar eliminación"
        centered
      >
        <Text size="sm" mb="md">
          ¿Estás seguro de que quieres eliminar este cliente? Esta acción no se puede deshacer.
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

const LabelValue = ({ className, label, value, isEditing, handleChange }: { className: string, label: string, value: string | undefined, isEditing: boolean, handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) => {
  return (
    <div className={className}>
      <p className="label">{label}</p>
      <input className="value" disabled={!isEditing} value={value} onChange={handleChange} />
    </div>
  )
}

const LabelSelect = ({ className, label, value, isEditing, handleChange }: { className: string, label: string, value: string | undefined, isEditing: boolean, handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void }) => {
  return (
    <div className={className}>
      <p className="label">{label}</p>
      <select className="value-select" disabled={!isEditing} value={value} onChange={handleChange}>
        <option value="1">NIF</option>
        <option value="2">DNI</option>
      </select>
    </div>
  )
}

export default ParticipantData;