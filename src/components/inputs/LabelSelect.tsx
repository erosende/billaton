import './LabelInputs.css';

const LabelSelect = (
  { 
    className, 
    label, 
    value, 
    enabled, 
    handleChange
  }: { 
    className: string, 
    label: string, 
    value: string | undefined, 
    enabled: boolean, handleChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void
  }) => {

  return (
    <div className={className}>
      <p className="label">{label}</p>
      <select className="value-select" disabled={!enabled} value={value} onChange={handleChange}>
        <option value="1">NIF</option>
        <option value="2">DNI</option>
      </select>
    </div>
  )
}

export default LabelSelect;