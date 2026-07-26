import wsallCover from '@/assets/projects/wsall/cover.svg'
import wsallG1 from '@/assets/projects/wsall/gallery-1.png'
import wsallG2 from '@/assets/projects/wsall/gallery-2.png'
import wsallG3 from '@/assets/projects/wsall/gallery-3.png'
import lemseCover from '@/assets/projects/lemse/cover.svg'
import lemseG1 from '@/assets/projects/lemse/gallery-1.png'
import lemseG2 from '@/assets/projects/lemse/gallery-2.png'
import lemseG3 from '@/assets/projects/lemse/gallery-3.png'
import mernRestaurantCover from '@/assets/projects/mern-restaurant/cover.svg'
import mernRestaurantG1 from '@/assets/projects/mern-restaurant/gallery-1.png'
import mernRestaurantG2 from '@/assets/projects/mern-restaurant/gallery-2.png'
import mernRestaurantG3 from '@/assets/projects/mern-restaurant/gallery-3.png'
import mernAdminCover from '@/assets/projects/mern-admin/cover.svg'
import mernAdminG1 from '@/assets/projects/mern-admin/gallery-1.png'
import mernAdminG2 from '@/assets/projects/mern-admin/gallery-2.png'
import mernAdminG3 from '@/assets/projects/mern-admin/gallery-3.png'
import eshopitCover from '@/assets/projects/eshopit/cover.svg'
import eshopitG1 from '@/assets/projects/eshopit/gallery-1.png'
import eshopitG2 from '@/assets/projects/eshopit/gallery-2.png'
import eshopitG3 from '@/assets/projects/eshopit/gallery-3.png'

export interface Project {
  id: string
  slug: string
  title: { en: string; ar: string }
  category: string
  categoryAr: string
  description: { en: string; ar: string }
  shortDescription: { en: string; ar: string }
  image: string
  gallery: string[]
  tech: string[]
  liveUrl?: string
  githubUrl?: string
  status: string
  featured: boolean
  highlights?: string[]
}

