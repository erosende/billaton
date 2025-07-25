import { Card, Text, Badge, Group, Stack, ActionIcon, ButtonGroup } from '@mantine/core';
import { Calendar, User, Building, Euro, Edit, Trash } from 'lucide-react';
import type { Document } from '../../interfaces/Document';
import './DocumentCard.css';

interface DocumentCardProps {
  document: Document;
  onEdit?: (document: Document) => void;
  onDelete?: (document: Document) => void;
}

const DocumentCard = ({ document, onEdit, onDelete }: DocumentCardProps) => {
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
      padding="md"
      radius="md"
      withBorder
      className="document-card"
    >
      <ButtonGroup className="document-card-buttons">
        <ActionIcon
          variant="filled"
          color="blue"
          size="sm"
          className="edit-button"
          onClick={handleEditClick}
        >
          <Edit size={14} />
        </ActionIcon>

        <ActionIcon
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
            <Text size="sm" c="dimmed">
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
          <Text size="sm" c="dimmed">
            {document.recipientName}
          </Text>
        </Group>

        <Group justify="space-between" align="center" mt="xs">
          <Group gap="xs">
            <Euro size={16} />
            <Text size="sm" c="dimmed">
              Total
            </Text>
          </Group>
          <Text fw={700} size="lg" c="blue">
            {formatAmount(document.totalAmount)}
          </Text>
        </Group>
      </Stack>
    </Card>
  );
};

export default DocumentCard; 