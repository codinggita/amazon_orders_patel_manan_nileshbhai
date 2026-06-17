import React from 'react';
import { useField } from 'formik';
import { FiChevronDown } from 'react-icons/fi';

const FormSelect = ({ label, icon: Icon, options, ...props }) => {
  const [field, meta] = useField(props);
  const isError = meta.touched && meta.error;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label && (
        <label className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#475569' }}
          htmlFor={props.id || props.name}>
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none z-10">
            <Icon size={14} style={{ color: '#334155' }} />
          </div>
        )}
        <select
          {...field}
          {...props}
          className={`w-full text-sm py-2.5 rounded-xl outline-none text-white appearance-none cursor-pointer transition-all ${Icon ? 'pl-10 pr-10' : 'px-4 pr-10'}`}
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: `1px solid ${isError ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.07)'}`,
          }}
        >
          <option value="" disabled style={{ background: '#0D1117', color: '#475569' }}>Select...</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} style={{ background: '#0D1117', color: '#F1F5F9' }}>
              {opt.label}
            </option>
          ))}
        </select>
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
          <FiChevronDown size={14} style={{ color: '#334155' }} />
        </div>
      </div>
      {isError && (
        <p className="text-xs ml-0.5" style={{ color: '#F87171', animation: 'fadeIn 0.2s ease-out' }}>{meta.error}</p>
      )}
    </div>
  );
};

export default FormSelect;
