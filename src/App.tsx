import { useState, useMemo, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Header } from './components/Header';
import { DishCard, type DishItem } from './components/DishCard';
import { CustomizeModal } from './components/CustomizeModal';
import { CartModal, type CartItem } from './components/CartModal';
import { ReservationDrawer } from './components/ReservationDrawer';
import { MapPin, Phone, ShieldCheck, Heart, CalendarPlus } from 'lucide-react';
import './App.css';

// Shared promo type
export interface PromoItem {
  id: string;
  image: string;
  name: string;
  desc: string;
  price: number;
}

// Complete Sawasdee authentic menu data
const INITIAL_CATALOG_DATA: (DishItem & { category: 'starters' | 'thai' | 'indian' | 'naan' | 'drinks_desserts' })[] = [
  // --- ENTRADAS (Starters) ---
  {
    id: 'indian_mix_starter',
    name: '1- Indian Mix Starter',
    description: 'Samosas, Aloo Tikki, Chicken Tikka & Afghani Kebab.',
    price: 85000,
    category: 'starters',
    image: 'indian_starters.png',
    isRecommended: true
  },
  {
    id: 'samosas',
    name: '2- Samosas',
    description: 'Empanaditas fritas, rellenas de papas, arvejas y especias.',
    price: 45000,
    category: 'starters',
    image: 'indian_starters.png',
    isRecommended: true
  },
  {
    id: 'aloo_tikki',
    name: '3- Aloo Tikki',
    description: 'Finas croquetas fritas de papas, cebolla morada, arveja, kuratu y especias.',
    price: 40000,
    category: 'starters',
    image: 'indian_starters.png'
  },
  {
    id: 'chicken_tikka',
    name: '4- Chicken Tikka',
    description: 'Pollo marinado en yogurt y especias, asado en el tandoor.',
    price: 45000,
    category: 'starters',
    image: 'indian_starters.png',
    isRecommended: true,
    isGlutenFree: true
  },
  {
    id: 'chicken_afghani',
    name: '5- Chicken Afghani',
    description: 'Pollo marinado en crema de leche, kuratu, queso y especias, asado en el tandoor.',
    price: 45000,
    category: 'starters',
    image: 'indian_starters.png',
    isGlutenFree: true
  },
  {
    id: 'mix_entrada_thai',
    name: '17- Mix Entrada Thai',
    description: 'Rollito fresco con camarones, rollito primavera, chicken satay y papaya salad.',
    price: 85000,
    category: 'starters',
    image: 'entradas_thai.png',
    isRecommended: true,
    spicyLevel: 1
  },
  {
    id: 'rollitos_primavera',
    name: '18- Rollitos de primavera',
    description: 'Rollitos rellenos de fideo de arroz, brotes de soja, zanahoria y tofu.',
    price: 45000,
    category: 'starters',
    image: 'rollitos_primavera.jpg'
  },
  {
    id: 'rollitos_frescos',
    name: '19- Rollitos frescos con camarones',
    description: 'Rollitos frescos rellenos de lechuga, zanahoria, pepino y camarones.',
    price: 55000,
    category: 'starters',
    image: 'entradas_thai.png',
    isRecommended: true,
    spicyLevel: 2,
    isGlutenFree: true
  },
  {
    id: 'chicken_satay_thai',
    name: '20- Chicken Satay',
    description: 'Asaditos marinados y asados con leche de coco, hierbas y especias.',
    price: 45000,
    category: 'starters',
    image: 'entradas_thai.png'
  },
  {
    id: 'papaya_salad',
    name: '21- Papaya Salad',
    description: 'Papaya Verde, zanahoria, chaucha, tomate, camarones deshidratados y maní.',
    price: 40000,
    category: 'starters',
    image: 'entradas_thai.png',
    isRecommended: true,
    spicyLevel: 2,
    isGlutenFree: true
  },
  {
    id: 'tom_yum_soup',
    name: '22- Tom Yum Soup',
    description: 'Sopa Tradicional de Tailandia a base de Thai Chilli Paste, lemongrass, galangal, tomate fresco, champiñones, cebollita y kuratu.',
    price: 0,
    category: 'starters',
    image: 'entradas_thai.png',
    isGlutenFree: true,
    variants: [
      { id: 'tom_yum_tofu', name: 'Con Tofu', price: 70000 },
      { id: 'tom_yum_pollo', name: 'Con Pollo', price: 75000 },
      { id: 'tom_yum_carne', name: 'Con Carne', price: 80000 },
      { id: 'tom_yum_camarones', name: 'Con Camarones', price: 85000 }
    ]
  },
  {
    id: 'tom_kha_soup',
    name: '23- Tom Kha Soup',
    description: 'Sopa tradicional de Tailandia a base de Leche de coco, lemongrass, galangal, tomate fresco, champiñones, cebollita y kuratu.',
    price: 0,
    category: 'starters',
    image: 'entradas_thai.png',
    isGlutenFree: true,
    variants: [
      { id: 'tom_kha_tofu', name: 'Con Tofu', price: 70000 },
      { id: 'tom_kha_pollo', name: 'Con Pollo', price: 75000 },
      { id: 'tom_kha_carne', name: 'Con Carne', price: 80000 },
      { id: 'tom_kha_camarones', name: 'Con Camarones', price: 85000 }
    ]
  },

  // --- PLATOS PRINCIPALES (Indian & Thai Main Courses) ---
  {
    id: 'curry_indian',
    name: '6- Curry',
    description: 'Salsa a base de cebolla, especias y crema de leche.',
    price: 0,
    category: 'indian',
    image: 'butter_chicken.png',
    isRecommended: true,
    isGlutenFree: true,
    variants: [
      { id: 'curry_panner', name: 'Panner', price: 90000 },
      { id: 'curry_pollo', name: 'Pollo', price: 95000 },
      { id: 'curry_mix', name: 'Mix de vegetales', price: 90000 },
      { id: 'curry_cordero', name: 'Cordero', price: 105000 }
    ]
  },
  {
    id: 'makhanwala',
    name: '7- Makhanwala',
    description: 'Salsa a base de tomate, especias, crema y manteca.',
    price: 0,
    category: 'indian',
    image: 'butter_chicken.png',
    isGlutenFree: true,
    variants: [
      { id: 'makhanwala_panner', name: 'Panner', price: 90000 },
      { id: 'makhanwala_pollo', name: 'Pollo', price: 95000 },
      { id: 'makhanwala_mix', name: 'Mix de vegetales', price: 90000 },
      { id: 'makhanwala_cordero', name: 'Cordero', price: 105000 }
    ]
  },
  {
    id: 'tikka_massala',
    name: '8- Tikka Massala',
    description: 'Salsa a base de tomate, cebolla, especias y crema.',
    price: 0,
    category: 'indian',
    image: 'butter_chicken.png',
    isRecommended: true,
    isGlutenFree: true,
    variants: [
      { id: 'tikka_panner', name: 'Panner', price: 90000 },
      { id: 'tikka_pollo', name: 'Pollo', price: 95000 },
      { id: 'tikka_mix', name: 'Mix de vegetales', price: 90000 },
      { id: 'tikka_cordero', name: 'Cordero', price: 105000 }
    ]
  },
  {
    id: 'saagwala',
    name: '9- Saagwala',
    description: 'Salsa a base de espinaca, cebolla, especias y crema.',
    price: 0,
    category: 'indian',
    image: 'butter_chicken.png',
    isGlutenFree: true,
    variants: [
      { id: 'saagwala_panner', name: 'Panner', price: 90000 },
      { id: 'saagwala_pollo', name: 'Pollo', price: 95000 },
      { id: 'saagwala_cordero', name: 'Cordero', price: 105000 }
    ]
  },
  {
    id: 'pad_thai',
    name: '24- Pad Thai',
    description: 'Fideo de arroz de Thailandia salteado con brotes de soja, zanahoria, nira, huevo, tofu, maní y un toque de ají.',
    price: 0,
    category: 'thai',
    image: 'pad_thai.png',
    isRecommended: true,
    spicyLevel: 1,
    isGlutenFree: true,
    variants: [
      { id: 'pad_thai_tofu', name: 'Tofu', price: 85000 },
      { id: 'pad_thai_pollo', name: 'Pollo', price: 90000 },
      { id: 'pad_thai_carne', name: 'Carne', price: 95000 },
      { id: 'pad_thai_camarones', name: 'Camarones', price: 105000 }
    ]
  },
  {
    id: 'arroz_con_pina',
    name: '25- Arroz con Piña',
    description: 'Arroz salteado con piña, pollo, arvejas, zanahoria, cebolla, caju, uva pasa, especias y condimentos tradicionales.',
    price: 0,
    category: 'thai',
    image: 'arroz_pina.png',
    isGlutenFree: true,
    variants: [
      { id: 'arroz_pina_base', name: 'Tradicional', price: 95000 },
      { id: 'arroz_pina_crispy', name: 'Con Crispy Chicken (+20.000)', price: 115000 }
    ]
  },
  {
    id: 'green_curry',
    name: '26- Green Curry',
    description: 'Curry verde de hierbas y especias con leche de coco, berenjenas y albahacas, acompañado de arroz blanco.',
    price: 0,
    category: 'thai',
    image: 'green_curry.png',
    isGlutenFree: true,
    variants: [
      { id: 'green_curry_tofu', name: 'Tofu', price: 90000 },
      { id: 'green_curry_pollo', name: 'Pollo', price: 95000 },
      { id: 'green_curry_carne', name: 'Carne', price: 105000 },
      { id: 'green_curry_camarones', name: 'Camarones', price: 115000 }
    ]
  },
  {
    id: 'massaman_curry',
    name: '27- Massaman Curry',
    description: 'Curry massaman de hierbas y especias con leche de coco, papas, cebolla, zanahoria y maní, con un toque de canela y anís estrellado, acompañado de arroz blanco.',
    price: 0,
    category: 'thai',
    image: 'green_curry.png',
    isGlutenFree: true,
    variants: [
      { id: 'massaman_tofu', name: 'Tofu', price: 90000 },
      { id: 'massaman_pollo', name: 'Pollo', price: 95000 },
      { id: 'massaman_carne', name: 'Carne', price: 105000 },
      { id: 'massaman_camarones', name: 'Camarones', price: 115000 }
    ]
  },
  {
    id: 'lagrimas_de_tigre',
    name: '28- Lágrimas de tigre',
    description: 'Ojo de bife marinado con hierbas y especias, servido en placa caliente con salsa tradicional de Thailandia, acompañado de arroz frito.',
    price: 105000,
    category: 'thai',
    image: 'lagrimas_de_tigre.jpg',
    isRecommended: true,
    spicyLevel: 1
  },

  // --- NAANS ---
  {
    id: 'plain_naan',
    name: '10- Plain Naan',
    description: 'Plain naan.',
    price: 20000,
    category: 'naan',
    image: 'naan_bread.png'
  },
  {
    id: 'butter_naan',
    name: '11- Butter Naan',
    description: 'Plain Naan con manteca.',
    price: 20000,
    category: 'naan',
    image: 'naan_bread.png',
    isRecommended: true
  },
  {
    id: 'garlic_naan',
    name: '12- Garlic Naan',
    description: 'Plain Naan con ajo.',
    price: 25000,
    category: 'naan',
    image: 'naan_bread.png'
  },
  {
    id: 'cheese_naan',
    name: '13- Cheese Naan',
    description: 'Plain Naan con queso.',
    price: 25000,
    category: 'naan',
    image: 'naan_bread.png'
  },
  {
    id: 'til_naan',
    name: '14- Til Naan',
    description: 'Plain Naan con sésamo y kuratu.',
    price: 25000,
    category: 'naan',
    image: 'naan_bread.png'
  },
  {
    id: 'onion_naan',
    name: '15- Onion Naan',
    description: 'Plain Naan con cebolla, cilantro y especias.',
    price: 25000,
    category: 'naan',
    image: 'naan_bread.png'
  },

  // --- DRINKS & DESSERTS ---
  {
    id: 'kulfi',
    name: '16- Kulfi',
    description: 'Helado tradicional de la India a base de leche y almendras.',
    price: 45000,
    category: 'drinks_desserts',
    image: 'thai_iced_tea.png',
    isGlutenFree: true
  },
  {
    id: 'crispy_banana',
    name: '29- Crispy banana',
    description: 'Banana marinada con leche de coco, sésamo y coco rallado, frita y acompañada de helado americana y miel.',
    price: 50000,
    category: 'drinks_desserts',
    image: 'crispy_banana.png',
    isGlutenFree: true
  },
  {
    id: 'mango_sticky_rice',
    name: '30- Mango sticky rice',
    description: 'Arroz tailandés cocinado con leche de coco, acompañado con mango fresco.',
    price: 50000,
    category: 'drinks_desserts',
    image: 'mango_sticky_rice.png',
    isRecommended: true,
    isGlutenFree: true
  },
  {
    id: 'thai_tea',
    name: 'Thai Tea / Green Thai Tea',
    description: 'Té Thai con leche condensada y hielo.',
    price: 25000,
    category: 'drinks_desserts',
    image: 'thai_iced_tea.png'
  },
  {
    id: 'lassi',
    name: 'Lassi',
    description: 'Bebida a base de yogurt.',
    price: 0,
    category: 'drinks_desserts',
    image: 'thai_iced_tea.png',
    variants: [
      { id: 'sweet_lassi', name: 'Sweet Lassi', price: 25000 },
      { id: 'mango_lassi', name: 'Mango Lassi', price: 30000 }
    ]
  },
  {
    id: 'aguas_gaseosas',
    name: 'Aguas y Gaseosas',
    description: 'Agua Dasani y Gaseosas Coca Cola.',
    price: 0,
    category: 'drinks_desserts',
    image: 'thai_iced_tea.png',
    variants: [
      { id: 'agua_dasani', name: 'Agua Dasani 500ml', price: 10000 },
      { id: 'gaseosas', name: 'Gaseosas Coca Cola', price: 15000 }
    ]
  },
  {
    id: 'jugos_naturales',
    name: 'Jugos Naturales',
    description: 'Jugos frescos naturales.',
    price: 0,
    category: 'drinks_desserts',
    image: 'cocktails.png',
    variants: [
      { id: 'jugo_durazno', name: 'Jugo de Durazno', price: 20000 },
      { id: 'jugo_mango', name: 'Jugo de Mango', price: 25000 },
      { id: 'jugo_pina', name: 'Jugo de Piña', price: 20000 },
      { id: 'jugo_pepino', name: 'Pepino, Limón, Albahaca', price: 25000 },
      { id: 'jugo_pina_jengibre', name: 'Piña, Manzana, Jengibre', price: 25000 },
      { id: 'jugo_naranja_zanahoria', name: 'Naranja, Zanahoria, Durazno', price: 25000 }
    ]
  },
  {
    id: 'cocktails',
    name: 'Cocktails',
    description: 'Selección de cócteles.',
    price: 0,
    category: 'drinks_desserts',
    image: 'cocktails.png',
    variants: [
      { id: 'thaipirinia', name: 'Thaipirinia', price: 45000 },
      { id: 'coco_delight', name: 'Coco Delight', price: 45000 },
      { id: 'pink_paradise', name: 'Pink Paradise', price: 45000 },
      { id: 'sexy_lime', name: 'Sexy Lime', price: 50000 },
      { id: 'sawasdee_mule', name: 'Sawasdee Mule', price: 55000 }
    ]
  }
];

