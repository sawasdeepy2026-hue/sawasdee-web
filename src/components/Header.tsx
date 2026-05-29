import { Menu } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import type { PromoItem } from '../App';

interface HeaderProps {
  isAdmin: boolean;
  adminUsername: string;
  onLoginClick: () => void;
  onLogoutClick: () => void;
  onEditCredentialsClick: () => void;
  promos: PromoItem[];
  onAddPromo: () => void;
  onDeletePromo: (id: string) => void;
  onUpdatePromo: (id: string, field: keyof PromoItem, value: string | number) => void;
  onUploadPromoImage: (id: string, file: File) => void;
  onSavePromos: () => void;
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
  promos,
  onAddPromo,
  onDeletePromo,
  onUpdatePromo,
  onUploadPromoImage,
  onSavePromos
}: HeaderProps) {
  const { i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openSection, setOpenSection] = useState<null | 'auth' | 'lang' | 'promo'>(null);
  const [expandedPromoId, setExpandedPromoId] = useState<string | null>(null);
  const [saveFlash, setSaveFlash] = useState(false);

  const toggleSection = (section: 'auth' | 'lang' | 'promo') => {
    setOpenSection(prev => (prev === section ? null : section));
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setOpenSection(null);
    setIsMenuOpen(false);
  };

  const handleSave = () => {
    onSavePromos();
    setSaveFlash(true);
    setTimeout(() => setSaveFlash(false), 2000);
  };

  const currentLang = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0];

  const inputStyle: React.CSSProperties = {
    background: 'rgba(0,0,0,0.5)',
    border: '1px solid rgba(210,125,45,0.2)',
    borderRadius: '5px',
    padding: '0.3rem 0.5rem',
    color: 'white',
    fontSize: '0.75rem',
    outline: 'none',
    width: '100%',
    boxSizing: 'border-box',
  };

  const rowBtnStyle = (active: boolean): React.CSSProperties => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    padding: '0.52rem 0.72rem',
    background: active ? 'rgba(210,125,45,0.12)' : 'rgba(255,255,255,0.03)',
    border: active ? '1px solid rgba(210,125,45,0.3)' : '1px solid rgba(255,255,255,0.06)',
    borderRadius: active ? '8px 8px 0 0' : '8px',
    color: 'white',
    cursor: 'pointer',
    textAlign: 'left',
    transition: 'all 0.2s',
    fontSize: '0.82rem',
    fontWeight: 600,
  });

  const chevron = (open: boolean) => (
    <svg viewBox="0 0 24 24" width="12" height="12" stroke="var(--primary)" strokeWidth="2.5" fill="none"
      style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.22s', flexShrink: 0 }}>
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50,
      background: 'rgba(10, 11, 13, 0.92)',
      backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      borderBottom: '1px solid rgba(210, 125, 45, 0.1)', padding: '1rem 0',
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: '100px', gap: '1rem', width: '100%' }}>

        {/* LEFT: Menu button + absolutely-positioned dropdown */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-start', position: 'relative' }}>

          {/* Menú pill button */}
          <button
            onClick={() => { setIsMenuOpen(p => !p); setOpenSection(null); }}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.55rem',
              padding: '0.55rem 1.1rem', borderRadius: '50px',
              background: isMenuOpen ? 'var(--primary)' : 'rgba(28, 23, 18, 0.65)',
              border: isMenuOpen ? '1px solid var(--primary)' : '1px solid rgba(210, 125, 45, 0.28)',
              color: isMenuOpen ? '#0a0b0d' : 'white',
              cursor: 'pointer', fontWeight: 700, fontSize: '0.88rem',
              transition: 'all 0.25s ease',
              boxShadow: isMenuOpen ? '0 3px 12px rgba(210,125,45,0.3)' : 'none',
              position: 'relative', zIndex: 201
            }}
          >
            <Menu size={17} />
            <span>Menú</span>
          </button>

          {/* ── FLOATING PERSIANA ── */}
          <div style={{
            position: 'absolute', top: 'calc(100% + 8px)', left: 0,
            width: '240px',
            maxHeight: isMenuOpen ? '900px' : '0px',
            opacity: isMenuOpen ? 1 : 0,
            overflow: 'hidden',
            pointerEvents: isMenuOpen ? 'auto' : 'none',
            transition: 'max-height 0.45s cubic-bezier(0.16,1,0.3,1), opacity 0.25s ease',
            background: 'rgba(10, 11, 13, 0.98)',
            backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(210, 125, 45, 0.18)',
            borderRadius: '12px',
            boxShadow: '0 16px 48px rgba(0,0,0,0.65)',
            zIndex: 200
          }}>
            <div style={{ padding: '0.5rem' }}>

              {/* ── ROW 1: Auth ── */}
              <div style={{ marginBottom: '3px' }}>
                <button style={rowBtnStyle(openSection === 'auth')} onClick={() => toggleSection('auth')}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span>{isAdmin ? '🟢' : '🔒'}</span>
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700, color: isAdmin ? '#4ade80' : 'white' }}>
                        {isAdmin ? `Admin: ${adminUsername}` : 'Iniciar Sesión'}
                      </div>
                      <div style={{ fontSize: '0.67rem', color: 'var(--text-muted)' }}>
                        {isAdmin ? 'Sesión activa' : 'Acceso administrador'}
                      </div>
                    </div>
                  </div>
                  {chevron(openSection === 'auth')}
                </button>
                <div style={{
                  overflow: 'hidden',
                  maxHeight: openSection === 'auth' ? '200px' : '0px',
                  transition: 'max-height 0.35s cubic-bezier(0.16,1,0.3,1)',
                  background: 'rgba(210,125,45,0.04)',
                  border: openSection === 'auth' ? '1px solid rgba(210,125,45,0.15)' : 'none',
                  borderTop: 'none', borderRadius: '0 0 8px 8px',
                  marginBottom: openSection === 'auth' ? '3px' : 0
                }}>
                  <div style={{ padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                    {isAdmin ? (
                      <>
                        <button onClick={() => { onEditCredentialsClick(); setIsMenuOpen(false); }}
                          style={{ padding: '0.48rem 0.65rem', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.4rem', transition: 'background 0.2s', textAlign: 'left' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                        >⚙️ Editar Credenciales</button>
                        <button onClick={() => { onLogoutClick(); setIsMenuOpen(false); }}
                          style={{ padding: '0.48rem 0.65rem', background: 'rgba(255,77,77,0.08)', color: '#ff7070', border: '1px solid rgba(255,77,77,0.2)', borderRadius: '6px', cursor: 'pointer', fontWeight: 600, fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.4rem', transition: 'background 0.2s', textAlign: 'left' }}
                          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,77,77,0.2)'}
                          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,77,77,0.08)'}
                        >🚪 Cerrar Sesión</button>
                      </>
                    ) : (
                      <button onClick={() => { onLoginClick(); setIsMenuOpen(false); }}
                        style={{ width: '100%', padding: '0.6rem', background: 'var(--primary)', color: '#0a0b0d', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 800, fontSize: '0.8rem' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--primary-hover)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'var(--primary)'}
                      >🔑 Iniciar Sesión</button>
                    )}
                  </div>
                </div>
              </div>

              {/* ── ROW 2: Language ── */}
              <div style={{ marginBottom: '3px' }}>
                <button style={rowBtnStyle(openSection === 'lang')} onClick={() => toggleSection('lang')}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <img src={currentLang.flagUrl} alt={currentLang.name} style={{ width: '16px', borderRadius: '2px' }} />
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 700 }}>Idioma</div>
                      <div style={{ fontSize: '0.67rem', color: 'var(--text-muted)' }}>{currentLang.name}</div>
                    </div>
                  </div>
                  {chevron(openSection === 'lang')}
                </button>
                <div style={{
                  overflow: 'hidden',
                  maxHeight: openSection === 'lang' ? '220px' : '0px',
                  transition: 'max-height 0.35s cubic-bezier(0.16,1,0.3,1)',
                  background: 'rgba(255,255,255,0.02)',
                  border: openSection === 'lang' ? '1px solid rgba(255,255,255,0.07)' : 'none',
                  borderTop: 'none', borderRadius: '0 0 8px 8px',
                  marginBottom: openSection === 'lang' ? '3px' : 0
                }}>
                  <div style={{ padding: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                    {LANGUAGES.map(lang => {
                      const active = i18n.language === lang.code;
                      return (
                        <button key={lang.code} onClick={() => changeLanguage(lang.code)}
                          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.42rem 0.6rem', background: active ? 'var(--primary)' : 'rgba(255,255,255,0.03)', color: active ? '#0a0b0d' : 'white', border: active ? '1px solid var(--primary)' : '1px solid rgba(255,255,255,0.06)', borderRadius: '6px', cursor: 'pointer', fontWeight: active ? 700 : 500, fontSize: '0.8rem', transition: 'all 0.2s', textAlign: 'left', width: '100%' }}
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
                  <button style={rowBtnStyle(openSection === 'promo')} onClick={() => toggleSection('promo')}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span>📣</span>
                      <div>
                        <div style={{ fontSize: '0.82rem', fontWeight: 700 }}>Editar Promoción</div>
                        <div style={{ fontSize: '0.67rem', color: 'var(--text-muted)' }}>{promos.length} promo{promos.length !== 1 ? 's' : ''} cargada{promos.length !== 1 ? 's' : ''}</div>
                      </div>
                    </div>
                    {chevron(openSection === 'promo')}
                  </button>

                  <div style={{
                    overflow: 'hidden',
                    maxHeight: openSection === 'promo' ? '900px' : '0px',
                    transition: 'max-height 0.4s cubic-bezier(0.16,1,0.3,1)',
                    background: 'rgba(255,255,255,0.02)',
                    border: openSection === 'promo' ? '1px solid rgba(255,255,255,0.07)' : 'none',
                    borderTop: 'none', borderRadius: '0 0 8px 8px'
                  }}>
                    <div style={{ padding: '0.6rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>

                      {/* List of promos */}
                      {promos.map((promo, idx) => (
                        <div key={promo.id} style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', overflow: 'hidden' }}>

                          {/* Promo header row — click to expand */}
                          <div
                            onClick={() => setExpandedPromoId(expandedPromoId === promo.id ? null : promo.id)}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.45rem 0.6rem', cursor: 'pointer', background: expandedPromoId === promo.id ? 'rgba(210,125,45,0.1)' : 'rgba(255,255,255,0.03)', transition: 'background 0.2s' }}
                          >
                            {promo.image
                              ? <img src={promo.image} alt="" style={{ width: '32px', height: '32px', borderRadius: '5px', objectFit: 'cover', flexShrink: 0 }} />
                              : <div style={{ width: '32px', height: '32px', borderRadius: '5px', background: 'rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', flexShrink: 0 }}>📷</div>
                            }
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {promo.name || `Promo ${idx + 1}`}
                              </div>
                              <div style={{ fontSize: '0.67rem', color: 'var(--primary)', fontWeight: 700 }}>
                                {promo.price ? `${promo.price.toLocaleString()} Gs.` : 'Sin precio'}
                              </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                              {chevron(expandedPromoId === promo.id)}
                              <button
                                onClick={e => { e.stopPropagation(); onDeletePromo(promo.id); }}
                                style={{ width: '20px', height: '20px', borderRadius: '50%', background: 'rgba(255,77,77,0.15)', border: '1px solid rgba(255,77,77,0.3)', color: '#ff7070', fontSize: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}
                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,77,77,0.35)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,77,77,0.15)'}
                                title="Eliminar promo"
                              >✕</button>
                            </div>
                          </div>

                          {/* Expanded edit fields */}
                          {expandedPromoId === promo.id && (
                            <div style={{ padding: '0.55rem', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column', gap: '0.4rem', background: 'rgba(0,0,0,0.25)' }}>

                              {/* Image upload */}
                              <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', background: 'rgba(210,125,45,0.07)', border: '1px dashed var(--primary)', borderRadius: '5px', padding: '0.42rem', cursor: 'pointer', color: 'var(--primary)', fontWeight: 700, fontSize: '0.73rem', transition: 'all 0.2s' }}
                                onMouseEnter={e => e.currentTarget.style.background = 'rgba(210,125,45,0.16)'}
                                onMouseLeave={e => e.currentTarget.style.background = 'rgba(210,125,45,0.07)'}
                              >
                                📷 {promo.image ? 'Cambiar imagen' : 'Cargar imagen'}
                                <input type="file" accept="image/*" onChange={e => { if (e.target.files?.[0]) onUploadPromoImage(promo.id, e.target.files[0]); }} style={{ display: 'none' }} />
                              </label>

                              {/* Name */}
                              <input type="text" value={promo.name} onChange={e => onUpdatePromo(promo.id, 'name', e.target.value)}
                                placeholder="Nombre de la promo" style={inputStyle}
                                onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                                onBlur={e => e.target.style.borderColor = 'rgba(210,125,45,0.2)'} />

                              {/* Description */}
                              <input type="text" value={promo.desc} onChange={e => onUpdatePromo(promo.id, 'desc', e.target.value)}
                                placeholder="Descripción" style={inputStyle}
                                onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                                onBlur={e => e.target.style.borderColor = 'rgba(210,125,45,0.2)'} />

                              {/* Price */}
                              <input type="number" value={promo.price || ''} onChange={e => onUpdatePromo(promo.id, 'price', Number(e.target.value))}
                                placeholder="Precio en Gs." style={{ ...inputStyle, fontWeight: 700 }}
                                onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                                onBlur={e => e.target.style.borderColor = 'rgba(210,125,45,0.2)'} />
                            </div>
                          )}
                        </div>
                      ))}

                      {/* Agregar promo button */}
                      <button onClick={onAddPromo}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', padding: '0.48rem', background: 'rgba(210,125,45,0.06)', border: '1px dashed rgba(210,125,45,0.4)', borderRadius: '7px', color: 'var(--primary)', cursor: 'pointer', fontWeight: 700, fontSize: '0.77rem', transition: 'all 0.2s', width: '100%' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(210,125,45,0.14)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'rgba(210,125,45,0.06)'}
                      >➕ Agregar Promoción</button>

                      {/* SAVE button */}
                      <button onClick={handleSave}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem',
                          padding: '0.55rem', width: '100%', borderRadius: '7px', cursor: 'pointer',
                          fontWeight: 800, fontSize: '0.8rem', border: 'none',
                          background: saveFlash ? '#22c55e' : 'var(--primary)',
                          color: '#0a0b0d',
                          transition: 'background 0.3s, transform 0.15s',
                          transform: saveFlash ? 'scale(0.97)' : 'scale(1)'
                        }}
                        onMouseEnter={e => { if (!saveFlash) e.currentTarget.style.background = 'var(--primary-hover)'; }}
                        onMouseLeave={e => { if (!saveFlash) e.currentTarget.style.background = 'var(--primary)'; }}
                      >
                        {saveFlash ? '✅ ¡Guardado!' : '💾 Guardar cambios'}
                      </button>

                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* CENTER: Brand Logo */}
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
            <image href={`${import.meta.env.BASE_URL}logo.png`} width="100%" height="100%" preserveAspectRatio="xMidYMid meet" filter="url(#remove-black)" />
          </svg>
        </div>

        {/* RIGHT: Spacer */}
        <div style={{ flex: 1 }} />

      </div>
    </header>
  );
}
