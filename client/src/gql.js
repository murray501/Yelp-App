import { gql } from "@apollo/client";

export const BasicSearch = gql`
    query BasicSearch($term: String, $location: String, $offset: Int) {
        search(term: $term, location: $location, offset: $offset) {
            total
            business {
                id
                name
                url
                photos
                rating
                review_count
            }
        }
    }    
`

export const BusinessSearch = gql`
    query BusinessSearch($id: String) {
        business(id: $id) {
            is_claimed
            is_closed
            display_phone
            price
            categories {
                title
                alias
            }
            location {
                formatted_address
            }
            hours {
                hours_type
                is_open_now
            }
        }
    }
`

export const ReviewSearch = gql`
    query ReviewSearch($id: String) {
        reviews(business: $id) {
            total
            review {
                rating
                text
                user {
                    name
                    image_url
                }
            }
        }
    }
`