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
  documentTypeId: number;
  documentDate: string;
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
