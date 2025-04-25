import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { FilterState } from "@/utils/filters";

interface FilterPanelProps {
  allSpecialties: string[];
  filters: FilterState;
  updateFilters: (newFilters: Partial<FilterState>) => void;
}

const FilterPanel = ({ allSpecialties, filters, updateFilters }: FilterPanelProps) => {
  const [expandedSections, setExpandedSections] = useState({
    consultationMode: true,
    speciality: true,
    sort: true,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleConsultationChange = (type: "Video Consult" | "In Clinic" | null) => {
    updateFilters({ consultationType: type });
  };

  const handleSpecialtyChange = (specialty: string, checked: boolean) => {
    let updatedSpecialties = [...filters.specialties];
    
    if (checked) {
      updatedSpecialties.push(specialty);
    } else {
      updatedSpecialties = updatedSpecialties.filter(item => item !== specialty);
    }
    
    updateFilters({ specialties: updatedSpecialties });
  };

  const handleSortChange = (sortOption: "fees" | "experience" | null) => {
    updateFilters({ sortBy: sortOption });
  };

  return (
    <aside className="w-full md:w-64 flex-shrink-0">
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Consultation Mode Filter */}
        <div className="border-b border-gray-200">
          <h3
            data-testid="filter-header-moc"
            className="px-4 py-3 bg-gray-50 text-gray-700 font-medium flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection("consultationMode")}
          >
            Consultation Mode
            {expandedSections.consultationMode ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </h3>
          {expandedSections.consultationMode && (
            <div className="px-4 py-3 space-y-2">
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="consultation-type"
                  data-testid="filter-video-consult"
                  className="h-4 w-4 text-primary"
                  checked={filters.consultationType === "Video Consult"}
                  onChange={() => handleConsultationChange("Video Consult")}
                />
                <span className="text-gray-700">Video Consult</span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="consultation-type"
                  data-testid="filter-in-clinic"
                  className="h-4 w-4 text-primary"
                  checked={filters.consultationType === "In Clinic"}
                  onChange={() => handleConsultationChange("In Clinic")}
                />
                <span className="text-gray-700">In Clinic</span>
              </label>
              {filters.consultationType && (
                <div className="mt-2">
                  <button 
                    className="text-sm text-primary hover:underline"
                    onClick={() => handleConsultationChange(null)}
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Speciality Filter */}
        <div className="border-b border-gray-200">
          <h3
            data-testid="filter-header-speciality"
            className="px-4 py-3 bg-gray-50 text-gray-700 font-medium flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection("speciality")}
          >
            Speciality
            {expandedSections.speciality ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </h3>
          {expandedSections.speciality && (
            <div className="px-4 py-3 max-h-64 overflow-y-auto">
              <div className="space-y-2">
                {allSpecialties.map((specialty) => (
                  <label key={specialty} className="flex items-center space-x-3">
                    <input
                      type="checkbox"
                      data-testid={`filter-specialty-${specialty}`}
                      className="h-4 w-4 text-primary rounded"
                      checked={filters.specialties.includes(specialty)}
                      onChange={(e) => handleSpecialtyChange(specialty, e.target.checked)}
                    />
                    <span className="text-gray-700">{specialty}</span>
                  </label>
                ))}
              </div>
              {filters.specialties.length > 0 && (
                <div className="mt-3">
                  <button 
                    className="text-sm text-primary hover:underline"
                    onClick={() => updateFilters({ specialties: [] })}
                  >
                    Clear All
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sort Filter */}
        <div>
          <h3
            data-testid="filter-header-sort"
            className="px-4 py-3 bg-gray-50 text-gray-700 font-medium flex justify-between items-center cursor-pointer"
            onClick={() => toggleSection("sort")}
          >
            Sort By
            {expandedSections.sort ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </h3>
          {expandedSections.sort && (
            <div className="px-4 py-3 space-y-2">
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="sort"
                  data-testid="sort-fees"
                  className="h-4 w-4 text-primary"
                  checked={filters.sortBy === "fees"}
                  onChange={() => handleSortChange("fees")}
                />
                <span className="text-gray-700">Consultation Fees (Low to High)</span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="sort"
                  data-testid="sort-experience"
                  className="h-4 w-4 text-primary"
                  checked={filters.sortBy === "experience"}
                  onChange={() => handleSortChange("experience")}
                />
                <span className="text-gray-700">Experience (High to Low)</span>
              </label>
              {filters.sortBy && (
                <div className="mt-2">
                  <button 
                    className="text-sm text-primary hover:underline"
                    onClick={() => handleSortChange(null)}
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default FilterPanel;
