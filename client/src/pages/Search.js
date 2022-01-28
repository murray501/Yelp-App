import React, {useState, useEffect} from "react";
import { useInput } from "./../hooks";
import { BasicSearch} from "./../gql";
import { useQuery } from "@apollo/client";
import { loadJSON, saveJSON} from "./../utils";

export default function Search () {
    const [showProp, setShowProp] = useState();

    const search = (term, location, limit) => {
        const result = <Show term={term} location={location} limit={limit} />
        setShowProp(result);         
    }

    if (showProp) {
        return (
            <>                
                <SearchForm onSearch={search} />
                {showProp}
            </>
        )
    } else {
        return (
            <SearchForm onSearch={search} />
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
            let limit = parseInt(limitProps.value);
            if (limit === NaN) limit = 20;
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


function Show({term, location, limit}) { 
    
    const {loading, error, data} = useQuery(BasicSearch, {variables: {term, location, limit}});

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error</p>;

    return (
        <>
            <div class="notification is-primary">
                <button class="delete"></button>
                Search Variables: <strong>{term}</strong>,  location: <strong>{location}</strong>,  limit: <strong>{limit}</strong>
            </div>
            <section>
                <div class="columns is-multiline">
                    {data.search.business.map((chunk) => <Business chunk={chunk} />)}
                </div>
            </section>
        </>
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
