import { useEffect, useState } from "react";
import LabelSelect from "../inputs/LabelSelect";
import "./DocumentFilters.css";
import { participantService } from "../../services/ParticipantService";
import DatePicker from "../inputs/DatePicker";
import { Button } from "@mantine/core";
import { Search } from "lucide-react";

const DocumentFilters = ({
  documentTypeFilter,
  setDocumentTypeFilter,
  recipientFilter,
  setRecipientFilter,
  dateFromFilter,
  setDateFromFilter,
  dateToFilter,
  setDateToFilter,
  handleSearch
}: {
  documentTypeFilter: string | null,
  setDocumentTypeFilter: (documentType: string | null) => void,
  recipientFilter: string | null,
  setRecipientFilter: (recipient: string | null) => void,
  dateFromFilter: Date | null,
  setDateFromFilter: (dateFrom: Date | null) => void,
  dateToFilter: Date | null,
  setDateToFilter: (dateTo: Date | null) => void,
  handleSearch: () => void
}) => {

  const [documentTypeOptions, setDocumentTypeOptions] = useState<{ label: string, value: string }[]>([]);
  const [recipientOptions, setRecipientOptions] = useState<{ label: string, value: string }[]>([]);

  const recipientService = participantService();

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
      }
    ])
  }, []);

  useEffect(() => {
    const fetchRecipients = async () => {
      const recipients = await recipientService.getParticipants('RECIPIENT');
      setRecipientOptions([{
        label: 'Todos',
        value: ''
      }, ...recipients.map(recipient => ({
        label: recipient.name + ' ' + recipient.surnames,
        value: recipient.participantId.toString()
      }))]);
    }
    fetchRecipients();
  }, []);

  return (
    <div className="document-filters-container">
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
  )
}

export default DocumentFilters;