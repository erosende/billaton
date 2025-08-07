import { useState } from "react";
import { emptyDocumentRequest, type DocumentRequest } from "../../../interfaces/Document";
import { Button, Group, Stack, Select, TextInput } from "@mantine/core";
import type { Participant } from "../../../interfaces/Participant";
import DatePicker from "../../inputs/DatePicker";

const DocumentCreationForm = ({
  onSave,
  onCancel,
  issuers,
  recipients
}: {
  onSave: (documentRequest: DocumentRequest) => void,
  onCancel: () => void,
  issuers: Participant[],
  recipients: Participant[]
}) => {

  const [documentRequest, setDocumentRequest] = useState<DocumentRequest>(emptyDocumentRequest);

  const documentTypes = [
    { value: "1", label: "Factura" },
    { value: "2", label: "Presupuesto" },
    { value: "3", label: "Albarán" }
  ]

  const getIssuerOptions = () => {
    return issuers.map((issuer) => ({ value: issuer.participantId.toString(), label: issuer.name + ' ' + issuer.surnames }));
  }

  const getRecipientOptions = (recipients: Participant[]) => {
    return recipients.map((recipient) => ({ value: recipient.participantId.toString(), label: recipient.name + ' ' + recipient.surnames }));
  }

  const handleConfirmSave = () => {
    onSave(documentRequest);
  }

  const handleDocumentTypeChange = (value: string | null) => {
    if (value) {
      setDocumentRequest({ ...documentRequest, documentTypeId: parseInt(value) });
    }
  }

  const handleDocumentCodeChange = (value: string) => {
    setDocumentRequest({ ...documentRequest, documentCode: value });
  }

  const handleDocumentDateChange = (date: Date | null) => {
    if (date) {
      setDocumentRequest({ ...documentRequest, documentDate: date });
    }
  }

  const handleIssuerChange = (value: string | null) => {
    if (value) {
      setDocumentRequest({ ...documentRequest, issuerId: parseInt(value) });
    }
  }

  const handleRecipientChange = (value: string | null) => {
    if (value) {
      setDocumentRequest({ ...documentRequest, recipientId: parseInt(value) });
    }
  }

  // TODO: fix input lengths
  return (
    <Stack gap="md" p="sm" display="flex" dir="column">
      <Group display="flex" dir="row">
        <Select
          label="Tipo de documento"
          data={documentTypes}
          value={documentRequest.documentTypeId.toString()}
          onChange={handleDocumentTypeChange}
        />

        <DatePicker
          label="Fecha de documento"
          date={documentRequest.documentDate}
          setDate={handleDocumentDateChange}
        />
      </Group>

      <Group display="flex" dir="row">
        <Select
          label="Facturador"
          searchable
          data={getIssuerOptions()}
          value={documentRequest.issuerId.toString()}
          onChange={handleIssuerChange}
        />
        <Select
          label="Cliente"
          searchable
          data={getRecipientOptions(recipients)}
          value={documentRequest.recipientId.toString()}
          onChange={handleRecipientChange}
        />
      </Group>

      <Group display="flex" dir="row">
        <TextInput
          label="Número de documento"
            value={documentRequest.documentCode ?? ""}
            onChange={(event) => handleDocumentCodeChange(event.target.value)}
        />
      </Group>

      <Group display="flex" dir="row" justify="flex-end">
        <Button onClick={onCancel} variant="outline">Cancelar</Button>
        <Button onClick={handleConfirmSave}>Guardar</Button>
      </Group>

    </Stack>
  )
}

export default DocumentCreationForm;
