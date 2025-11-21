import type { Opportunity, Company, Post, Application, User, Applicant, Mentor, TimeSlot, ScheduledMentorship } from './types';

// This file is now deprecated for opportunities, companies, and applications,
// as this data is fetched from the API. It is kept for other mock data like feed posts.

export const companies: Company[] = [
  // This data is now fetched from /api/empresas
];

export const opportunities: Opportunity[] = [
  // This data is now fetched from /api/ofertas
];

const mockUser: User = {
  id: 'user-2',
  name: 'Carlos Ruiz',
  email: 'carlos@example.com',
  avatar: 'https://placehold.co/48x48.png',
  role: 'user',
  roleName: 'user',
};

export const posts: Post[] = [
  {
    id: 'p1',
    author: mockUser,
    content: 'Acabo de terminar mi proceso en @Innovatech y fue una gran experiencia. El equipo es muy profesional. ¡Mucha suerte a los que postulen!',
    mentions: [{ id: 'c1', name: 'Innovatech', logo: '', sector: 'Tecnología', description: '', website: '' }],
    createdAt: 'hace 2 horas',
  },
  {
    id: 'p2',
    author: { name: 'Anónimo', avatar: 'https://placehold.co/48x48.png' },
    content: 'El proceso en @Soluciones Futuras fue un poco largo, pero valió la pena. La comunicación podría mejorar.',
    rating: 3,
    mentions: [{ id: 'c3', name: 'Soluciones Futuras', logo: '', sector: 'Consultoría', description: '', website: '' }],
    createdAt: 'hace 5 horas',
  },
  {
    id: 'p3',
    author: mockUser,
    content: '¿Alguien ha postulado a la vacante de Analista en @Gobierno Digital? Quisiera saber más sobre las etapas del proceso.',
    mentions: [{ id: 'c2', name: 'Gobierno Digital', logo: '', sector: 'Gobierno', description: '', website: '' }],
    createdAt: 'hace 1 día',
  },
];

export const applications: Application[] = [
  // This data is now fetched from /api/postulaciones/postulante/{id}
];


// --- Company specific data ---

export const companyOpportunities: Opportunity[] = [
    // This data is now fetched from /api/ofertas/empresa/{id}
];

export const applicants: Applicant[] = [
    // This data is now fetched from /api/postulaciones/oferta/{id}
];

export const interviews = [
    { id: 'int1', applicant: 'Laura Martinez', date: 'Mañana, 10:00 AM' },
    { id: 'int2', applicant: 'Javier Fernandez', date: 'Pasado mañana, 2:00 PM' },
];

// --- Misty X (Premium) specific data ---

export const mentors: Mentor[] = [
    {
        id: 'm1',
        name: 'Elena Vargas',
        avatar: 'https://placehold.co/128x128.png',
        role: 'Senior Product Manager en Google',
        bio: 'Apasionada por construir productos que la gente ama. Con más de 10 años de experiencia, puedo ayudarte a navegar tu carrera en tech y a prepararte para entrevistas de alto nivel.',
        specialties: ['Product Management', 'Career Growth', 'Interview Prep', 'UX Strategy']
    },
    {
        id: 'm2',
        name: 'Ricardo Mendoza',
        avatar: 'https://placehold.co/128x128.png',
        role: 'Lead Software Engineer en Microsoft',
        bio: 'Especialista en sistemas distribuidos y desarrollo backend. Ofrezco mentoría técnica para fortalecer tus habilidades de programación y diseño de sistemas.',
        specialties: ['System Design', 'Backend Development', 'Cloud Architecture', 'Algoritmos']
    },
    {
        id: 'm3',
        name: 'Carla Acosta',
        avatar: 'https://placehold.co/128x128.png',
        role: 'Tech Recruiter & HR Specialist',
        bio: 'Conozco los secretos de los procesos de selección. Te ayudo a optimizar tu CV y perfil de LinkedIn para que no pases desapercibido.',
        specialties: ['CV & LinkedIn', 'Employability', 'Networking']
    }
];

export const timeSlots: TimeSlot[] = [
    {
        id: 'ts1',
        date: 'Lunes, 27 de Mayo',
        time: '10:00 AM - 11:00 AM',
        availableMentors: [mentors[0], mentors[2]]
    },
    {
        id: 'ts2',
        date: 'Lunes, 27 de Mayo',
        time: '03:00 PM - 04:00 PM',
        availableMentors: [mentors[1]]
    },
    {
        id: 'ts3',
        date: 'Martes, 28 de Mayo',
        time: '09:00 AM - 10:00 AM',
        availableMentors: [mentors[0], mentors[1], mentors[2]]
    },
     {
        id: 'ts4',
        date: 'Miércoles, 29 de Mayo',
        time: '11:00 AM - 12:00 PM',
        availableMentors: [mentors[1], mentors[2]]
    }
]

export const scheduledMentorships: ScheduledMentorship[] = [
    // {
    //     id: 'sm1',
    //     mentor: mentors[0],
    //     date: 'Viernes, 24 de Mayo',
    //     time: '04:00 PM',
    //     meetingLink: 'https://meet.google.com/xyz-abc-def'
    // },
];
