import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Town from "./pages/Town";

export const App = (): JSX.Element => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/:town" element={<Town />} />
    </Routes>
  );
};
