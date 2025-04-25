import { Doctor } from "@/types/doctor";
import { Clock, Star } from "lucide-react";

interface DoctorCardProps {
  doctor: Doctor;
}

const DoctorCard = ({ doctor }: DoctorCardProps) => {
  // Use either provided photo or fallback to our avatar list
  const avatarSrc = doctor.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.name)}&background=random`;
  
  // Extract specialties
  const specialtyNames = doctor.specialities?.map(s => s.name).join(", ") || "";
  
  // Extract experience number from text
  const experienceText = doctor.experience || "0 years of experience";
  
  // Get rating and reviews
  const rating = doctor.rating || 4.5;
  const reviews = doctor.reviews || 100;

  return (
    <div 
      data-testid="doctor-card" 
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex flex-col md:flex-row gap-4"
    >
      <div className="w-24 h-24 md:w-32 md:h-32 flex-shrink-0">
        <img
          src={avatarSrc}
          alt={`${doctor.name} profile`}
          className="w-full h-full object-cover rounded-full"
        />
      </div>
      <div className="flex-1">
        <h3 data-testid="doctor-name" className="text-lg font-semibold text-gray-800">
          {doctor.name}
        </h3>
        <p data-testid="doctor-specialty" className="text-gray-600 mb-2">
          {specialtyNames}
        </p>
        <div className="flex items-center mb-2">
          <Star className="h-5 w-5 text-yellow-500 fill-current" />
          <span className="ml-1 text-gray-600">
            {rating} ({reviews}+ ratings)
          </span>
        </div>
        <p data-testid="doctor-experience" className="flex items-center text-gray-600">
          <Clock className="h-5 w-5 mr-1 text-gray-500" />
          {experienceText}
        </p>
        <div className="flex flex-wrap mt-3 gap-2">
          {doctor.video_consult && (
            <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
              Video Consult
            </span>
          )}
          {doctor.in_clinic && (
            <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs font-medium rounded">
              In Clinic
            </span>
          )}
          {doctor.available && (
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded">
              Available Today
            </span>
          )}
        </div>
      </div>
      <div className="flex flex-col items-end justify-between">
        <p data-testid="doctor-fee" className="text-lg font-semibold text-gray-800">
          {doctor.fees || "₹ 500"}
        </p>
        <button className="px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-blue-600 transition-colors">
          Book Appointment
        </button>
      </div>
    </div>
  );
};

export default DoctorCard;
