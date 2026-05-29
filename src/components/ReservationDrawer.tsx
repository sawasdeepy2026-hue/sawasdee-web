import { useState, useEffect } from 'react';
import { X, Users, Calendar, Clock, ChevronDown, ChevronUp } from 'lucide-react';

interface ReservationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ReservationDrawer({ isOpen, onClose }: ReservationDrawerProps) {
  
  // Steps: 1: Guests, 2: Date, 3: Time
  const [activeStep, setActiveStep] = useState<number>(1);
  
  // State
  const [guests, setGuests] = useState<number>(2);
  const [date, setDate] = useState<Date | null>(new Date());
  const [time, setTime] = useState<string>('');
  
  // Reset when opened
  useEffect(() => {
    if (isOpen) {
      setActiveStep(1);
    }
  }, [isOpen]);

  const guestOptions = [1, 2, 3, 4, 5, 6, '7+'];
  
  // Date helpers
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const formatDateStr = (d: Date) => {
    return d.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' });
  };

  const handleDateSelect = (d: Date) => {
    setDate(d);
    setActiveStep(3);
  };

  const timeSlotsLunch = ['12:00', '12:30', '13:00', '13:30', '14:00'];
  const timeSlotsDinner = ['19:30', '20:00', '20:30', '21:00', '21:30', '22:00'];

