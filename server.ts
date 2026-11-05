import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

// Body parser with generous size for images upload
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Ensure data directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const storeFilePath = path.join(dataDir, 'store.json');

// Interface for database schema
interface StoreDB {
  products: any[];
  categories: any[];
  orders: any[];
  settings: any;
  reviews: any[];
  faqs: any[];
  admin: {
    passwordHash: string;
    salt: string;
    isSetup: boolean;
  };
  orderCounter: number;
}

// PBKDF2 Password Hashing with SHA-512 and 100,000 iterations with cryptographically random salt
function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
}

function verifyPassword(password: string, storedHash: string, storedSalt: string): boolean {
  if (!password || !storedHash || !storedSalt) return false;
  try {
    const computedHash = hashPassword(password, storedSalt);
    const computedBuf = Buffer.from(computedHash, 'hex');
    const storedBuf = Buffer.from(storedHash, 'hex');
    if (computedBuf.length !== storedBuf.length) return false;
    return crypto.timingSafeEqual(computedBuf, storedBuf);
  } catch {
    return false;
  }
}

// Initial secure salt & hash (PBKDF2-SHA512, 100k iterations)
const INITIAL_ADMIN_SALT = '0b751a5fd135346918bcacb9848eef07b2ed6104c62e8b9d78a0d2aeb2553152';
const INITIAL_ADMIN_HASH = 'b5083476ac15ae9021edf254dd4c2ebae758aab750e1b3c7ba4fa2c4dae0298c316676bb21200188bceee3de664b992848a1f8a41c529a6bd804b735ae525931';

