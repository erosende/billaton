import "./LabelInputs.css";
import "./DatePicker.css";

const DatePicker = (
  {
    label,
    date,
    setDate
  }: {
    label: string,
    date: Date | null,
    setDate: (date: Date | null) => void
  }) => {

  function handleDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.value === '') {
      setDate(null);
      return;
    }
    setDate(new Date(e.target.value));
  }

  function formatDate(date: Date | null) {
    if (!date) {
      return '';
    }
    return date.toISOString().split('T')[0];
  }


  return (
    <div className="date-picker-container">
      <p className="label">{label}</p>
      <input className="value" type="date" value={formatDate(date)} onChange={handleDateChange} />
    </div>
  )

}

export default DatePicker;