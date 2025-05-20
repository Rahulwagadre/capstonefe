import axios from 'axios';

export function userRegistration() {
    return new Promise(async(resolve) => {
        const response = await axios("http://localhost:9010/product");
        resolve({ data: response.data.data });
    })
}

export function userLogin(filter) {
    //filter:{"category": "beauty"}
    let queryString = ""
    for (let key in filter) {
        queryString += `${key}=${filter[key]}&`
    }
    return new Promise(async(resolve) => {
        const response = await axios("http://localhost:8080/products?" + queryString);
        const data = response.data;
        resolve({ data });
    })
}

export function userLogout() {
    return new Promise(async(resolve) => {
        const response = await axios("http://localhost:9010/product");
        resolve({ data: response.data.data });
    })
}