import { X, Trash2, ShoppingBag, MapPin, Clock, MessageSquare } from 'lucide-react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  spice?: string;
  notes?: string;
}

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onRemove: (itemId: string, spice?: string, notes?: string) => void;
  onClear: () => void;
  onUpdateQuantity: (itemId: string, quantity: number, spice?: string, notes?: string) => void;
}

import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export function CartModal({ 
  isOpen, 
  onClose, 
  items, 
  onRemove, 
  onClear, 
  onUpdateQuantity 
}: CartModalProps) {
  const { t } = useTranslation();
  const [customerName, setCustomerName] = useState('');
  const [deliveryType, setDeliveryType] = useState<'delivery' | 'takeaway'>('delivery');
  const [address, setAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'efectivo' | 'transferencia' | 'tarjeta'>('efectivo');
  const [paymentNote, setPaymentNote] = useState('');

  if (!isOpen) return null;

  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = deliveryType === 'delivery' ? 12000 : 0;
  const total = subtotal + deliveryFee;

  const handleSendOrder = () => {
    if (!customerName.trim()) {
      alert('Por favor, ingrese su nombre para realizar el pedido.');
      return;
    }
    if (deliveryType === 'delivery' && !address.trim()) {
      alert('Por favor, ingrese su dirección de entrega.');
      return;
    }

    // Generate WhatsApp Message
    const restaurantPhone = '595981874120'; // Test number
    let message = `🐘 *SAWASDEE | NUEVO PEDIDO* 🪷\n\n`;
    message += `👤 *Cliente:* ${customerName}\n`;
    message += `🛵 *Tipo:* ${deliveryType === 'delivery' ? 'Delivery' : 'Retiro del Local (Take Away)'}\n`;
    
    if (deliveryType === 'delivery') {
      message += `📍 *Dirección:* ${address}\n`;
    }
    
    message += `💳 *Pago:* ${
      paymentMethod === 'efectivo' 
        ? 'Efectivo' 
        : paymentMethod === 'transferencia' 
        ? 'Transferencia Bancaria' 
        : 'Tarjeta de Crédito/Débito'
    }\n`;

    if (paymentNote) {
      message += `💵 *Detalle de Pago:* ${paymentNote}\n`;
    }

    message += `\n----------------------------------\n`;
    message += `🛒 *DETALLE DE PLATOS:*\n\n`;

    items.forEach((item, index) => {
      message += `${index + 1}. *${item.name}* x${item.quantity}\n`;
      message += `   💰 Precio: ${(item.price * item.quantity).toLocaleString('es-PY')} Gs.\n`;
      
      if (item.spice) {
        message += `   🔥 Picante: ${item.spice}\n`;
      }
      if (item.notes) {
        message += `   📝 Notas: _"${item.notes}"_\n`;
      }
      message += `\n`;
    });

    message += `----------------------------------\n`;
    message += `🍽️ *Subtotal:* ${subtotal.toLocaleString('es-PY')} Gs.\n`;
    if (deliveryFee > 0) {
      message += `🛵 *Delivery:* ${deliveryFee.toLocaleString('es-PY')} Gs.\n`;
    }
    message += `💵 *TOTAL A PAGAR:* *${total.toLocaleString('es-PY')} Gs.*\n\n`;
    message += `🙏 *¡Muchas gracias por su preferencia!*`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${restaurantPhone}&text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div 
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0,0,0,0.85)',
        backdropFilter: 'blur(8px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        transition: 'var(--transition)'
      }}
    >
      <div 
        className="glass"
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '520px',
          height: '100%',
          background: 'rgba(15, 16, 20, 0.95)',
          borderLeft: '1px solid rgba(210, 125, 45, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        {/* Header */}
        <div 
          style={{
            padding: '1.5rem',
            borderBottom: '1px solid rgba(212,175,55,0.08)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'rgba(28, 23, 18, 0.98)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <ShoppingBag style={{ color: 'var(--primary)' }} />
            <h2 style={{ fontSize: '1.4rem', margin: 0, color: 'white', fontWeight: 800 }}>{t('ui.cartTitle', 'Mi Pedido')}</h2>
          </div>
          <button 
            onClick={onClose} 
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-muted)',
              cursor: 'pointer',
              transition: 'var(--transition)'
            }}
            onMouseOver={e => e.currentTarget.style.color = 'white'}
            onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            <X size={26} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div style={{ padding: '1.5rem', overflowY: 'auto', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '4rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
              <span style={{ fontSize: '4rem' }}>🐘</span>
              <h3 style={{ color: 'white', margin: 0 }}>{t('ui.cartEmpty', 'El carrito está vacío')}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '300px' }}>
              </p>
              <button 
                onClick={onClose} 
                className="btn btn-primary" 
                style={{ marginTop: '1rem', padding: '0.65rem 1.5rem' }}
              >
                Ver el Menú
              </button>
            </div>
          ) : (
            <>
              {/* Order Items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>PLATOS SELECCIONADOS</span>
                  <button 
                    onClick={onClear}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--accent-red)',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem'
                    }}
                  >
                    <Trash2 size={14} /> Vaciar Carrito
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {items.map(item => (
                    <div 
                      key={`${item.id}-${item.spice}-${item.notes}`}
                      style={{
                        padding: '1rem',
                        background: 'rgba(255,255,255,0.02)',
                        border: '1px solid rgba(255,255,255,0.05)',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        gap: '1rem'
                      }}
                    >
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        style={{ width: '65px', height: '65px', objectFit: 'cover', borderRadius: '8px', background: 'rgba(0,0,0,0.1)' }} 
                      />
                      
                      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <h4 style={{ color: 'white', margin: 0, fontSize: '0.95rem', fontWeight: 700, paddingRight: '0.5rem' }}>
                            {item.name}
                          </h4>
                          <span style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '0.95rem', whiteSpace: 'nowrap' }}>
                            {(item.price * item.quantity).toLocaleString('es-PY')} Gs.
                          </span>
                        </div>

                        {/* Spice & Notes badges */}
                        {(item.spice || item.notes) && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.4rem' }}>
                            {item.spice && (
                              <span style={{
                                fontSize: '0.725rem',
                                color: '#f28482',
                                background: 'rgba(158, 42, 43, 0.12)',
                                border: '1px solid rgba(158, 42, 43, 0.25)',
                                padding: '0.15rem 0.4rem',
                                borderRadius: '4px',
                                display: 'inline-flex',
                                alignItems: 'center'
                              }}>
                                🔥 {item.spice}
                              </span>
                            )}
                            {item.notes && (
                              <span style={{
                                fontSize: '0.725rem',
                                color: 'var(--text-muted)',
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                padding: '0.15rem 0.4rem',
                                borderRadius: '4px',
                                maxWidth: '220px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap'
                              }}>
                                📝: "{item.notes}"
                              </span>
                            )}
                          </div>
                        )}

                        {/* Quantity selector & Delete */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.75rem' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.05)', padding: '2px' }}>
                            <button 
                              onClick={() => item.quantity > 1 ? onUpdateQuantity(item.id, item.quantity - 1, item.spice, item.notes) : onRemove(item.id, item.spice, item.notes)}
                              style={{ width: '24px', height: '24px', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 'bold' }}
                            >
                              -
                            </button>
                            <span style={{ color: 'white', fontSize: '0.85rem', fontWeight: 700, minWidth: '18px', textAlign: 'center' }}>
                              {item.quantity}
                            </span>
                            <button 
                              onClick={() => onUpdateQuantity(item.id, item.quantity + 1, item.spice, item.notes)}
                              style={{ width: '24px', height: '24px', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', fontWeight: 'bold' }}
                            >
                              +
                            </button>
                          </div>

                          <button 
                            onClick={() => onRemove(item.id, item.spice, item.notes)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: 'var(--text-muted)',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              transition: 'color 0.2s'
                            }}
                            onMouseOver={e => e.currentTarget.style.color = 'var(--accent-red)'}
                            onMouseOut={e => e.currentTarget.style.color = 'var(--text-muted)'}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Data Section */}
              <div 
                style={{ 
                  padding: '1.25rem', 
                  background: 'rgba(210, 125, 45, 0.03)', 
                  border: '1px solid rgba(210, 125, 45, 0.1)', 
                  borderRadius: 'var(--radius-lg)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem'
                }}
              >
                <h3 style={{ fontSize: '1rem', margin: 0, color: 'var(--primary)', fontWeight: 800, letterSpacing: '0.05em' }}>
                  DATOS DE ENTREGA Y PAGO
                </h3>
                
                {/* Name */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'white' }}>Nombre del Cliente: *</label>
                  <input 
                    type="text" 
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    placeholder="Ej: Marcelo Benítez"
                    style={{
                      padding: '0.75rem',
                      borderRadius: '8px',
                      background: 'rgba(0,0,0,0.3)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: 'white',
                      fontFamily: 'inherit',
                      outline: 'none'
                    }}
                  />
                </div>

                {/* Delivery Type */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'white' }}>Tipo de Entrega:</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    <button
                      onClick={() => setDeliveryType('delivery')}
                      style={{
                        background: deliveryType === 'delivery' ? 'var(--primary)' : 'rgba(0,0,0,0.3)',
                        color: deliveryType === 'delivery' ? '#0a0b0d' : 'white',
                        border: `1px solid ${deliveryType === 'delivery' ? 'var(--primary)' : 'rgba(255,255,255,0.08)'}`,
                        padding: '0.6rem 0.5rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.4rem',
                        transition: 'all 0.2s'
                      }}
                    >
                      <MapPin size={15} /> Delivery
                    </button>
                    <button
                      onClick={() => setDeliveryType('takeaway')}
                      style={{
                        background: deliveryType === 'takeaway' ? 'var(--primary)' : 'rgba(0,0,0,0.3)',
                        color: deliveryType === 'takeaway' ? '#0a0b0d' : 'white',
                        border: `1px solid ${deliveryType === 'takeaway' ? 'var(--primary)' : 'rgba(255,255,255,0.08)'}`,
                        padding: '0.6rem 0.5rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.4rem',
                        transition: 'all 0.2s'
                      }}
                    >
                      <Clock size={15} /> Retiro del Local
                    </button>
                  </div>
                </div>

                {/* Address (only for Delivery) */}
                {deliveryType === 'delivery' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'white' }}>Dirección de Envío: *</label>
                    <input 
                      type="text" 
                      value={address}
                      onChange={e => setAddress(e.target.value)}
                      placeholder="Ej: Lillo esq. Dr. Morra, Edif. Royal Plaza Apto 4B"
                      style={{
                        padding: '0.75rem',
                        borderRadius: '8px',
                        background: 'rgba(0,0,0,0.3)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        color: 'white',
                        fontFamily: 'inherit',
                        outline: 'none'
                      }}
                    />
                  </div>
                )}

                {/* Payment Method */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'white' }}>Método de Pago:</label>
                  <select
                    value={paymentMethod}
                    onChange={e => setPaymentMethod(e.target.value as any)}
                    style={{
                      padding: '0.75rem',
                      borderRadius: '8px',
                      background: 'rgba(15, 16, 20, 0.95)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      color: 'white',
                      fontFamily: 'inherit',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="efectivo">Efectivo al recibir/retirar</option>
                    <option value="transferencia">Transferencia Bancaria (Anticipado)</option>
                    <option value="tarjeta">POS / Tarjeta al recibir</option>
                  </select>
                </div>

                {/* Cash change / Transfer details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'white' }}>
                    {paymentMethod === 'efectivo' 
                      ? '¿Necesita vuelto? (Indique con cuánto pagará):' 
                      : paymentMethod === 'transferencia'
                      ? 'Le enviaremos los datos bancarios al confirmar.'
                      : 'Llevaremos el lector POS inalámbrico.'}
                  </label>
                  {paymentMethod === 'efectivo' && (
                    <input 
                      type="text" 
                      value={paymentNote}
                      onChange={e => setPaymentNote(e.target.value)}
                      placeholder="Ej: Pago con billete de 100.000 Gs."
                      style={{
                        padding: '0.75rem',
                        borderRadius: '8px',
                        background: 'rgba(0,0,0,0.3)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        color: 'white',
                        fontFamily: 'inherit',
                        outline: 'none'
                      }}
                    />
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Summary & Order button */}
        {items.length > 0 && (
          <div 
            style={{
              padding: '1.5rem',
              borderTop: '1px solid rgba(210, 125, 45, 0.15)',
              background: 'rgba(28, 23, 18, 0.98)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem'
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                <span>Subtotal:</span>
                <span>{subtotal.toLocaleString('es-PY')} Gs.</span>
              </div>
              {deliveryFee > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.95rem' }}>
                  <span>Costo de envío (Delivery):</span>
                  <span>{deliveryFee.toLocaleString('es-PY')} Gs.</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'white', fontSize: '1.25rem', fontWeight: 800, marginTop: '0.25rem' }}>
                <span>{t('ui.total', 'Total')}:</span>
                <span style={{ color: 'var(--primary)' }}>{total.toLocaleString('es-PY')} Gs.</span>
              </div>
            </div>

            <button 
              onClick={handleSendOrder}
              className="btn btn-primary"
              style={{
                width: '100%',
                padding: '1rem',
                fontSize: '1.05rem',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                marginTop: '0.5rem'
              }}
            >
              <MessageSquare size={20} />
              {t('ui.checkout', 'Pedir por WhatsApp')}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
