import type { Participant } from "../../interfaces/Participant";
import './ParticipantList.css';
import { Loader, ScrollArea, TextInput } from "@mantine/core";

const ParticipantList = (
  { 
    participants, 
    loading, 
    setSearchTerm,
    setSelectedParticipant,
    selectedParticipant
  }: { 
    participants: Participant[], 
    loading: boolean, 
    setSearchTerm: Function,
    setSelectedParticipant: Function,
    selectedParticipant: Participant | null
  }
  ) => {
  return (
    <div className="participant-list-container">
      <TextInput placeholder="Buscar cliente" className="search-input" onChange={(e) => setSearchTerm(e.target.value)}/>
      <ScrollArea className="participant-scroll-area" >
        {loading && <Loader className="loading-spinner" size="xl" />}
        {participants.map((participant) => (
          <ParticipantItem key={participant.participantId} participant={participant} onClick={() => setSelectedParticipant(participant)} selected={selectedParticipant?.participantId === participant.participantId}/>
        ))}
      </ScrollArea>
    </div>
  ) 
}

const ParticipantItem = ({ participant, onClick, selected }: { participant: Participant, onClick: Function, selected: boolean }) => {
  return (
    <div className={`participant-item ${selected ? 'selected' : ''}`} onClick={() => onClick(participant)}>
      <p className="participant-name">{participant.name} {participant.surnames}</p>
      <p className="participant-identification-number">{participant.identificationType}: {participant.identificationNumber}</p>
    </div>
  )
}

export default ParticipantList;