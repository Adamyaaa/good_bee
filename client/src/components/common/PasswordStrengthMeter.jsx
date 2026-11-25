import React from 'react';
import { Check, X, ShieldCheck, ShieldAlert } from 'lucide-react';
import { evaluatePasswordStrength } from '../../utils/passwordStrength';

export default function PasswordStrengthMeter({ password = '', showDetails = true, className = '' }) {
  if (!password) {
    return null;
  }

  const { scoreOutOf4, label, color, requirements, isValid } = evaluatePasswordStrength(password);

  const getSegmentColor = (index) => {
    if (scoreOutOf4 < index) {
      return 'bg-gray-200';
    }
    switch (scoreOutOf4) {
      case 1:
        return 'bg-rose-500';
      case 2:
        return 'bg-amber-500';
      case 3:
        return 'bg-sky-500';
      case 4:
        return 'bg-emerald-500';
      default:
        return 'bg-gray-200';
    }
  };

  const badgeStyles = {
    Weak: 'bg-rose-50 text-rose-700 border-rose-200',
    Fair: 'bg-amber-50 text-amber-700 border-amber-200',
    Good: 'bg-sky-50 text-sky-700 border-sky-200',
    Strong: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  };

  return (
    <div className={`mt-2 space-y-2 p-2.5 rounded-xl bg-gray-50/80 border border-gray-100 transition-all ${className}`}>
      {/* Header with Strength Label */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 font-medium text-gray-700">
          {isValid ? (
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          ) : (
            <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
          )}
          <span>Password Strength:</span>
        </div>
        <span
          className={`px-2 py-0.5 rounded-md text-[10px] font-bold border uppercase tracking-wider ${
            badgeStyles[label] || 'bg-gray-100 text-gray-600 border-gray-200'
          }`}
        >
          {label}
        </span>
      </div>

      {/* 4-Segment Strength Bar */}
      <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full">
        <div className={`rounded-full transition-colors duration-200 ${getSegmentColor(1)}`} />
        <div className={`rounded-full transition-colors duration-200 ${getSegmentColor(2)}`} />
        <div className={`rounded-full transition-colors duration-200 ${getSegmentColor(3)}`} />
        <div className={`rounded-full transition-colors duration-200 ${getSegmentColor(4)}`} />
      </div>

      {/* Detailed Checklist */}
      {showDetails && (
        <div className="pt-1.5 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px]">
          {requirements.map((req) => (
            <div
              key={req.id}
              className={`flex items-center gap-1.5 transition-colors ${
                req.met ? 'text-emerald-700 font-medium' : 'text-gray-400'
              }`}
            >
              <div
                className={`w-3.5 h-3.5 rounded-full flex items-center justify-center shrink-0 text-[9px] ${
                  req.met ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-200 text-gray-400'
                }`}
              >
                {req.met ? <Check className="w-2.5 h-2.5 stroke-[3]" /> : <span className="w-1 h-1 rounded-full bg-gray-400" />}
              </div>
              <span className="truncate">{req.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
