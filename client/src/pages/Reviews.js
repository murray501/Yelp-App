import React, {useMemo, useEffect} from "react";
import { ReviewSearch } from "./../gql";
import { useQuery } from "@apollo/client";
import { loadJSON, saveJSON, ShowStars} from "./../utils";

export default function Reviews({chunk}) {
    const stored = useMemo(() => {
        const key = JSON.stringify({type: "Reviews", id: chunk.id});
        let stored = loadJSON(key);
        return stored;
    }, []);

    if (stored) {
        return <Show chunk={chunk} data={stored} />
    }

    return (
        <ReviewQuery chunk={chunk} />
    )
}

function ReviewQuery({chunk}) {
    const {id, name, url, photos, rating, review_count} = chunk;
    const {loading, error, data} = useQuery(ReviewSearch, {variables: {id}});
        
    useEffect(() => {
        if (data) {
            const key = JSON.stringify({type: "Reviews", id: chunk.id});
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
    const reviews = data.reviews.review;
    return (
        <>
        <div class="box">
            <div class="level">
                <div class="level-left">
                    <figure class="media-left">
                        <img width="80" src={photos} alt="Placeholder image" />
                    </figure>
                </div>
                <div class="level-item">
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
        </div>
        <ShowReviews reviews={reviews} />
        </>
    )
}

function ShowReviews({reviews}) {
    return (
    <section class="section">
        {reviews.map(review => <ShowReview review={review} />)}
    </section>
    )
}

function ShowReview({review}) {
    const {rating, text, user} = review;
    const {name, image_url} = user;

    return (
    <article class="media">
        <figure class="media-left">
            <p class="image is-64x64">
                <img src={image_url} />
            </p>
        </figure>
        <div class="media-content">
            <div class="content">
                <p>
                    <strong>{name}</strong>
                    <br />
                    {text}
                    <br />
                    <ShowStars rating={rating} />
                </p>
            </div>
        </div>
    </article>
    )
}
