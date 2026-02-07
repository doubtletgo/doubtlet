export const APP_URL =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000'
    : 'https://doubtlet.com';

export const BASE_API_URL = 'https://doubt.doubtlet.com/api';

export const baseUrl = {
  development: 'http://localhost:3000',
  production: 'https://doubtlet.com',
  test: 'http://localhost:5000',
}[process.env.NODE_ENV];

export const API_URLS = {
  //   GET_SUBJECT_DETAILS: '/get-subject-details.php?request=subject_details',
  QUESTIONS: '/get-question-details.php',
  GET_SOLUTION_DETAILS: '/get-question-details.php?request=solution_details',
  GET_BLOG_LIST: '/get-blog-details.php',
  GET_BLOG_DETAILS: '/get-blog-details.php',
};

export const BLOGS_PER_PAGE = 16;

export const SUBJECT_LIST = [
  {
    subject_id: 'B_001_001',
    subject_name: 'PHYSICS',
    sub_subject_details: [
      {
        subject_id: 'B_001_001_01',
        subject_name: 'MECHANICS',
      },
      {
        subject_id: 'B_001_001_02',
        subject_name: 'ELECTRO DYNAMICS',
      },
      {
        subject_id: 'B_001_001_03',
        subject_name: 'MODERN PHYSICS',
      },
      {
        subject_id: 'B_001_001_04',
        subject_name: 'OPTICS',
      },
      {
        subject_id: 'B_001_001_05',
        subject_name: 'ADVANCE PHYSICS',
      },
      {
        subject_id: 'B_001_001_06',
        subject_name: 'MECHANICS',
      },
      {
        subject_id: 'B_001_001_07',
        subject_name: 'ELECTRO DYNAMICS',
      },
      {
        subject_id: 'B_001_001_08',
        subject_name: 'MODERN PHYSICS',
      },
      {
        subject_id: 'B_001_001_09',
        subject_name: 'OPTICS',
      },
      {
        subject_id: 'B_001_001_10',
        subject_name: 'ADVANCE PHYSICS',
      },
    ],
  },
  {
    subject_id: 'B_001_002',
    subject_name: 'MATHEMATICS',
    sub_subject_details: [
      {
        subject_id: 'B_001_002_02',
        subject_name: 'ALGEBRA',
      },
      {
        subject_id: 'B_001_002_03',
        subject_name: 'CALCULUS',
      },
      {
        subject_id: 'B_001_002_04',
        subject_name: 'TRIGNOMETRY',
      },
      {
        subject_id: 'B_001_002_05',
        subject_name: 'GEOMETRY',
      },
      {
        subject_id: 'B_001_002_06',
        subject_name: 'OTHER MATHS',
      },
      {
        subject_id: 'B_001_002_07',
        subject_name: 'ADVANCE MATHS',
      },
      {
        subject_id: 'B_001_002_08',
        subject_name: 'DISCRETE MATHS',
      },
      {
        subject_id: 'B_001_002_09',
        subject_name: 'DIFFERENTIAL EQUATION',
      },
      {
        subject_id: 'B_001_002_10',
        subject_name: 'LINEAR ALGEBRA',
      },
      {
        subject_id: 'B_001_002_11',
        subject_name: 'PRE-ALGEBRA',
      },
      {
        subject_id: 'B_001_002_12',
        subject_name: 'PRE-CALCULUS',
      },
      {
        subject_id: 'B_001_002_13',
        subject_name: 'VECTOR-CALCULUS',
      },
      {
        subject_id: 'B_001_002_14',
        subject_name: 'BUSINESS-CALCULUS',
      },
    ],
  },
  {
    subject_id: 'B_001_003',
    subject_name: 'CHEMISTRY',
    sub_subject_details: [
      {
        subject_id: 'B_001_003_01',
        subject_name: 'IN-ORGANIC',
      },
      {
        subject_id: 'B_001_003_02',
        subject_name: 'ORGANIC',
      },
      {
        subject_id: 'B_001_003_03',
        subject_name: 'PHYSICAL',
      },
      {
        subject_id: 'B_001_003_04',
        subject_name: 'ADVANCE CHEMESTRY',
      },
    ],
  },
  {
    subject_id: 'B_001_004',
    subject_name: 'BIOLOGY',
    sub_subject_details: [
      {
        subject_id: 'B_001_004_01',
        subject_name: 'ZOOLOGY',
      },
      {
        subject_id: 'B_001_004_02',
        subject_name: 'BOTNAY',
      },
      {
        subject_id: 'B_001_004_03',
        subject_name: 'ANATOMY & PHYSIOLOGY',
      },
      {
        subject_id: 'B_001_004_04',
        subject_name: 'ADVANCE BIOLOGY',
      },
    ],
  },
  {
    subject_id: 'B_001_005',
    subject_name: 'STATISTICS & PROBABILITY',
    sub_subject_details: [],
  },
  {
    subject_id: 'B_001_006',
    subject_name: 'ELECTRONICS ENGINEERING',
    sub_subject_details: [],
  },
  {
    subject_id: 'B_001_007',
    subject_name: 'ELECTRICAL ENGINEERING',
    sub_subject_details: [],
  },
  {
    subject_id: 'B_001_008',
    subject_name: 'MECHANICAL ENGINEERING',
    sub_subject_details: [],
  },
  {
    subject_id: 'B_001_009',
    subject_name: 'COMPUTER SCIENCE ENGINEERING',
    sub_subject_details: [],
  },
  {
    subject_id: 'B_001_010',
    subject_name: 'CIVIL ENGINEERING',
    sub_subject_details: [],
  },
  {
    subject_id: 'B_001_011',
    subject_name: 'CHEMICAL ENGINEERING',
    sub_subject_details: [],
  },
  {
    subject_id: 'B_001_012',
    subject_name: 'PSYCOLOGY',
    sub_subject_details: [],
  },
  {
    subject_id: 'B_001_013',
    subject_name: 'NURSING',
    sub_subject_details: [],
  },
  {
    subject_id: 'B_001_014',
    subject_name: 'OPERATION & RESEARCH',
    sub_subject_details: [],
  },
  {
    subject_id: 'B_001_015',
    subject_name: 'ACCOUNTING',
    sub_subject_details: [],
  },
  {
    subject_id: 'B_001_016',
    subject_name: 'ECONOMICS',
    sub_subject_details: [],
  },
  {
    subject_id: 'B_001_017',
    subject_name: 'FINANCE',
    sub_subject_details: [],
  },
  {
    subject_id: 'B_001_018',
    subject_name: 'ENVIRONMENT & EARTH SCIENCE',
    sub_subject_details: [],
  },
];

