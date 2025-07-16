import { useHttpService } from './HttpService';
import type { Participant, IssuerConfig } from '../interfaces/Participant';

export const participantService = () => {
  const { get, post, put } = useHttpService();

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

  return {
    createRecipientParticipant,
    getParticipants,
    updateIssuerConfig,
    getIssuerConfig,
  };
}; 