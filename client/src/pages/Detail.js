import React, {useMemo, useEffect} from "react";
import { BusinessSearch } from "./../gql";
import { useQuery } from "@apollo/client";
import { loadJSON, saveJSON} from "./../utils";

export default function Detail ({chunk}) {
    const stored = useMemo(() => {
        const key = JSON.stringify({type: "Detail", id: chunk.id});
        let stored = loadJSON(key);
        return stored;
    }, []);

    if (stored) {
        return <Show chunk={chunk} data={stored} />
    }

    return (
        <DetailQuery chunk={chunk} />
    )

}

function DetailQuery({chunk}) {
    const {id, name, url, photos, rating, review_count} = chunk;
    const {loading, error, data} = useQuery(BusinessSearch, {variables: {id}});
        
    useEffect(() => {
        if (data) {
            const key = JSON.stringify({type: "Detail", id: chunk.id});
            saveJSON(key, data);
        }
    }, [data])

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error</p>;

    return (
        <Show chunk={chunk} data={data} />
    )
}

function Show({chunk, data}) {
    return (
        <>
        <pre>{JSON.stringify(chunk)}</pre>
        <pre>{JSON.stringify(data.business)}</pre>
        </>
    )
}