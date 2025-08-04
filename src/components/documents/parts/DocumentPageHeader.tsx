import { useEffect, useState } from "react";
import LabelSelect from "../../inputs/LabelSelect";
import "./DocumentPageHeader.css";
import DatePicker from "../../inputs/DatePicker";
import { Button } from "@mantine/core";
import { Plus, Search } from "lucide-react";
import type { Participant } from "../../../interfaces/Participant";

const DocumentPageHeader = ({
  documentTypeFilter,
  setDocumentTypeFilter,
  recipientFilter,
  setRecipientFilter,
  recipients,
  dateFromFilter,
  setDateFromFilter,
  dateToFilter,
  setDateToFilter,
  handleSearch,
  handleNewDocument
}: {
  documentTypeFilter: string | null,
  setDocumentTypeFilter: (documentType: string | null) => void,
  recipientFilter: string | null,
  setRecipientFilter: (recipient: string | null) => void,
  dateFromFilter: Date | null,
  recipients: Participant[],
  setDateFromFilter: (dateFrom: Date | null) => void,
  dateToFilter: Date | null,
  setDateToFilter: (dateTo: Date | null) => void,
  handleSearch: () => void,
  handleNewDocument: () => void
}) => {

  const [documentTypeOptions, setDocumentTypeOptions] = useState<{ label: string, value: string }[]>([]);
  const [recipientOptions, setRecipientOptions] = useState<{ label: string, value: string }[]>([]);

  // TODO: Get document types from backend
  useEffect(() => {
    setDocumentTypeOptions([
      {
        label: 'Todos',
        value: ''
      },
      {
        label: 'Factura',
        value: '1'
      },
      {
        label: 'Presupuesto',
        value: '2'
      },
      {
        label: 'Albarán',
        value: '3'
      }
    ])
  }, []);

  useEffect(() => {
    setRecipientOptions([{
      label: 'Todos',
      value: ''
    }, ...recipients.map(recipient => ({
      label: recipient.name + ' ' + recipient.surnames,
      value: recipient.participantId.toString()
    }))]);
  }, [recipients]);

  return (
    <div className="document-page-header-container">
      <div className="document-page-header-actions">
        <Button leftSection={<Plus />} onClick={handleNewDocument}>
          Nuevo documento
        </Button>
      </div>
      <div className="document-page-header-filters">
        <LabelSelect
          className="document-type-filter"
          enabled={true}
          label="Tipo de documento"
          value={documentTypeFilter || ''}
          options={documentTypeOptions}
          handleChange={(e) => setDocumentTypeFilter(e.target.value)}
        />
        <LabelSelect
          className="recipient-filter"
          enabled={true}
          label="Cliente"
          value={recipientFilter || ''}
          options={recipientOptions}
          handleChange={(e) => setRecipientFilter(e.target.value)}
        />
        <DatePicker
          label="Desde"
          date={dateFromFilter}
          setDate={setDateFromFilter}
        />
        <DatePicker
          label="Hasta"
          date={dateToFilter}
          setDate={setDateToFilter}
        />
        <Button
          className="search-button"
          title={"Buscar"}
          variant="subtle"
          color="blue"
          leftSection={<Search size={20} />}
          size="compact-sm"
          onClick={handleSearch}
        >
          Buscar
        </Button>
      </div>
    </div>
  )
}

export default DocumentPageHeader;