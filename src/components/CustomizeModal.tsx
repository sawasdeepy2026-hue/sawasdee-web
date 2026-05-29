import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import type { DishItem } from './DishCard';

interface CustomizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  dish: DishItem | null;
  onConfirm: (dish: DishItem, spice: string, notes: string) => void;
}

const SPICE_LEVELS = [
  { level: 'Sin Picante ⚪', description: 'Totalmente apto para niños y personas sensibles.' },
  { level: 'Levemente Picante 🌶️', description: 'El toque justo para despertar los sabores tradicionales tailandeses.' },
  { level: 'Picante 🌶️🌶️', description: 'Nivel tradicional tailandés. Sabor intenso y picor medio.' },
  { level: 'Muy Picante (Thai Style) 🌶️🌶️🌶️', description: '¡Solo para valientes! El verdadero nivel de picor de las calles de Bangkok.' }
];

export function CustomizeModal({ isOpen, onClose, dish, onConfirm }: CustomizeModalProps) {
  const { t } = useTranslation();
  const [selectedSpice, setSelectedSpice] = useState<string>(SPICE_LEVELS[1].level);
  const [specialNotes, setSpecialNotes] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      setSelectedSpice(SPICE_LEVELS[1].level);
      setSpecialNotes('');
    }
  }, [isOpen, dish]);

  if (!isOpen || !dish) return null;

  const handleConfirm = () => {
    onConfirm(dish, selectedSpice, specialNotes);
    onClose();
  };

  return (
    <div 
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.85)',
        zIndex: 200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem'
      }}
    >
      <div 
        className="modal-content glass"
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '460px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--bg-card)',
          borderRadius: 'var(--radius-lg)',
          border: '1px solid rgba(210, 125, 45, 0.15)',
          boxShadow: 'var(--shadow-lg)',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(212,175,55,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(28, 23, 18, 0.95)' }}>
          <h2 style={{ fontSize: '1.4rem', margin: 0, color: 'white' }}>{t('ui.customize', 'Personalizar Plato')}</h2>
          <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', transition: 'var(--transition)' }} onMouseOver={e => e.currentTarget.style.color = 'white'} onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'}>
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div style={{ padding: '1.5rem', overflowY: 'auto', flexGrow: 1, background: 'rgba(10, 11, 13, 0.9)' }}>
          
          {/* Dish Overview */}
          <div style={{ display: 'flex', gap: '1.25rem', marginBottom: '1.75rem', padding: '1rem', background: 'rgba(210, 125, 45, 0.03)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(210, 125, 45, 0.08)' }}>
            <img src={dish.image} alt={dish.name} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '12px' }} />
            <div>
              <h3 style={{ margin: '0 0 0.25rem 0', fontSize: '1.2rem', color: 'white' }}>{dish.name}</h3>
              <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.3 }}>{t(`catalog.${dish.id}.desc`, { defaultValue: dish.description })}</p>
            </div>
          </div>

          {/* Spice Selection */}
          <h3 style={{ fontSize: '1.05rem', marginBottom: '0.75rem', color: 'var(--primary)', fontWeight: 700, letterSpacing: '0.03em' }}>NIVEL DE PICANTE:</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.75rem' }}>
            {SPICE_LEVELS.map(spice => {
              const isSelected = selectedSpice === spice.level;
              return (
                <label 
                  key={spice.level}
                  onClick={() => setSelectedSpice(spice.level)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '0.75rem 1rem',
                    background: isSelected ? 'rgba(210, 125, 45, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                    border: `1px solid ${isSelected ? 'var(--primary)' : 'rgba(255, 255, 255, 0.05)'}`,
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    transition: 'var(--transition)'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      border: `2px solid ${isSelected ? 'var(--primary)' : 'rgba(255, 255, 255, 0.2)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'transparent'
                    }}>
                      {isSelected && <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--primary)' }} />}
                    </div>
                    <span style={{ color: 'white', fontWeight: isSelected ? 700 : 500, fontSize: '0.925rem' }}>{spice.level}</span>
                  </div>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginLeft: '1.75rem', marginTop: '0.25rem', lineHeight: 1.2 }}>
                    {spice.description}
                  </span>
                </label>
              )
            })}
          </div>

          {/* Kitchen Notes */}
          <h3 style={{ fontSize: '1.05rem', marginBottom: '0.5rem', color: 'var(--primary)', fontWeight: 700, letterSpacing: '0.03em' }}>NOTAS PARA LA COCINA:</h3>
          <textarea
            value={specialNotes}
            onChange={(e) => setSpecialNotes(e.target.value)}
            placeholder="Ej: Sin cebolla, sin maní, extra kuratu, etc."
            style={{
              width: '100%',
              height: '80px',
              padding: '0.75rem',
              borderRadius: 'var(--radius-md)',
              background: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              color: 'white',
              fontFamily: 'inherit',
              fontSize: '0.9rem',
              outline: 'none',
              resize: 'none',
              transition: 'var(--transition)'
            }}
            onFocus={e => e.currentTarget.style.borderColor = 'var(--primary)'}
            onBlur={e => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)'}
          />

        </div>

        {/* Footer */}
        <div style={{ padding: '1.5rem', borderTop: '1px solid rgba(210, 125, 45, 0.15)', background: 'rgba(28, 23, 18, 0.95)' }}>
          <button 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '1rem', fontSize: '1.05rem', fontWeight: 800, display: 'flex', justifyContent: 'center' }}
            onClick={handleConfirm}
          >
            {t('ui.confirm', 'Confirmar y Agregar')}
          </button>
        </div>
      </div>
    </div>
  );
}
