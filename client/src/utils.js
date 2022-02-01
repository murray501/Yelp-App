export const loadJSON = key => key && JSON.parse(localStorage.getItem(key));
export const saveJSON = (key, data) => localStorage.setItem(key, JSON.stringify(data));

export function ShowStars({rating}) {
    const valueFloat = parseFloat(rating);
    const valueInt = parseInt(rating);
    const prefix = "./yelp_stars/small/small_"
    const postfix = ".png"
    const infix = valueInt === valueFloat ? rating : `${valueInt}_half`
    const path = prefix + infix + postfix
    return (
        <img src={path} />
    )  
}


