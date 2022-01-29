import React, {useState, useEffect} from "react";
import { useInput } from "./../hooks";
import { BasicSearch} from "./../gql";
import { useQuery } from "@apollo/client";
import { loadJSON, saveJSON} from "./../utils";

export default function Search () {
    const [terms, setTerms] = useState();
    const [data, setData] = useState();
    const [showProp, setShowProp] = useState(<></>);
    const [page, setPage] = useState();

    const search = (term, location, offset) => {
        let newTerms = {term: term, location: location, offset: offset}
        let stored= loadJSON(JSON.stringify(newTerms));
        
        if (stored) {
            setTerms(newTerms);
            setData(stored);
        } else {
            setShowProp(<Query newTerms={newTerms}/>)
        }
    }

    /*
    useEffect(() => {
        if (terms) {
            
            const {term, location, limit, _} = terms;
            const offset = limit * page;
            search(term, location, limit, offset);
            
        }
    }, [page])
    */
   
    return (
        <>
            <SearchForm onSearch={search} />
            {data ? <Show terms = {terms} data={data}/> : showProp}
        </>
    )
    
    function Query({newTerms}) { 
        const {term, location, offset} = newTerms;
        const {loading, error, data} = useQuery(BasicSearch, {variables: {term, location, offset}});
        
        if (loading) return <p>Loading...</p>;
        if (error) return <p>Error</p>;
    
        setTerms(newTerms);
        setData(data);
        saveJSON(JSON.stringify(newTerms), data);
        return <Show terms={newTerms} data={data} />;
    }
}

// --- outside --
function Show({terms, data}) {
    return (
        <>
            <div class="notification is-primary">
                <button class="delete"></button>
                Search Variables: {JSON.stringify(terms)} 
                <br />
                Total: {data.search.total}
            </div>
            <section>
                <div class="columns is-multiline">
                    {data.search.business.map((chunk) => <Business chunk={chunk} />)}
                </div>
                <Pagenation total={data.search.total} />
            </section>                
        </>
    )
}

function SearchForm({onSearch = f => f}) {
    const [termProps, resetTerm] = useInput("");
    const [locationProps, resetLocation] = useInput("");
    const [limitProps, resetLimit] = useInput("");
    
    const submit = e => {
        e.preventDefault();
        if (termProps.value || locationProps.value) {
            const limit = parseInt(limitProps.value);
            onSearch(termProps.value, locationProps.value, 0);
        }
        resetTerm();
        resetLocation();
        resetLimit();
    }

    return (
        <form onSubmit={submit} class="box">
            <div class="columns is-desktop is-vcentered">
                <div class="column">
                    <label class="label">Term</label>
                    <input class="input" type="text" {...termProps} placeholder="term" />
                </div>
                <div class="column">
                    <label class="label">Location</label>
                    <input class="input" type="text" {...locationProps} placeholder="location" />
                </div>
                <div class="column">
                    <label class="label">Limit</label>
                    <input class="input" type="text" {...limitProps} placeholder="limit" />
                </div>
                <div class="column">
                    <button class="button is-success">
                        Search
                    </button>
                </div>
            </div>
        </form>
    )
}

function Business({chunk}) {
    const {name, url, photos, rating, review_count} = chunk;
    return (
        <div class="column is-3-desktop box">
            <article class="media">
                <aside class="media-left">
                    <img src={photos} width="80" />
                </aside>
                <div class="media-content">
                    <a href={url}>{name}</a>
                    <p class="content is-small">
                        <ShowStars rating={rating} />
                        <br />
                        Based on {review_count} reviews
                    </p>
                </div>
            </article>
        </div>
    )
}

function ShowStars({rating}) {
    const valueFloat = parseFloat(rating);
    const valueInt = parseInt(rating);
    const prefix = "./yelp_stars/small/small_"
    const postfix = ".png"
    const infix = valueInt === valueFloat ? rating : `${valueInt}_half`
    const path = prefix + infix + postfix
    return (
        <img src={path} />
    )  
}

function Pagenation({total}) {
    const limit = 20;
    const numPages = Math.ceil(total / limit);

    const nextPage = () => {
        //const nextpage = page + 1 >= numPages ? numPages - 1 : page + 1
        //setPage(nextpage);
    }

    const prevPage = () => {
        //const prevpage = page - 1 < 0 ? 0 : page - 1
        //setPage(prevpage);
    }

    const setCurrent = i => {
        //setPage(i);
    }

    return (
    <nav class="pagination is-small" role="navigation" aria-label="pagination">
        <a class="pagination-previous" onClick={prevPage}>Previous</a>
        <a class="pagination-next" onClick={nextPage}>Next page</a>
        <ul class="pagination-list">
            {[...Array(numPages).keys()].map (i => 
                <li>
                    <a class={"pagination-link" + (i === 0 ? " is-current" : '')}
                        onClick={() => setCurrent(i)}
                        >{i + 1}</a>
                </li>
            )}
        </ul>
    </nav>
    )
}
