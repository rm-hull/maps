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

interface SearchIconProps {
  localType: string;
}

export function SearchIcon({ localType }: SearchIconProps) {
  switch (localType.split(/,/)[0]) {
    case "City":
    case "Town":
      return <FaCity size={16} />;

    case "Postcode":
    case "Suburban Area":
    case "Other Settlement":
      return <MdHomeWork size={16} />;

    case "Village":
    case "Hamlet":
      return <FaHouseChimney size={16} />;

    case "Railway":
    case "Railway Station":
      return <MdOutlineDirectionsRailwayFilled size={16} />;

    case "Bus Station":
    case "Coach Station":
      return <FaBusAlt size={16} />;

    case "Road User Services":
      return <FaCar size={16} />;

    case "Tramway":
      return <MdTram size={16} />;

    case "Hospital":
      return <MdLocalHospital size={16} />;

    case "Hospice":
    case "Medical Care Accommodation":
      return <FaClinicMedical size={16} />;

    case "Hill Or Mountain":
    case "Hill Or Mountain Ranges":
      return <FaMountain size={16} />;

    case "Waterfall":
    case "Inland Water":
      return <FaWater size={16} />;

    case "Woodland Or Forest":
      return <MdForest size={16} />;

    case "Other Landcover":
      return <FaWalking size={16} />;

    case "Named Road":
    case "Numbered Road":
    case "Section Of Numbered Road":
    case "Section Of Named Road":
      return <FaRoad size={16} />;

    case "Airport":
    case "Airfield":
      return <MdLocalAirport size={16} />;

    case "Heliport":
    case "Helicopter Station":
      return <FaHelicopter size={16} />;

    case "Port Consisting of Docks and Nautical Berthing":
    case "Passenger Ferry Terminal":
    case "Vehicular Ferry Terminal":
    case "Harbour":
      return <MdDirectionsBoat size={16} />;

    case "Primary Education":
    case "Secondary Education":
    case "Non State Primary Education":
    case "Non State Secondary Education":
    case "Special Needs Education":
      return <FaSchool size={16} />;

    case "Higher or University Education":
    case "Further Education":
      return <FaUniversity size={16} />;

    case "Beach":
      return <FaUmbrellaBeach size={16} />;

    case "Oil Refining":
    case "Oil Terminal":
    case "Oil Distribution or Storage":
      return <FaOilWell size={16} />;

    default:
      return <LuGlobe size={16} />;
  }
}
