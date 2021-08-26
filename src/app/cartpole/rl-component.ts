import { RlEnvironment } from './rl-environment';

export interface RlComponent {
    renderSimulation(simulator: RlEnvironment): void;
    updateInfo(message: string): void;
    updateGameProgress(current: number, total: number): void;
    // updateProgress(progress: progressObj): void;
}

// export interface progressObj {
//     games: {
//         current: number,
//         total: number
//     };
//     iteration: {
//         current: number,
//         total: number
//     }
// }
