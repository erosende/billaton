import { Plus } from "lucide-react";
import type { Participant } from "../../interfaces/Participant";
import './ParticipantList.css';
import { ActionIcon, Loader, ScrollArea, TextInput } from "@mantine/core";
import { notifications } from "@mantine/notifications";

const ParticipantList = (
  {
    participantType,
    participants,
    loading,
    setSearchTerm,
    setSelectedParticipant,
    selectedParticipant,
    isCreating,
    setIsCreating
  }: {
    participantType: string,
    participants: Participant[],
    loading: boolean,
    setSearchTerm: Function,
    setSelectedParticipant: Function,
    selectedParticipant: Participant | null,
    isCreating?: boolean,
    setIsCreating?: Function
  }
) => {

  const handleAddParticipant = () => {
    if (selectedParticipant !== null) {
      handleParticipantClick(selectedParticipant);
    }
    if (setIsCreating) {
      setIsCreating(true);
    }
  }

  const handleParticipantClick = (participant: Participant) => {
    if (!isCreating) {
      setSelectedParticipant(participant);
    } else {
      notifications.show({
        title: 'Acción no permitida',
        message: 'No se puede seleccionar un cliente mientras se está creando uno nuevo',
        color: 'yellow'
      });
    }
  };

  return (
    <div className="participant-list-container">
      <div className="header-container">
        <TextInput placeholder={`Buscar ${participantType}`} className="search-input" onChange={(e) => setSearchTerm(e.target.value)} />
        {(isCreating !== undefined && setIsCreating !== undefined) && (
          <ActionIcon title={`Crear un nuevo ${participantType}`} className="add-button" color="green" variant="default" onClick={handleAddParticipant}>
            <Plus color="green" size={20} />
          </ActionIcon>
        )}
      </div>
      <ScrollArea className="participant-scroll-area" scrollbarSize={5} offsetScrollbars={true}>
        {loading
          ? <Loader className="loading-spinner" size="xl" />
          : participants.map((participant) => (
            <ParticipantItem
              key={participant.participantId}
              participant={participant}
              onClick={handleParticipantClick}
              selected={selectedParticipant?.participantId === participant.participantId}
              isCreating={isCreating === undefined ? false : isCreating}
            />
          ))}
      </ScrollArea>
    </div>
  )
}

const ParticipantItem = (
  {
    participant,
    onClick,
    selected,
    isCreating
  }: {
    participant: Participant,
    onClick: (participant: Participant) => void,
    selected: boolean,
    isCreating: boolean
  }) => {

  const className = `participant-item ${selected ? 'selected' : ''} ${isCreating ? 'creating' : ''}`;
  const tooltip = isCreating ? 'No se puede seleccionar un cliente mientras se está creando uno nuevo' : '';

  return (
    <div className={className} onClick={() => onClick(participant)} title={tooltip}>
      <p className="participant-name">{participant.name} {participant.surnames}</p>
      <p className="participant-identification-number">{participant.identificationType}: {participant.identificationNumber}</p>
    </div>
  )
}

export default ParticipantList;