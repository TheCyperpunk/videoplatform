export interface Category {
    id: string;
    name: string;
    icon: string;
    color: string;
    description: string;
    count: number;
}

export interface CategoryWithCount extends Category {
    videoCount: number;
}
