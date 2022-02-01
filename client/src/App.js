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

  const changeTab = (_chunk, _tab) => {
    setChunk(_chunk);
    setTab(_tab);
  }

  const OnTabChange = (tname) => {
    setTab(tname);
  } 

  return (
    <Context.Provider value={{currentTerms, setCurrentTerms, currentData, setCurrentData, page, setPage, tab, setTab}}>
      <nav class="level">
        <div class="level-item">
          <Tabs />
        </div>
        <div class="level-right">
          <ShowLogo />
        </div>
      </nav>
      { tab === "Search" ? <Search changeTab={changeTab}/> : tab === "Detail" ? <Detail chunk={chunk}/> : <Reviews chunk={chunk}/> }
    </Context.Provider>
  );

  function Tabs() {
    const tabs = ["Search", "Detail", "Reviews"];
    return (
    <div class="tabs">
      <ul>
        {tabs.map (tname => <li class={(tname === tab) ? 'is-active' : ''}><a onClick={() => OnTabChange(tname)}>{tname}</a></li>)}
      </ul>
    </div>
    )
  }
}

function ShowLogo() {
  const path = "./yelp_logo/yelp_logo.png"
  return (
      <a href="https://www.yelp.com"><img src={path} width="64"/></a>
  )  
}