function App() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'starters' | 'thai' | 'indian' | 'naan' | 'drinks_desserts'>('starters');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Catalog Reactive Local State
  const [catalog, setCatalog] = useState<(DishItem & { category: 'starters' | 'thai' | 'indian' | 'naan' | 'drinks_desserts' })[]>(() => {
    const saved = localStorage.getItem('sawasdee_catalog');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_CATALOG_DATA;
  });

  // Admin Profile & Credentials State
  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    return sessionStorage.getItem('sawasdee_isAdmin') === 'true';
  });

  const [adminCredentials, setAdminCredentials] = useState(() => {
    const saved = localStorage.getItem('sawasdee_admin_creds');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return { username: 'LIDIAYFRED', password: '123456789' };
  });

  // Admin Modals & Action States
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [isEditCredsOpen, setIsEditCredsOpen] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [isEditDishOpen, setIsEditDishOpen] = useState(false);
  const [activeEditDish, setActiveEditDish] = useState<DishItem | null>(null);

  // Edit Dish Form & Cropper States
  const [editName, setEditName] = useState('');
  const [editPrice, setEditPrice] = useState(0);
  const [editDesc, setEditDesc] = useState('');
  const [uploadImageSrc, setUploadImageSrc] = useState<string>('');
  const [isNewImageUploaded, setIsNewImageUploaded] = useState(false);

  // Interactive Drag & Zoom States
  const [zoom, setZoom] = useState(1.0);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Ref to preview container for accurate canvas capture
  const cropPreviewRef = useRef<HTMLDivElement>(null);

  // Cart State
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  
  // Reservation State
  const [isReservationOpen, setIsReservationOpen] = useState(false);
  
  // Customization States
  const [selectedDishForCustomization, setSelectedDishForCustomization] = useState<DishItem | null>(null);

  // ── MULTI-PROMO STATE ──
  const [promos, setPromos] = useState<PromoItem[]>(() => {
    const saved = localStorage.getItem('sawasdee_promos');
    if (saved) { try { return JSON.parse(saved); } catch { /* fall through */ } }
    const oldImage = localStorage.getItem('sawasdee_promo_image') || `${import.meta.env.BASE_URL}sawasdee_promo.png`;
    return [{ id: '1', image: oldImage, name: localStorage.getItem('sawasdee_promo_name') || '¡Promoción Especial!', desc: localStorage.getItem('sawasdee_promo_desc') || 'Agrega este plato exclusivo a tu pedido', price: Number(localStorage.getItem('sawasdee_promo_price')) || 75000 }];
  });
  const [promoSlideIndex, setPromoSlideIndex] = useState<number>(0);
  const [promoSlideDir, setPromoSlideDir] = useState<'left' | 'right'>('right');
  const [promoQuantity, setPromoQuantity] = useState<number>(1);
  const [showPromo, setShowPromo] = useState<boolean>(false);

  // Derived: only promos that have an image
  const validPromos = promos.filter(p => p.image);
  const activePromo = validPromos[promoSlideIndex] ?? null;

  const handlePromoSlide = (dir: 'left' | 'right') => {
    setPromoSlideDir(dir);
    setPromoSlideIndex(prev => {
      if (dir === 'right') return (prev + 1) % validPromos.length;
      return (prev - 1 + validPromos.length) % validPromos.length;
    });
    setPromoQuantity(1);
  };

  const handleAddPromo = () => {
    const newPromo: PromoItem = { id: Date.now().toString(), image: '', name: '¡Nueva Promoción!', desc: 'Descripción de la promo', price: 75000 };
    setPromos(prev => [...prev, newPromo]);
  };

  const handleDeletePromo = (id: string) => {
    if (confirm('¿Eliminar esta promoción?')) setPromos(prev => prev.filter(p => p.id !== id));
  };

  const handleUpdatePromo = (id: string, field: keyof PromoItem, value: string | number) => {
    setPromos(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
  };

  const handleUploadPromoImage = (id: string, file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setPromos(prev => prev.map(p => p.id === id ? { ...p, image: base64 } : p));
    };
    reader.readAsDataURL(file);
  };

  const handleSavePromos = () => {
    localStorage.setItem('sawasdee_promos', JSON.stringify(promos));
  };

  useEffect(() => {
    if (validPromos.length === 0) return;
    const timerShow = setTimeout(() => setShowPromo(true), 800);
    const timerClose = setTimeout(() => setShowPromo(false), 10800);
    return () => { clearTimeout(timerShow); clearTimeout(timerClose); };
  }, []);

  // Auto-advance slide every 7 seconds when modal is open and has multiple promos
  useEffect(() => {
    if (!showPromo || validPromos.length <= 1) return;
    const interval = setInterval(() => {
      setPromoSlideDir('right');
      setPromoSlideIndex(prev => (prev + 1) % validPromos.length);
      setPromoQuantity(1);
    }, 7000);
    return () => clearInterval(interval);
  }, [showPromo, validPromos.length]);

  // Sync Admin Credentials to edit states when opening modal
  useEffect(() => {
    if (isEditCredsOpen) {
      setNewUsername(adminCredentials.username);
      setNewPassword(adminCredentials.password);
    }
  }, [isEditCredsOpen, adminCredentials]);

  // Sync Dish Form when opening modal
  useEffect(() => {
    if (isEditDishOpen && activeEditDish) {
      setEditName(activeEditDish.name);
      setEditPrice(activeEditDish.price);
      setEditDesc(activeEditDish.description);
      
      setZoom(1.0);
      setOffset({ x: 0, y: 0 });
      setUploadImageSrc(activeEditDish.image.startsWith('data:') ? activeEditDish.image : '');
      setIsNewImageUploaded(false);
    }
  }, [isEditDishOpen, activeEditDish]);

  // Admin Handlers
  const handleLoginSubmit = () => {
    if (
      loginUsername.trim().toLowerCase() === adminCredentials.username.toLowerCase() &&
      loginPassword === adminCredentials.password
    ) {
      setIsAdmin(true);
      sessionStorage.setItem('sawasdee_isAdmin', 'true');
      setIsLoginOpen(false);
      setLoginUsername('');
      setLoginPassword('');
      setLoginError('');
    } else {
      setLoginError('Credenciales incorrectas. Verifique usuario y contraseña.');
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    sessionStorage.removeItem('sawasdee_isAdmin');
  };

  const handleSaveCredentials = () => {
    if (!newUsername.trim() || !newPassword.trim()) {
      alert('El usuario y la contraseña no pueden estar vacíos.');
      return;
    }
    const updated = { username: newUsername.trim(), password: newPassword.trim() };
    setAdminCredentials(updated);
    localStorage.setItem('sawasdee_admin_creds', JSON.stringify(updated));
    setIsEditCredsOpen(false);
    alert('Credenciales actualizadas correctamente.');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUploadImageSrc(event.target.result as string);
          setIsNewImageUploaded(true);
          setZoom(1.0);
          setOffset({ x: 0, y: 0 });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Drag Handlers for Image Manipulation
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!uploadImageSrc) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!uploadImageSrc) return;
    setIsDragging(true);
    const touch = e.touches[0];
    setDragStart({ x: touch.clientX - offset.x, y: touch.clientY - offset.y });
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const touch = e.touches[0];
    setOffset({
      x: touch.clientX - dragStart.x,
      y: touch.clientY - dragStart.y
    });
  };

  // Save edited dish with Canvas crop & Zoom
  const handleSaveDish = () => {
    if (!activeEditDish) return;
    if (!editName.trim()) {
      alert('El nombre del plato es obligatorio.');
      return;
    }

    const saveUpdatedItem = (imgDataUrl: string) => {
      const updatedCatalog = catalog.map(item => {
        if (item.id === activeEditDish.id) {
          return {
            ...item,
            name: editName.trim(),
            description: editDesc.trim(),
            price: editPrice,
            image: imgDataUrl
          };
        }
        return item;
      });

      setCatalog(updatedCatalog);
      localStorage.setItem('sawasdee_catalog', JSON.stringify(updatedCatalog));
      setIsEditDishOpen(false);
      setActiveEditDish(null);
    };


    // Si se subió imagen nueva → capturar con canvas replicando exactamente el editor
    if (isNewImageUploaded && uploadImageSrc) {
      const container = cropPreviewRef.current;
      const CW = 700, CH = 490; // Output canvas: exactly 10:7 ratio
      const canvas = document.createElement('canvas');
      canvas.width = CW;
      canvas.height = CH;
      const ctx = canvas.getContext('2d');

      if (ctx && container) {
        const { width: Wc, height: Hc } = container.getBoundingClientRect();
        const img = new Image();
        img.onload = () => {
          ctx.fillStyle = '#0a0b0d';
          ctx.fillRect(0, 0, CW, CH);

          // Escala base para que la imagen encaje (contain) en el contenedor real Wc x Hc
          const scaleContain = Math.min(Wc / img.width, Hc / img.height);
          
          // Tamaño base de la imagen en píxeles del preview
          const imgBaseWidth = img.width * scaleContain;
          const imgBaseHeight = img.height * scaleContain;

          ctx.save();
          // 1. Mapear al tamaño del canvas de salida (ratio 10:7 exacto)
          const canvasScale = CW / Wc;
          ctx.scale(canvasScale, canvasScale);

          // 2. Centrar en el contenedor (equivalente a left: 50%, top: 50%)
          ctx.translate(Wc / 2, Hc / 2);

          // 3. Aplicar el desplazamiento (offset) del usuario
          ctx.translate(offset.x, offset.y);

          // 4. Aplicar el zoom del usuario
          ctx.scale(zoom, zoom);

          // 5. Dibujar la imagen centrada en el origen (equivalente a transform: translate(-50%, -50%))
          ctx.drawImage(
            img,
            -imgBaseWidth / 2,
            -imgBaseHeight / 2,
            imgBaseWidth,
            imgBaseHeight
          );
          ctx.restore();

          try {
            const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
            saveUpdatedItem(dataUrl);
          } catch (err) {
            console.error(err);
            saveUpdatedItem(uploadImageSrc);
          }
        };
        img.src = uploadImageSrc;
      } else {
        saveUpdatedItem(uploadImageSrc);
      }
    } else {
      // Solo actualizar datos del plato, mantener imagen y display actuales
      saveUpdatedItem(activeEditDish.image);
    }
  };

  // Cart Handlers
  const handleAddDish = (dish: DishItem, selectedVariantId?: string) => {
    // Determine if it needs spice level customization
    const isDrinkOrDessert = 
      dish.id.includes('naan') || 
      dish.id.includes('beer') || 
      dish.id.includes('tea') || 
      dish.id.includes('lassi') || 
      dish.id.includes('coca_cola') || 
      dish.id.includes('dasani') || 
      dish.id.includes('agua') ||
      dish.id.includes('gulab') || 
      dish.id.includes('rice');

    let itemToAdd = { ...dish };
    
    // If it has variants and one is selected, update name and price
    if (selectedVariantId && dish.variants) {
      const variant = dish.variants.find(v => v.id === selectedVariantId);
      if (variant) {
        itemToAdd.name = `${dish.name} - ${variant.name}`;
        itemToAdd.price = variant.price;
        itemToAdd.id = variant.id; 
      }
    } else if (dish.variants && !selectedVariantId) {
      const variant = dish.variants[0];
      itemToAdd.name = `${dish.name} - ${variant.name}`;
      itemToAdd.price = variant.price;
      itemToAdd.id = variant.id;
    }

    if (!isDrinkOrDessert) {
      setSelectedDishForCustomization(itemToAdd);
    } else {
      addToCart(itemToAdd, undefined, undefined);
    }
  };

  const addToCart = (item: DishItem, spice?: string, notes?: string, quantity: number = 1) => {
    setCartItems(prevItems => {
      const existingIdx = prevItems.findIndex(
        i => i.id === item.id && i.spice === spice && i.notes === notes
      );

      if (existingIdx > -1) {
        const newItems = [...prevItems];
        newItems[existingIdx].quantity += quantity;
        return newItems;
      } else {
        return [...prevItems, {
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: quantity,
          image: item.image,
          spice,
          notes
        }];
      }
    });
  };

  const handleRemoveFromCart = (itemId: string, spice?: string, notes?: string) => {
    setCartItems(prev => prev.filter(
      item => !(item.id === itemId && item.spice === spice && item.notes === notes)
    ));
  };

  const handleUpdateQuantity = (itemId: string, quantity: number, spice?: string, notes?: string) => {
    setCartItems(prev => prev.map(
      item => (item.id === itemId && item.spice === spice && item.notes === notes)
        ? { ...item, quantity }
        : item
    ));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Filter Catalog Data
  const filteredDishes = useMemo(() => {
    return catalog.filter(dish => {
      if (!searchTerm) {
        return dish.category === activeTab;
      }
      
      const term = searchTerm.toLowerCase();
      const translatedDesc = t(`catalog.${dish.id}.desc`, { defaultValue: dish.description }).toLowerCase();
      return dish.name.toLowerCase().includes(term) || translatedDesc.includes(term);
    });
  }, [activeTab, searchTerm, catalog, t]);

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '6rem', color: 'var(--text-main)' }}>
      <Header 
        isAdmin={isAdmin}
        adminUsername={adminCredentials.username}
        onLoginClick={() => setIsLoginOpen(true)}
        onLogoutClick={handleLogout}
        onEditCredentialsClick={() => setIsEditCredsOpen(true)}
        promos={promos}
        onAddPromo={handleAddPromo}
        onDeletePromo={handleDeletePromo}
        onUpdatePromo={handleUpdatePromo}
        onUploadPromoImage={handleUploadPromoImage}
        onSavePromos={handleSavePromos}
      />

      {/* Hero Cover Banner */}
      <section 
        style={{
          position: 'relative',
          width: '100%',
          height: '380px',
          backgroundImage: `linear-gradient(rgba(10, 11, 13, 0.3), rgba(10, 11, 13, 0.95)), url('sawasdee_portada.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '0 1.5rem',
          borderBottom: '1px solid rgba(210, 125, 45, 0.15)'
        }}
      >
        <div style={{ maxWidth: '750px', zIndex: 10 }}>
          <span 
            style={{ 
              color: 'var(--primary)', 
              fontWeight: 700, 
              letterSpacing: '0.15em', 
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '0.5rem'
            }}
          >
            {t('ui.welcome')}
          </span>
          <h2 
            style={{ 
              fontSize: '3rem', 
              color: 'white', 
              fontWeight: 800, 
              marginBottom: '1rem', 
              letterSpacing: '-0.02em',
              lineHeight: 1.15
            }}
          >
            {t('ui.mainTitle')}
          </h2>
          <p style={{ color: '#dcdcdc', fontSize: '1.15rem', lineHeight: 1.5, textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
            {t('ui.desc')}
          </p>
        </div>
      </section>

      {/* Main Container */}
      <main className="container" style={{ marginTop: '3rem' }}>
        
        {/* Main Content Spacer */}
        <div style={{ marginBottom: '2rem' }}></div>

        {/* Category Tabs */}
        <div className="tabs-container">
          <button 
            className={`tab-btn ${activeTab === 'starters' ? 'active' : ''}`}
            onClick={() => { setActiveTab('starters'); setSearchTerm(''); }}
          >
            {t('tabs.starters')}
          </button>
          <button 
            className={`tab-btn ${activeTab === 'thai' ? 'active' : ''}`}
            onClick={() => { setActiveTab('thai'); setSearchTerm(''); }}
          >
            {t('tabs.thai')}
          </button>
          <button 
            className={`tab-btn ${activeTab === 'indian' ? 'active' : ''}`}
            onClick={() => { setActiveTab('indian'); setSearchTerm(''); }}
          >
            {t('tabs.indian')}
          </button>
          <button 
            className={`tab-btn ${activeTab === 'naan' ? 'active' : ''}`}
            onClick={() => { setActiveTab('naan'); setSearchTerm(''); }}
          >
            {t('tabs.naan')}
          </button>
          <button 
            className={`tab-btn ${activeTab === 'drinks_desserts' ? 'active' : ''}`}
            onClick={() => { setActiveTab('drinks_desserts'); setSearchTerm(''); }}
          >
            {t('tabs.drinks_desserts')}
          </button>
        </div>

        {/* Catalog Menu Grid */}
        {filteredDishes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'var(--text-muted)' }}>
            <span style={{ fontSize: '3rem' }}>🐘</span>
            <p style={{ marginTop: '1rem', fontSize: '1.1rem' }}>{t('ui.empty')}</p>
          </div>
        ) : (
          <div className="menu-grid">
            {filteredDishes.map(dish => (
              <DishCard 
                key={dish.id} 
                dish={dish} 
                onAdd={(d, variantId) => handleAddDish(d, variantId)} 
                isAdmin={isAdmin}
                onEdit={(d) => {
                  setActiveEditDish(d);
                  setIsEditDishOpen(true);
                }}
              />
            ))}
          </div>
        )}

        {/* Info & Location Section (Google Maps Embed) */}
        <section 
          style={{
            marginTop: '6rem',
            padding: '3rem 2rem',
            background: 'rgba(28, 23, 18, 0.35)',
            border: '1px solid rgba(210, 125, 45, 0.12)',
            borderRadius: 'var(--radius-lg)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)'
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'center' }}>
            
            {/* Contact details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)', fontWeight: 800, fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                <span>{t('ui.restaurant')}</span>
              </div>
              
              <h2 style={{ fontSize: '2.2rem', color: 'white', fontWeight: 800, margin: 0, letterSpacing: '-0.02em' }}>
                {t('ui.visitUs')}
              </h2>
              
              <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: 1.5, margin: 0 }}>
                {t('ui.visitDesc')}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
                
                {/* Address */}
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <MapPin size={22} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <h4 style={{ color: 'white', margin: '0 0 0.25rem 0', fontWeight: 700 }}>{t('ui.addressTitle')}</h4>
                    <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.925rem' }}>{t('ui.addressDesc')}</p>
                  </div>
                </div>

                {/* Telephone */}
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <Phone size={22} style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <h4 style={{ color: 'white', margin: '0 0 0.25rem 0', fontWeight: 700 }}>{t('ui.phoneTitle')}</h4>
                    <p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.925rem' }}>{t('ui.phoneDesc')}</p>
                  </div>
                </div>

                {/* Instagram */}
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <svg 
                    viewBox="0 0 24 24" 
                    width="22" 
                    height="22" 
                    stroke="var(--primary)" 
                    strokeWidth="2" 
                    fill="none" 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    style={{ flexShrink: 0, marginTop: '2px' }}
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                  <div>
                    <h4 style={{ color: 'white', margin: '0 0 0.25rem 0', fontWeight: 700 }}>Síganos en Redes Sociales</h4>
                    <a 
                      href="https://www.instagram.com/sawasdeepy/" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      style={{ color: 'var(--primary)', textDecoration: 'none', fontSize: '0.925rem', fontWeight: 600 }}
                    >
                      @sawasdeepy (Instagram Oficial)
                    </a>
                  </div>
                </div>

              </div>
            </div>

            {/* Google Map iframe */}
            <div className="footer-map-container" style={{ width: '100%', height: '350px' }}>
              <iframe 
                title="Mapa de Sawasdee"
                src="https://maps.google.com/maps?q=-25.2896783,-57.5759826&t=&z=17&ie=UTF8&iwloc=&output=embed" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={false} 
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

          </div>
        </section>

      </main>

      {/* Floating Cart Action Button */}
      {totalCount > 0 && (
        <button 
          onClick={() => setIsCartOpen(true)}
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            background: 'var(--primary)',
            color: '#0a0b0d',
            border: 'none',
            borderRadius: '50px',
            padding: '1rem 1.6rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontSize: '1.05rem',
            fontWeight: 800,
            boxShadow: 'var(--shadow-lg)',
            cursor: 'pointer',
            zIndex: 40,
            transition: 'var(--transition)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.boxShadow = '0 10px 20px rgba(212,175,55,0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.boxShadow = 'var(--shadow-lg)';
          }}
        >
          <span>🐘</span>
          Ver mi Pedido ({totalCount}) — {totalPrice.toLocaleString('es-PY')} Gs.
        </button>
      )}

      {/* Floating Reservation Button */}
      {totalCount === 0 && (
        <button 
          onClick={() => setIsReservationOpen(true)}
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            background: 'rgba(28, 23, 18, 0.9)',
            backdropFilter: 'blur(10px)',
            color: 'var(--primary)',
            border: '1px solid rgba(210, 125, 45, 0.3)',
            borderRadius: '50px',
            padding: '1rem 1.6rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontSize: '1.05rem',
            fontWeight: 800,
            boxShadow: 'var(--shadow-lg)',
            cursor: 'pointer',
            zIndex: 40,
            transition: 'var(--transition)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'scale(1.05)';
            e.currentTarget.style.background = 'var(--bg-card)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'scale(1)';
            e.currentTarget.style.background = 'rgba(28, 23, 18, 0.9)';
          }}
        >
          <CalendarPlus size={20} />
          Reservar una mesa
        </button>
      )}

      {/* Cart Modal component */}
      <CartModal 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onRemove={handleRemoveFromCart}
        onClear={handleClearCart}
        onUpdateQuantity={handleUpdateQuantity}
      />

      {/* Reservation Drawer component */}
      <ReservationDrawer 
        isOpen={isReservationOpen}
        onClose={() => setIsReservationOpen(false)}
      />

      {/* Customize Spice & Notes Modal */}
      <CustomizeModal 
        isOpen={!!selectedDishForCustomization}
        onClose={() => setSelectedDishForCustomization(null)}
        dish={selectedDishForCustomization}
        onConfirm={(dish, spice, notes) => addToCart(dish, spice, notes)}
      />

      {/* 📣 MODAL DE PROMOCIÓN — Slider multi-promo con transición izq→der */}
      {showPromo && activePromo && activePromo.image && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0, 0, 0, 0.85)', backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', zIndex: 1000, padding: '1rem', animation: 'fadeIn 0.3s ease'
        }}>
          <div style={{
            position: 'relative', background: 'var(--bg-card)', border: '2px solid var(--primary)',
            borderRadius: '24px', maxWidth: '480px', width: '100%', overflow: 'hidden',
            boxShadow: '0 25px 60px -15px rgba(210, 125, 45, 0.5)',
            display: 'flex', flexDirection: 'column',
            animation: 'scaleUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
          }}>

            {/* ✕ Close button */}
            <button onClick={() => setShowPromo(false)} style={{
              position: 'absolute', top: '14px', right: '14px', width: '34px', height: '34px',
              borderRadius: '50%', background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(210,125,45,0.4)',
              color: 'white', fontSize: '1rem', fontWeight: 700, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 20, transition: 'all 0.2s'
            }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--primary)'; e.currentTarget.style.color = '#0a0b0d'; }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,0,0,0.7)'; e.currentTarget.style.color = 'white'; }}
            >✕</button>

            {/* ── IMAGE SLIDER with CSS slide animation ── */}
            <div style={{ position: 'relative', width: '100%', aspectRatio: '0.85', overflow: 'hidden', background: '#0a0b0d' }}>
              <img
                key={`${activePromo.id}-${promoSlideIndex}`}
                src={activePromo.image}
                alt="Sawasdee Promoción"
                style={{
                  width: '100%', height: '100%', objectFit: 'contain',
                  animation: `slideIn${promoSlideDir === 'right' ? 'Right' : 'Left'} 0.35s cubic-bezier(0.25,1,0.5,1) both`
                }}
              />

              {/* Left arrow — only if multiple promos */}
              {validPromos.length > 1 && (
                <button onClick={() => handlePromoSlide('left')} style={{
                  position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)',
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)',
                  color: 'white', fontSize: '1.1rem', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  zIndex: 10, transition: 'all 0.2s'
                }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--primary)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.55)'}
                >‹</button>
              )}

              {/* Right arrow */}
              {validPromos.length > 1 && (
                <button onClick={() => handlePromoSlide('right')} style={{
                  position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)',
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.15)',
                  color: 'white', fontSize: '1.1rem', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  zIndex: 10, transition: 'all 0.2s'
                }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--primary)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(0,0,0,0.55)'}
                >›</button>
              )}

              {/* Dots indicator */}
              {validPromos.length > 1 && (
                <div style={{ position: 'absolute', bottom: '10px', left: 0, right: 0, display: 'flex', justifyContent: 'center', gap: '6px' }}>
                  {validPromos.map((_, i) => (
                    <div key={i} onClick={() => { setPromoSlideDir(i > promoSlideIndex ? 'right' : 'left'); setPromoSlideIndex(i); setPromoQuantity(1); }} style={{
                      width: i === promoSlideIndex ? '18px' : '7px', height: '7px',
                      borderRadius: '50px', background: i === promoSlideIndex ? 'var(--primary)' : 'rgba(255,255,255,0.4)',
                      transition: 'all 0.3s', cursor: 'pointer'
                    }} />
                  ))}
                </div>
              )}
            </div>

            {/* Info + Actions Panel */}
            <div style={{ padding: '1.25rem 1.5rem', background: 'rgba(28,23,18,0.96)', display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '1px solid rgba(210,125,45,0.15)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <h4 style={{ color: 'white', margin: '0 0 3px', fontSize: '1.15rem', fontWeight: 800 }}>{activePromo.name}</h4>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{activePromo.desc}</span>
                </div>
                <div style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--primary)', whiteSpace: 'nowrap', marginLeft: '0.75rem' }}>
                  {activePromo.price.toLocaleString()} Gs.
                </div>
              </div>

              {/* Quantity */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.03)', padding: '0.65rem 1rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'white' }}>Cantidad:</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <button onClick={() => setPromoQuantity(Math.max(1, promoQuantity - 1))} style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                  >-</button>
                  <span style={{ fontSize: '1.05rem', fontWeight: 900, color: 'var(--primary)', minWidth: '20px', textAlign: 'center' }}>{promoQuantity}</span>
                  <button onClick={() => setPromoQuantity(promoQuantity + 1)} style={{ width: '30px', height: '30px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                  >+</button>
                </div>
              </div>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button onClick={() => setShowPromo(false)} style={{ flex: 1, background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', padding: '0.8rem', color: 'white', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', transition: 'background 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >Cerrar</button>
                <button onClick={() => {
                  const promoDish: DishItem = { id: `promo_${activePromo.id}`, name: activePromo.name, description: activePromo.desc, price: activePromo.price, image: activePromo.image };
                  addToCart(promoDish, undefined, undefined, promoQuantity);
                  setShowPromo(false);
                }} style={{ flex: 2, background: 'var(--primary)', border: 'none', borderRadius: '10px', padding: '0.8rem', color: '#0a0b0d', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer', boxShadow: '0 4px 15px rgba(210,125,45,0.25)', transition: 'background 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'var(--primary-hover)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'var(--primary)'}
                >Agregar ({(activePromo.price * promoQuantity).toLocaleString()} Gs.)</button>
              </div>
            </div>

            {/* Countdown bar */}
            <div style={{ width: '100%', height: '3px', background: 'rgba(255,255,255,0.08)' }}>
              <div style={{ height: '100%', background: 'var(--primary)', animation: 'countdown 10s linear forwards' }}></div>
            </div>
          </div>

          <style>{`
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes scaleUp { from { transform: scale(0.93); opacity: 0; } to { transform: scale(1); opacity: 1; } }
            @keyframes countdown { from { width: 100%; } to { width: 0%; } }
            @keyframes slideInRight { from { transform: translateX(60px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
            @keyframes slideInLeft  { from { transform: translateX(-60px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
          `}</style>
        </div>
      )}


      {/* ========================================================================= */}
      {/* 🔐 MODAL DE INICIO DE SESIÓN */}
      {/* ========================================================================= */}

      {isLoginOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '1rem'
        }}>
          <div className="glass" style={{
            width: '100%', maxWidth: '400px',
            background: 'rgba(20, 21, 25, 0.95)',
            border: '1px solid rgba(210, 125, 45, 0.25)',
            borderRadius: '16px', padding: '2rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.7)',
            display: 'flex', flexDirection: 'column', gap: '1.5rem'
          }}>
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '2.5rem' }}>🔐</span>
              <h3 style={{ fontSize: '1.5rem', color: 'white', fontWeight: 800, margin: '0.5rem 0 0.25rem 0' }}>
                Acceso Administrador
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
                Ingrese sus credenciales de seguridad
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <label style={{ color: 'white', fontSize: '0.85rem', fontWeight: 600 }}>Usuario</label>
                <input 
                  type="text" 
                  value={loginUsername}
                  onChange={(e) => {
                    setLoginUsername(e.target.value);
                    setLoginError('');
                  }}
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(210, 125, 45, 0.2)',
                    borderRadius: '8px', padding: '0.75rem 1rem',
                    color: 'white', outline: 'none', fontSize: '0.95rem'
                  }}
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <label style={{ color: 'white', fontSize: '0.85rem', fontWeight: 600 }}>Contraseña</label>
                <input 
                  type="password" 
                  value={loginPassword}
                  onChange={(e) => {
                    setLoginPassword(e.target.value);
                    setLoginError('');
                  }}
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(210, 125, 45, 0.2)',
                    borderRadius: '8px', padding: '0.75rem 1rem',
                    color: 'white', outline: 'none', fontSize: '0.95rem'
                  }}
                  placeholder="••••••••"
                />
              </div>

              {loginError && (
                <span style={{ color: '#f87171', fontSize: '0.85rem', fontWeight: 600, textAlign: 'center' }}>
                  ⚠️ {loginError}
                </span>
              )}
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
              <button 
                onClick={() => setIsLoginOpen(false)}
                style={{
                  flex: 1, background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px', padding: '0.75rem',
                  color: 'white', fontWeight: 600, cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button 
                onClick={handleLoginSubmit}
                style={{
                  flex: 1, background: 'var(--primary)',
                  border: 'none', borderRadius: '8px', padding: '0.75rem',
                  color: '#0a0b0d', fontWeight: 700, cursor: 'pointer'
                }}
              >
                Ingresar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ⚙️ MODAL DE EDICIÓN DE CREDENCIALES */}
      {/* ========================================================================= */}
      {isEditCredsOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '1rem'
        }}>
          <div className="glass" style={{
            width: '100%', maxWidth: '400px',
            background: 'rgba(20, 21, 25, 0.95)',
            border: '1px solid rgba(210, 125, 45, 0.25)',
            borderRadius: '16px', padding: '2rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.7)',
            display: 'flex', flexDirection: 'column', gap: '1.5rem'
          }}>
            <div style={{ textAlign: 'center' }}>
              <span style={{ fontSize: '2.5rem' }}>⚙️</span>
              <h3 style={{ fontSize: '1.5rem', color: 'white', fontWeight: 800, margin: '0.5rem 0 0.25rem 0' }}>
                Credenciales de Acceso
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', margin: 0 }}>
                Cambie su nombre de usuario y contraseña administrador
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <label style={{ color: 'white', fontSize: '0.85rem', fontWeight: 600 }}>Nuevo Usuario</label>
                <input 
                  type="text" 
                  value={newUsername}
                  onChange={(e) => setNewUsername(e.target.value)}
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(210, 125, 45, 0.2)',
                    borderRadius: '8px', padding: '0.75rem 1rem',
                    color: 'white', outline: 'none', fontSize: '0.95rem'
                  }}
                  placeholder="Ej. LIDIAYFRED"
                />
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <label style={{ color: 'white', fontSize: '0.85rem', fontWeight: 600 }}>Nueva Contraseña</label>
                <input 
                  type="password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(210, 125, 45, 0.2)',
                    borderRadius: '8px', padding: '0.75rem 1rem',
                    color: 'white', outline: 'none', fontSize: '0.95rem'
                  }}
                  placeholder="Nueva contraseña"
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
              <button 
                onClick={() => setIsEditCredsOpen(false)}
                style={{
                  flex: 1, background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px', padding: '0.75rem',
                  color: 'white', fontWeight: 600, cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button 
                onClick={handleSaveCredentials}
                style={{
                  flex: 1, background: 'var(--primary)',
                  border: 'none', borderRadius: '8px', padding: '0.75rem',
                  color: '#0a0b0d', fontWeight: 700, cursor: 'pointer'
                }}
              >
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ✏️ MODAL DE EDICIÓN DE PLATO CON CORTADOR INTERACTIVO */}
      {/* ========================================================================= */}
      {isEditDishOpen && activeEditDish && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '1rem', overflowY: 'auto'
        }}>
          <div className="glass" style={{
            width: '100%', maxWidth: '550px',
            background: 'rgba(20, 21, 25, 0.98)',
            border: '1px solid rgba(210, 125, 45, 0.25)',
            borderRadius: '16px', padding: '2rem',
            boxShadow: '0 20px 50px rgba(0,0,0,0.8)',
            display: 'flex', flexDirection: 'column', gap: '1.25rem',
            maxHeight: '90vh', overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.75rem' }}>
              <h3 style={{ fontSize: '1.35rem', color: 'white', fontWeight: 800, margin: 0 }}>
                Editar: {activeEditDish.name}
              </h3>
              <button 
                onClick={() => setIsEditDishOpen(false)}
                style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', fontSize: '1.5rem', cursor: 'pointer' }}
              >
                &times;
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {/* Dish Name */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <label style={{ color: 'white', fontSize: '0.85rem', fontWeight: 600 }}>Nombre del Plato</label>
                <input 
                  type="text" 
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(210, 125, 45, 0.15)',
                    borderRadius: '8px', padding: '0.65rem 0.85rem',
                    color: 'white', outline: 'none', fontSize: '0.95rem'
                  }}
                />
              </div>

              {/* Price */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <label style={{ color: 'white', fontSize: '0.85rem', fontWeight: 600 }}>Precio (Gs.)</label>
                <input 
                  type="number" 
                  value={editPrice}
                  onChange={(e) => setEditPrice(parseInt(e.target.value) || 0)}
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(210, 125, 45, 0.15)',
                    borderRadius: '8px', padding: '0.65rem 0.85rem',
                    color: 'white', outline: 'none', fontSize: '0.95rem'
                  }}
                />
              </div>

              {/* Ingredients / Description */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                <label style={{ color: 'white', fontSize: '0.85rem', fontWeight: 600 }}>Ingredientes / Descripción</label>
                <textarea 
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  rows={3}
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(210, 125, 45, 0.15)',
                    borderRadius: '8px', padding: '0.65rem 0.85rem',
                    color: 'white', outline: 'none', fontSize: '0.925rem', resize: 'vertical',
                    lineHeight: 1.4
                  }}
                />
              </div>

              {/* File Image Upload */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <label style={{ color: 'white', fontSize: '0.85rem', fontWeight: 600 }}>Foto del Plato (Proporción 10:7)</label>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <label 
                    style={{
                      background: 'rgba(210, 125, 45, 0.12)',
                      color: 'var(--primary)',
                      border: '1px solid var(--primary)',
                      padding: '0.5rem 1rem',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      fontWeight: 700,
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'var(--primary)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(210, 125, 45, 0.12)'}
                  >
                    📂 Seleccionar Imagen
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageUpload} 
                      style={{ display: 'none' }} 
                    />
                  </label>
                  {isNewImageUploaded ? (
                    <span style={{ color: '#4ade80', fontSize: '0.85rem', fontWeight: 600 }}>
                      ✓ Imagen cargada (Lista para recortar)
                    </span>
                  ) : (
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.825rem' }}>
                      Cargue una imagen para habilitar el zoom/arrastre
                    </span>
                  )}
                </div>
              </div>

              {/* Crop Panel */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.25rem' }}>
                <div 
                  ref={cropPreviewRef}
                  style={{
                    width: '100%',
                    aspectRatio: '10/7',
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: '12px',
                    border: '2px dashed rgba(210, 125, 45, 0.3)',
                    background: '#0a0b0d',
                    cursor: uploadImageSrc ? (isDragging ? 'grabbing' : 'grab') : 'default',
                    userSelect: 'none',
                    touchAction: 'none'
                  }}
                  onMouseDown={handleMouseDown}
                  onMouseMove={handleMouseMove}
                  onMouseUp={handleMouseUp}
                  onMouseLeave={handleMouseUp}
                  onTouchStart={handleTouchStart}
                  onTouchMove={handleTouchMove}
                  onTouchEnd={handleMouseUp}
                >
                  {uploadImageSrc ? (
                    <img 
                      src={uploadImageSrc}
                      alt="Preview"
                      style={{
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        transform: `translate(calc(-50% + ${offset.x}px), calc(-50% + ${offset.y}px)) scale(${zoom})`,
                        transformOrigin: 'center center',
                        width: 'auto',
                        height: 'auto',
                        maxWidth: '100%',
                        maxHeight: '100%',
                        pointerEvents: 'none'
                      }}
                    />
                  ) : (
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', gap: '0.5rem', padding: '1rem', textAlign: 'center' }}>
                      <span style={{ fontSize: '2rem' }}>🖼️</span>
                      <span style={{ fontSize: '0.825rem' }}>Vista previa de encuadre interactivo.</span>
                      <span style={{ fontSize: '0.75rem', opacity: 0.7 }}>Para recortar y posicionar libremente, cargue una imagen nueva arriba.</span>
                    </div>
                  )}
                </div>

                {uploadImageSrc && (
                  <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      <span>🔍 Acercar / Alejar: <strong>{zoom.toFixed(1)}x</strong></span>
                      <span>👈 Arrastre para centrar</span>
                    </div>
                    <input 
                      type="range" 
                      min="1.0" 
                      max="3.0" 
                      step="0.05" 
                      value={zoom} 
                      onChange={(e) => setZoom(parseFloat(e.target.value))}
                      style={{
                        width: '100%',
                        accentColor: 'var(--primary)',
                        background: 'rgba(255,255,255,0.08)',
                        height: '6px',
                        borderRadius: '3px',
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                    />
                  </div>
                )}
              </div>

            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
              <button 
                onClick={() => setIsEditDishOpen(false)}
                style={{
                  flex: 1, background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '8px', padding: '0.75rem',
                  color: 'white', fontWeight: 600, cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button 
                onClick={handleSaveDish}
                style={{
                  flex: 1, background: 'var(--primary)',
                  border: 'none', borderRadius: '8px', padding: '0.75rem',
                  color: '#0a0b0d', fontWeight: 700, cursor: 'pointer'
                }}
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer Info */}
      <footer style={{ marginTop: '6rem', textAlign: 'center', padding: '2rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.03)', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
        <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'center' }}>
          <p style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', margin: 0 }}>
            Made with <Heart size={12} style={{ color: 'var(--primary)' }} /> by Antigravity | Cocina con Seguridad <ShieldCheck size={14} style={{ color: '#81b29a' }} />
          </p>
          <p style={{ margin: 0 }}>
            &copy; {new Date().getFullYear()} Sawasdee - Authentic Thai & Indian Cuisine. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;
