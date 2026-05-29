import { ShoppingCart, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useState, useRef, useEffect } from 'react';

interface HeaderProps {
  cartItemCount: number;
  onOpenCart: () => void;
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
  cartItemCount, 
  onOpenCart,
  isAdmin,
  adminUsername,
  onLoginClick,
  onLogoutClick,
  onEditCredentialsClick
}: HeaderProps) {
  const { t, i18n } = useTranslation();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isAdminMenuOpen, setIsAdminMenuOpen] = useState(false);
  
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
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', minHeight: '150px' }}>
        
        {/* Left Side: Admin Login & Language Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
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
                    color: '#f87171',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(248, 113, 113, 0.08)'}
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
                      gap: '0.6rem',
                      padding: '0.75rem 1rem',
                      cursor: 'pointer',
                      background: i18n.language === lang.code ? 'rgba(210, 125, 45, 0.1)' : 'transparent',
                      borderLeft: `2px solid ${i18n.language === lang.code ? 'var(--primary)' : 'transparent'}`,
                      transition: 'background 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = i18n.language === lang.code ? 'rgba(210, 125, 45, 0.1)' : 'transparent'}
                  >
                    <img src={lang.flagUrl} alt={lang.name} style={{ width: '18px', borderRadius: '2px' }} />
                    <span style={{ color: 'white', fontSize: '0.85rem', fontWeight: 500 }}>{lang.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Center: Brand Logo & Name */}
        <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', display: 'flex', alignItems: 'center' }}>
          <svg width="360" height="170" viewBox="0 0 360 170">
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

        {/* Right Side: Cart Button */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <button 
            onClick={onOpenCart}
            style={{
              background: 'var(--primary)',
              color: '#0a0b0d',
              border: 'none',
              borderRadius: '50px',
              padding: '0.65rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.65rem',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(210, 125, 45, 0.2)',
              transition: 'var(--transition)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.backgroundColor = 'var(--primary-hover)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.backgroundColor = 'var(--primary)';
            }}
          >
            <ShoppingCart size={18} />
            <span style={{ display: 'inline' }}>Pedido</span>
            {cartItemCount > 0 && (
              <div 
                style={{
                  background: '#0a0b0d',
                  color: 'var(--primary)',
                  minWidth: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  boxShadow: 'inset 0 0 5px rgba(210, 125, 45, 0.2)'
                }}
              >
                {cartItemCount}
              </div>
            )}
          </button>
        </div>

      </div>
    </header>
  );
}
