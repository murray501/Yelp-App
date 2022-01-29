import React, {useState, useEffect} from "react";
import { useInput } from "./../hooks";
import { BasicSearch} from "./../gql";
import { useQuery } from "@apollo/client";
import { loadJSON, saveJSON} from "./../utils";

export default function Search () {
    const [key, setKey] = useState();
    const [data, setData] = useState();
    const [showProp, setShowProp] = useState(<></>);

    const search = (term, location, limit) => {
        let newkey = JSON.stringify({term: term, location: location, limit: limit});
        let stored= loadJSON(newkey);
        if (stored) {
            setKey(newkey);
            setData(stored);
        } else {
            setShowProp(<Query term={term} location={location} limit={limit} />)
        }
    }

    return (
        <>
            <SearchForm onSearch={search} />
            {data ? <Show /> : showProp}
        </>
    )
    
    function Query({term, location, limit}) { 
        const {loading, error, data} = useQuery(BasicSearch, {variables: {term, location, limit}});
        
        if (loading) return <p>Loading...</p>;
        if (error) return <p>Error</p>;
    
        let key = JSON.stringify({term: term, location: location, limit: limit});
        setKey(key);
        setData(data);
        saveJSON(key, data);

        return (
            <Show />
        )
    }

    function Show() {
        return (
            <>
                <div class="notification is-primary">
                    <button class="delete"></button>
                    Search Variables: {key} 
                </div>
                <section>
                    <div class="columns is-multiline">
                        {data.search.business.map((chunk) => <Business chunk={chunk} />)}
                    </div>
                </section>
            </>
        )
    }
}

function SearchForm({onSearch = f => f}) {
    const [termProps, resetTerm] = useInput("");
    const [locationProps, resetLocation] = useInput("");
    const [limitProps, resetLimit] = useInput("");
    
    const submit = e => {
        e.preventDefault();
        if (termProps.value || locationProps.value) {
            const limit = parseInt(limitProps.value);
            onSearch(termProps.value, locationProps.value, limit);
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



function Query({term, location, limit}) { 
    const {loading, error, data} = useQuery(BasicSearch, {variables: {term, location, limit}});
    
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error</p>;

    let key = JSON.stringify({term: term, location: location, limit: limit});
    saveJSON(key, data);
    
    return (
        <Show key={key} data={data} />
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
                        rating: {rating}
                        <br />
                        review_count: {review_count}
                    </p>
                </div>
            </article>
        </div>
    )
}
