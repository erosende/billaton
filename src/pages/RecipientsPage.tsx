import { useEffect, useState } from "react";
import type { Participant } from "../interfaces/Participant";
import { participantService } from "../services/ParticipantService";
import { Modal, Text } from "@mantine/core";
import ParticipantList from "../components/participants/ParticipantList";
import './RecipientsPage.css';
import ParticipantData from "../components/participants/ParticipantData";

const RecipientsPage = () => {

  const [recipients, setRecipients] = useState<Participant[]>([]);
  const [selectedRecipient, setSelectedRecipient] = useState<Participant | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const recipientService = participantService();

  useEffect(() => {
    const fetchRecipients = async () => {
      try {
        const response = await recipientService.getParticipants('RECIPIENT', searchTerm);
        setRecipients(response);
      } catch (error) {
        setError(error as string);
      } finally {
        setLoading(false);
      }
    }
    fetchRecipients();
  }, [recipientService, searchTerm]);

  const handleCloseErrorModal = () => {
    setError(null);
  }

  const handleSelectParticipant = (participant: Participant) => {
    if (selectedRecipient?.participantId === participant.participantId) {
      setSelectedRecipient(null);
    } else {
      setSelectedRecipient(participant);
    }
  }

  return (
    <div className="recipients-page">
      <div className="participant-list-wrapper">
        <ParticipantList 
          participants={recipients} 
          loading={loading} 
          setSearchTerm={setSearchTerm} 
          setSelectedParticipant={handleSelectParticipant}
          selectedParticipant={selectedRecipient}
        />
      </div>
    
        <div className="participant-data-wrapper">
          <ParticipantData participant={selectedRecipient} />
        </div>
      

      {error && 
        <Modal title="Error" opened={error !== null} onClose={handleCloseErrorModal}>
          <Text>Error: {error}</Text>
        </Modal>
      }
    </div>
  )
}

export default RecipientsPage;
