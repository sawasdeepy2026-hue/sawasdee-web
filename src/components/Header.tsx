import { ChevronDown, Menu } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState, useRef, useEffect } from 'react';

interface HeaderProps {
  isAdmin: boolean;
  adminUsername: string;
  onLoginClick: () => void;
  onLogoutClick: () => void;
  onEditCredentialsClick: () => void;
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
  onEditCredentialsClick
}: HeaderProps) {
  const { t, i18n } = useTranslation();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const langRef = useRef<HTMLDivElement>(null);
  const adminRef = useRef<HTMLDivElement>(null);

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsLangOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
      if (adminRef.current && !adminRef.current.contains(event.target as Node)) {
        setIsAdminMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLang = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0];

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
        padding: '1.25rem 0',
        transition: 'var(--transition)'
      }}
    >
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: '120px', gap: '1rem', width: '100%' }}>
        
        {/* Column 1 (Left): Desktop Controls or Mobile Menu Hamburger (flex-start) */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
          {/* Left Side: Admin Login & Language Selector (Desktop) */}
          <div className="desktop-nav" style={{ alignItems: 'center', gap: '0.75rem' }}>
            {/* Admin Profile Login Button */}
            <div 
              ref={adminRef}
              style={{ position: 'relative' }}
            >
              {isAdmin ? (
                <div 
                  onClick={() => setIsAdminMenuOpen(!isAdminMenuOpen)}
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.5rem', 
                    background: 'rgba(210, 125, 45, 0.12)', 
                    padding: '0.5rem 1rem', 
                    borderRadius: '50px', 
                    border: '1px solid var(--primary)',
                    cursor: 'pointer',
                    userSelect: 'none',
                    boxShadow: '0 0 10px rgba(210, 125, 45, 0.2)'
                  }}
                >
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 8px #4ade80' }}></span>
                  <span style={{ color: 'white', fontSize: '0.85rem', fontWeight: 700 }}>
                    {adminUsername}
                  </span>
                  <ChevronDown size={14} color="var(--primary)" style={{ transform: isAdminMenuOpen ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
                </div>
              ) : (
                <div 
                  onClick={onLoginClick}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: 'rgba(28, 23, 18, 0.6)',
                    border: '1px solid rgba(210, 125, 45, 0.15)',
                    cursor: 'pointer',
                    color: 'var(--text-muted)',
                    transition: 'var(--transition)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--primary)';
                    e.currentTarget.style.color = 'var(--primary)';
                    e.currentTarget.style.transform = 'scale(1.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(210, 125, 45, 0.15)';
                    e.currentTarget.style.color = 'var(--text-muted)';
                    e.currentTarget.style.transform = 'scale(1)';
                  }}
                  title="Acceso Administrador"
                >
                  <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
              )}

              {isAdminMenuOpen && isAdmin && (
                <div 
                  style={{
                    position: 'absolute',
                    top: '110%',
                    left: 0,
                    width: '180px',
                    background: 'rgba(15, 16, 20, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(210, 125, 45, 0.2)',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                    overflow: 'hidden',
                    zIndex: 100,
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <div
                    onClick={() => {
                      setIsAdminMenuOpen(false);
                      onEditCredentialsClick();
                    }}
                    style={{
                      padding: '0.75rem 1rem',
                      cursor: 'pointer',
                      color: 'white',
                      fontSize: '0.85rem',
                      fontWeight: 500,
                      borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    ⚙️ Credenciales
                  </div>
                  <div
                    onClick={() => {
                      setIsAdminMenuOpen(false);
                      onLogoutClick();
                    }}
                    style={{
                      padding: '0.75rem 1rem',
                      cursor: 'pointer',
                      color: '#ff4d4d',
                      fontSize: '0.85rem',
                      fontWeight: 500,
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 77, 77, 0.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    🚪 Cerrar Sesión
                  </div>
                </div>
              )}
            </div>

            {/* Language Selector */}
            <div 
              ref={langRef}
              style={{ position: 'relative' }}
            >
              <div 
                onClick={() => setIsLangOpen(!isLangOpen)}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.5rem', 
                  background: 'rgba(28, 23, 18, 0.6)', 
                  padding: '0.5rem 1rem', 
                  borderRadius: '50px', 
                  border: '1px solid rgba(210, 125, 45, 0.15)',
                  cursor: 'pointer',
                  userSelect: 'none'
                }}
              >
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>
                  {t('ui.language', 'Idioma')}:
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginLeft: '0.2rem' }}>
                  <img src={currentLang.flagUrl} alt={currentLang.name} style={{ width: '16px', borderRadius: '2px' }} />
                  <span style={{ color: 'white', fontSize: '0.9rem', fontWeight: 600 }}>{currentLang.name}</span>
                  <ChevronDown size={14} color="var(--text-muted)" style={{ transform: isLangOpen ? 'rotate(180deg)' : 'none', transition: '0.2s' }} />
                </div>
              </div>

              {isLangOpen && (
                <div 
                  style={{
                    position: 'absolute',
                    top: '110%',
                    left: 0,
                    width: '160px',
                    background: 'rgba(15, 16, 20, 0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(210, 125, 45, 0.15)',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.5)',
                    overflow: 'hidden',
                    zIndex: 100,
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  {LANGUAGES.map(lang => (
                    <div
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.75rem 1rem',
                        cursor: 'pointer',
                        color: i18n.language === lang.code ? 'var(--primary)' : 'white',
                        background: i18n.language === lang.code ? 'rgba(210, 125, 45, 0.1)' : 'transparent',
                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                        transition: '0.2s',
                        fontWeight: i18n.language === lang.code ? 700 : 500
                      }}
                      onMouseEnter={(e) => {
                        if (i18n.language !== lang.code) {
                          e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (i18n.language !== lang.code) {
                          e.currentTarget.style.background = 'transparent';
                        }
                      }}
                    >
                      <img src={lang.flagUrl} alt={lang.name} style={{ width: '18px', borderRadius: '2px' }} />
                      {lang.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Hamburger Mobile Menu Toggle */}
          <div 
            className="mobile-nav-toggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            style={{ 
               alignItems: 'center', 
               justifyContent: 'center',
               width: '44px',
               height: '44px',
               borderRadius: '8px',
               background: 'rgba(28, 23, 18, 0.6)',
               border: '1px solid rgba(210, 125, 45, 0.15)',
               cursor: 'pointer',
               transition: 'var(--transition)'
            }}
          >
            <Menu size={22} color="var(--primary)" />
          </div>
        </div>

        {/* Column 2 (Center): Brand Logo & Name (center) */}
        <div style={{ flex: '0 0 auto', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <svg width="280" height="110" viewBox="0 0 360 170" style={{ pointerEvents: 'none' }}>
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

        {/* Column 3 (Right): Spacer to keep logo centered */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
          {/* Cart Button removed as requested to avoid redundancy with the floating bottom bar */}
        </div>

      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          background: 'rgba(10, 11, 13, 0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(210, 125, 45, 0.15)',
          padding: '1rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem',
          zIndex: 40,
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
        }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ color: 'white', fontWeight: 600 }}>Menú Principal</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {isAdmin ? (
              <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(210,125,45,0.1)' }}>
                <div style={{ color: 'var(--primary)', fontWeight: 600, marginBottom: '0.5rem' }}>
                  Admin: {adminUsername}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => { onEditCredentialsClick(); setIsMobileMenuOpen(false); }} className="btn" style={{ flex: 1, padding: '0.5rem', background: 'rgba(255,255,255,0.1)', color: 'white', fontSize: '0.85rem' }}>Credenciales</button>
                  <button onClick={() => { onLogoutClick(); setIsMobileMenuOpen(false); }} className="btn" style={{ flex: 1, padding: '0.5rem', background: 'rgba(255,50,50,0.1)', color: '#ff4d4d', fontSize: '0.85rem' }}>Salir</button>
                </div>
              </div>
            ) : (
              <button 
                onClick={() => { onLoginClick(); setIsMobileMenuOpen(false); }}
                className="btn"
                style={{ width: '100%', background: 'rgba(210, 125, 45, 0.1)', color: 'var(--primary)', border: '1px solid rgba(210, 125, 45, 0.2)' }}
              >
                Acceso Administrador
              </button>
            )}

            <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.5rem' }}>{t('ui.language', 'Idioma')}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {LANGUAGES.map(lang => (
                  <div
                    key={lang.code}
                    onClick={() => { changeLanguage(lang.code); setIsMobileMenuOpen(false); }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem',
                      background: i18n.language === lang.code ? 'var(--primary)' : 'rgba(255,255,255,0.05)',
                      color: i18n.language === lang.code ? 'black' : 'white',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      flex: '1 0 calc(50% - 0.5rem)'
                    }}
                  >
                    <img src={lang.flagUrl} alt={lang.name} style={{ width: '16px' }} />
                    {lang.name}
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}
    </header>
  );
}
