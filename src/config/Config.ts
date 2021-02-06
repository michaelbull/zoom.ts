import { CloneConfig } from './CloneConfig';
import { ContainerConfig } from './ContainerConfig';
import { ImageConfig } from './ImageConfig';
import { OverlayConfig } from './OverlayConfig';
import { WrapperConfig } from './WrapperConfig';

export interface Config {
    readonly scrollDismissPx: number;
    readonly clone: CloneConfig;
    readonly container: ContainerConfig;
    readonly image: ImageConfig;
    readonly overlay: OverlayConfig;
    readonly wrapper: WrapperConfig;
}

