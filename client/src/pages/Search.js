import React from "react";
import { useInput } from "./../hooks";
import { BasicSearch} from "./../gql";
import { useQuery } from "@apollo/client";

export default function Search () {
    const term = "burrito";
    const location = "san francisco";
    const limit = 5;
    const { loading, error, data} = useQuery(BasicSearch, {variables: {term, location, limit}});

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error</p>;

    return (
        <>
            <SearchForm />
            <div>{JSON.stringify(data)}</div>
        </>
    )
}

function SearchForm () {
    const [termProps, resetTerm] = useInput("");
    const [locationProps, resetLocation] = useInput("");
    const [limitProps, resetLimit] = useInput("");

    const submit = e => {
        e.preventDefault();
        resetTerm();
        resetLocation();
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