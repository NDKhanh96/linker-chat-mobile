declare global {
    /**
     * Bọc lấy type T để làm phẳng các thuộc tính của nó.
     */
    type Prettify<T> = { [K in keyof T]: T[K] } & {};
}

export {};
