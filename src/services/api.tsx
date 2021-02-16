import {Product, Category} from "./interfaces"

//VARIAVEIS DE AMBIENTE
const productEndpoint = 'http://209.126.0.127:6001/api/product';
const categoryEndpoint = 'http://209.126.0.127:6001/api/category';
const headers = {
    'content-type':'application/json'
}

export function getProduct() {
    return fetch(productEndpoint, { method: 'get' })
    .then(res => res.json());
}

export function putProduct(product:Product) {
    product.value.replace(/,/g , ".");
    const sendValues = {
        id: product.id,
        name: product.name,
        description : product.description,
        value : Number(product.value) ,
        categoryId : Number(product.categoryId)
    }
    product.categoryId = Number(product.categoryId);
    return fetch(productEndpoint, {method:'put', body: JSON.stringify(sendValues), headers:headers});
}

export function deleteProduct(productID:number){
    return fetch(`${productEndpoint}/${productID}`, { method: 'delete' });
}

export function postProduct(product:Product){
    product.value.replace(/,/g , ".");
    const sendValues = {
        name: product.name,
        description : product.description,
        value : Number(product.value) ,
        categoryId : Number(product.categoryId)
    }
    return fetch(productEndpoint, {method:'post', body: JSON.stringify(sendValues), headers:headers});
}

export function getCategory() {
    return fetch(categoryEndpoint, { method: 'get' })
    .then(res => res.json())
}

export function putCategory(category:Category) {
    return fetch(categoryEndpoint, {method: 'put', body: JSON.stringify(category), headers:headers})
}

export function deleteCategory(categoryID:number){
    return fetch(`${categoryEndpoint}/${categoryID}`, { method: 'delete' });
}

export function postCategory(category:Category){
    return fetch(categoryEndpoint, {method:'post', body: JSON.stringify(category), headers:headers});
}