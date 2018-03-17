export declare class Features {
    static of(style: CSSStyleDeclaration): Features;
    readonly hasTransform: boolean;
    readonly hasTransform3d: boolean;
    readonly hasTransitions: boolean;
    readonly transformProperty?: string;
    readonly transitionProperty?: string;
    readonly transitionEndEvent?: string;
    constructor(hasTransform: boolean, hasTransform3d: boolean, hasTransitions: boolean, transformProperty?: string, transitionProperty?: string, transitionEndEvent?: string);
}
