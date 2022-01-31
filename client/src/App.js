import React, {useState, createContext} from "react";
import Search from "./pages/Search";
import Detail from "./pages/Detail";
import Reviews from "./pages/Reviews";

export const Context = createContext();

export function App() {
  const [currentTerms, setCurrentTerms] = useState();
  const [currentData, setCurrentData] = useState();
  const [page, setPage] = useState(0);
  const [tab, setTab] = useState("Search");
  const [chunk, setChunk] = useState();

  const goDetail = (_chunk) => {
    setChunk(_chunk);
    setTab("Detail");
  }

  return (
    <Context.Provider value={{currentTerms, setCurrentTerms, currentData, setCurrentData, page, setPage, tab, setTab}}>
      <Tabs />
      { tab === "Search" ? <Search goDetail={goDetail}/> : tab === "Detail" ? <Detail chunk={chunk}/> : <Reviews /> }
    </Context.Provider>
  );

  function Tabs() {
    const tabs = ["Search", "Detail", "Reviews"];
    return (
    <div class="tabs">
      <ul>
        {tabs.map (tname => <li class={(tname === tab) ? 'is-active' : ''}><a>{tname}</a></li>)}
      </ul>
    </div>
    )
  }
}

