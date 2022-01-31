import React, {useState, useEffect, useContext} from "react";
import { useInput } from "./../hooks";
import { BasicSearch} from "./../gql";
import { useQuery } from "@apollo/client";
import { loadJSON, saveJSON} from "./../utils";
import { Context } from "./../App";

export default function Search ({goDetail = f => f}) {
    const {currentTerms, setCurrentTerms, currentData, setCurrentData, page, setPage, tab, setTab} = useContext(Context);
    const limit = 20;
    
    const search = (term, location, offset) => {
        let newTerms = {term: term, location: location, offset: offset}
        
        let stored= loadJSON(JSON.stringify(newTerms));
        
        setCurrentTerms(newTerms);

        if (stored) {            
            setCurrentData(stored);
        } else {
            setCurrentData(null);
        }
    }

    useEffect(() => {
        if (currentTerms) {
            const {term, location, _} = currentTerms;
            const offset = page * limit; 
            search(term, location, offset);
        }
    }, [page])

    return (
        <>
            <SearchForm onSearch={search} />
            {(currentData && currentTerms) ? <Show terms={currentTerms} data={currentData} /> : 
                currentTerms ? <Query /> : <p>nothing to search...</p>}
        </>
    )
    
    function Query() {
        const {term, location, offset} = currentTerms;
        const {loading, error, data} = useQuery(BasicSearch, {variables: {term, location, offset}});
        
        if (loading) return <p>Loading...</p>;
        if (error) return <p>Error</p>;
    
        setCurrentData(data);
        saveJSON(JSON.stringify(currentTerms), data);
        return <Show terms={currentTerms} data={data} />;
    }

    function Show({terms, data}) {
        return (
            <>
                <div class="notification is-primary">
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

    function Pagenation({total}) {
        const numPages = Math.ceil(total / limit);
    
        const nextPage = () => {
            const nextpage = page + 1 >= numPages ? numPages - 1 : page + 1
            setPage(nextpage);
        }
    
        const prevPage = () => {
            const prevpage = page - 1 < 0 ? 0 : page - 1
            setPage(prevpage);
        }
    
        const setCurrent = i => {
            setPage(i);
        }
    
        return (
        <nav class="pagination is-small" role="navigation" aria-label="pagination">
            <a class="pagination-previous" onClick={prevPage}>Previous</a>
            <a class="pagination-next" onClick={nextPage}>Next page</a>
            <ul class="pagination-list">
                {[...Array(numPages).keys()].map (i => 
                    <li>
                        <a class={"pagination-link" + (i === page ? " is-current" : '')}
                            onClick={() => setCurrent(i)}
                            >{i + 1}</a>
                    </li>
                )}
            </ul>
        </nav>
        )
    }

    function Business({chunk}) {
        const {id, name, url, photos, rating, review_count} = chunk;
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
                            <br />
                            <a onClick={() => goDetail(chunk)}>Detail</a>
                            <span>·</span>
                            <a>Review</a>
                        </p>
                    </div>
                </article>
            </div>
        )
    }
}

// --- outside ---
function SearchForm({onSearch = f => f}) {
    const [termProps, resetTerm] = useInput("");
    const [locationProps, resetLocation] = useInput("");
    
    const submit = e => {
        e.preventDefault();
        if (termProps.value || locationProps.value) {
            onSearch(termProps.value, locationProps.value, 0);
        }
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
                    <button class="button is-success">
                        Search
                    </button>
                </div>
            </div>
        </form>
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
