import * as tf from '@tensorflow/tfjs';

export interface RlEnvironment {
    randomizeState(): void;
    getStateTensor(): tf.Tensor;
    update(action): boolean;
    draw(canvas: HTMLCanvasElement): void;
}
