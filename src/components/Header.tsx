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
  promoImage
}: HeaderProps) {
  const { i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <header 
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(10, 11, 13, 0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(210, 125, 45, 0.1)',
        padding: '1rem 0',
        transition: 'var(--transition)'
      }}
    >
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: '100px', gap: '1rem', width: '100%' }}>
        
        {/* Column 1 (Left): Premium Menu Trigger Button */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
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
            onMouseEnter={(e) => {
              if (!isMenuOpen) {
                e.currentTarget.style.borderColor = 'var(--primary)';
                e.currentTarget.style.background = 'rgba(210, 125, 45, 0.08)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isMenuOpen) {
                e.currentTarget.style.borderColor = 'rgba(210, 125, 45, 0.25)';
                e.currentTarget.style.background = 'rgba(28, 23, 18, 0.6)';
              }
            }}
          >
            <Menu size={18} />
            <span>Menú</span>
          </button>
        </div>

        {/* Column 2 (Center): Brand Logo & Name */}
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

        {/* Column 3 (Right): Spacer */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          {/* Preserves symmetry */}
        </div>

      </div>

      {/* Premium Slide-Down Curtain Panel (Persiana) */}
      <div 
        style={{
          background: 'rgba(10, 11, 13, 0.96)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: isMenuOpen ? '1px solid rgba(210, 125, 45, 0.15)' : '1px solid transparent',
          overflow: 'hidden',
          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          maxHeight: isMenuOpen ? '450px' : '0px',
          opacity: isMenuOpen ? 1 : 0,
          transform: isMenuOpen ? 'translateY(0)' : 'translateY(-15px)',
          boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
          zIndex: 40
        }}
      >
        <div style={{ padding: '2rem 1rem', maxWidth: '1200px', margin: '0 auto', display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center' }}>
          
          {/* Card 1: Acceso Administrador */}
          <div style={{ 
            flex: '1 1 300px', 
            background: 'rgba(255, 255, 255, 0.02)', 
            border: '1px solid rgba(210, 125, 45, 0.12)', 
            borderRadius: '16px', 
            padding: '1.5rem', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1rem',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
          }}>
            <h4 style={{ color: 'var(--primary)', margin: 0, fontSize: '1.05rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              🔒 Acceso de Administrador
            </h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.5, margin: 0 }}>
              Ingresa para gestionar el menú, modificar precios, agregar platos y cambiar imágenes de tus especialidades.
            </p>

            {isAdmin && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.25rem' }}>
                <label 
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    background: 'rgba(210, 125, 45, 0.1)',
                    border: '1px dashed var(--primary)',
                    borderRadius: '10px',
                    padding: '0.75rem',
                    cursor: 'pointer',
                    color: 'var(--primary)',
                    fontWeight: 700,
                    fontSize: '0.85rem',
                    transition: 'all 0.2s',
                    textAlign: 'center'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(210, 125, 45, 0.2)';
                    e.currentTarget.style.transform = 'scale(1.02)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(210, 125, 45, 0.1)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" strokeWidth="2.5" fill="none">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                    <circle cx="8.5" cy="8.5" r="1.5"></circle>
                    <polyline points="21 15 16 10 5 21"></polyline>
                  </svg>
                  <span>Cargar Imagen de Promoción</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        onUploadPromoImage(e.target.files[0]);
                      }
                    }} 
                    style={{ display: 'none' }} 
                  />
                </label>
                {promoImage && (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', padding: '0 0.25rem' }}>
                    <span>Miniatura actual:</span>
                    <img 
                      src={promoImage} 
                      alt="Miniatura Promo" 
                      style={{ height: '35px', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)', objectFit: 'cover', aspectRatio: '1' }} 
                    />
                  </div>
                )}
              </div>
            )}

            {isAdmin ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: 'auto' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4ade80', fontSize: '0.85rem', fontWeight: 700 }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 8px #4ade80' }}></span>
                  Admin activo: {adminUsername}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    onClick={() => { onEditCredentialsClick(); setIsMenuOpen(false); }} 
                    style={{ flex: 1, padding: '0.6rem', background: 'rgba(255,255,255,0.06)', color: 'white', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem', transition: 'var(--transition)' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                  >
                    ⚙️ Credenciales
                  </button>
                  <button 
                    onClick={() => { onLogoutClick(); setIsMenuOpen(false); }} 
                    style={{ flex: 1, padding: '0.6rem', background: 'rgba(255,77,77,0.12)', color: '#ff4d4d', border: '1px solid rgba(255,77,77,0.2)', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem', transition: 'var(--transition)' }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,77,77,0.25)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,77,77,0.12)'}
                  >
                    🚪 Cerrar Sesión
                  </button>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => { onLoginClick(); setIsMenuOpen(false); }}
                style={{
                  marginTop: 'auto',
                  background: 'var(--primary)',
                  color: '#0a0b0d',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '0.75rem',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  boxShadow: '0 4px 10px rgba(210,125,45,0.15)',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--primary-hover)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'var(--primary)'}
              >
                Iniciar Sesión
              </button>
            )}
          </div>

          {/* Card 2: Selector de Idioma */}
          <div style={{ 
            flex: '1 1 300px', 
            background: 'rgba(255, 255, 255, 0.02)', 
            border: '1px solid rgba(255, 255, 255, 0.05)', 
            borderRadius: '16px', 
            padding: '1.5rem', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '1rem',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)'
          }}>
            <h4 style={{ color: 'white', margin: 0, fontSize: '1.05rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              🌐 Seleccionar Idioma
            </h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.5, margin: 0 }}>
              Traduce al instante todas las secciones del menú, especialidades y el proceso de pedido a tu idioma preferido.
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', marginTop: 'auto' }}>
              {LANGUAGES.map(lang => {
                const isActive = i18n.language === lang.code;
                return (
                  <div
                    key={lang.code}
                    onClick={() => { changeLanguage(lang.code); setIsMenuOpen(false); }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.6rem',
                      padding: '0.6rem 0.8rem',
                      background: isActive ? 'var(--primary)' : 'rgba(255,255,255,0.04)',
                      color: isActive ? '#0a0b0d' : 'white',
                      border: isActive ? '1px solid var(--primary)' : '1px solid rgba(255,255,255,0.06)',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: isActive ? 700 : 500,
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
                    }}
                    onMouseLeave={(e) => {
                      if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                    }}
                  >
                    <img src={lang.flagUrl} alt={lang.name} style={{ width: '18px', borderRadius: '2px' }} />
                    <span>{lang.name}</span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </header>
  );
}
