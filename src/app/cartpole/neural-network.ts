/**
 * Adaptation of the CartPole Example
 * https://github.com/tensorflow/tfjs-examples/tree/master/cart-pole
 * 
 * Rewritten in TypeScript and integrated into the Angular Framework
 * 
 */

import * as tf from '@tensorflow/tfjs';
import { Cart } from './cart';
import { RlComponent } from './rl-component';
import { RlEnvironment } from './rl-environment';

export class NeuralNetwork {

    private network: tf.LayersModel;
    private currentActions_: any;

    // accept a model and a renderer as input
    constructor(
        inputModel: number | Array<number> | tf.LayersModel,
        public renderer: RlComponent
    ) {
        if (inputModel instanceof tf.LayersModel) {
            this.network = inputModel;
        } else {
            this.network = this.createNewModel(inputModel);
        }
    }

    createNewModel(inputModel: number | number[]): tf.LayersModel {
        let modelSizes: number[];
        modelSizes = Array.isArray(inputModel) ? inputModel : [inputModel];
        let model = tf.sequential();
        modelSizes.forEach((size, index) => {
            // use the list of nums as dimensions for each layer, except the first,
            // which is fixed to the state dimension of the environment
            model.add(tf.layers.dense({
                units: size,
                activation: 'elu',
                inputShape: index === 0 ? [4] : undefined
            }));
        });
        model.add(tf.layers.dense({ units: 1 }));
        return model;
    }

    async downloadModel() {
        let today = new Date();
        let date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        let time = today.getHours() + "-" + today.getMinutes() + "-" + today.getSeconds();
        await this.network.save('downloads://cart-pole-network-' + date + time);
    }

    computeGrad(inputTensor) {
        const f = () => tf.tidy(() => {
            const [logits, actions] = tf.tidy(() => {
                // get model output for the input
                const logits = (this.network.predict(inputTensor) as tf.Tensor);
                // convert the logits of the model into probabilities
                const leftProb = tf.sigmoid(logits);
                // negative value represents -x direction, needs to be added as second probability
                const leftRightProbs = (tf.concat([leftProb, tf.sub(1, leftProb)], 1) as tf.Tensor2D);
                const actions = tf.multinomial(leftRightProbs, 1, null, true);
                return [logits, actions];
            })
            // store the action to perform, according to the network in currentActions_
            this.currentActions_ = actions.dataSync();
            const labels = tf.sub(1, tf.tensor2d(this.currentActions_, (actions as tf.Tensor2D).shape));
            return tf.losses.sigmoidCrossEntropy(labels, logits).asScalar();
        });
        return tf.variableGrads(f);
    }

    async trainNetwork(
        simulator: RlEnvironment,
        optimizer: tf.Optimizer,
        discount: number,
        nGames: number,
        nSteps: number
    ): Promise<number[]> {
        const gradientList = [], rewardList = [], stepsList: number[] = [];
        this.renderer.updateGameProgress(0, nGames);

        // go through all games, 
        // collect steps, rewards and gradients for each game
        for (let i = 0; i < nGames; ++i) {
            // randomize the environment before each game
            simulator.randomizeState();
            const rewards = [], gradients = [];
            // in each step the gradient and its reward is saved
            for (let j = 0; j < nSteps; ++j) {
                const currGradients = tf.tidy(() => {
                    // get the state of the environment
                    const state = simulator.getStateTensor();
                    return this.computeGrad(state).grads;
                });
                // add gradients from this step to the gradient list for this game
                this.concatGradientList(gradients, currGradients);
                // update the environment
                const action = this.currentActions_[0];
                const done = simulator.update(action);
                await this.renderer.renderSimulation(simulator);
                // add reward for the chosen action if not ended
                if (done) {
                    rewards.push(0);
                    break;
                } else {
                    rewards.push(1);
                }
            }
            // inform renderer about changes and save steps, gradients and rewards
            this.renderer.updateGameProgress(i + 1, nGames);
            stepsList.push(rewards.length);
            // this saves the 
            this.concatGradientList(gradientList, gradients);
            rewardList.push(rewards);
            await tf.nextFrame();
        }

        tf.tidy(() => {
            // discount the rewards
            const discounted = [];
            for (let r of rewardList) {
                const buffer = tf.buffer([r.length]);
                let prev = 0;
                for (let i = r.length - 1; i >= 0; --i) {
                    // use discount factor
                    // more current rewards hold more relevance
                    const curr = discount * prev + r[i];
                    buffer.set(curr, i);
                    prev = curr;
                }
                discounted.push(buffer.toTensor());
            }
            // normalize rewards (use norm vector method)
            // here the mean is subtracted, so big rewards are positive
            // and small rewards are negative
            const concat = tf.concat(discounted);
            const mean = tf.mean(concat);
            const std = tf.sqrt(tf.mean(tf.square(concat.sub(mean))));
            const normalized = discounted.map(rs => rs.sub(mean).div(std));

            // scale gradients
            const gradients = {};
            for (let idx in gradientList) {
                gradients[idx] = tf.tidy(() => {
                    const stackedGrads = gradientList[idx].map(singleGrad => tf.stack(singleGrad));
                    // calculate dimensions that are generated after the stacking
                    const expandedDims = [];
                    for (let i = 0; i < stackedGrads[0].rank - 1; ++i) {
                        expandedDims.push(1);
                    }
                    // reshape the rewards to allow multiplication with the gradients
                    const expandedRewards = normalized.map(rs => rs.reshape(rs.shape.concat(expandedDims)));
                    for (let g = 0; g < stackedGrads.length; ++g) {
                        // multiply gradients with their rewards
                        stackedGrads[g] = stackedGrads[g].mul(expandedRewards[g]);
                    }
                    // average gradients
                    return tf.mean(tf.concat(stackedGrads, 0), 0);
                });
            }
            optimizer.applyGradients(gradients);
        });

        tf.dispose(gradientList);
        return stepsList;
    }

    getActions(inputs) {
        // get the action to perform according to model
        // based on current state (inputs)
        const actions = tf.tidy(() => {
            const logits = (this.network.predict(inputs) as tf.Tensor);
            // convert the logits of the model into probabilities
            const partProb = tf.sigmoid(logits);
            // negative value represents -x direction, needs to be added as second probability
            const completeProb = (tf.concat([partProb, tf.sub(1, partProb)], 1) as tf.Tensor2D);
            return tf.multinomial(completeProb, 1, null, true);
        })
        return actions.dataSync();
    }

    concatGradientList(storage, new_gradients) {
        // basically just concat two dicts
        for (const grad in new_gradients) {
            if (grad in storage) {
                storage[grad].push(new_gradients[grad]);
            } else {
                storage[grad] = [new_gradients[grad]];
            }
        }
    }
}
