import './LabelInputs.css';

const LabelValue = (
  { 
    className, 
    label, 
    value, 
    enabled, 
    handleChange 
  } : { 
    className: string, 
    label: string, 
    value: string | undefined, 
    enabled: boolean,
    handleChange?: (e: React.ChangeEvent<HTMLInputElement>) => void 
  }) => {

  return (
    <div className={className}>
      <p className="label">{label}</p>
      <input className="value" disabled={!enabled} value={value} onChange={handleChange} />
    </div>
  )
}

export default LabelValue;