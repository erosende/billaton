import "./LabelInputs.css";
import "./DatePicker.css";

const DatePicker = (
  { 
    label,
    date, 
    setDate
  } : { 
    label: string,
    date: Date | null, 
    setDate: (date: Date | null) => void 
  }) => {

  return (
    <div className="date-picker-container">
      <p className="label">{label}</p>
      <input className="value" type="date" value={date?.toISOString().split('T')[0]} onChange={(e) => setDate(new Date(e.target.value))} />
    </div>
  )

}

export default DatePicker;