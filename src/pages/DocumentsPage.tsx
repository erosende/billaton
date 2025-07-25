import { useEffect, useState } from "react";
import DocumentFilters from "../components/filters/DocumentFilters";
import DocumentsList from "../components/documents/DocumentsList";
import { documentService } from "../services/DocumentService";
import type { Document } from "../interfaces/Document";
import { Button, Group, Modal, Text } from "@mantine/core";
import "./DocumentsPage.css";

const DocumentsPage = () => {

  const [documentTypeFilter, setDocumentTypeFilter] = useState<string | null>(null);
  const [recipientFilter, setRecipientFilter] = useState<string | null>(null);
  const [dateFromFilter, setDateFromFilter] = useState<Date | null>(null);
  const [dateToFilter, setDateToFilter] = useState<Date | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [page, setPage] = useState<number>(0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const documentsService = documentService();

  const pageSize = 18;

  useEffect(() => {
      handleSearch();
  }, []);

  const handleSearch = async () => {
    try {
      setIsLoading(true);
      const documents = await documentsService.getDocumentsPage(page, pageSize, documentTypeFilter, recipientFilter, dateFromFilter, dateToFilter);
      setDocuments(documents.content);
      setTotalPages(documents.totalPages);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  const handleEdit = (document: Document) => {
    setSelectedDocument(document);
  }

  const handleDelete = (document: Document) => {
    setSelectedDocument(document);
    setIsDeleteModalOpen(true);
  }

  const handleDeleteConfirm = () => {
    if (selectedDocument) {
      documentsService.deleteDocument(selectedDocument.documentId);
      setIsDeleteModalOpen(false);
    }
    handleSearch();
  }

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
  }

  return (
    <div className="documents-page-container">
      <div className="documents-page-container-filters">
        <DocumentFilters
          documentTypeFilter={documentTypeFilter}
          setDocumentTypeFilter={setDocumentTypeFilter}
          recipientFilter={recipientFilter}
          setRecipientFilter={setRecipientFilter}
          dateFromFilter={dateFromFilter}
          setDateFromFilter={setDateFromFilter}
          dateToFilter={dateToFilter}
          setDateToFilter={setDateToFilter}
          handleSearch={handleSearch}
        />
      </div>

      <div className="documents-page-container-list">
        <DocumentsList
          documents={documents}
          onEdit={handleEdit}
          onDelete={handleDelete}
          page={page}
          setPage={setPage}
          totalPages={totalPages}
          isLoading={isLoading}
        />

        <Modal
          opened={isDeleteModalOpen}
          onClose={handleDeleteCancel}
          title="Confirmar eliminación"
          centered
        >
          <Text size="sm" mb="md">
            ¿Estás seguro de que quieres eliminar este documento? <br /> Esta acción no se puede deshacer.
          </Text>

          <Group justify="flex-end" gap="sm">
            <Button variant="default" onClick={handleDeleteCancel}>Cancelar</Button>
            <Button color="red" onClick={handleDeleteConfirm}>Eliminar</Button>
          </Group>
        </Modal>
      </div>

    </div>


  )
}

export default DocumentsPage;