// Initial seed data with our generated images
const initialData: StoreDB = {
  orderCounter: 100,
  admin: {
    passwordHash: INITIAL_ADMIN_HASH,
    salt: INITIAL_ADMIN_SALT,
    isSetup: true,
  },
  settings: {
    storeName: 'CENTER AL ASSAL',
    storeNameArabic: 'سنتر العسال لتجارة المفروشات',
    logoUrl: '',
    heroHeadline: 'الفخامة العصرية لراحة منزلك',
    heroSubheadline: 'تشكيلة راقية من أرقى المفروشات، الملايات القطنية، والبطاطين الفاخرة بجودة عالمية وتصاميم تواكب أحدث صيحات 2026.',
    heroImageUrl: '/src/assets/images/hero_luxury_bedding_1793871158417.jpg',
    announcement: '✨ شحن سريع لجميع محافظات مصر | خصومات حصرية للموسم الجديد تصل إلى 35%',
    phones: ['01277714100', '01279207793'],
    whatsapp: '201277714100',
    branches: [
      {
        id: 'branch-1',
        name: 'الفرع الأول – المعرض الرئيسي',
        address: '8 شارع أنور السادات',
        phone: '01277714100',
        hours: 'يومياً من 10:00 صباحاً حتى 11:00 مساءً',
        mapUrl: 'https://maps.google.com/?q=8+Anwar+El+Sadat+Street',
        isMain: true,
      },
      {
        id: 'branch-2',
        name: 'الفرع الثاني – فرع كرموز',
        address: '95 عمود السواري – كرموز',
        phone: '01279207793',
        hours: 'يومياً من 11:00 صباحاً حتى 11:30 مساءً',
        mapUrl: 'https://maps.google.com/?q=95+Pompeys+Pillar+Karmouz',
        isMain: false,
      },
    ],
    paymentSettings: {
      codEnabled: true,
      instapayEnabled: true,
      instapayHandle: 'alassal.center@instapay',
      instapayPhone: '01277714100',
      walletEnabled: true,
      walletNumber: '01277714100',
      walletProvider: 'فودافون كاش / إنستاباي / محفظة بنكية',
      walletBeneficiary: 'سنتر العسال للمفروشات',
    },
    shippingRate: 50,
    freeShippingThreshold: 1200,
    aiAssistantEnabled: true,
  },
  categories: [
    {
      id: 'cat-bedsheets',
      name: 'أطقم الملايات',
      slug: 'bedsheets',
      description: 'أطقم ملايات قطن مصري 100% بتطريزات راقية وخامات فائقة النعومة تدوم طويلاً.',
      image: '/src/assets/images/category_bedsheets_1793871159128.jpg',
      itemCount: 4,
    },
    {
      id: 'cat-comforters',
      name: 'اللحاف والكوفرتات',
      slug: 'comforters',
      description: 'ألحفة فندقية شتوية وصيفية بحشوات ميكروفايبر معالجة ولمسات جمالية ساحرة.',
      image: '/src/assets/images/category_comforters_1793871160345.jpg',
      itemCount: 3,
    },
    {
      id: 'cat-blankets',
      name: 'البطاطين',
      slug: 'blankets',
      description: 'بطاطين حفر ليزر فاخرة وطبقات مزدوجة للدفء الملكي في ليالي الشتاء.',
      image: '/src/assets/images/category_blankets_1793871160966.jpg',
      itemCount: 3,
    },
    {
      id: 'cat-bedcovers',
      name: 'المفارش العصرية',
      slug: 'bedcovers',
      description: 'مفارش سرير للعرائس والمناسبات بتطريزات كلاسيكية ومودرن تضفي بهجة وفخامة.',
      image: '/src/assets/images/hero_luxury_bedding_1793871158417.jpg',
      itemCount: 2,
    },
    {
      id: 'cat-towels',
      name: 'الفوط والبشاكير',
      slug: 'towels',
      description: 'بشاكير وفوط حمام قطن ناعم عالي الامتصاص بألوان هادئة مستوحاة من الطبيعة.',
      image: '/src/assets/images/category_towels_1793871160094.jpg',
      itemCount: 3,
    },
    {
      id: 'cat-pillows',
      name: 'المخدات والوسائد',
      slug: 'pillows',
      description: 'مخدات فندقية طبية ومريحة تدعم الرقبة لنوم هادئ ومريح كل ليلة.',
      image: '/src/assets/images/category_comforters_1793871160345.jpg',
      itemCount: 2,
    },
    {
      id: 'cat-rugs',
      name: 'السجاد والمشايات',
      slug: 'rugs',
      description: 'سجاد أرضيات ناعم بتصاميم بوهيمية ومودرن تمنح غرفتك دفئاً استثنائياً.',
      image: '/src/assets/images/category_blankets_1793871160966.jpg',
      itemCount: 2,
    },
    {
      id: 'cat-curtains',
      name: 'الستائر الفاخرة',
      slug: 'curtains',
      description: 'ستائر شيفون وقطيفة متناسقة تمنح إضاءة طبيعية دافئة لغرف النوم والمعيشة.',
      image: '/src/assets/images/hero_luxury_bedding_1793871158417.jpg',
      itemCount: 2,
    },
    {
      id: 'cat-others',
      name: 'منتجات أخرى',
      slug: 'others',
      description: 'إكسسوارات سرير، أغطية حماية للمراتب ومكملات الديكور المنزلي.',
      image: '/src/assets/images/category_towels_1793871160094.jpg',
      itemCount: 1,
    },
  ],
  products: [
    {
      id: 'prod-1',
      name: 'طقم ملاية ملكي تطريز يدوي – قطن مصري 100%',
      slug: 'royal-egyptian-cotton-bedsheet',
      categoryId: 'cat-bedsheets',
      categoryName: 'أطقم الملايات',
      description: 'طقم ملايات سرير فاخر مصنوع من أجود خيوط القطن المصري طويل التيلة (600 غرزة). ناعم كالحرير مع تطريز راقٍ بأطراف الأكياس ومحيط الملاءة باللون السماوي والذهبي الشامبين. يتضمن ملاية سرير كبيرة، 2 كيس وسادة، و2 كيس خدادية.',
      price: 1450,
      originalPrice: 1850,
      discount: 22,
      images: [
        '/src/assets/images/category_bedsheets_1793871159128.jpg',
        '/src/assets/images/hero_luxury_bedding_1793871158417.jpg',
      ],
      sizes: ['كينج كبير (240×260 سم)', 'كوين وسط (220×240 سم)', 'سرير مفرد (180×220 سم)'],
      colors: ['أبيض عاجي وتطريز أزرق', 'بيج كريمي وهادئ', 'أخضر مريمي راقي'],
      fabrics: ['قطن مصري 100% طويل التيلة', 'معالجة ضد الانكماش وتغير الألوان'],
      stock: 24,
      isAvailable: true,
      isNew: true,
      isBestSeller: true,
      isFeatured: true,
      rating: 4.9,
      reviewsCount: 46,
      createdAt: '2026-03-01T10:00:00.000Z',
    },
    {
      id: 'prod-2',
      name: 'لحاف ميكروفايبر فندقي دبل فيس – شتوي دافئ',
      slug: 'hotel-microfiber-winter-comforter',
      categoryId: 'cat-comforters',
      categoryName: 'اللحاف والكوفرتات',
      description: 'لحاف شتوي ملكي بتصميم مضلع ماسي يضمن توزيع الحشوة بشكل متساوي لدفء متكامل. وجه أبيض عاجي فندقي والوجه الآخر أزرق ثلجي هادئ. حشوة داخلية ميكروفايبر حرارية مقاومة للبكتيريا وحساسية الصدر.',
      price: 2150,
      originalPrice: 2600,
      discount: 17,
      images: [
        '/src/assets/images/category_comforters_1793871160345.jpg',
        '/src/assets/images/hero_luxury_bedding_1793871158417.jpg',
      ],
      sizes: ['مقاس كبير كينج (240×260 سم)', 'مقاس مفرد (180×240 سم)'],
      colors: ['أبيض ثلجي / أزرق سماوي', 'أوف وايت / كريمي بيج'],
      fabrics: ['خامة خارجية ميكروفايبر ناعمة جداً', 'حشوة فايبر بكر معالج حرارياً'],
      stock: 15,
      isAvailable: true,
      isNew: true,
      isBestSeller: true,
      isFeatured: true,
      rating: 5.0,
      reviewsCount: 32,
      createdAt: '2026-03-02T11:00:00.000Z',
    },
    {
      id: 'prod-3',
      name: 'بطانية حفر ليزر فاخرة طبقتين – دفء وسحر شتوي',
      slug: 'embossed-plush-luxury-blanket',
      categoryId: 'cat-blankets',
      categoryName: 'البطاطين',
      description: 'بطانية شتوية إسبانية الصنع بطبقتين سميكتين ولمسة مخملية فائقة النعومة، مزينة بنقوش ليزر بارزة تمنح غرفة النوم فخامة كلاسيكية لا تضاهى. وزن ممتاز يمنح الدفء والراحة في أبرد الليالي.',
      price: 1890,
      originalPrice: 2300,
      discount: 18,
      images: [
        '/src/assets/images/category_blankets_1793871160966.jpg',
      ],
      sizes: ['مقاس كبير (220×240 سم) وزن 6 كجم', 'مقاس جامبو (240×260 سم) وزن 8 كجم'],
      colors: ['كريمي دافئ', 'أخضر مريمي فاتح', 'سماوي ثلجي'],
      fabrics: ['مخمل بوليستر تركي فائق النعومة', 'حفر ليزر ثلاثي الأبعاد'],
      stock: 18,
      isAvailable: true,
      isNew: false,
      isBestSeller: true,
      isFeatured: true,
      rating: 4.8,
      reviewsCount: 58,
      createdAt: '2026-03-03T09:30:00.000Z',
    },
    {
      id: 'prod-4',
      name: 'طقم فوط وبشاكير قطن 100% – 6 قطع هيدروفيليك',
      slug: 'hydrophilic-cotton-towel-set',
      categoryId: 'cat-towels',
      categoryName: 'الفوط والبشاكير',
      description: 'طقم مناشف سبا فندقية متكامل مكون من 2 بشكير حمام كبير، 2 فوطة يد، و2 فوطة وجه. تتميز بقدرة امتصاص فائقة ونعومة تدوم حتى بعد الغسيل المتكرر. ألوان متناسقة تناسب جميع ديكورات الحمامات العصرية.',
      price: 890,
      originalPrice: 1100,
      discount: 19,
      images: [
        '/src/assets/images/category_towels_1793871160094.jpg',
      ],
      sizes: ['طقم 6 قطع متكامل (2 بشكير 90×150 + 2 فوطة 50×100 + 2 وجه 30×50)'],
      colors: ['مزيج مريمي وأبيض وأزرق هادئ', 'أبيض فندقي موحد', 'بيج كريمي'],
      fabrics: ['قطن مصري 100% هيدروفيليك عالي الامتصاص'],
      stock: 40,
      isAvailable: true,
      isNew: true,
      isBestSeller: false,
      isFeatured: true,
      rating: 4.9,
      reviewsCount: 29,
      createdAt: '2026-03-04T14:15:00.000Z',
    },
    {
      id: 'prod-5',
      name: 'طقم مفرش عرائسي ساتان مطرز بحبات اللؤلؤ',
      slug: 'bridal-pearl-embroidered-bedcover',
      categoryId: 'cat-bedcovers',
      categoryName: 'المفارش العصرية',
      description: 'مفرش سرير زفاف ملكي مصنوع من الساتان الفاخر مع تطريز راقي ولمسات ذهب شامبين خفيفة. يمنح غرفة العروسين حضوراً ملكياً فخماً لا يُنسى.',
      price: 2750,
      originalPrice: 3400,
      discount: 19,
      images: [
        '/src/assets/images/hero_luxury_bedding_1793871158417.jpg',
        '/src/assets/images/category_bedsheets_1793871159128.jpg',
      ],
      sizes: ['طقم ملكي 7 قطع (مفرش 260×270 + ملاية + 4 خداديات + كوشن)'],
      colors: ['أوف وايت عاجي', 'شامبين هادئ'],
      fabrics: ['ساتان حريري مستورد مع بطانة قطن نقية'],
      stock: 8,
      isAvailable: true,
      isNew: true,
      isBestSeller: false,
      isFeatured: true,
      rating: 5.0,
      reviewsCount: 19,
      createdAt: '2026-03-05T12:00:00.000Z',
    },
  ],
  orders: [
    {
      id: 'order-sample-1',
      orderCode: 'CAA-2026-00001',
      customerName: 'أحمد محمود الرفاعي',
      customerPhone: '01012345678',
      customerEmail: 'ahmed@example.com',
      governorate: 'الإسكندرية',
      city: 'سموحة',
      address: 'شارع فوزي معاذ، عمارة الأمل، الدور الخامس',
      notes: 'يرجى الاتصال قبل الوصول بنصف ساعة',
      items: [
        {
          productId: 'prod-1',
          productName: 'طقم ملاية ملكي تطريز يدوي – قطن مصري 100%',
          price: 1450,
          quantity: 1,
          size: 'كينج كبير (240×260 سم)',
          color: 'أبيض عاجي وتطريز أزرق',
          image: '/src/assets/images/category_bedsheets_1793871159128.jpg',
        },
      ],
      subtotal: 1450,
      shippingCost: 0,
      discountAmount: 0,
      total: 1450,
      paymentMethod: 'cod',
      paymentStatus: 'verified',
      orderStatus: 'delivered',
      adminNotes: 'تم تسليم الطلب للعميل واستلام المبلغ نقداً بنجاح.',
      createdAt: '2026-03-01T15:20:00.000Z',
      updatedAt: '2026-03-02T16:00:00.000Z',
    },
  ],
  reviews: [
    {
      id: 'rev-1',
      author: 'منى الشاذلي',
      city: 'الإسكندرية',
      rating: 5,
      comment: 'ما شاء الله خامات سنتر العسال فوق الممتازة! أطقم الملايات ناعمة جداً والقطن مصري أصيل بعد الغسيل ما كش ولا غير لون. فرع كرموز تعاملهم محترم وسريع جداً.',
      productName: 'طقم ملاية ملكي تطريز يدوي',
      date: '2026-03-02',
      verifiedPurchase: true,
    },
    {
      id: 'rev-2',
      author: 'محمود الصاوي',
      city: 'القاهرة',
      rating: 5,
      comment: 'اللحاف الميكروفايبر الشتوي دافئ جداً وخفيف ومرتب على السرير، الدفع عند الاستلام وصل في يومين فقط وتغليف محكم وراقي.',
      productName: 'لحاف ميكروفايبر فندقي دبل فيس',
      date: '2026-03-03',
      verifiedPurchase: true,
    },
    {
      id: 'rev-3',
      author: 'سارة عبدالرحمن',
      city: 'الجيزة',
      rating: 5,
      comment: 'اشتريت جهاز بنتي بالكامل من سنتر العسال. المفروشات والبطاطين تشرف بجد، والأسعار ممتازة مقارنة بالسوق. شكراً سنتر العسال!',
      productName: 'بطانية حفر ليزر فاخرة',
      date: '2026-03-04',
      verifiedPurchase: true,
    },
  ],
  faqs: [
    {
      id: 'faq-1',
      question: 'ما هي مواعيد العمل في فروع سنتر العسال؟',
      answer: 'فرعنا الرئيسي بـ 8 شارع أنور السادات يعمل يومياً من الساعة 10:00 صباحاً حتى 11:00 مساءً. والفرع الثاني في 95 عمود السواري – كرموز يعمل يومياً من 11:00 صباحاً حتى 11:30 مساءً.',
      category: 'الفروع',
    },
    {
      id: 'faq-2',
      question: 'ما هي طرق الدفع المتاحة في المتجر؟',
      answer: 'نوفر الدفع عند الاستلام لجميع محافظات مصر، بالإضافة إلى التحويل المباشر عبر InstaPay، والمحافظ الإلكترونية (فودافون كاش، أورنج كاش، اتصالات كاش، وي باي) مع رفع إيصال التحويل.',
      category: 'الدفع',
    },
    {
      id: 'faq-3',
      question: 'كم يستغرق شحن الطلبات؟',
      answer: 'داخل الإسكندرية يتم التوصيل خلال 24 إلى 48 ساعة. باقي محافظات مصر خلال 2 إلى 4 أيام عمل. وتمنح الطلبات التي تتجاوز 1200 جنيه شحناً مجانياً.',
      category: 'الشحن',
    },
    {
      id: 'faq-4',
      question: 'ما هي سياسة الاستبدال والاسترجاع؟',
      answer: 'يحق للعميل استبدال أو استرجاع المنتج خلال 14 يوماً من تاريخ الاستلام بشرط أن يكون المنتج بحالته الأصلية وفي غلافه وغير مستعمل.',
      category: 'الاسترجاع',
    },
  ],
};

