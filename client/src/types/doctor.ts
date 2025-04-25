export interface Doctor {
  id: string;
  name: string;
  name_initials?: string;
  specialities?: { name: string }[];
  experience?: string;
  fees?: string;
  rating?: number;
  reviews?: number;
  video_consult?: boolean;
  in_clinic?: boolean;
  available?: boolean;
  photo?: string;
  doctor_introduction?: string;
  languages?: string[];
  clinic?: {
    name: string;
    address?: {
      locality?: string;
      city?: string;
      address_line1?: string;
      location?: string;
      logo_url?: string;
    }
  };
}
