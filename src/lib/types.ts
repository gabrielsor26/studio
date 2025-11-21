export type User = {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: 'user' | 'company';
  roleName: string; // From backend
  cvUrl?: string;
  currentProfileId?: string; // postulanteId or empresaId
  company?: Company; // Nested object from login
  applicant?: Applicant; // Nested object from login
};

export type Company = {
  id: string;
  name: string;
  logo: string;
  sector: 'Tecnología' | 'Consultoría' | 'Gobierno' | 'Educación' | string;
  description: string;
  website: string;
};

export type Opportunity = {
  id: string;
  title: string;
  company: Company;
  modality: 'Remoto' | 'Híbrido' | 'Presencial';
  sector: 'Público' | 'Privado';
  description: string;
  requirements: string[];
  conditions: string[];
  externalUrl?: string;
};

export type Post = {
  id: string;
  author: User | { name: 'Anónimo', avatar: string };
  content: string;
  rating?: number;
  mentions?: Company[];
  createdAt: string;
};

export type Applicant = {
  id: string;
  name: string;
  avatar: string;
  date: string;
  cvUrl: string;
};

export type Application = {
  id: string;
  opportunity: Opportunity;
  status: 'Postulado' | 'En Revisión' | 'Entrevista' | 'Rechazado' | 'Aceptado';
  date: string;
};

export type Mentor = {
  id: string;
  name: string;
  avatar: string;
  role: string;
  bio: string;
  specialties: string[];
}

export type TimeSlot = {
  id: string;
  date: string;
  time: string;
  availableMentors: Mentor[];
}

export type ScheduledMentorship = {
  id:string;
  mentor: Mentor;
  date: string;
  time: string;
  meetingLink?: string;
}