// Helper functions for reading and writing to DB
function getDB(): StoreDB {
  try {
    if (fs.existsSync(storeFilePath)) {
      const content = fs.readFileSync(storeFilePath, 'utf-8');
      return JSON.parse(content);
    }
  } catch (err) {
    console.error('Error reading store DB:', err);
  }
  // Initialize with initial data
  saveDB(initialData);
  return initialData;
}

function saveDB(data: StoreDB): void {
  try {
    fs.writeFileSync(storeFilePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving store DB:', err);
  }
}

// Ensure DB file exists on launch
if (!fs.existsSync(storeFilePath)) {
  saveDB(initialData);
}

// Credentials resolver with environment variable / Cloudflare Secrets support
function getAdminCredentials(db: StoreDB): { hash: string; salt: string } {
  if (process.env.ADMIN_PASSWORD_HASH && process.env.ADMIN_PASSWORD_SALT) {
    return {
      hash: process.env.ADMIN_PASSWORD_HASH,
      salt: process.env.ADMIN_PASSWORD_SALT,
    };
  }
  if (process.env.ADMIN_PASSWORD) {
    const salt = INITIAL_ADMIN_SALT;
    const hash = hashPassword(process.env.ADMIN_PASSWORD, salt);
    return { hash, salt };
  }
  if (db.admin && db.admin.passwordHash && db.admin.salt) {
    return {
      hash: db.admin.passwordHash,
      salt: db.admin.salt,
    };
  }
  return {
    hash: INITIAL_ADMIN_HASH,
    salt: INITIAL_ADMIN_SALT,
  };
}

// Rate Limiter against brute-force login attempts
interface LoginAttempt {
  count: number;
  firstAttempt: number;
  blockedUntil: number;
}

const loginAttempts = new Map<string, LoginAttempt>();
const MAX_FAILED_ATTEMPTS = 5;
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes window
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes lockout

function getClientIp(req: Request): string {
  return (
    (req.headers['cf-connecting-ip'] as string) ||
    (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() ||
    req.ip ||
    req.socket.remoteAddress ||
    'unknown'
  );
}

function checkRateLimit(ip: string): { allowed: boolean; retryAfterSeconds?: number } {
  const now = Date.now();
  const attempt = loginAttempts.get(ip);
  if (!attempt) return { allowed: true };

  // If locked out
  if (attempt.blockedUntil > now) {
    const retryAfterSeconds = Math.ceil((attempt.blockedUntil - now) / 1000);
    return { allowed: false, retryAfterSeconds };
  }

  // If window expired, reset
  if (now - attempt.firstAttempt > ATTEMPT_WINDOW_MS) {
    loginAttempts.delete(ip);
    return { allowed: true };
  }

  return { allowed: true };
}

function recordFailedAttempt(ip: string) {
  const now = Date.now();
  const attempt = loginAttempts.get(ip);
  if (!attempt || now - attempt.firstAttempt > ATTEMPT_WINDOW_MS) {
    loginAttempts.set(ip, { count: 1, firstAttempt: now, blockedUntil: 0 });
  } else {
    attempt.count += 1;
    if (attempt.count >= MAX_FAILED_ATTEMPTS) {
      attempt.blockedUntil = now + LOCKOUT_DURATION_MS;
    }
  }
}

function clearLoginAttempts(ip: string) {
  loginAttempts.delete(ip);
}

// Middleware: Admin auth check
const ADMIN_SECRET_TOKEN = process.env.ADMIN_SESSION_TOKEN || 'alassal-admin-session-token-2026';
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'غير مصرح: يلزم تسجيل الدخول كمسؤول' });
  }
  const token = authHeader.split(' ')[1];
  if (token !== ADMIN_SECRET_TOKEN) {
    return res.status(403).json({ error: 'رمز الجلسة غير صالح أو منتهي الصلاحية' });
  }
  next();
}

