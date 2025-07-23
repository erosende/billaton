import { useEffect, useState } from "react";
import type { Participant } from "../interfaces/Participant";
import { participantService } from "../services/ParticipantService";
import { Modal, Text } from "@mantine/core";
import ParticipantList from "../components/participants/ParticipantList";
import './RecipientsPage.css';
import RecipientData from "../components/participants/recipients/RecipientData";
import { notifications } from "@mantine/notifications";

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

  const fetchRecipients = async () => {
    try {
      setLoading(true);
      const response = await recipientService.getParticipants('RECIPIENT', debouncedSearchTerm || undefined);
      setRecipients(response);
    } catch (error) {
      setError(error as string);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  
  useEffect(() => {
    fetchRecipients();
  }, [debouncedSearchTerm]);

  const handleCloseErrorModal = () => {
    setError(null);
  }

  const handleSelectRecipient = (participant: Participant) => {
    if (selectedRecipient?.participantId === participant.participantId) {
      setSelectedRecipient(null);
    } else {
      setSelectedRecipient(participant);
    }
  }

  const handleRefreshAfterUpdate = () => {
    fetchRecipients();
    notifications.show({
      title: 'Cliente actualizado',
      message: 'El cliente ha sido actualizado correctamente',
      color: 'green'
    });
  };

  const handleRefreshAfterDelete = () => {
    setSelectedRecipient(null);
    fetchRecipients();
    notifications.show({
      title: 'Cliente eliminado',
      message: 'El cliente ha sido eliminado correctamente',
      color: 'green'
    });
  };

  const handleRefreshAfterAdd = () => {
    fetchRecipients();
    notifications.show({
      title: 'Cliente creado',
      message: 'El cliente ha sido creado correctamente',
      color: 'green'
    });
  };

  return (
    <div className="recipients-page">
      <div className="participant-list-wrapper">
        <ParticipantList
          participantType="cliente"
          participants={recipients}
          loading={loading}
          setSearchTerm={setSearchTerm}
          setSelectedParticipant={handleSelectRecipient}
          selectedParticipant={selectedRecipient}
          isCreating={isCreating}
          setIsCreating={setIsCreating}
        />
      </div>

      <div className="participant-data-wrapper">
        <RecipientData
          recipient={selectedRecipient}
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
