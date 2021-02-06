export interface ImageConfig {
    readonly attributeNames: ImageAttributeNames;
    readonly classNames: ImageClassNames;
}

export interface ImageAttributeNames {
    readonly width: string;
    readonly height: string;
    readonly src: string;
}

export interface ImageClassNames {
    readonly base: string;
    readonly hidden: string;
    readonly active: string;
}
