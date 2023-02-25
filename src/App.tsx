import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Search from "./pages/Search";

export const App = (): JSX.Element => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/:query" element={<Search />} />
    </Routes>
  );
};
