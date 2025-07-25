import { Button, ButtonGroup, Divider, Group, Select, Stack, Table, Text, NumberInput, Textarea } from "@mantine/core";
import { type Concept, type ConceptRequest, type Document, type DocumentRequest } from "../../../interfaces/Document";
import { useEffect, useState } from "react";
import { PencilOff, Plus, Save, Trash, Edit, Check, X } from "lucide-react";
import type { Participant } from "../../../interfaces/Participant";
import "./DocumentEditForm.css";
import DatePicker from "../../inputs/DatePicker";
import { documentService } from "../../../services/DocumentService";
import { notifications } from "@mantine/notifications";

const DocumentEditForm = ({
  onUpdate,
  onCancel,
  document,
  issuers,
  recipients
}: {
  onUpdate: (documentRequest: DocumentRequest) => void,
  onCancel: () => void,
  document: Document,
  issuers: Participant[],
  recipients: Participant[]
}) => {

  const [documentRequest, setDocumentRequest] = useState<DocumentRequest>({
    documentTypeId: document.documentTypeId,
    documentDate: new Date(document.documentDate),
    issuerId: document.issuerId,
    recipientId: document.recipientId,
  });

  const conceptRequest : ConceptRequest = {
    description: "",
    amount: 0,
    pricePerUnit: 0.0,
  };

  const [concepts, setConcepts] = useState<Concept[]>([]);
  const [editingConceptId, setEditingConceptId] = useState<number | null>(null);
  const [editingConcept, setEditingConcept] = useState<ConceptRequest>({
    description: "",
    amount: 0,
    pricePerUnit: 0.0,
  });

  const documentsService = documentService();

  const documentTypes = [
    { value: '1', label: 'Factura' },
    { value: '2', label: 'Presupuesto' }
  ];

  useEffect(() => {
    const getConcepts = async () => {
      try {
        const concepts = await documentsService.getDocumentConcepts(document.documentId);
        setConcepts(concepts);
      } catch (error) {
        console.error(error);
      }
    }
    getConcepts();
  }, [document]);

  const issuerOptions = issuers.map(issuer => ({ value: issuer.participantId.toString(), label: issuer.name + " " + issuer.surnames }));
  const recipientOptions = recipients.map(recipient => ({ value: recipient.participantId.toString(), label: recipient.name + " " + recipient.surnames }));

  const handleDocumentTypeChange = (value: string | null) => {
    setDocumentRequest({ ...documentRequest, documentTypeId: parseInt(value!) });
  }

  const handleDocumentDateChange = (date: Date | null) => {
    setDocumentRequest({ ...documentRequest, documentDate: date! });
  }

  const handleIssuerChange = (value: string | null) => {
    setDocumentRequest({ ...documentRequest, issuerId: parseInt(value!) });
  }

  const handleRecipientChange = (value: string | null) => {
    setDocumentRequest({ ...documentRequest, recipientId: parseInt(value!) });
  }

  const handleAddConcept = async () => {
    try {
      const newConceptId = await documentsService.createDocumentConcept(document.documentId, conceptRequest);
      notifications.show({
        title: "Concepto añadido",
        message: "El concepto se ha añadido correctamente",
        color: "green",
      });

      const newConcept: Concept = {
        conceptId: newConceptId,
        documentId: document.documentId,
        description: conceptRequest.description,
        amount: conceptRequest.amount,
        pricePerUnit: conceptRequest.pricePerUnit,
      }
      setConcepts([...concepts, newConcept]);
    } catch (error) {
      console.error(error);
    }
  }

  const handleDeleteConcept = async (conceptId: number) => {
    try {
      await documentsService.deleteDocumentConcept(document.documentId, conceptId);
      notifications.show({
        title: "Concepto eliminado",
        message: "El concepto se ha eliminado correctamente",
        color: "green",
      });
      const newConcepts = concepts.filter((concept) => concept.conceptId !== conceptId);
      setConcepts(newConcepts);
    } catch (error) {
      console.error(error);
    }
  }

  const handleEditConcept = (concept: Concept) => {
    setEditingConceptId(concept.conceptId);
    setEditingConcept({
      description: concept.description,
      amount: concept.amount,
      pricePerUnit: concept.pricePerUnit,
    });
  };

  const handleSaveConcept = async () => {
    if (editingConceptId === null) return;

    try {
      await documentsService.updateDocumentConcept(document.documentId, editingConceptId, editingConcept);

      notifications.show({
        title: "Concepto actualizado",
        message: "El concepto se ha actualizado correctamente",
        color: "green",
      });

      const updatedConcepts = concepts.map(concept =>
        concept.conceptId === editingConceptId
          ? { ...concept, ...editingConcept }
          : concept
      );
      setConcepts(updatedConcepts);

      setEditingConceptId(null);
      setEditingConcept({ description: "", amount: 0, pricePerUnit: 0.0 });
    } catch (error) {
      console.error('Error updating concept:', error);
    }
  };

  const handleCancelEditConcept = () => {
    setEditingConceptId(null);
    setEditingConcept({ description: "", amount: 0, pricePerUnit: 0.0 });
  };

  const handleEditConceptChange = (field: keyof ConceptRequest, value: string | number) => {
    setEditingConcept(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Stack className="document-edit-form-container" gap="md" p="sm" display="flex" dir="column">
      {/* Header and buttons */}
      <Group className="document-edit-form-header" display="flex" dir="row" justify="space-between">
        <h2 className="document-edit-form-title">Información del documento</h2>
        <ButtonGroup style={{ gap: "2px" }}>
          <Button variant="outline" onClick={() => onUpdate(documentRequest!)} radius="sm" color="blue" leftSection={<Save size={16} />}>
            Guardar
          </Button>
          <Button variant="outline" onClick={onCancel} radius="sm" color="red" leftSection={<PencilOff size={16} />}>
            Cancelar
          </Button>
        </ButtonGroup>
      </Group>

      {/* Document information */}
      <Group display="flex" dir="row" gap="40px" ml="30px">
        <Select
          label="Tipo de documento"
          placeholder="Selecciona un tipo de documento"
          data={documentTypes}
          value={documentRequest?.documentTypeId.toString()}
          onChange={handleDocumentTypeChange}
        />
        <Select
          searchable
          label="Facturador"
          placeholder="Selecciona un facturador"
          data={issuerOptions}
          value={documentRequest?.issuerId.toString()}
          onChange={handleIssuerChange}
        />
        <Select
          searchable
          label="Cliente"
          placeholder="Selecciona un cliente"
          data={recipientOptions}
          value={documentRequest?.recipientId.toString()}
          onChange={handleRecipientChange}
        />
        {/* TODO: fix date picker length */}
        <DatePicker
          label="Fecha de documento"
          date={documentRequest?.documentDate}
          setDate={handleDocumentDateChange}
        />
      </Group>

      <Divider className="document-edit-form-divider" />

      {/* Document concepts */}
      <Group className="document-edit-form-header" display="flex" dir="row" justify="space-between">
        <h2 className="document-edit-form-title">Conceptos</h2>
        <Button variant="outline" onClick={handleAddConcept} radius="sm" color="green" leftSection={<Plus size={16} />}>
          Añadir un nuevo concepto
        </Button>
      </Group>

      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th w="65%" >Descripción</Table.Th>
            <Table.Th w="10%" >Cantidad</Table.Th>
            <Table.Th w="10%" >Precio por unidad</Table.Th>
            <Table.Th w="15%" >Acciones</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {concepts.map((concept) => (
            <Table.Tr key={concept.conceptId}>
              <Table.Td w="65%">
                {editingConceptId === concept.conceptId ? (
                  <Textarea
                    autosize
                    minRows={1}
                    maxRows={4}
                    value={editingConcept.description}
                    onChange={(e) => handleEditConceptChange('description', e.currentTarget.value)}
                    size="sm"
                  />
                ) : (
                  concept.description
                )}
              </Table.Td>
              <Table.Td w="10%" >
                {editingConceptId === concept.conceptId ? (
                  <NumberInput
                    value={editingConcept.amount}
                    onChange={(value) => handleEditConceptChange('amount', Number(value) || 0)}
                    min={1}
                    size="sm"
                  />
                ) : (
                  concept.amount
                )}
              </Table.Td>
              <Table.Td w="10%">
                {editingConceptId === concept.conceptId ? (
                  <NumberInput
                    value={editingConcept.pricePerUnit}
                    onChange={(value) => handleEditConceptChange('pricePerUnit', Number(value) || 0)}
                    min={0}
                    step={0.01}
                    decimalScale={2}
                    fixedDecimalScale
                    suffix=" €"
                    size="sm"
                  />
                ) : (
                  `${concept.pricePerUnit} €`
                )}
              </Table.Td>
              <Table.Td w="15%">
                {editingConceptId === concept.conceptId ? (
                  <Group gap="xs">
                    <Button
                      variant="outline"
                      onClick={handleSaveConcept}
                      radius="sm"
                      color="green"
                      size="xs"
                      leftSection={<Check size={14} />}
                    >
                      Guardar
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleCancelEditConcept}
                      radius="sm"
                      color="gray"
                      size="xs"
                      leftSection={<X size={14} />}
                    >
                      Cancelar
                    </Button>
                  </Group>
                ) : (
                  <Group gap="xs">
                    <Button
                      variant="outline"
                      onClick={() => handleEditConcept(concept)}
                      radius="sm"
                      color="blue"
                      size="xs"
                      leftSection={<Edit size={14} />}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => handleDeleteConcept(concept.conceptId)}
                      radius="sm"
                      color="red"
                      size="xs"
                      leftSection={<Trash size={14} />}
                    >
                      Eliminar
                    </Button>
                  </Group>
                )}
              </Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>

      <Divider className="document-edit-form-divider" />

      <Group display="flex" dir="row" justify="flex-end" mr="30px">
        <Text size="xl" fw="600" >
          Total (sin IVA): {concepts.reduce((acc, concept) => acc + concept.amount * concept.pricePerUnit, 0)} €
        </Text>
      </Group>
    </Stack>
  )
}

export default DocumentEditForm;