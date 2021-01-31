export interface Features {
    readonly transform: boolean;
    readonly transform3d: boolean;
    readonly transitions: boolean;
    readonly transformProperty?: string;
    readonly transitionProperty?: string;
    readonly transitionEndEvent?: string;
}
