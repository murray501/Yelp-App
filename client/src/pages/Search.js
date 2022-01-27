import React, {useState, useEffect} from "react";
import { useInput } from "./../hooks";
import { BasicSearch} from "./../gql";
import { useQuery } from "@apollo/client";

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
            console.log("onSearch");
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
        <div>{JSON.stringify(data)}</div>
    )
}

