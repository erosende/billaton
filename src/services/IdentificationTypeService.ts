import { useHttpService } from './HttpService';
import type { IdentificationType } from '../interfaces/IdentificationType';

export const useIdentificationTypeService = () => {
  const { get } = useHttpService();

  const getIdentificationTypes = async (): Promise<IdentificationType[]> => {
    try {
      const response = await get<IdentificationType[]>('/identification-types');
      return response.data;
    } catch (error) {
      console.error('Error fetching identification types:', error);
      throw error;
    }
  };

  return {
    getIdentificationTypes,
  };
};
