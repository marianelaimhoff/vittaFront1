export type Specialty = {
    id: string;
    name: string;
  };
  
  export type ProfessionalProfile = {
    id: string;
    biography: string;
    experience: string;
    licenseNumber: string;
    specialty?: Specialty[];
    verified?: boolean;
    verifiedBy?: string | null;
  };
  
  export type Provider = {
    id: string;
    name: string;
    email: string;
    phone: string;
    dni: string;
    city: string;
    dob: string;
    role: "provider";
    imageUrl?: string;
    status?: string;
    createdAt?: string;
    professionalProfile: ProfessionalProfile;
    file?: {
    id?: string;
    imgUrl?: string;
    filename?: string;
    mimetype?: string;
  };
  }