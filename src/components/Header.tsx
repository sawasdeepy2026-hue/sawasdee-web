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
    background: 'rgba(0,0,0,0.5)',
    border: '1px solid rgba(210,125,45,0.2)',
    borderRadius: '6px',
    padding: '0.38rem 0.6rem',
    color: 'white',
    fontSize: '0.8rem',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s'
  };

  // Shared style for each main accordion row button
  const rowBtnStyle = (active: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: '0.55rem 0.75rem',
    background: active ? 'rgba(210,125,45,0.12)' : 'rgba(255,255,255,0.03)',
    border: active ? '1px solid rgba(210,125,45,0.3)' : '1px solid rgba(255,255,255,0.06)',
    borderRadius: active ? '8px 8px 0 0' : '8px',
    color: 'white',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.2s',
    fontSize: '0.82rem',
    fontWeight: 600,
    marginBottom: 0
  });

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
      }}
    >
      <div
        className="container"
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: '100px', gap: '1rem', width: '100%' }}
      >

        {/* ── LEFT: Menu button + absolutely-positioned floating dropdown ── */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-start', position: 'relative' }}>

          {/* The "Menú" pill button */}
          <button
            onClick={() => { setIsMenuOpen(p => !p); setOpenSection(null); }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.55rem',
              padding: '0.55rem 1.1rem',
              borderRadius: '50px',
              background: isMenuOpen ? 'var(--primary)' : 'rgba(28, 23, 18, 0.65)',
              border: isMenuOpen ? '1px solid var(--primary)' : '1px solid rgba(210, 125, 45, 0.28)',
              color: isMenuOpen ? '#0a0b0d' : 'white',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.88rem',
              transition: 'all 0.25s ease',
              boxShadow: isMenuOpen ? '0 3px 12px rgba(210,125,45,0.3)' : 'none',
              position: 'relative',
              zIndex: 201
            }}
          >
            <Menu size={17} />
            <span>Menú</span>
          </button>

          {/* ── FLOATING PERSIANA dropdown — falls below button, does NOT affect layout ── */}
          <div
            style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              left: 0,
              width: '220px',
              maxHeight: isMenuOpen ? '700px' : '0px',
              opacity: isMenuOpen ? 1 : 0,
              overflow: 'hidden',
              pointerEvents: isMenuOpen ? 'auto' : 'none',
              transition: 'max-height 0.45s cubic-bezier(0.16,1,0.3,1), opacity 0.25s ease',
              background: 'rgba(10, 11, 13, 0.98)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(210, 125, 45, 0.18)',
              borderRadius: '12px',
              boxShadow: '0 16px 48px rgba(0,0,0,0.65)',
              zIndex: 200
            }}
          >
            <div style={{ padding: '0.5rem' }}>

              {/* ── ROW 1: Auth / Login ── */}
              <div style={{ marginBottom: '3px' }}>
                <button
                  style={rowBtnStyle(openSection === 'auth')}
                  onClick={() => toggleSection('auth')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>{isAdmin ? '🟢' : '🔒'}</span>
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: isAdmin ? '#4ade80' : 'white' }}>
                        {isAdmin ? `Admin: ${adminUsername}` : 'Iniciar Sesión'}
                      </div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                        {isAdmin ? 'Sesión activa' : 'Acceso administrador'}
                      </div>
                    </div>
                  </div>
                  <svg viewBox="0 0 24 24" width="12" height="12" stroke="var(--primary)" strokeWidth="2.5" fill="none"
                    style={{ transform: openSection === 'auth' ? 'rotate(180deg)' : 'none', transition: 'transform 0.22s', flexShrink: 0 }}>
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {/* Auth sub-panel */}
                <div style={{
                  overflow: 'hidden',
                  maxHeight: openSection === 'auth' ? '200px' : '0px',
                  transition: 'max-height 0.35s cubic-bezier(0.16,1,0.3,1)',
                  background: 'rgba(210,125,45,0.04)',
                  border: openSection === 'auth' ? '1px solid rgba(210,125,45,0.15)' : 'none',
                  borderTop: 'none',
                  borderRadius: '0 0 8px 8px',
                  marginBottom: openSection === 'auth' ? '3px' : '0'
                }}>
                  <div style={{ padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {isAdmin ? (
                      <>
                        <button
                          onClick={() => { onEditCredentialsClick(); setIsMenuOpen(false); }}
                          style={{ padding: '0.5rem 0.7rem', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.4rem', transition: 'background 0.2s', textAlign: 'left' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                        >
                          ⚙️ Editar Credenciales
                        </button>
                        <button
                          onClick={() => { onLogoutClick(); setIsMenuOpen(false); }}
                          style={{ padding: '0.5rem 0.7rem', background: 'rgba(255,77,77,0.08)', color: '#ff7070', border: '1px solid rgba(255,77,77,0.2)', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.4rem', transition: 'background 0.2s', textAlign: 'left' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,77,77,0.2)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,77,77,0.08)'}
                        >
                          🚪 Cerrar Sesión
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => { onLoginClick(); setIsMenuOpen(false); }}
                        style={{ width: '100%', padding: '0.6rem', background: 'var(--primary)', color: '#0a0b0d', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 800, fontSize: '0.8rem', transition: 'background 0.2s' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--primary-hover)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'var(--primary)'}
                      >
                        🔑 Iniciar Sesión
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* ── ROW 2: Language ── */}
              <div style={{ marginBottom: '3px' }}>
                <button
                  style={rowBtnStyle(openSection === 'lang')}
                  onClick={() => toggleSection('lang')}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <img src={currentLang.flagUrl} alt={currentLang.name} style={{ width: '16px', borderRadius: '2px' }} />
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'white' }}>Idioma</div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{currentLang.name}</div>
                    </div>
                  </div>
                  <svg viewBox="0 0 24 24" width="12" height="12" stroke="var(--primary)" strokeWidth="2.5" fill="none"
                    style={{ transform: openSection === 'lang' ? 'rotate(180deg)' : 'none', transition: 'transform 0.22s', flexShrink: 0 }}>
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </button>

                {/* Lang sub-panel */}
                <div style={{
                  overflow: 'hidden',
                  maxHeight: openSection === 'lang' ? '220px' : '0px',
                  transition: 'max-height 0.35s cubic-bezier(0.16,1,0.3,1)',
                  background: 'rgba(255,255,255,0.02)',
                  border: openSection === 'lang' ? '1px solid rgba(255,255,255,0.07)' : 'none',
                  borderTop: 'none',
                  borderRadius: '0 0 8px 8px',
                  marginBottom: openSection === 'lang' ? '3px' : '0'
                }}>
                  <div style={{ padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    {LANGUAGES.map(lang => {
                      const active = i18n.language === lang.code;
                      return (
                        <button
                          key={lang.code}
                          onClick={() => changeLanguage(lang.code)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '0.5rem',
                            padding: '0.45rem 0.65rem',
                            background: active ? 'var(--primary)' : 'rgba(255,255,255,0.03)',
                            color: active ? '#0a0b0d' : 'white',
                            border: active ? '1px solid var(--primary)' : '1px solid rgba(255,255,255,0.06)',
                            borderRadius: '6px', cursor: 'pointer',
                            fontWeight: active ? 700 : 500, fontSize: '0.8rem',
                            transition: 'all 0.2s', textAlign: 'left', width: '100%'
                          }}
                          onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; }}
                          onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                        >
                          <img src={lang.flagUrl} alt={lang.name} style={{ width: '16px', borderRadius: '2px' }} />
                          {lang.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* ── ROW 3: Promo (admin only) ── */}
              {isAdmin && (
                <div>
                  <button
                    style={rowBtnStyle(openSection === 'promo')}
                    onClick={() => toggleSection('promo')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span>📣</span>
                      <div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'white' }}>Editar Promoción</div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{promoImage ? 'Imagen cargada' : 'Sin imagen'}</div>
                      </div>
                    </div>
                    <svg viewBox="0 0 24 24" width="12" height="12" stroke="var(--primary)" strokeWidth="2.5" fill="none"
                      style={{ transform: openSection === 'promo' ? 'rotate(180deg)' : 'none', transition: 'transform 0.22s', flexShrink: 0 }}>
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>

                  {/* Promo sub-panel */}
                  <div style={{
                    overflow: 'hidden',
                    maxHeight: openSection === 'promo' ? '500px' : '0px',
                    transition: 'max-height 0.4s cubic-bezier(0.16,1,0.3,1)',
                    background: 'rgba(255,255,255,0.02)',
                    border: openSection === 'promo' ? '1px solid rgba(255,255,255,0.07)' : 'none',
                    borderTop: 'none',
                    borderRadius: '0 0 8px 8px'
                  }}>
                    <div style={{ padding: '0.65rem', display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>

                      {/* Upload */}
                      <label style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                        background: 'rgba(210,125,45,0.08)', border: '1px dashed var(--primary)',
                        borderRadius: '6px', padding: '0.5rem', cursor: 'pointer',
                        color: 'var(--primary)', fontWeight: 700, fontSize: '0.75rem', transition: 'all 0.2s'
                      }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(210,125,45,0.16)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(210,125,45,0.08)'; }}
                      >
                        📷 Cargar imagen
                        <input type="file" accept="image/*" onChange={e => {
                          if (e.target.files?.[0]) onUploadPromoImage(e.target.files[0]);
                        }} style={{ display: 'none' }} />
                      </label>

                      {/* Name */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        <label style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600 }}>Nombre</label>
                        <input type="text" value={promoName} onChange={e => onUpdatePromoName(e.target.value)}
                          placeholder="¡Promoción Especial!" style={inputStyle}
                          onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                          onBlur={e => e.target.style.borderColor = 'rgba(210,125,45,0.2)'} />
                      </div>

                      {/* Description */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        <label style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600 }}>Descripción</label>
                        <input type="text" value={promoDesc} onChange={e => onUpdatePromoDesc(e.target.value)}
                          placeholder="Plato exclusivo de temporada..." style={inputStyle}
                          onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                          onBlur={e => e.target.style.borderColor = 'rgba(210,125,45,0.2)'} />
                      </div>

                      {/* Price + Thumbnail */}
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                          <label style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 600 }}>Precio (Gs.)</label>
                          <input type="number" value={promoPrice || ''} onChange={e => onUpdatePromoPrice(Number(e.target.value))}
                            placeholder="75000" style={{ ...inputStyle, fontWeight: 700 }}
                            onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                            onBlur={e => e.target.style.borderColor = 'rgba(210,125,45,0.2)'} />
                        </div>
                        {promoImage && (
                          <div style={{ position: 'relative', width: '42px', height: '42px', flexShrink: 0 }}>
                            <img src={promoImage} alt="Promo" style={{ width: '100%', height: '100%', borderRadius: '6px', objectFit: 'cover', border: '1px solid rgba(255,255,255,0.1)' }} />
                            <button onClick={onDeletePromoImage} title="Eliminar"
                              style={{ position: 'absolute', top: '-6px', right: '-6px', width: '16px', height: '16px', borderRadius: '50%', background: '#ff4d4d', border: 'none', color: 'white', fontSize: '8px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 5px rgba(0,0,0,0.4)', transition: '0.15s' }}
                              onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.25)'}
                              onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                            >✕</button>
                          </div>
                        )}
                      </div>

                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* ── CENTER: Brand Logo ── */}
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
              width="100%" height="100%"
              preserveAspectRatio="xMidYMid meet"
              filter="url(#remove-black)"
            />
          </svg>
        </div>

        {/* ── RIGHT: Spacer ── */}
        <div style={{ flex: 1 }} />

      </div>
    </header>
  );
}
