import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export interface DishItem {
  id: string;
  name: string;
  description: string;
  price: number;
  variants?: { id: string; name: string; price: number }[];
  image: string;
  isGlutenFree?: boolean;
  spicyLevel?: 0 | 1 | 2; // 0 = non spicy, 1 = mildly spicy, 2 = spicy
  isRecommended?: boolean;
}

interface DishCardProps {
  dish: DishItem;
  onAdd: (dish: DishItem, selectedVariantId?: string) => void;
  isAdmin?: boolean;
  onEdit?: (dish: DishItem) => void;
}

export function DishCard({ dish, onAdd, isAdmin, onEdit }: DishCardProps) {
  const { t } = useTranslation();
  // If the dish has protein or size variants, track the currently selected index
  const [selectedVariantIdx, setSelectedVariantIdx] = useState<number>(0);

  const hasVariants = dish.variants && dish.variants.length > 0;
  const currentPrice = hasVariants ? dish.variants![selectedVariantIdx].price : dish.price;
  const currentVariantId = hasVariants ? dish.variants![selectedVariantIdx].id : undefined;

  // Determine if it is a drink to apply 'contain' fit style
  const isBeverage = dish.id.includes('coca_cola') || 
                     dish.id.includes('tonica') || 
                     dish.id.includes('tea') || 
                     dish.id.includes('lassi') || 
                     dish.id.includes('dasani') || 
                     dish.id.includes('beer') || 
                     dish.id.includes('wine') || 
                     dish.id.includes('cocktail');

  return (
    <div 
      className="dish-card glass"
      style={{
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        background: `linear-gradient(rgba(28, 23, 18, 0.60), rgba(15, 12, 10, 0.80)), url('/mandala_bg.jpg') center/250px repeat`,
        border: '1px solid rgba(210, 125, 45, 0.15)',
        boxShadow: 'inset 0 0 20px rgba(0,0,0,0.5)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        transition: 'var(--transition)'
      }}
    >
      {/* Product Image */}
      <div style={{ position: 'relative', width: '100%', paddingTop: '70%', overflow: 'hidden', background: 'rgba(0, 0, 0, 0.2)' }}>
        <img 
          src={dish.image} 
          alt={dish.name}
          className="dish-img-real"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: isBeverage ? 'contain' : 'cover',
            padding: isBeverage ? '0.75rem' : '0'
          }}
        />

        {/* Floating Admin Edit Button */}
        {isAdmin && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.(dish);
            }}
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: 'rgba(210, 125, 45, 0.95)',
              color: '#0a0b0d',
              border: 'none',
              borderRadius: '50px',
              padding: '0.45rem 0.85rem',
              fontSize: '0.75rem',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              zIndex: 20,
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.background = '#ffffff';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.background = 'rgba(210, 125, 45, 0.95)';
            }}
          >
            <span>✏️</span> {t('ui.edit', 'Editar')}
          </button>
        )}
      </div>

      {/* Card Info Content */}
      <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
        {/* Badges under the photo, above the title */}
        {(dish.isRecommended || dish.isGlutenFree || (dish.spicyLevel !== undefined && dish.spicyLevel > 0)) && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.65rem' }}>
            {dish.isRecommended && (
              <span className="badge-recommended" style={{ position: 'static' }}>⭐ {t('ui.recommended')}</span>
            )}
            {dish.isGlutenFree && (
              <span className="badge-gluten-free" style={{ position: 'static' }}>🌾 {t('ui.glutenFree')}</span>
            )}
            {dish.spicyLevel !== undefined && dish.spicyLevel > 0 && (
              <span className="badge-spicy" style={{ position: 'static' }}>
                🌶️ {dish.spicyLevel === 2 ? 'Picante' : 'Levemente Picante'}
              </span>
            )}
          </div>
        )}

        <h3 style={{ fontSize: '1.3rem', marginBottom: '0.5rem', fontWeight: 700, color: 'white' }}>{dish.name}</h3>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', flexGrow: 1, lineHeight: 1.4 }}>
          {t(`catalog.${dish.id}.desc`, { defaultValue: dish.description })}
        </p>

        {/* Variants Selector */}
        {hasVariants && (
          <div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--primary)', letterSpacing: '0.05em' }}>
              SELECCIONAR PROTEÍNA / TAMAÑO:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.4rem' }}>
              {dish.variants!.map((variant, idx) => {
                const isSelected = selectedVariantIdx === idx;
                return (
                  <button
                    key={variant.id}
                    onClick={() => setSelectedVariantIdx(idx)}
                    style={{
                      background: isSelected ? 'var(--primary)' : 'rgba(255, 255, 255, 0.03)',
                      color: isSelected ? '#0a0b0d' : 'white',
                      border: `1px solid ${isSelected ? 'var(--primary)' : 'rgba(255, 255, 255, 0.08)'}`,
                      padding: '0.45rem 0.5rem',
                      borderRadius: '8px',
                      fontSize: '0.825rem',
                      fontWeight: isSelected ? 700 : 500,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      textAlign: 'center'
                    }}
                  >
                    {t(`variants.${variant.id}`, { defaultValue: variant.name })}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Price & Action Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: '0.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {hasVariants && (
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>Precio seleccionado</span>
            )}
            <span style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary)' }}>
              {currentPrice.toLocaleString('es-PY')} Gs.
            </span>
          </div>
          
          <button 
            className="btn btn-primary"
            style={{ padding: '0.55rem 1.15rem', fontSize: '0.9rem', fontWeight: 700 }}
            onClick={() => onAdd(dish, currentVariantId)}
          >
            {t('ui.addToCart')}
          </button>
        </div>
      </div>
    </div>
  );
}
