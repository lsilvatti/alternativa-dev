//Interfaces de cada tipo tratado pelo CRUD

export interface Product {
    value: string,
    categoryId: number,
    category: Category,
    id?: number,
    name: string,
    description: string,
}


export interface Category {
    id: number,
    name: string,
    description: string
}