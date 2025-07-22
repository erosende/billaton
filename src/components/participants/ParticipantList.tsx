import { Plus } from "lucide-react";
import type { Participant } from "../../interfaces/Participant";
import './ParticipantList.css';
import { ActionIcon, Loader, ScrollArea, TextInput } from "@mantine/core";

const ParticipantList = (
  { 
    participants, 
    loading, 
    setSearchTerm,
    setSelectedParticipant,
    selectedParticipant,
    isCreating,
    setIsCreating
  }: { 
    participants: Participant[], 
    loading: boolean, 
    setSearchTerm: Function,
    setSelectedParticipant: Function,
    selectedParticipant: Participant | null,
    isCreating: boolean,
    setIsCreating: Function
  }
  ) => {

  const handleAddParticipant = () => {
    if (selectedParticipant !== null) {
      handleParticipantClick(selectedParticipant);
    }
    setIsCreating(true);
  }

  const handleParticipantClick = (participant: Participant) => {
    if (!isCreating) {
      setSelectedParticipant(participant);
    }
  };

  return (
    <div className="participant-list-container">
      <div className="header-container">
        <TextInput placeholder="Buscar cliente" className="search-input" onChange={(e) => setSearchTerm(e.target.value)}/>
        <ActionIcon className="add-button" color="green" variant="default" onClick={handleAddParticipant}>
          <Plus color="green" size={20} />
        </ActionIcon>
      </div>
      <ScrollArea className="participant-scroll-area" scrollbarSize={5} offsetScrollbars={true}>
        {loading && <Loader className="loading-spinner" size="xl" />}
        {participants.map((participant) => (
          <ParticipantItem 
            enabled={!isCreating} 
            key={participant.participantId} 
            participant={participant} 
            onClick={handleParticipantClick} 
            selected={selectedParticipant?.participantId === participant.participantId}
          />
        ))}
      </ScrollArea>
    </div>
  ) 
}

const ParticipantItem = ({ participant, onClick, selected, enabled }: { participant: Participant, onClick: (participant: Participant) => void, selected: boolean, enabled: boolean }) => {
  const handleClick = () => {
    if (enabled) {
      onClick(participant);
    }
  };

  return (
    <div className={`participant-item ${selected ? 'selected' : ''} ${!enabled ? 'disabled' : ''}`} onClick={handleClick}>
      <p className="participant-name">{participant.name} {participant.surnames}</p>
      <p className="participant-identification-number">{participant.identificationType}: {participant.identificationNumber}</p>
    </div>
  )
}

export default ParticipantList;