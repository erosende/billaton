import type { Concept, ConceptRequest, DocumentRequest, PaginatedDocument } from "../interfaces/Document";
import { useHttpService } from "./HttpService";

export const documentService = () => {
  const { get, post, put, del, getForFile, postForFile } = useHttpService();

  const getDocumentsPage = async (
    page: number,
    size: number, 
    documentTypeId: string | null, 
    recipientId: string | null, 
    dateFrom: Date | null, 
    dateTo: Date | null
  ): Promise<PaginatedDocument> => {
    try {
      const params = {
        page,
        size,
        documentTypeId,
        recipientId,
        dateFrom: dateFrom ? dateFrom.toISOString().split('T')[0] : null,
        dateTo: dateTo ? dateTo.toISOString().split('T')[0] : null
      } 
      const response = await get<PaginatedDocument>('/documents', params);
      return response.data;
    } catch (error) {
      console.error('Error fetching documents:', error);
      throw error;
    }
  }

  const createDocument = async (document: DocumentRequest): Promise<void> => {
    try {
      const response = await post<void>('/documents', document);
      return response.data;
    } catch (error) {
      console.error('Error creating document:', error);
      throw error;
    }
  }

  const updateDocument = async (documentId: number, document: DocumentRequest): Promise<void> => {
    try {
      const response = await put<void>(`/documents/${documentId}`, document);
      return response.data;
    } catch (error) {
      console.error('Error updating document:', error);
      throw error;
    }
  }

  const deleteDocument = async (documentId: number): Promise<void> => {
    try {
      const response = await del<void>(`/documents/${documentId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting document:', error);
      throw error;
    }
  }

  const getDocumentConcepts = async (documentId: number): Promise<Concept[]> => {
    try {
      const response = await get<Concept[]>(`/documents/${documentId}/concepts`);
      return response.data;
    } catch (error) {
      console.error('Error fetching document concepts:', error);
      throw error;
    }
  }

  const createDocumentConcept = async (documentId: number, concept: ConceptRequest): Promise<number> => {
    try {
      const response = await post<number>(`/documents/${documentId}/concepts`, concept);
      return response.data;
    } catch (error) {
      console.error('Error creating document concept:', error);
      throw error;
    }
  }

  const updateDocumentConcept = async (documentId: number, conceptId: number, concept: ConceptRequest): Promise<void> => {
    try {
      const response = await put<void>(`/documents/${documentId}/concepts/${conceptId}`, concept);
      return response.data;
    } catch (error) {
      console.error('Error updating document concept:', error);
      throw error;
    }
  }

  const deleteDocumentConcept = async (documentId: number, conceptId: number): Promise<void> => {
    try {
      const response = await del<void>(`/documents/${documentId}/concepts/${conceptId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting document concept:', error);
      throw error;
    }
  }

  const generateDocumentFile = async (documentId: number): Promise<File> => {
    try {
      const response = await postForFile<File>(`/documents/${documentId}/pdf/generate`);
      return response;
    } catch (error) {
      console.error('Error generating document:', error);
      throw error;
    }
  }

  const downloadDocumentFile = async (documentId: number): Promise<File> => {
    try {
      const response = await getForFile<File>(`/documents/${documentId}/pdf/download`);
      return response;
    } catch (error) {
      console.error('Error downloading document:', error);
      throw error;
    }
  }

  return {
    getDocumentsPage,
    createDocument,
    updateDocument,
    deleteDocument,
    getDocumentConcepts,
    createDocumentConcept,
    updateDocumentConcept,
    deleteDocumentConcept,
    generateDocumentFile,
    downloadDocumentFile,
  }

}