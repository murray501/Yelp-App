import React, {useState, createContext} from "react";
import Search from "./pages/Search";

export const Context = createContext();

export function App() {
  const [currentTerms, setCurrentTerms] = useState();
  const [currentData, setCurrentData] = useState();
  const [page, setPage] = useState(0);

  return (
    <Context.Provider value={{currentTerms, setCurrentTerms, currentData, setCurrentData, page, setPage}}>
      <Search />
    </Context.Provider>
  );
}