// -------------------------------------------------------------
// REST API ROUTES
// -------------------------------------------------------------

// 1. Products API
app.get('/api/products', (req: Request, res: Response) => {
  const db = getDB();
  let list = db.products || [];
  
  const { category, featured, search } = req.query;
  if (category && typeof category === 'string') {
    list = list.filter((p) => p.categoryId === category || p.slug === category);
  }
  if (featured === 'true') {
    list = list.filter((p) => p.isFeatured || p.isBestSeller);
  }
  if (search && typeof search === 'string') {
    const q = search.trim().toLowerCase();
    list = list.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.categoryName && p.categoryName.toLowerCase().includes(q))
    );
  }
  res.json(list);
});

app.get('/api/products/:id', (req: Request, res: Response) => {
  const db = getDB();
  const product = db.products.find((p) => p.id === req.params.id || p.slug === req.params.id);
  if (!product) {
    return res.status(404).json({ error: 'المنتج غير موجود' });
  }
  res.json(product);
});

app.post('/api/products', requireAdmin, (req: Request, res: Response) => {
  const db = getDB();
  const newProduct = {
    ...req.body,
    id: req.body.id || 'prod-' + Date.now(),
    createdAt: new Date().toISOString(),
    rating: req.body.rating || 5.0,
    reviewsCount: req.body.reviewsCount || 0,
  };
  db.products.unshift(newProduct);
  saveDB(db);
  res.status(201).json(newProduct);
});

