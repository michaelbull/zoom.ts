export interface WrapperConfig {
    readonly classNames: WrapperClassNames;
}

export interface WrapperClassNames {
    readonly base: string;
    readonly expanding: string;
    readonly expanded: string;
    readonly collapsing: string;
}