export const SUBJECT_IDS: Record<string, string> = {
  physics: 'B_001_001',
  mechanics: 'B_001_001_06',
  'electro-dynamics': 'B_001_001_07',
  'modern-physics': 'B_001_001_08',
  optics: 'B_001_001_09',
  'advance-physics': 'B_001_001_10',
  mathematics: 'B_001_002',
  algebra: 'B_001_002_02',
  calculus: 'B_001_002_03',
  trignometry: 'B_001_002_04',
  geometry: 'B_001_002_05',
  'other-maths': 'B_001_002_06',
  'advance-maths': 'B_001_002_07',
  'discrete-maths': 'B_001_002_08',
  'differential-equation': 'B_001_002_09',
  'linear-algebra': 'B_001_002_10',
  'pre-algebra': 'B_001_002_11',
  'pre-calculus': 'B_001_002_12',
  'vector-calculus': 'B_001_002_13',
  'business-calculus': 'B_001_002_14',
  chemistry: 'B_001_003',
  'in-organic': 'B_001_003_01',
  organic: 'B_001_003_02',
  physical: 'B_001_003_03',
  'advance-chemestry': 'B_001_003_04',
  biology: 'B_001_004',
  zoology: 'B_001_004_01',
  botnay: 'B_001_004_02',
  'anatomy-&-physiology': 'B_001_004_03',
  'advance-biology': 'B_001_004_04',
  'statistics-&-probability': 'B_001_005',
  'electronics-engineering': 'B_001_006',
  'electrical-engineering': 'B_001_007',
  'mechanical-engineering': 'B_001_008',
  'computer-science-engineering': 'B_001_009',
  'civil-engineering': 'B_001_010',
  'chemical-engineering': 'B_001_011',
  psycology: 'B_001_012',
  nursing: 'B_001_013',
  'operation-&-research': 'B_001_014',
  accounting: 'B_001_015',
  economics: 'B_001_016',
  finance: 'B_001_017',
  'environment-&-earth-science': 'B_001_018',
};