app.put('/api/products/:id', requireAdmin, (req: Request, res: Response) => {
  const db = getDB();
  const index = db.products.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'المنتج غير موجود' });
  }
  db.products[index] = { ...db.products[index], ...req.body, id: req.params.id };
  saveDB(db);
  res.json(db.products[index]);
});

app.delete('/api/products/:id', requireAdmin, (req: Request, res: Response) => {
  const db = getDB();
  const index = db.products.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'المنتج غير موجود' });
  }
  const deleted = db.products.splice(index, 1);
  saveDB(db);
  res.json({ success: true, deleted: deleted[0] });
});

// 2. Categories API
app.get('/api/categories', (_req: Request, res: Response) => {
  const db = getDB();
  res.json(db.categories || []);
});

app.post('/api/categories', requireAdmin, (req: Request, res: Response) => {
  const db = getDB();
  const newCategory = {
    ...req.body,
    id: req.body.id || 'cat-' + Date.now(),
    itemCount: req.body.itemCount || 0,
  };
  db.categories.push(newCategory);
  saveDB(db);
  res.status(201).json(newCategory);
});

app.put('/api/categories/:id', requireAdmin, (req: Request, res: Response) => {
  const db = getDB();
  const index = db.categories.findIndex((c) => c.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'القسم غير موجود' });
  }
  db.categories[index] = { ...db.categories[index], ...req.body, id: req.params.id };
  saveDB(db);
  res.json(db.categories[index]);
});

