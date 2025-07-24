import './LabelInputs.css';

const LabelSelect = (
  { 
    className, 
    label, 
    value, 
    enabled, 
    handleChange,
    options
  }: { 
    className: string, 
    label: string, 
    value: string | undefined, 
    enabled: boolean, handleChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void
    options: { value: string, label: string }[]
  }) => {

  return (
    <div className={className}>
      <p className="label">{label}</p>
      <select className="value-select" disabled={!enabled} value={value} onChange={handleChange}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  )
}

export default LabelSelect;