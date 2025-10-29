import React from 'react';
import { FaArrowUp, FaArrowDown, FaMinus } from 'react-icons/fa';
import '../../styles/global.css';

const InfoCard = ({ title, value, change, icon: Icon, unit = '' }) => {
  const isPositive = change > 0;
  const isNegative = change < 0;
  const isNeutral = change === 0;

  const changeClassName = isPositive ? 'text-success' : isNegative ? 'text-danger' : 'text-muted';
  const ArrowIcon = isPositive ? FaArrowUp : isNegative ? FaArrowDown : FaMinus;

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--secondary-color)' }}>{title}</h3>
        {Icon && <Icon size={24} color="var(--primary-color)" />}
      </div>
      <div style={{ fontSize: '2.5rem', fontWeight: 'bold', lineHeight: 1 }}>
        {unit === 'R$' ? `R$ ${value.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : value.toLocaleString('pt-BR')}
      </div>
      {change !== undefined && (
        <div className={`percentage-change ${changeClassName}`}>
          <ArrowIcon size={12} />
          {change.toFixed(1)}% {isPositive ? '⬆️' : isNegative ? '⬇️' : ''}
        </div>
      )}
    </div>
  );
};

export default InfoCard;