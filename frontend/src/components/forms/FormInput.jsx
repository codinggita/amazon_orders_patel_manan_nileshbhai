import React from 'react';
import { useField } from 'formik';

const FormInput = ({ label, icon: Icon, ...props }) => {
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
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none">
            <Icon size={14} style={{ color: '#334155' }} />
          </div>
        )}
        <input
          {...field}
          {...props}
          className={`w-full text-sm py-2.5 rounded-xl outline-none text-white placeholder-slate-600 transition-all ${Icon ? 'pl-10 pr-4' : 'px-4'}`}
          style={{
            background: 'rgba(255,255,255,0.03)',
            border: `1px solid ${isError ? 'rgba(239,68,68,0.4)' : 'rgba(255,255,255,0.07)'}`,
          }}
        />
      </div>
      {isError && (
        <p className="text-xs ml-0.5" style={{ color: '#F87171', animation: 'fadeIn 0.2s ease-out' }}>{meta.error}</p>
      )}
    </div>
  );
};

export default FormInput;
