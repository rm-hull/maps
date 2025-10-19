import {
  FaBusAlt,
  FaCar,
  FaCity,
  FaClinicMedical,
  FaHelicopter,
  FaMountain,
  FaRoad,
  FaSchool,
  FaUmbrellaBeach,
  FaUniversity,
  FaWater,
  FaWalking,
} from "react-icons/fa";
import { FaHouseChimney, FaOilWell } from "react-icons/fa6";
import { LuGlobe } from "react-icons/lu";
import {
  MdDirectionsBoat,
  MdForest,
  MdHomeWork,
  MdLocalAirport,
  MdLocalHospital,
  MdOutlineDirectionsRailwayFilled,
  MdTram,
} from "react-icons/md";
import { PiIslandBold } from "react-icons/pi";

interface SearchIconProps {
  localType: string;
}

const iconMap: Record<string, React.ElementType> = {
  City: FaCity,
  Town: FaCity,
  Postcode: MdHomeWork,
  "Suburban Area": MdHomeWork,
  "Other Settlement": MdHomeWork,
  Village: FaHouseChimney,
  Hamlet: FaHouseChimney,
  Railway: MdOutlineDirectionsRailwayFilled,
  "Railway Station": MdOutlineDirectionsRailwayFilled,
  "Bus Station": FaBusAlt,
  "Coach Station": FaBusAlt,
  "Road User Services": FaCar,
  Tramway: MdTram,
  Hospital: MdLocalHospital,
  Hospice: FaClinicMedical,
  "Medical Care Accommodation": FaClinicMedical,
  "Hill Or Mountain": FaMountain,
  "Hill Or Mountain Ranges": FaMountain,
  Waterfall: FaWater,
  "Inland Water": FaWater,
  "Woodland Or Forest": MdForest,
  "Other Landcover": FaWalking,
  "Named Road": FaRoad,
  "Numbered Road": FaRoad,
  "Section Of Numbered Road": FaRoad,
  "Section Of Named Road": FaRoad,
  Airport: MdLocalAirport,
  Airfield: MdLocalAirport,
  Heliport: FaHelicopter,
  "Helicopter Station": FaHelicopter,
  "Port Consisting of Docks and Nautical Berthing": MdDirectionsBoat,
  "Passenger Ferry Terminal": MdDirectionsBoat,
  "Vehicular Ferry Terminal": MdDirectionsBoat,
  Harbour: MdDirectionsBoat,
  "Primary Education": FaSchool,
  "Secondary Education": FaSchool,
  "Non State Primary Education": FaSchool,
  "Non State Secondary Education": FaSchool,
  "Special Needs Education": FaSchool,
  "Higher or University Education": FaUniversity,
  "Further Education": FaUniversity,
  Beach: FaUmbrellaBeach,
  "Oil Refining": FaOilWell,
  "Oil Terminal": FaOilWell,
  "Oil Distribution or Storage": FaOilWell,
  Sea: FaWater,
  Bay: PiIslandBold,
};

export function SearchIcon({ localType }: SearchIconProps) {
  const IconComponent = iconMap[localType.split(/,/)[0]] ?? LuGlobe;
  return <IconComponent size={16} />;
}
