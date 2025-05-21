import axios from 'axios';

export function fetchAllProducts() {
    return new Promise(async(resolve) => {
        const response = await axios("http://localhost:9010/product");
        resolve({ data: response.data.data });
    })
}

export function fetchProductsByBrand(brand) {
    return new Promise(async (resolve) => {
        const response = await axios.get("http://localhost:9010/product/by-brand/" + brand);
        resolve({ data: response.data.data });
    });
}

export function fetchProductsByCategory(category) {
    return new Promise(async (resolve) => {
        const response = await axios.get("http://localhost:9010/product/by-category/" + category);
        resolve({ data: response.data.data });
    });
}

export function fetchAllProductsByFilters(filter) {
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

// export function fetchAllProductBrands() {
//     return new Promise(async(resolve) => {
//         const response = await axios("http://localhost:8080/products");
//         const data = response.data;
//         const brands = [...new Set(data.map(product => product.brand))];
//         resolve({ data: brands });
//     })
// }