import { useEffect, useState } from "react";
import DocumentsList from "../components/documents/parts/DocumentsList";
import { documentService } from "../services/DocumentService";
import type { Document, DocumentRequest } from "../interfaces/Document";
import { Button, Group, Modal, Text } from "@mantine/core";
import "./DocumentsPage.css";
import DocumentPageHeader from "../components/documents/parts/DocumentPageHeader";
import DocumentCreationForm from "../components/documents/parts/DocumentCreationForm";
import type { Participant } from "../interfaces/Participant";
import { participantService } from "../services/ParticipantService";
import { notifications } from "@mantine/notifications";
import DocumentEditForm from "../components/documents/parts/DocumentEditForm";

const DocumentsPage = () => {

  // Documents
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  // Filters
  const [documentTypeFilter, setDocumentTypeFilter] = useState<string | null>(null);
  const [recipientFilter, setRecipientFilter] = useState<string | null>(null);
  const [dateFromFilter, setDateFromFilter] = useState<Date | null>(null);
  const [dateToFilter, setDateToFilter] = useState<Date | null>(null);


  // Pagination
  const [page, setPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);

  // Conditionals
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);

  // Modals
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isNewDocumentModalOpen, setIsNewDocumentModalOpen] = useState<boolean>(false);
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState<boolean>(false);

  const [issuers, setIssuers] = useState<Participant[]>([]);
  const [recipients, setRecipients] = useState<Participant[]>([]);

  const documentsService = documentService();
  const participantsService = participantService();

  const pageSize = 18;

  useEffect(() => {
    handleSearch();
    handleGetParticipants();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [page]);

  const handleGetParticipants = async () => {
    try {
      const issuers = await participantsService.getParticipants('ISSUER');
      const recipients = await participantsService.getParticipants('RECIPIENT');
      setIssuers(issuers);
      setRecipients(recipients);
    } catch (error) {
      console.error(error);
    }
  }

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
    setIsEditing(true);
  }

  const handleEditCancel = () => {
    setIsEditing(false);
    setSelectedDocument(null);
    handleSearch();
  }

  const handleSave = async (documentRequest: DocumentRequest) => {
    try {
      await documentsService.createDocument(documentRequest);
      setIsNewDocumentModalOpen(false);
      notifications.show({
        title: "Documento creado",
        message: "El documento se ha creado correctamente",
        color: "green",
      });
      handleSearch();
    } catch (error) {
      console.error(error);
      notifications.show({
        title: "Error al crear el documento",
        message: "No se ha podido crear el documento",
        color: "red",
      });
    }
  }

  const handleUpdate = async (document: DocumentRequest) => {
    try {
      if (selectedDocument) {
        await documentsService.updateDocument(selectedDocument.documentId, document);
        setIsEditing(false);
        notifications.show({
          title: "Documento actualizado",
          message: "El documento se ha actualizado correctamente",
          color: "green",
        });
        handleSearch();
      }
    } catch (error) {
      console.error(error);
      notifications.show({
        title: "Error al actualizar el documento",
        message: "No se ha podido actualizar el documento",
        color: "red",
      });
    }
  }

  const handleDelete = (document: Document) => {
    setSelectedDocument(document);
    setIsDeleteModalOpen(true);
  }

  const handleDownload = async (document: Document) => {
    try {
      const file = await documentsService.downloadDocumentFile(document.documentId);
      if (file) {
        const url = URL.createObjectURL(file);
        window.open(url, '_blank');
        notifications.show({
          title: "Documento descargado",
          message: "El documento se ha descargado correctamente",
          color: "green",
        });
      }
    } catch (error) {
      console.error(error);
      notifications.show({
        title: "Error al descargar el documento",
        message: "No se ha podido descargar el documento",
        color: "red",
      });
    }
  }

  const handleGenerate = (document: Document) => {
    setSelectedDocument(document);
    if (document.resourcePath) {
      setIsGenerateModalOpen(true);
    } else {
      handleGenerateConfirm(document);
    }
  }

  const handleGenerateCancel = () => {
    setIsGenerateModalOpen(false);
  }

  const handleGenerateConfirm = async (document?: Document) => {
    const docToGenerate = document || selectedDocument;
    try {
      if (docToGenerate) {
        const file = await documentsService.generateDocumentFile(docToGenerate.documentId);
        const url = URL.createObjectURL(file);
        window.open(url, '_blank');
        setSelectedDocument(null);
        notifications.show({
          title: "Documento generado",
          message: "El documento se ha generado correctamente",
          color: "green",
        });

        setIsGenerateModalOpen(false);
        handleSearch();
      }
    } catch (error) {
      console.error(error);
      notifications.show({
        title: "Error al generar el documento",
        message: "No se ha podido generar el documento",
        color: "red",
      });
    }
  }

  const handleDeleteConfirm = async () => {
    try {
      if (selectedDocument) {
        await documentsService.deleteDocument(selectedDocument.documentId);
        setIsDeleteModalOpen(false);
        notifications.show({
          title: "Documento eliminado",
          message: "El documento se ha eliminado correctamente",
          color: "green",
        });
        handleSearch();
      }
    } catch (error) {
      console.error(error);
      notifications.show({
        title: "Error al eliminar el documento",
        message: "No se ha podido eliminar el documento",
        color: "red",
      });
    }
  }

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
  }

  const handleNewDocument = () => {
    setSelectedDocument(null);
    setIsNewDocumentModalOpen(true);
  }

  const handleNewDocumentCancel = () => {
    setIsNewDocumentModalOpen(false);
  }

  return (
    <div className="documents-page-container">
      {!isEditing && (
        <div className="documents-page-list-container">

          <div className="documents-page-container-header">
            <DocumentPageHeader
              documentTypeFilter={documentTypeFilter}
              setDocumentTypeFilter={setDocumentTypeFilter}
              recipientFilter={recipientFilter}
              setRecipientFilter={setRecipientFilter}
              recipients={recipients}
              dateFromFilter={dateFromFilter}
              setDateFromFilter={setDateFromFilter}
              dateToFilter={dateToFilter}
              setDateToFilter={setDateToFilter}
              handleSearch={handleSearch}
              handleNewDocument={handleNewDocument}
            />
          </div>
          <div className="documents-page-container-list">
            <DocumentsList
              documents={documents}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onDownload={handleDownload}
              onGenerate={handleGenerate}
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

            <Modal
              size="lg"
              opened={isNewDocumentModalOpen}
              onClose={handleNewDocumentCancel}
              title="Nuevo documento"
              centered
            >
              <DocumentCreationForm
                onSave={handleSave}
                onCancel={handleNewDocumentCancel}
                issuers={issuers}
                recipients={recipients}
              />
            </Modal>

            <Modal
              size="md"
              opened={isGenerateModalOpen}
              onClose={handleGenerateCancel}
              title="Aviso antes de generar"
              centered
            >
              <Text size="sm" mb="md">
                ¿Estás seguro de que quieres generar este documento? <br />
                Ya se ha generado previamente, al hacerlo se sobrescribirá el documento existente.
              </Text>
              <Group justify="flex-end" gap="sm">
                <Button variant="default" onClick={handleGenerateCancel}>Cancelar</Button>
                <Button color="green" onClick={() => handleGenerateConfirm(undefined)}>Generar</Button>
              </Group>
            </Modal>
          </div>
        </div>
      )}

      {isEditing && selectedDocument && (
        <div className="documents-page-edit-container">
          <DocumentEditForm
            onUpdate={handleUpdate}
            onCancel={handleEditCancel}
            document={selectedDocument}
            issuers={issuers}
            recipients={recipients}
          />
        </div>
      )}
    </div>
  )
}

export default DocumentsPage;