import { Menu } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

interface HeaderProps {
  isAdmin: boolean;
  adminUsername: string;
  onLoginClick: () => void;
  onLogoutClick: () => void;
  onEditCredentialsClick: () => void;
  onUploadPromoImage: (file: File) => void;
  promoImage: string;
  promoPrice: number;
  onUpdatePromoPrice: (price: number) => void;
  onDeletePromoImage: () => void;
  promoName: string;
  promoDesc: string;
  onUpdatePromoName: (name: string) => void;
  onUpdatePromoDesc: (desc: string) => void;
}

const LANGUAGES = [
  { code: 'es', name: 'Español', flagUrl: 'https://flagcdn.com/w20/es.png' },
  { code: 'en', name: 'English', flagUrl: 'https://flagcdn.com/w20/us.png' },
  { code: 'fr', name: 'Français', flagUrl: 'https://flagcdn.com/w20/fr.png' },
  { code: 'pt', name: 'Português', flagUrl: 'https://flagcdn.com/w20/br.png' },
  { code: 'de', name: 'Deutsch', flagUrl: 'https://flagcdn.com/w20/de.png' }
];

// Reusable styled accordion row button
function AccordionRow({
  emoji,
  label,
  sublabel,
  isOpen,
  onClick,
  isHighlighted = false
}: {
  emoji: string;
  label: string;
  sublabel?: string;
  isOpen: boolean;
  onClick: () => void;
  isHighlighted?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        padding: '0.85rem 1rem',
        background: isOpen
          ? 'rgba(210, 125, 45, 0.12)'
          : 'rgba(255, 255, 255, 0.03)',
        border: isOpen
          ? '1px solid rgba(210, 125, 45, 0.35)'
          : '1px solid rgba(255, 255, 255, 0.06)',
        borderRadius: isOpen ? '10px 10px 0 0' : '10px',
        color: 'white',
        cursor: 'pointer',
        textAlign: 'left',
        transition: 'all 0.2s ease',
        marginBottom: isOpen ? '0' : '0'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <span style={{ fontSize: '1.1rem' }}>{emoji}</span>
        <div>
          <div style={{
            fontWeight: 700,
            fontSize: '0.9rem',
            color: isHighlighted ? 'var(--primary)' : 'white'
          }}>
            {label}
          </div>
          {sublabel && (
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '1px' }}>
              {sublabel}
            </div>
          )}
        </div>
      </div>
      {/* Chevron arrow */}
      <svg
        viewBox="0 0 24 24"
        width="14"
        height="14"
        stroke="var(--primary)"
        strokeWidth="2.5"
        fill="none"
        style={{
          transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
          transition: 'transform 0.25s ease',
          flexShrink: 0
        }}
      >
        <polyline points="6 9 12 15 18 9" />
      </svg>
    </button>
  );
}

