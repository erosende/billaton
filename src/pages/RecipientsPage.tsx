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
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const recipientService = participantService();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const fetchRecipients = async () => {
    try {
      setLoading(true);
      const response = await recipientService.getParticipants('RECIPIENT', debouncedSearchTerm);
      setRecipients(response);
    } catch (error) {
      setError(error as string);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecipients();
  }, [debouncedSearchTerm]);

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

  const handleRefreshAfterUpdate = () => {
    fetchRecipients();
  };

  const handleRefreshAfterDelete = () => {
    setSelectedRecipient(null);
    fetchRecipients();
  };

  const handleRefreshAfterAdd = () => {
    fetchRecipients();
  };

  return (
    <div className="recipients-page">
      <div className="participant-list-wrapper">
        <ParticipantList
          participants={recipients}
          loading={loading}
          setSearchTerm={setSearchTerm}
          setSelectedParticipant={handleSelectParticipant}
          selectedParticipant={selectedRecipient}
          isCreating={isCreating}
          setIsCreating={setIsCreating}
        />
      </div>

      <div className="participant-data-wrapper">
        <ParticipantData
          participant={selectedRecipient}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          isCreating={isCreating}
          setIsCreating={setIsCreating}
          onUpdate={handleRefreshAfterUpdate}
          onDelete={handleRefreshAfterDelete}
          onAdd={handleRefreshAfterAdd}
        />
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
