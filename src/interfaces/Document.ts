export interface Document {
  documentId: number;
  documentTypeId: number;
  documentDate: string;
  resourcePath: string;
  issuerId: number;
  issuerName: string;
  recipientId: number;
  recipientName: string;
  totalAmount: number;
  documentCode: string;
}

export interface PaginatedDocument {
  content: Document[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export interface DocumentRequest {
  documentCode: string | null;
  documentTypeId: number;
  documentDate: Date;
  issuerId: number;
  recipientId: number;
}

export interface Concept {
  conceptId: number;
  description: string;
  amount: number;
  pricePerUnit: number;
  documentId: number;
}

export interface ConceptRequest {
  description: string;
  amount: number;
  pricePerUnit: number;
}

export const emptyDocumentRequest: DocumentRequest = {
  documentCode: "",
  documentTypeId: 1,
  documentDate: new Date(),
  issuerId: 0,
  recipientId: 0
}
