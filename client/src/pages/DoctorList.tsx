import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchDoctors } from "@/lib/api";
import { Doctor } from "@/types/doctor";
import SearchBar from "@/components/SearchBar";
import FilterPanel from "@/components/FilterPanel";
import DoctorCard from "@/components/DoctorCard";
import { 
  filterDoctors, 
  FilterState, 
  initializeFilterState, 
  getAllSpecialties 
} from "@/utils/filters";
import { 
  syncFiltersToUrl, 
  getFiltersFromUrl 
} from "@/utils/urlParams";

const DoctorList = () => {
  const [filters, setFilters] = useState<FilterState>(initializeFilterState());
  const [allSpecialties, setAllSpecialties] = useState<string[]>([]);

  // Fetch all doctors
  const { data: doctors = [], isLoading, error } = useQuery({
    queryKey: ["doctors"],
    queryFn: fetchDoctors,
  });

  // Log doctor data to debug
  useEffect(() => {
    if (doctors.length > 0) {
      console.log("First doctor data:", doctors[0]);
    }
  }, [doctors]);

  // Apply filters to get filtered doctors
  const filteredDoctors = filterDoctors(doctors, filters);

  // Initialize filters from URL on component mount
  useEffect(() => {
    const urlFilters = getFiltersFromUrl();
    if (Object.keys(urlFilters).length > 0) {
      setFilters(prev => ({ ...prev, ...urlFilters }));
    }
  }, []);

  // Extract all specialties once data is loaded
  useEffect(() => {
    if (doctors.length > 0) {
      setAllSpecialties(getAllSpecialties(doctors));
    }
  }, [doctors]);

  // Sync filters to URL when they change
  useEffect(() => {
    syncFiltersToUrl(filters);
  }, [filters]);

  // Handle browser navigation
  useEffect(() => {
    const handlePopState = () => {
      const urlFilters = getFiltersFromUrl();
      setFilters(prev => ({
        ...initializeFilterState(),
        ...urlFilters
      }));
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Update filters
  const updateFilters = (newFilters: Partial<FilterState>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-800">Doctor Finder</h1>
            
            {/* Search Bar */}
            <SearchBar 
              doctors={doctors}
              searchQuery={filters.search}
              onSearchChange={(query) => updateFilters({ search: query })}
            />
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row gap-6">
          {/* Filter Panel */}
          <FilterPanel 
            allSpecialties={allSpecialties} 
            filters={filters}
            updateFilters={updateFilters}
          />

          {/* Doctors List */}
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Available Doctors{" "}
              {filteredDoctors.length > 0 && (
                <span className="text-gray-500 text-sm">({filteredDoctors.length})</span>
              )}
            </h2>
            
            {isLoading && (
              <div className="text-center py-10">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                <p className="mt-2 text-gray-600">Loading doctors...</p>
              </div>
            )}

            {error && (
              <div className="bg-red-50 text-red-800 p-4 rounded-lg">
                <p>Error loading doctors. Please try again later.</p>
              </div>
            )}

            {!isLoading && !error && filteredDoctors.length === 0 && (
              <div className="bg-yellow-50 text-yellow-800 p-4 rounded-lg">
                <p>No doctors found matching your criteria. Try adjusting your filters.</p>
              </div>
            )}
            
            <div className="space-y-4">
              {filteredDoctors.map((doctor) => (
                <DoctorCard key={doctor.id} doctor={doctor} />
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gray-100 border-t border-gray-200 mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-gray-600">© {new Date().getFullYear()} Doctor Finder. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default DoctorList;
