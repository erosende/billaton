import type { Participant } from "../../interfaces/Participant";
import './ParticipantData.css';
import { Divider } from "@mantine/core";

const ParticipantData = ({ participant }: { participant: Participant | null }) => {
  return (
    <>
      <div className="participant-data-container">
        <h2 className="participant-data-title">Información del cliente</h2>
        <Divider />

        <div className="participant-data-section-one">
          <LabelValue className="name-label" label="Nombre" value={participant?.name} />
          <LabelValue className="surnames-label" label="Apellidos" value={participant?.surnames} />
        </div>

        <div className="participant-data-section-two">
          <LabelValue className="identification-number-label" label={participant?.identificationType || "DNI/NIF"} value={participant?.identificationNumber} />
        </div>
      </div>

    </>
  )
}

const LabelValue = ({ className, label, value }: { className: string, label: string, value: string | undefined }) => {
  return (
    <div className={className}>
      <p className="label">{label}: </p>
      <p className="value">{value}</p>
    </div>
  )
}

export default ParticipantData;