import { gql } from "@apollo/client";

export const BasicSearch = gql`
    query BasicSearch($term: String, $location: String, $offset: Int) {
        search(term: $term, location: $location, offset: $offset) {
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