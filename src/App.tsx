import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";

export const App = (): JSX.Element => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
    </Routes>
  );
};