app.delete('/api/categories/:id', requireAdmin, (req: Request, res: Response) => {
  const db = getDB();
  const index = db.categories.findIndex((c) => c.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'القسم غير موجود' });
  }
  const deleted = db.categories.splice(index, 1);
  saveDB(db);
  res.json({ success: true, deleted: deleted[0] });
});

// 3. Orders API with Sequential Unique Codes
app.post('/api/orders', (req: Request, res: Response) => {
  const db = getDB();
  
  // Format code: CAA-2026-00001
  db.orderCounter = (db.orderCounter || 100) + 1;
  const counterStr = String(db.orderCounter).padStart(5, '0');
  const orderCode = `CAA-2026-${counterStr}`;

  const {
    customerName,
    customerPhone,
    customerEmail,
    governorate,
    city,
    address,
    notes,
    items,
    subtotal,
    shippingCost,
    discountAmount,
    total,
    paymentMethod,
    paymentReceiptUrl,
  } = req.body;

  if (!customerName || !customerPhone || !address || !items || items.length === 0) {
    return res.status(400).json({ error: 'بيانات الطلب غير مكتملة' });
  }

  const newOrder = {
    id: 'ord-' + Date.now(),
    orderCode,
    customerName,
    customerPhone,
    customerEmail: customerEmail || '',
    governorate: governorate || 'الإسكندرية',
    city: city || '',
    address,
    notes: notes || '',
    items,
    subtotal: subtotal || 0,
    shippingCost: shippingCost || 0,
    discountAmount: discountAmount || 0,
    total: total || 0,
    paymentMethod: paymentMethod || 'cod',
    paymentReceiptUrl: paymentReceiptUrl || '',
    paymentStatus: paymentMethod === 'cod' ? 'pending' : 'pending',
    orderStatus: 'new',
    adminNotes: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.orders.unshift(newOrder);
  saveDB(db);

  res.status(201).json({
    success: true,
    order: newOrder,
  });
});

// Track order with code and phone verification
app.post('/api/orders/track', (req: Request, res: Response) => {
  const { orderCode, phone } = req.body;
  if (!orderCode) {
    return res.status(400).json({ error: 'يرجى إدخال كود الطلب' });
  }

  const db = getDB();
  const cleanCode = orderCode.trim().toUpperCase();
  const cleanPhone = (phone || '').trim().replace(/\s+/g, '');

  const order = db.orders.find((o) => {
    if (o.orderCode.toUpperCase() !== cleanCode) return false;
    if (cleanPhone) {
      // allow flexible phone comparison (e.g. 012... or with country code)
      const orderPhone = (o.customerPhone || '').replace(/\s+/g, '');
      return orderPhone.endsWith(cleanPhone) || cleanPhone.endsWith(orderPhone);
    }
    return true;
  });

  if (!order) {
    return res.status(404).json({ error: 'لم يتم العثور على طلب بهذا الكود ورقم الهاتف' });
  }

  // Return safe customer view of order
  res.json({
    orderCode: order.orderCode,
    customerName: order.customerName,
    createdAt: order.createdAt,
    orderStatus: order.orderStatus,
    paymentStatus: order.paymentStatus,
    paymentMethod: order.paymentMethod,
    total: order.total,
    items: order.items,
    governorate: order.governorate,
    city: order.city,
    shippingCost: order.shippingCost,
  });
});

// Admin Orders list and status update
app.get('/api/orders', requireAdmin, (_req: Request, res: Response) => {
  const db = getDB();
  res.json(db.orders || []);
});

app.put('/api/orders/:id/status', requireAdmin, (req: Request, res: Response) => {
  const db = getDB();
  const index = db.orders.findIndex((o) => o.id === req.params.id || o.orderCode === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'الطلب غير موجود' });
  }
  const { orderStatus, paymentStatus, adminNotes } = req.body;
  if (orderStatus) db.orders[index].orderStatus = orderStatus;
  if (paymentStatus) db.orders[index].paymentStatus = paymentStatus;
  if (adminNotes !== undefined) db.orders[index].adminNotes = adminNotes;
  db.orders[index].updatedAt = new Date().toISOString();
  saveDB(db);
  res.json(db.orders[index]);
});

