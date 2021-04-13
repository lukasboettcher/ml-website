import { NeuralNetwork } from './neural-network';

describe('NeuralNetwork', () => {
  it('should create an instance', () => {
    expect(new NeuralNetwork(1,null)).toBeTruthy();
  });
});
