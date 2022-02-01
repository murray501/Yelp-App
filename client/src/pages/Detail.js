import React, {useMemo, useEffect} from "react";
import { BusinessSearch } from "./../gql";
import { useQuery } from "@apollo/client";
import { loadJSON, saveJSON, ShowStars} from "./../utils";

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
    const {id, name, url, photos, rating, review_count} = chunk;
    const {is_claimed, is_closed, display_phone, price, categories, location, hours} = data.business;
    return (
        <section class="section">
            <article class="media">
                <figure class="media-left">
                    <img width="256" src={photos} alt="Placeholder image" />
                </figure>
                <div class="media-content">    
                    <div class="level">
                        <div class="level-left">
                            <p class="title is-4">
                                <a href={url}>{name}</a> 
                            </p>
                        </div>
                        <div class="level-right">
                            <p class="level-item">
                                Based on {review_count} reviews
                            </p>
                            <p class="level-item">
                                <ShowStars rating={rating} />
                            </p>
                        </div>
                    </div>
                    <div class="content">
                        <p>
                            <strong>is_claimed: </strong>{is_claimed ? "YES" : "NO"} <br />
                            <strong>is_closed: </strong>{is_closed ? "YES" : "NO"} <br />
                            <strong>phone: </strong>{display_phone} <br />
                            <strong>price: </strong>{price} <br />
                            <strong>address: </strong>{location.formatted_address} <br />
                            <strong>categories: </strong>{getCategories(categories)} <br />
                            <strong>Hours(type: is_open_now): </strong>{getHours(hours)}
                        </p>
                    </div>
                </div>
            </article>
        </section>
    )
}

function getHours(hours) {
    const text = hours.map(x => x.hours_type + ' : ' + (x.is_open_now ? "YES" : "NO")).join(" · ")
    return text;
}

function getCategories(categories) {
    const titles = categories.map(x => x.title).join(" · ")
    return titles;
}