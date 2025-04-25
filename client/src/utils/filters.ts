import { Doctor } from "@/types/doctor";

export type ConsultationType = "Video Consult" | "In Clinic" | null;
export type SortOption = "fees" | "experience" | null;

export interface FilterState {
  search: string;
  consultationType: ConsultationType;
  specialties: string[];
  sortBy: SortOption;
}

export const initializeFilterState = (): FilterState => ({
  search: "",
  consultationType: null,
  specialties: [],
  sortBy: null,
});

export const filterDoctors = (doctors: Doctor[], filters: FilterState): Doctor[] => {
  return doctors
    .filter((doctor) => {
      // Filter by search term
      if (filters.search && !doctor.name.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }

      // Filter by consultation type
      if (filters.consultationType === "Video Consult" && !doctor.video_consult) {
        return false;
      }
      if (filters.consultationType === "In Clinic" && !doctor.in_clinic) {
        return false;
      }

      // Filter by specialties (if any selected)
      if (filters.specialties.length > 0) {
        if (!doctor.specialities || !Array.isArray(doctor.specialities)) {
          return false;
        }
        
        const doctorSpecialtyNames = doctor.specialities.map(s => s.name);
        if (!filters.specialties.some(specialty => 
          doctorSpecialtyNames.includes(specialty)
        )) {
          return false;
        }
      }

      return true;
    })
    .sort((a, b) => {
      // Sort by selected option
      if (filters.sortBy === "fees") {
        // Extract numeric value from fee strings (remove currency symbol and spaces)
        const aFee = parseInt(a.fees?.replace(/[^\d]/g, '') || '0');
        const bFee = parseInt(b.fees?.replace(/[^\d]/g, '') || '0');
        return aFee - bFee; // Ascending
      } else if (filters.sortBy === "experience") {
        // Extract numeric value from experience strings (e.g., "13 Years of experience" -> 13)
        const aExp = parseInt(a.experience?.match(/\d+/)?.[0] || '0');
        const bExp = parseInt(b.experience?.match(/\d+/)?.[0] || '0');
        return bExp - aExp; // Descending
      }
      
      return 0; // Default: no sorting
    });
};

export const getMatchingSearchSuggestions = (
  doctors: Doctor[],
  searchQuery: string,
  maxSuggestions = 3
): Doctor[] => {
  if (!searchQuery) {
    return [];
  }
  
  const normalizedQuery = searchQuery.toLowerCase();
  
  return doctors
    .filter((doctor) => doctor.name.toLowerCase().includes(normalizedQuery))
    .slice(0, maxSuggestions);
};

export const getAllSpecialties = (doctors: Doctor[]): string[] => {
  const specialtiesSet = new Set<string>();
  
  doctors.forEach((doctor) => {
    if (doctor.specialities && Array.isArray(doctor.specialities)) {
      doctor.specialities.forEach((specialty) => {
        if (specialty && specialty.name) {
          specialtiesSet.add(specialty.name);
        }
      });
    }
  });
  
  return Array.from(specialtiesSet).sort();
};
