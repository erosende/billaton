import { Card, Text, Badge, Group, Stack, ActionIcon, ButtonGroup } from '@mantine/core';
import { Calendar, User, Building, Euro, Edit, Trash, Download, File } from 'lucide-react';
import type { Document } from '../../../interfaces/Document';
import './DocumentCard.css';

interface DocumentCardProps {
  document: Document;
  onEdit?: (document: Document) => void;
  onDelete?: (document: Document) => void;
  onDownload?: (document: Document) => void;
  onGenerate?: (document: Document) => void;
}

const DocumentCard = ({ document, onEdit, onDelete, onDownload, onGenerate }: DocumentCardProps) => {
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(document);
    }
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(document);
    }
  };

  const handleGenerateClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onGenerate) {
      onGenerate(document);
    }
  };

  const handleDownloadClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onDownload) {
      onDownload(document);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  };

  const getDocumentTypeBadge = (documentTypeId: number) => {
    const isInvoice = documentTypeId === 1;
    return (
      <Badge
        color={isInvoice ? 'blue' : 'orange'}
        variant="light"
        size="sm"
      >
        {isInvoice ? 'Factura' : 'Presupuesto'}
      </Badge>
    );
  };

  return (
    <Card
      shadow="sm"
      padding="sm"
      radius="sm"
      withBorder
      className="document-card"
    >
      <ButtonGroup className="document-card-buttons">
        <ActionIcon
          title="Editar documento"
          variant="filled"
          color="blue"
          size="sm"
          className="edit-button"
          onClick={handleEditClick}
        >
          <Edit size={14} />
        </ActionIcon>
        <ActionIcon
          title="Generar documento"
          variant="filled"
          color="yellow"
          size="sm"
          className="generate-button"
          onClick={handleGenerateClick}
        >
          <File size={14} />
        </ActionIcon>
        <ActionIcon
          title={document.resourcePath ? "Descargar documento" : "No se puede descargar el documento porque no se ha generado previamente"}
          variant="filled"
          color="green"
          size="sm"
          className="download-button"
          onClick={handleDownloadClick}
          disabled={!document.resourcePath}
        >
          <Download size={14} />
        </ActionIcon>

        <ActionIcon
          title="Eliminar documento"
          variant="filled"
          color="red"
          size="sm"
          className="delete-button"
          onClick={handleDeleteClick}
        >
          <Trash size={14} />
        </ActionIcon>
      </ButtonGroup>



      <Stack gap="xs">
        <Group justify="space-between" align="flex-start">
          {getDocumentTypeBadge(document.documentTypeId)}
          <Group gap="xs">
            <Calendar size={16} />
            <Text size="sm">
              {formatDate(document.documentDate)}
            </Text>
          </Group>
        </Group>

        <Group gap="xs" align="center">
          <Building size={16} />
          <Text size="sm">
            {document.issuerName}
          </Text>
        </Group>

        <Group gap="xs" align="center">
          <User size={16} />
          <Text size="sm" >
            {document.recipientName}
          </Text>
        </Group>

        <Group justify="space-between" align="center" mt="xs">
          <Group gap="xs">
            <Euro size={16} />
            <Text size="sm">
              Total
            </Text>
          </Group>
          <Text fw={600} size="md" c="blue">
            {formatAmount(document.totalAmount)}
          </Text>
        </Group>
      </Stack>
    </Card>
  );
};

export default DocumentCard; 