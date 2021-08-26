/**
 * Implementation based on: https://perma.cc/C9ZM-652R
 *
 * Inpired by: https://github.com/openai/gym/blob/master/gym/envs/classic_control/cartpole.py
 *
 */

import * as tf from '@tensorflow/tfjs';
import { RlEnvironment } from './rl-environment';

export class Cart implements RlEnvironment {

  private gravity;

  private massOfCart;
  private massOfPole;
  private totalMass;

  private cartWidth;
  private cartHeight;
  private poleLength;
  private poleSpeedPotential;

  private forceMag;
  private deltaT;

  private maxX;
  private maxTheta;

  private x;
  private dX;
  private theta;
  private dTheta;

  constructor() {
    // Constants that characterize the system.
    this.gravity = 9.8;

    this.massOfCart = 1.0;
    this.massOfPole = 0.1;
    this.totalMass = this.massOfCart + this.massOfPole;

    this.cartWidth = 0.2;
    this.cartHeight = 0.1;

    this.poleLength = 0.5;
    this.poleSpeedPotential = this.massOfPole * this.poleLength;
    this.forceMag = 10.0;
    this.deltaT = 0.02;

    this.maxX = 2.4;
    this.maxTheta = 12 / 360 * 2 * Math.PI;

    this.randomizeState();
  }

  /*
   * Copied from https://github.com/tensorflow/tfjs-examples/blob/master/cart-pole/ui.js
   */
  draw(canvas: HTMLCanvasElement): void {
    if (!canvas.style.display) {
      canvas.style.display = 'block';
    }
    const X_MIN = -this.maxX;
    const X_MAX = this.maxX;
    const xRange = X_MAX - X_MIN;
    const scale = canvas.width / xRange;

    const context = canvas.getContext('2d');
    context.clearRect(0, 0, canvas.width, canvas.height);
    const center = canvas.width / 2;

    // Draw the cart.
    const railY = canvas.height * 0.8;
    const cartW = this.cartWidth * scale;
    const cartH = this.cartHeight * scale;

    const cartX = this.x * scale + center;

    context.beginPath();
    context.strokeStyle = '#000000';
    context.lineWidth = 2;
    context.rect(cartX - cartW / 2, railY - cartH / 2, cartW, cartH);
    context.stroke();

    // Draw the wheels under the cart.
    const wheelRadius = cartH / 4;
    for (const offsetX of [-1, 1]) {
      context.beginPath();
      context.lineWidth = 2;
      context.arc(
        cartX - cartW / 4 * offsetX, railY + cartH / 2 + wheelRadius,
        wheelRadius, 0, 2 * Math.PI);
      context.stroke();
    }

    // Draw the pole.
    const angle = this.theta + Math.PI / 2;
    const poleTopX =
      center + scale * (this.x + Math.cos(angle) * this.poleLength);
    const poleTopY = railY -
      scale * (this.cartHeight / 2 + Math.sin(angle) * this.poleLength);
    context.beginPath();
    context.strokeStyle = '#fc8600';
    context.lineWidth = 6;
    context.moveTo(cartX, railY - cartH / 2);
    context.lineTo(poleTopX, poleTopY);
    context.stroke();

    // Draw the ground.
    const groundY = railY + cartH / 2 + wheelRadius * 2;
    context.beginPath();
    context.strokeStyle = '#000000';
    context.lineWidth = 1;
    context.moveTo(0, groundY);
    context.lineTo(canvas.width, groundY);
    context.stroke();

    // Draw the left and right limits.
    const limitTopY = groundY - canvas.height / 2;
    context.beginPath();
    context.strokeStyle = '#8a35bf';
    context.lineWidth = 2;
    context.moveTo(1, groundY);
    context.lineTo(1, limitTopY);
    context.stroke();
    context.beginPath();
    context.moveTo(canvas.width - 1, groundY);
    context.lineTo(canvas.width - 1, limitTopY);
    context.stroke();
  }

  randomizeState(): void {
    // set random cart pos and speed
    this.x = Math.random() - 0.5;
    this.dX = (Math.random() - 0.5) * 1;

    // set random pole angle and speed
    this.theta = (Math.random() - 0.5) * 2 * (6 / 360 * 2 * Math.PI);
    this.dTheta = (Math.random() - 0.5) * 0.5;
  }

  getStateTensor(): tf.Tensor {
    return tf.tensor2d([[this.x, this.dX, this.theta, this.dTheta]]);
  }

  update(action): boolean {
    const direction = action > 0 ? this.forceMag : -this.forceMag;

    const cosTheta = Math.cos(this.theta);
    const sinTheta = Math.sin(this.theta);

    // physics equations for the cartpole simulation
    const temp = (direction + this.poleSpeedPotential * this.dTheta * this.dTheta * sinTheta) / this.totalMass;
    const poleAccel = (this.gravity * sinTheta - cosTheta * temp) /
                       (this.poleLength * (4 / 3 - this.massOfPole * cosTheta * cosTheta / this.totalMass));
    const cartAccel = temp - this.poleSpeedPotential * poleAccel * cosTheta / this.totalMass;

    // update state by euler integration
    this.x += this.deltaT * this.dX;
    this.dX += this.deltaT * cartAccel;
    this.theta += this.deltaT * this.dTheta;
    this.dTheta += this.deltaT * poleAccel;

    return this.isDone();
  }

  isDone(): boolean {
    // if values are over threshold, round is over
    const cartOverBoundary = (this.x < -this.maxX || this.x > this.maxX);
    const weightAngleOverThreshold = (this.theta < -this.maxTheta || this.theta > this.maxTheta);
    return cartOverBoundary || weightAngleOverThreshold;
  }
}
