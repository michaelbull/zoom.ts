export interface CloneConfig {
    readonly classNames: CloneClassNames;
}

export interface CloneClassNames {
    readonly base: string;
    readonly visible: string;
    readonly loaded: string;
}
