import { useEffect, useState } from "react";
import type { Participant } from "../interfaces/Participant";
import { participantService } from "../services/ParticipantService";
import ParticipantList from "../components/participants/ParticipantList";
import './IssuersPage.css';
import { Modal, Text } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import IssuerData from "../components/participants/issuers/IssuerData";

const IssuersPage = () => {

  const [issuers, setIssuers] = useState<Participant[]>([]);
  const [selectedIssuer, setSelectedIssuer] = useState<Participant | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const issuerService = participantService();

  const fetchIssuers = async () => {
    try {
      setLoading(true);
      const response = await issuerService.getParticipants('ISSUER', debouncedSearchTerm || undefined);
      setIssuers(response);
    } catch (error) {
      setError(error as string);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    fetchIssuers();
  }, [debouncedSearchTerm]);

  const handleCloseErrorModal = () => {
    setError(null);
  }

  const handleSelectIssuer = (issuer: Participant) => {
    if (selectedIssuer?.participantId === issuer.participantId) {
      setSelectedIssuer(null);
    } else {
      setSelectedIssuer(issuer);
    }
  }

  const handleRefreshAfterUpdate = () => {
    fetchIssuers();
    notifications.show({
      title: 'Facturador actualizado',
      message: 'El facturador ha sido actualizado correctamente',
      color: 'green'
    });
  }

  return (
    <div className="issuers-page">
      <div className="participant-list-wrapper">
        <ParticipantList
          participantType="facturador"
          participants={issuers}
          loading={loading}
          setSearchTerm={setSearchTerm}
          setSelectedParticipant={handleSelectIssuer}
          selectedParticipant={selectedIssuer}
          isCreating={undefined}
          setIsCreating={undefined}
        />
      </div>

      <div className="issuer-data-wrapper">
        <IssuerData
          issuer={selectedIssuer}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          onUpdate={handleRefreshAfterUpdate}
          setError={setError}
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

export default IssuersPage;