export function Header({
  isAdmin,
  adminUsername,
  onLoginClick,
  onLogoutClick,
  onEditCredentialsClick,
  onUploadPromoImage,
  promoImage,
  promoPrice,
  onUpdatePromoPrice,
  onDeletePromoImage,
  promoName,
  promoDesc,
  onUpdatePromoName,
  onUpdatePromoDesc
}: HeaderProps) {
  const { i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openSection, setOpenSection] = useState<null | 'auth' | 'lang' | 'promo'>(null);

  const toggleSection = (section: 'auth' | 'lang' | 'promo') => {
    setOpenSection(prev => (prev === section ? null : section));
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setOpenSection(null);
    setIsMenuOpen(false);
  };

  const currentLang = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0];

  const inputStyle: React.CSSProperties = {
    background: 'rgba(0,0,0,0.4)',
    border: '1px solid rgba(210,125,45,0.2)',
    borderRadius: '8px',
    padding: '0.5rem 0.75rem',
    color: 'white',
    fontSize: '0.85rem',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s'
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(10, 11, 13, 0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(210, 125, 45, 0.1)',
        padding: '1rem 0',
        transition: 'var(--transition)'
      }}
    >
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: '100px', gap: '1rem', width: '100%' }}>

        {/* Left: Menu Toggle Button */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
          <button
            onClick={() => {
              setIsMenuOpen(prev => !prev);
              setOpenSection(null);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.65rem',
              padding: '0.65rem 1.2rem',
              borderRadius: '50px',
              background: isMenuOpen ? 'var(--primary)' : 'rgba(28, 23, 18, 0.6)',
              border: isMenuOpen ? '1px solid var(--primary)' : '1px solid rgba(210, 125, 45, 0.25)',
              color: isMenuOpen ? '#0a0b0d' : 'white',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.9rem',
              transition: 'all 0.3s ease',
              boxShadow: isMenuOpen ? '0 4px 15px rgba(210, 125, 45, 0.25)' : 'none'
            }}
          >
            <Menu size={18} />
            <span>Menú</span>
          </button>
        </div>

        {/* Center: Logo */}
        <div style={{ flex: '0 0 auto', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <svg width="240" height="90" viewBox="0 0 360 170" style={{ pointerEvents: 'none' }}>
            <defs>
              <filter id="remove-black" colorInterpolationFilters="sRGB">
                <feColorMatrix type="matrix" values="
                  1 0 0 0 0
                  0 1 0 0 0
                  0 0 1 0 0
                  0.33 0.33 0.33 0 0
                " />
              </filter>
            </defs>
            <image
              href={`${import.meta.env.BASE_URL}logo.png`}
              width="100%"
              height="100%"
              preserveAspectRatio="xMidYMid meet"
              filter="url(#remove-black)"
            />
          </svg>
        </div>

        {/* Right: Spacer */}
        <div style={{ flex: 1 }} />

      </div>

      {/* ── SLIDE-DOWN ACCORDION PANEL ── */}
      <div
        style={{
          overflow: 'hidden',
          maxHeight: isMenuOpen ? '700px' : '0px',
          opacity: isMenuOpen ? 1 : 0,
          transform: isMenuOpen ? 'translateY(0)' : 'translateY(-10px)',
          transition: 'max-height 0.4s cubic-bezier(0.16,1,0.3,1), opacity 0.3s, transform 0.3s',
          background: 'rgba(10, 11, 13, 0.97)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: isMenuOpen ? '1px solid rgba(210, 125, 45, 0.12)' : 'none',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)'
        }}
      >
        <div style={{ maxWidth: '420px', margin: '0 auto', padding: '1.25rem 1rem 1.5rem' }}>

          {/* ── SECTION 1: Login / Admin ── */}
          <div style={{ marginBottom: '0.5rem' }}>
            <AccordionRow
              emoji={isAdmin ? '🟢' : '🔒'}
              label={isAdmin ? `Admin: ${adminUsername}` : 'Iniciar Sesión'}
              sublabel={isAdmin ? 'Sesión de administrador activa' : 'Accede para gestionar el restaurante'}
              isOpen={openSection === 'auth'}
              onClick={() => toggleSection('auth')}
              isHighlighted={isAdmin}
            />
            {/* Auth expandable content */}
            <div style={{
              overflow: 'hidden',
              maxHeight: openSection === 'auth' ? '300px' : '0px',
              transition: 'max-height 0.35s cubic-bezier(0.16,1,0.3,1)',
              background: 'rgba(210, 125, 45, 0.04)',
              border: openSection === 'auth' ? '1px solid rgba(210, 125, 45, 0.2)' : 'none',
              borderTop: 'none',
              borderRadius: '0 0 10px 10px'
            }}>
              <div style={{ padding: '1rem' }}>
                {isAdmin ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    <button
                      onClick={() => { onEditCredentialsClick(); setIsMenuOpen(false); }}
                      style={{ padding: '0.7rem 1rem', background: 'rgba(255,255,255,0.06)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'background 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.14)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                    >
                      ⚙️ Editar Credenciales
                    </button>
                    <button
                      onClick={() => { onLogoutClick(); setIsMenuOpen(false); }}
                      style={{ padding: '0.7rem 1rem', background: 'rgba(255,77,77,0.1)', color: '#ff6b6b', border: '1px solid rgba(255,77,77,0.25)', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'background 0.2s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,77,77,0.22)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,77,77,0.1)'}
                    >
                      🚪 Cerrar Sesión
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => { onLoginClick(); setIsMenuOpen(false); }}
                    style={{ width: '100%', padding: '0.8rem', background: 'var(--primary)', color: '#0a0b0d', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 800, fontSize: '0.9rem', transition: 'background 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--primary-hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'var(--primary)'}
                  >
                    🔑 Iniciar Sesión como Administrador
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* ── SECTION 2: Language ── */}
          <div style={{ marginBottom: '0.5rem' }}>
            <AccordionRow
              emoji="🌐"
              label="Idioma"
              sublabel={`Actual: ${currentLang.name}`}
              isOpen={openSection === 'lang'}
              onClick={() => toggleSection('lang')}
            />
            <div style={{
              overflow: 'hidden',
              maxHeight: openSection === 'lang' ? '250px' : '0px',
              transition: 'max-height 0.35s cubic-bezier(0.16,1,0.3,1)',
              background: 'rgba(255, 255, 255, 0.02)',
              border: openSection === 'lang' ? '1px solid rgba(255,255,255,0.07)' : 'none',
              borderTop: 'none',
              borderRadius: '0 0 10px 10px'
            }}>
              <div style={{ padding: '0.75rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
                {LANGUAGES.map(lang => {
                  const isActive = i18n.language === lang.code;
                  return (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        padding: '0.6rem 0.75rem',
                        background: isActive ? 'var(--primary)' : 'rgba(255,255,255,0.04)',
                        color: isActive ? '#0a0b0d' : 'white',
                        border: isActive ? '1px solid var(--primary)' : '1px solid rgba(255,255,255,0.07)',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: isActive ? 700 : 500,
                        fontSize: '0.85rem',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; }}
                      onMouseLeave={e => { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                    >
                      <img src={lang.flagUrl} alt={lang.name} style={{ width: '18px', borderRadius: '2px' }} />
                      {lang.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* ── SECTION 3: Promo (Admin only) ── */}
          {isAdmin && (
            <div style={{ marginBottom: '0.5rem' }}>
              <AccordionRow
                emoji="📣"
                label="Editar Promoción"
                sublabel={promoImage ? 'Imagen cargada · Configurar nombre, precio...' : 'Sin imagen · Subir un flyer promocional'}
                isOpen={openSection === 'promo'}
                onClick={() => toggleSection('promo')}
              />
              <div style={{
                overflow: 'hidden',
                maxHeight: openSection === 'promo' ? '500px' : '0px',
                transition: 'max-height 0.4s cubic-bezier(0.16,1,0.3,1)',
                background: 'rgba(255, 255, 255, 0.02)',
                border: openSection === 'promo' ? '1px solid rgba(255,255,255,0.07)' : 'none',
                borderTop: 'none',
                borderRadius: '0 0 10px 10px'
              }}>
                <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>

                  {/* Upload Image */}
                  <label style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                    background: 'rgba(210, 125, 45, 0.08)', border: '1px dashed var(--primary)',
                    borderRadius: '8px', padding: '0.65rem', cursor: 'pointer', color: 'var(--primary)',
                    fontWeight: 700, fontSize: '0.82rem', transition: 'all 0.2s', textAlign: 'center'
                  }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'rgba(210,125,45,0.18)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'rgba(210,125,45,0.08)'; }}
                  >
                    📷 Cargar imagen de promoción
                    <input type="file" accept="image/*" onChange={e => {
                      if (e.target.files?.[0]) onUploadPromoImage(e.target.files[0]);
                    }} style={{ display: 'none' }} />
                  </label>

                  {/* Name */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>Nombre del plato/promo</label>
                    <input
                      type="text"
                      value={promoName}
                      onChange={e => onUpdatePromoName(e.target.value)}
                      placeholder="Ej. ¡Promoción Especial!"
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                      onBlur={e => e.target.style.borderColor = 'rgba(210,125,45,0.2)'}
                    />
                  </div>

                  {/* Description */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>Descripción</label>
                    <input
                      type="text"
                      value={promoDesc}
                      onChange={e => onUpdatePromoDesc(e.target.value)}
                      placeholder="Ej. Plato exclusivo de temporada..."
                      style={inputStyle}
                      onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                      onBlur={e => e.target.style.borderColor = 'rgba(210,125,45,0.2)'}
                    />
                  </div>

                  {/* Price + Miniature row */}
                  <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end' }}>
                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <label style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600 }}>Precio (Gs.)</label>
                      <input
                        type="number"
                        value={promoPrice || ''}
                        onChange={e => onUpdatePromoPrice(Number(e.target.value))}
                        placeholder="Ej. 75000"
                        style={{ ...inputStyle, fontWeight: 700 }}
                        onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                        onBlur={e => e.target.style.borderColor = 'rgba(210,125,45,0.2)'}
                      />
                    </div>
                    {promoImage && (
                      <div style={{ position: 'relative', width: '48px', height: '48px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', overflow: 'visible', flexShrink: 0 }}>
                        <img src={promoImage} alt="Promo" style={{ width: '100%', height: '100%', borderRadius: '7px', objectFit: 'cover' }} />
                        <button
                          onClick={onDeletePromoImage}
                          title="Eliminar imagen"
                          style={{
                            position: 'absolute', top: '-7px', right: '-7px',
                            width: '18px', height: '18px', borderRadius: '50%',
                            background: '#ff4d4d', border: 'none', color: 'white',
                            fontSize: '9px', fontWeight: 'bold', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 2px 5px rgba(0,0,0,0.4)', transition: '0.15s'
                          }}
                          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.25)'}
                          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                        >
                          ✕
                        </button>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </header>
  );
}