export const projects: Project[] = [
  {
    id: '1',
    slug: 'wsall',
    title: { en: 'Wsall', ar: 'وصّل' },
    category: 'MERN Chat Application',
    categoryAr: 'تطبيق محادثات MERN',
    description: {
      en: 'Real-time chat platform built using the MERN stack. Supports authentication, messaging, conversations, modern UI, and scalable architecture.',
      ar: 'منصة محادثات فورية مبنية باستخدام MERN. تدعم تسجيل الدخول والرسائل والمحادثات وواجهة حديثة.',
    },
    shortDescription: {
      en: 'MERN stack real-time chat platform with authentication and modern UI.',
      ar: 'منصة محادثات فورية مع تسجيل الدخول وواجهة حديثة.',
    },
    image: wsallCover,
    gallery: [wsallG1, wsallG2, wsallG3],
    tech: ['React', 'TypeScript', 'Node.js', 'Express', 'MongoDB', 'Socket.io'],
    liveUrl: 'https://wsall-chat-app.vercel.app/login',
    status: 'live',
    featured: true,
  },
  {
    id: '2',
    slug: 'lemse',
    title: { en: 'Lemse', ar: 'لمسة' },
    category: 'Personal Portfolio',
    categoryAr: 'بورتفوليو شخصي',
    description: {
      en: 'Professional portfolio website designed to showcase services, projects, and business presence with modern UI/UX.',
      ar: 'موقع بورتفوليو احترافي مصمم لعرض الخدمات والمشاريع بلمسة عصرية.',
    },
    shortDescription: {
      en: 'Professional portfolio with modern UI/UX and bilingual support.',
      ar: 'بورتفوليو احترافي مع واجهة عصرية ودعم ثنائي اللغة.',
    },
    image: lemseCover,
    gallery: [lemseG1, lemseG2, lemseG3],
    tech: ['React', 'TypeScript', 'Tailwind CSS'],
    liveUrl: 'https://lemse.vercel.app/',
    status: 'live',
    featured: true,
  },
  {
    id: '3',
    slug: 'mern-restaurant',
    title: { en: 'MERN Restaurant', ar: 'مطعم MERN' },
    category: 'Restaurant Ordering Platform',
    categoryAr: 'منصة طلبات وإدارة مطعم',
    description: {
      en: 'A modern full-stack restaurant application built with the MERN stack. The platform allows customers to browse and filter menu items, create accounts, upload profile images, manage shopping carts, and complete secure online payments through Stripe. Administrators can manage menu products while authenticated users can place orders and track their selections through a responsive and user-friendly interface.',
      ar: 'تطبيق مطاعم متكامل مبني باستخدام MERN Stack يتيح للعملاء تصفح قائمة الطعام وتصفية المنتجات وإنشاء الحسابات وإدارة سلة المشتريات وإتمام عمليات الدفع الآمنة عبر Stripe. كما يوفر لوحة تحكم للإدارة لإضافة المنتجات وإدارة المحتوى ضمن واجهة حديثة ومتجاوبة مع جميع الأجهزة.',
    },
    shortDescription: {
      en: 'A full-stack restaurant platform with online ordering, Stripe payments, user authentication, and an admin-controlled menu system.',
      ar: 'منصة متكاملة للمطاعم تتيح الطلبات الإلكترونية والدفع عبر Stripe وإدارة المنتجات مع نظام تسجيل مستخدمين متكامل.',
    },
    image: mernRestaurantCover,
    gallery: [mernRestaurantG1, mernRestaurantG2, mernRestaurantG3],
    tech: ['React', 'Node.js', 'Express.js', 'MongoDB', 'Redux Toolkit', 'Tailwind CSS', 'Stripe', 'React Router', 'Vercel', 'Render'],
    liveUrl: 'https://mern-restaurant-pied.vercel.app/',
    status: 'Completed',
    featured: true,
    highlights: [
      'User Authentication & Registration',
      'Profile Image Upload',
      'Product Filtering & Search',
      'Shopping Cart Management',
      'Quantity Increase & Decrease',
      'Stripe Payment Integration',
      'Admin Product Management',
      'Protected Checkout Process',
      'Responsive Design',
      'Error Handling & Custom 404 Page',
      'Redux Toolkit State Management',
    ],
  },
  {
    id: '4',
    slug: 'mern-admin',
    title: { en: 'MERN Admin Dashboard', ar: 'لوحة تحكم MERN الإدارية' },
    category: 'Admin Dashboard',
    categoryAr: 'لوحة تحكم إدارية',
    description: {
      en: 'A full-stack administration platform built with the MERN stack, designed to help businesses monitor performance, manage customers, track transactions, and visualize operational data through interactive dashboards and analytics tools. The application includes responsive layouts, dark and light themes, server-side pagination, geographical insights, sales reporting, and customizable charts for business intelligence.',
      ar: 'منصة إدارية متكاملة مبنية باستخدام MERN Stack تساعد الشركات على متابعة الأداء وإدارة العملاء وتتبع المعاملات وعرض البيانات التشغيلية من خلال لوحات معلومات وتحليلات تفاعلية. تتضمن المنصة واجهات متجاوبة بالكامل ودعم الوضعين الداكن والفاتح وتقارير المبيعات والتحليلات الجغرافية ومخططات الأعمال القابلة للتخصيص.',
    },
    shortDescription: {
      en: 'A modern MERN-based admin dashboard featuring analytics, customer management, sales tracking, and business insights.',
      ar: 'لوحة تحكم حديثة مبنية بتقنيات MERN توفر التحليلات وإدارة العملاء وتتبع المبيعات ومؤشرات الأعمال.',
    },
    image: mernAdminCover,
    gallery: [mernAdminG1, mernAdminG2, mernAdminG3],
    tech: ['React', 'Node.js', 'Express.js', 'MongoDB', 'Redux Toolkit', 'Material UI', 'Nivo Charts'],
    liveUrl: 'https://mern-admin.netlify.app/dashboard',
    status: 'Completed',
    featured: true,
    highlights: [
      'Interactive Analytics Dashboard',
      'Customer Management',
      'Sales & Transaction Tracking',
      'Business Performance Reports',
      'Geography & Regional Insights',
      'Responsive Design',
      'Dark & Light Themes',
      'Server-Side Pagination',
      'Advanced Data Visualization',
      'Role-Based Administration',
    ],
  },
  {
    id: '5',
    slug: 'eshopit',
    title: { en: 'eShopIt', ar: 'إي شوب إت' },
    category: 'E-Commerce Platform',
    categoryAr: 'منصة تجارة إلكترونية',
    description: {
      en: 'A complete e-commerce platform built with the MERN stack. The system includes secure authentication, product management, shopping cart functionality, wishlists, reviews and ratings, payment processing, email notifications, and a dedicated admin dashboard for managing products, orders, and users. Built with scalability, security, and maintainability in mind.',
      ar: 'منصة تجارة إلكترونية متكاملة مبنية باستخدام MERN Stack. توفر إدارة المنتجات، سلة التسوق، قائمة المفضلة، التقييمات والمراجعات، معالجة المدفوعات، الإشعارات البريدية، بالإضافة إلى لوحة تحكم إدارية لإدارة المستخدمين والطلبات والمنتجات. تم تطويرها مع التركيز على القابلية للتوسع والأمان وسهولة الصيانة.',
    },
    shortDescription: {
      en: 'Full-featured MERN e-commerce platform with authentication, shopping cart, wishlist, payments, reviews, and admin management tools.',
      ar: 'منصة تجارة إلكترونية متكاملة مبنية بتقنيات MERN تتضمن المصادقة، سلة التسوق، المفضلة، المدفوعات، التقييمات ولوحة إدارة متقدمة.',
    },
    image: eshopitCover,
    gallery: [eshopitG1, eshopitG2, eshopitG3],
    tech: ['Node.js', 'Express.js', 'MongoDB', 'Mongoose', 'JWT', 'bcrypt', 'Razorpay', 'Nodemailer', 'Express Validator', 'Vercel'],
    liveUrl: 'https://e-shopit.vercel.app/',
    status: 'Completed',
    featured: true,
    highlights: [
      'JWT Authentication',
      'Product Management',
      'Shopping Cart',
      'Wishlist',
      'Reviews & Ratings',
      'Payment Integration',
      'Admin Dashboard',
      'Email Notifications',
    ],
  },
]
