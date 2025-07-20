import { Pencil, Save, Trash, X } from "lucide-react";
import type { Participant } from "../../interfaces/Participant";
import './ParticipantData.css';
import { Button, ButtonGroup, Divider } from "@mantine/core";
import { useEffect } from "react";

const ParticipantData = ({ 
  participant, 
  isEditing, 
  setIsEditing 
}: { 
  participant: Participant | null, 
  isEditing: boolean, 
  setIsEditing: (isEditing: boolean) => void 
}) => {

  useEffect(() => {
    if (participant === null) {
      setIsEditing(false);
    }
  }, [participant]);

  const handleSave = () => {
    setIsEditing(false);
  }

  const handleCancel = () => {
    setIsEditing(false);
  }

  const handleDelete = () => {
    setIsEditing(false);
  }

  const handleEdit = () => {
    setIsEditing(true);
  }

  const handleIdentificationTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log(e.target.value);
    if (participant !== null) {
      participant.identificationTypeId = parseInt(e.target.value);
    }
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
          <LabelValue className="name-label" label="Nombre" value={participant?.name || ""} isEditing={isEditing} />
          <LabelValue className="surnames-label" label="Apellidos" value={participant?.surnames || ""} isEditing={isEditing} />
        </div>

        <div className="participant-data-section-two">
          <LabelSelect className="identification-type-label" label="Tipo de identificación" value={participant?.identificationTypeId + ""} isEditing={isEditing} />
          <LabelValue className="identification-number-label" label={"Número de identificación"} value={participant?.identificationNumber || ""} isEditing={isEditing} />
        </div>

        <div className="participant-data-section-three">
          <LabelValue className="email-label" label="Correo electrónico" value={participant?.email || ""} isEditing={isEditing} />
          <LabelValue className="phone-label" label="Teléfono" value={participant?.phoneNumber || ""} isEditing={isEditing} />
        </div>

        <p className="participant-data-title-address">Dirección</p>
        <Divider />

        <div className="participant-data-section-four">
          <LabelValue className="address-label-line-one" label="Línea 1" value={participant?.address?.addressLineOne || ""} isEditing={isEditing} />
        </div>

        <div className="participant-data-section-five">
          <LabelValue className="address-label-line-two" label="Línea 2" value={participant?.address?.addressLineTwo || ""} isEditing={isEditing} />
        </div>

        <div className="participant-data-section-six">
          <LabelValue className="address-label-postal-code" label="Código postal" value={participant?.address?.postalCode || ""} isEditing={isEditing} />
          <LabelValue className="address-label-city" label="Ciudad" value={participant?.address?.city || ""} isEditing={isEditing} />
          <LabelValue className="address-label-province" label="Provincia" value={participant?.address?.province || ""} isEditing={isEditing} />
        </div>
      </div>
    </>
  )
}

const LabelValue = ({ className, label, value, isEditing }: { className: string, label: string, value: string | undefined, isEditing: boolean }) => {
  return (  
    <div className={className}>
      <p className="label">{label}</p>
      <input className="value" disabled={!isEditing} value={value} />
    </div>
  )
}

const LabelSelect = ({ className, label, value, isEditing, handleChange }: { className: string, label: string, value: string | undefined, isEditing: boolean, handleChange: (e: React.ChangeEvent<HTMLSelectElement>) => void }) => {
  return (
    <div className={className}>
      <p className="label">{label}</p>
      <select className="value-select" disabled={!isEditing} onChange={handleChange}>
        <option value="1">NIF</option>
        <option value="2">DNI</option>
      </select>
    </div>
  )
}

export default ParticipantData;