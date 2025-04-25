import { FilterState, ConsultationType, SortOption } from "./filters";

export const syncFiltersToUrl = (filters: FilterState): void => {
  const url = new URL(window.location.href);
  const params = url.searchParams;

  // Clear existing params
  params.forEach((_value, key) => {
    params.delete(key);
  });
  
  // Update with current filter values
  if (filters.search) {
    params.set("search", filters.search);
  }
  
  if (filters.consultationType) {
    params.set("consultationType", filters.consultationType);
  }
  
  if (filters.specialties.length > 0) {
    filters.specialties.forEach(specialty => {
      params.append("specialty", specialty);
    });
  }
  
  if (filters.sortBy) {
    params.set("sortBy", filters.sortBy);
  }
  
  // Update URL without reloading the page
  window.history.pushState({}, "", url.toString());
};

export const getFiltersFromUrl = (): Partial<FilterState> => {
  const params = new URLSearchParams(window.location.search);
  const filters: Partial<FilterState> = {};
  
  const search = params.get("search");
  if (search) {
    filters.search = search;
  }
  
  const consultationType = params.get("consultationType") as ConsultationType;
  if (consultationType) {
    filters.consultationType = consultationType;
  }
  
  const specialties = params.getAll("specialty");
  if (specialties.length > 0) {
    filters.specialties = specialties;
  }
  
  const sortBy = params.get("sortBy") as SortOption;
  if (sortBy) {
    filters.sortBy = sortBy;
  }
  
  return filters;
};