// 4. Settings API
app.get('/api/settings', (_req: Request, res: Response) => {
  const db = getDB();
  res.json(db.settings);
});

app.put('/api/settings', requireAdmin, (req: Request, res: Response) => {
  const db = getDB();
  db.settings = { ...db.settings, ...req.body };
  saveDB(db);
  res.json(db.settings);
});

// 5. Admin Authentication
app.post('/api/admin/login', (req: Request, res: Response) => {
  const clientIp = getClientIp(req);

  // Rate Limiting check
  const rateCheck = checkRateLimit(clientIp);
  if (!rateCheck.allowed) {
    const minutes = Math.ceil((rateCheck.retryAfterSeconds || 60) / 60);
    return res.status(429).json({
      error: `تم حظر محاولات الدخول مؤقتاً لتكرار المحاولات الخاطئة. يرجى الانتظار لمدة ${minutes} دقيقة والمحاولة لاحقاً.`,
      retryAfterSeconds: rateCheck.retryAfterSeconds,
    });
  }

  const { password } = req.body;
  if (!password || typeof password !== 'string') {
    recordFailedAttempt(clientIp);
    return res.status(400).json({ error: 'كلمة المرور مطلوبة' });
  }

  const db = getDB();
  const creds = getAdminCredentials(db);
  const isValid = verifyPassword(password, creds.hash, creds.salt);

  if (isValid) {
    // Clear any previous failed attempts on successful authentication
    clearLoginAttempts(clientIp);
    return res.json({
      success: true,
      token: ADMIN_SECRET_TOKEN,
      username: 'مدير سنتر العسال',
    });
  }

  // Record failed attempt and compute remaining attempts
  recordFailedAttempt(clientIp);
  const attempt = loginAttempts.get(clientIp);
  const remaining = Math.max(0, MAX_FAILED_ATTEMPTS - (attempt?.count || 0));

  if (remaining === 0) {
    return res.status(429).json({
      error: 'تم تجاوز الحد الأقصى للمحاولات الخاطئة (5 محاولات). تم حظر محاولات تسجيل الدخول مؤقتاً لمدة 15 دقيقة.',
    });
  }

  return res.status(401).json({
    error: `كلمة المرور غير صحيحة. المحاولات المتبقية: ${remaining}`,
  });
});

app.post('/api/admin/change-password', requireAdmin, (req: Request, res: Response) => {
  const { newPassword } = req.body;
  if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 6) {
    return res.status(400).json({ error: 'كلمة المرور يجب أن لا تقل عن 6 أحرف' });
  }
  const db = getDB();
  const newSalt = crypto.randomBytes(32).toString('hex');
  const newPasswordHash = hashPassword(newPassword, newSalt);

  db.admin = {
    passwordHash: newPasswordHash,
    salt: newSalt,
    isSetup: true,
  };
  saveDB(db);
  res.json({ success: true, message: 'تم تحديث كلمة المرور وتشفيرها بنجاح' });
});

app.get('/api/admin/metrics', requireAdmin, (_req: Request, res: Response) => {
  const db = getDB();
  const orders = db.orders || [];
  const products = db.products || [];

  const totalOrders = orders.length;
  const newOrders = orders.filter((o) => o.orderStatus === 'new').length;
  const completedOrders = orders.filter((o) => o.orderStatus === 'delivered').length;
  const cancelledOrders = orders.filter((o) => o.orderStatus === 'cancelled').length;
  const totalSales = orders
    .filter((o) => o.orderStatus !== 'cancelled')
    .reduce((sum, o) => sum + (o.total || 0), 0);

  // Unique customers based on phone
  const uniquePhones = new Set(orders.map((o) => o.customerPhone).filter(Boolean));

  res.json({
    totalOrders,
    newOrders,
    completedOrders,
    cancelledOrders,
    totalSales,
    totalProducts: products.length,
    totalCustomers: uniquePhones.size,
  });
});

// Reviews and FAQs
app.get('/api/reviews', (_req: Request, res: Response) => {
  const db = getDB();
  res.json(db.reviews || []);
});

app.get('/api/faqs', (_req: Request, res: Response) => {
  const db = getDB();
  res.json(db.faqs || []);
});