  const handleSubmit = () => {
    if (!date || !time) return;
    const formattedDate = date.toLocaleDateString('es-ES');
    const message = `🐘 *Reserva de Mesa - Sawasdee*\n\n` +
      `👥 Personas: ${guests}\n` +
      `📅 Fecha: ${formattedDate}\n` +
      `⏰ Hora: ${time}\n\n` +
      `Por favor confirmar la disponibilidad. ¡Gracias!`;
    
    const phoneNumber = "595981874120"; // Test number
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
    onClose();
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          onClick={onClose}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(5px)',
            zIndex: 999
          }}
        />
      )}

      {/* Drawer */}
      <div 
        style={{
          position: 'fixed',
          top: 0,
          right: isOpen ? 0 : '-100%',
          width: '100%',
          maxWidth: '420px',
          height: '100%',
          background: 'var(--bg-card)',
          borderLeft: '1px solid rgba(210, 125, 45, 0.2)',
          boxShadow: '-10px 0 30px rgba(0,0,0,0.5)',
          zIndex: 1000,
          transition: 'right 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto'
        }}
      >
        {/* Header */}
        <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-main)' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>
              SAWASDEE
            </h2>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Reservar una mesa</p>
          </div>
          <button 
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.5rem' }}
          >
            <X size={24} />
          </button>
        </div>

        <div style={{ padding: '1.5rem', color: 'var(--text-main)', fontSize: '0.9rem', lineHeight: 1.5 }}>
          Las reservas son para el salón principal. Si desea reservar un evento privado, contáctenos directamente.
        </div>

        {/* Step 1: Guests */}
        <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div 
            onClick={() => setActiveStep(1)}
            style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', background: activeStep === 1 ? 'rgba(210, 125, 45, 0.05)' : 'transparent' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Users size={20} color={activeStep === 1 ? 'var(--primary)' : 'var(--text-muted)'} />
              <span style={{ fontWeight: 600, fontSize: '1.1rem', color: activeStep === 1 ? 'white' : 'var(--text-main)' }}>
                {guests} {guests === 1 ? 'persona' : 'personas'}
              </span>
            </div>
            {activeStep === 1 ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>
          
          {activeStep === 1 && (
            <div style={{ padding: '0 1.5rem 1.5rem 1.5rem' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {guestOptions.map((opt, idx) => (
                  opt === '7+' ? (
                    <input
                      key={idx}
                      type="number"
                      min="7"
                      placeholder="7+"
                      value={guests >= 7 ? guests : ''}
                      onChange={(e) => {
                        const val = parseInt(e.target.value, 10);
                        if (!isNaN(val)) setGuests(val);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && guests >= 7) {
                          setActiveStep(2);
                        }
                      }}
                      onBlur={() => {
                        if (guests >= 7) setActiveStep(2);
                      }}
                      style={{
                        flex: '1 0 calc(33.333% - 0.5rem)',
                        padding: '1rem 0',
                        background: guests >= 7 ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                        color: guests >= 7 ? '#0a0b0d' : 'white',
                        border: '1px solid',
                        borderColor: guests >= 7 ? 'var(--primary)' : 'rgba(210, 125, 45, 0.2)',
                        borderRadius: '8px',
                        fontWeight: 700,
                        textAlign: 'center',
                        outline: 'none',
                        fontFamily: 'inherit',
                        fontSize: '1rem',
                        transition: 'all 0.2s'
                      }}
                    />
                  ) : (
                    <button
                      key={idx}
                      onClick={() => {
                        setGuests(typeof opt === 'number' ? opt : 7);
                        setActiveStep(2);
                      }}
                      style={{
                        flex: '1 0 calc(33.333% - 0.5rem)',
                        padding: '1rem 0',
                        background: guests === opt ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                        color: guests === opt ? '#0a0b0d' : 'white',
                        border: '1px solid',
                        borderColor: guests === opt ? 'var(--primary)' : 'rgba(210, 125, 45, 0.2)',
                        borderRadius: '8px',
                        fontWeight: 700,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      {opt}
                    </button>
                  )
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Step 2: Date */}
        <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div 
            onClick={() => setActiveStep(2)}
            style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', background: activeStep === 2 ? 'rgba(210, 125, 45, 0.05)' : 'transparent' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Calendar size={20} color={activeStep === 2 ? 'var(--primary)' : 'var(--text-muted)'} />
              <span style={{ fontWeight: 600, fontSize: '1.1rem', color: activeStep === 2 ? 'white' : 'var(--text-main)' }}>
                {date ? formatDateStr(date) : 'Seleccionar fecha'}
              </span>
            </div>
            {activeStep === 2 ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>

          {activeStep === 2 && (
            <div style={{ padding: '0 1.5rem 1.5rem 1.5rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => handleDateSelect(today)}
                  style={{
                    flex: 1,
                    padding: '1rem',
                    background: date?.toDateString() === today.toDateString() ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                    color: date?.toDateString() === today.toDateString() ? '#0a0b0d' : 'white',
                    border: '1px solid',
                    borderColor: date?.toDateString() === today.toDateString() ? 'var(--primary)' : 'rgba(210, 125, 45, 0.2)',
                    borderRadius: '8px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}
                >
                  <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>Hoy</span>
                  <span>{today.getDate()}</span>
                </button>
                <button
                  onClick={() => handleDateSelect(tomorrow)}
                  style={{
                    flex: 1,
                    padding: '1rem',
                    background: date?.toDateString() === tomorrow.toDateString() ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                    color: date?.toDateString() === tomorrow.toDateString() ? '#0a0b0d' : 'white',
                    border: '1px solid',
                    borderColor: date?.toDateString() === tomorrow.toDateString() ? 'var(--primary)' : 'rgba(210, 125, 45, 0.2)',
                    borderRadius: '8px',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}
                >
                  <span style={{ fontSize: '0.8rem', opacity: 0.8 }}>Mañana</span>
                  <span>{tomorrow.getDate()}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Step 3: Time */}
        <div style={{ flex: 1 }}>
          <div 
            onClick={() => setActiveStep(3)}
            style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', background: activeStep === 3 ? 'rgba(210, 125, 45, 0.05)' : 'transparent' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Clock size={20} color={activeStep === 3 ? 'var(--primary)' : 'var(--text-muted)'} />
              <span style={{ fontWeight: 600, fontSize: '1.1rem', color: activeStep === 3 ? 'white' : 'var(--text-main)' }}>
                {time ? time : 'Seleccionar hora'}
              </span>
            </div>
            {activeStep === 3 ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
          </div>

          {activeStep === 3 && (
            <div style={{ padding: '0 1.5rem 1.5rem 1.5rem' }}>
              <div style={{ marginBottom: '1rem' }}>
                <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Almuerzo</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {timeSlotsLunch.map(t => (
                    <button
                      key={t}
                      onClick={() => setTime(t)}
                      style={{
                        padding: '0.75rem 1.25rem',
                        background: time === t ? 'var(--primary)' : 'transparent',
                        color: time === t ? '#0a0b0d' : 'white',
                        border: '1px solid',
                        borderColor: time === t ? 'var(--primary)' : 'rgba(210, 125, 45, 0.3)',
                        borderRadius: '50px',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h4 style={{ margin: '0 0 0.5rem 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>Cena</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {timeSlotsDinner.map(t => (
                    <button
                      key={t}
                      onClick={() => setTime(t)}
                      style={{
                        padding: '0.75rem 1.25rem',
                        background: time === t ? 'var(--primary)' : 'transparent',
                        color: time === t ? '#0a0b0d' : 'white',
                        border: '1px solid',
                        borderColor: time === t ? 'var(--primary)' : 'rgba(210, 125, 45, 0.3)',
                        borderRadius: '50px',
                        fontWeight: 600,
                        cursor: 'pointer'
                      }}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div style={{ padding: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', background: 'var(--bg-main)' }}>
          <button
            onClick={handleSubmit}
            disabled={!date || !time}
            style={{
              width: '100%',
              padding: '1rem',
              background: (!date || !time) ? 'rgba(210, 125, 45, 0.2)' : 'var(--primary)',
              color: (!date || !time) ? 'var(--text-muted)' : '#0a0b0d',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 800,
              fontSize: '1.1rem',
              cursor: (!date || !time) ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s'
            }}
          >
            Reservar
          </button>
        </div>

      </div>
    </>
  );
}
