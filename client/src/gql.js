import { gql } from "@apollo/client";

export const BasicSearch = gql`
    query BasicSearch($term: String, $location: String, $limit: Int) {
        search(term: $term, location: $location, limit: $limit) {
            total
            business {
                name
                url
                photos
                rating
                review_count
            }
        }
    }    
`