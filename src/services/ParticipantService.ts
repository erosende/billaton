import { useAuthenticatedHttpService } from '../hooks/useAuthenticatedHttpService';
import type { Participant, IssuerConfig } from '../interfaces/Participant';

export const useParticipantService = () => {
  const { get, post, put, del } = useAuthenticatedHttpService();

  const createRecipientParticipant = async (participantData: Participant): Promise<Participant> => {
    try {
      const response = await post<Participant>('/participants/recipients', participantData);
      return response.data;
    } catch (error) {
      console.error('Error creating recipient participant:', error);
      throw error;
    }
  };

  const getParticipants = async (participantType: string, searchTerm?: string): Promise<Participant[]> => {
    try {
      const response = await get<Participant[]>('/participants', { participantType, searchTerm });
      return response.data;
    } catch (error) {
      console.error('Error fetching participants:', error);
      throw error;
    }
  };

  const updateParticipant = async (participantId: number, participantData: Participant): Promise<Participant> => {
    try {
      const response = await put<Participant>(`/participants/recipients/${participantId}`, participantData);
      return response.data;
    } catch (error) {
      console.error('Error updating participant:', error);
      throw error;
    }
  };

  const updateIssuerConfig = async (
    participantId: number,
    configId: number,
    configData: IssuerConfig
  ): Promise<void> => {
    try {
      await put<IssuerConfig>(`/participants/issuers/${participantId}/config/${configId}`, configData);
    } catch (error) {
      console.error('Error updating issuer config:', error);
      throw error;
    }
  };

  const getIssuerConfig = async (participantId: number): Promise<IssuerConfig> => {
    try {
      const response = await get<IssuerConfig>(`/participants/issuers/${participantId}/config`);
      return response.data;
    } catch (error) {
      console.error('Error fetching issuer config:', error);
      throw error;
    }
  };

  const deleteRecipientParticipant = async (participantId: number): Promise<void> => {
    try {
      await del<void>(`/participants/recipients/${participantId}`);
    } catch (error) {
      console.error('Error deleting client:', error);
      throw error;
    }
  };

  return {
    createRecipientParticipant,
    getParticipants,
    updateParticipant,
    updateIssuerConfig,
    getIssuerConfig,
    deleteRecipientParticipant,
  };
}; 