// -------------------------------------------------------------
// 6. ASSAL AI Assistant (Safe Backend Integration with Gemini)
// -------------------------------------------------------------
app.post('/api/gemini/chat', async (req: Request, res: Response) => {
  const { message, conversationHistory } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'الرسالة مطلوبة' });
  }

  const db = getDB();

  // Build live context knowledge base from store DB
  const storeContext = {
    brandName: db.settings.storeName,
    brandNameArabic: db.settings.storeNameArabic,
    branches: db.settings.branches,
    phones: db.settings.phones,
    whatsapp: db.settings.whatsapp,
    categories: db.categories.map((c) => ({ id: c.id, name: c.name, description: c.description })),
    products: db.products
      .filter((p) => p.isAvailable)
      .map((p) => ({
        id: p.id,
        name: p.name,
        price: p.price,
        originalPrice: p.originalPrice,
        discount: p.discount,
        category: p.categoryName,
        sizes: p.sizes,
        colors: p.colors,
        fabrics: p.fabrics,
        stock: p.stock,
      })),
    paymentSettings: db.settings.paymentSettings,
    shippingRate: db.settings.shippingRate,
    freeShippingThreshold: db.settings.freeShippingThreshold,
    faqs: db.faqs,
  };

  const systemInstruction = `أنت "ASSAL AI" – المساعد الذكي الرسمي لمتجر "CENTER AL ASSAL | سنتر العسال لتجارة المفروشات".
مهمتك مساعدة العملاء بكل ود واحترافية وبلهجة مصرية مهذبة أو فصحى راقية حسب رغبة العميل.

بيانات المتجر الحالية المعتمدة حصراً:
${JSON.stringify(storeContext, null, 2)}

قواعد وتعليمات هامة وصارمة:
1. أنت تفهم اللهجة المصرية والأخطاء الإملائية والأسئلة الطبيعية عن المقاسات، الخامات، الألوان، الأسعار، وطرق الدفع.
2. لا تخترع منتجات أو أسعار أو معلومات شحن غير موجودة في البيانات المذكورة أعلاه.
3. إذا سأل العميل عن فروعنا ومواعيدها:
   - الفرع الأول (المعرض الرئيسي): 8 شارع أنور السادات (10:00 ص - 11:00 م)
   - الفرع الثاني: 95 عمود السواري – كرموز (11:00 ص - 11:30 م)
   - أرقام الهاتف: 01277714100 و 01279207793 (متاح أيضاً واتساب).
4. طرق الدفع المتاحة: الدفع عند الاستلام في كل مصر، أو InstaPay، أو المحافظ الإلكترونية (فودافون كاش، أورنج، اتصالات، وي).
5. الشحن مجاني لأي طلب بقيمة ${db.settings.freeShippingThreshold} جنيه أو أكثر، والشحن العادي بـ ${db.settings.shippingRate} جنيه.
6. إذا طلب العميل إضافة منتج إلى السلة، أو رغب في شرائه، يمكنك تضمين هذا الأمر في نهاية ردك:
   [ACTION:ADD_TO_CART:productId:size:color]
   حيث productId هو معرف المنتج، والمقاس واللون المتوفرين.
7. إذا سأل عن كود طلب أو تتبع طلب، اطلب منه كود الطلب ورقم الهاتف المرفق لنوجهه لصفحة تتبع الطلب.
8. إذا لم تكن متأكداً من معلومة، أخبر العميل بلطف واعرض عليه التواصل مباشرة مع خدمة العملاء على واتساب 01277714100.
9. لا تناقش صلاحيات الأدمن أو تغيير الأسعار.`;

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Fallback response if API key is not yet set
      return res.json({
        reply: `أهلاً بك في سنتر العسال لتجارة المفروشات! يسعدني مساعدتك في استعراض أطقم الملايات، البطاطين، والألحفة الفندقية. يمكنك أيضاً التواصل مع فروعنا مباشرة على 01277714100.`,
      });
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    // Build chat contents from conversation history if provided
    let promptContents = message;
    if (conversationHistory && Array.isArray(conversationHistory) && conversationHistory.length > 0) {
      const historyContext = conversationHistory
        .slice(-6)
        .map((h: any) => `${h.sender === 'user' ? 'العميل' : 'المساعد'}: ${h.text}`)
        .join('\n');
      promptContents = `سياق المحادثة السابقة:\n${historyContext}\n\nرسالة العميل الحالية: ${message}`;
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: promptContents,
      config: {
        systemInstruction,
      },
    });

    const reply = response.text || 'أهلاً بك! كيف يمكنني مساعدتك في سنتر العسال اليوم؟';
    res.json({ reply });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    res.status(500).json({
      error: 'عذراً، حدث خطأ أثناء معالجة استفسارك. يمكنك التواصل مع خدمة العملاء عبر واتساب 01277714100.',
      reply: 'أهلاً بك في سنتر العسال! يرجى التحقق من مفتاح الذكاء الاصطناعي أو الاتصال بنا مباشرة على 01277714100 وسنكون سعداء بخدمتك.',
    });
  }
});

// -------------------------------------------------------------
// Vite middleware integration (Full-stack setup)
// -------------------------------------------------------------
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CENTER AL ASSAL server running at http://localhost:${PORT}`);
  });
}

startServer();
