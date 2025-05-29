import { MotionStrategy } from "./MotionStrategy.js";

export class RigidBodyStrategy extends MotionStrategy {
  constructor(screenWidth, screenHeight) {
    super(screenWidth, screenHeight);
  }

  setupInitialState(body) {
    body.position = {
      x: Math.random() * this.screenWidth,
      y: Math.random() * this.screenHeight,
    };

    body.velocity = {
      x: (Math.random() - 0.5) * 0.02,
      y: (Math.random() - 0.5) * 0.02,
    };

    body.acceleration = { x: 0, y: 0 };
    body.mass = body.mass || 1 + Math.random() * 4;
    body.momentOfInertia = body.mass * 10;

    body.rotation = body.rotation || 0;
    body.angularVelocity = body.angularVelocity || (Math.random() - 0.5) * 0.01;
    body.angularAcceleration = 0;

    body.momentum = {
      x: body.velocity.x * body.mass,
      y: body.velocity.y * body.mass,
    };
    body.angularMomentum = body.angularVelocity * body.momentOfInertia;
const def = body.typeDefinition;
if (def.shape === 'circle') {
  const r = def.width / 2;
  body.collider = {
    type: 'circle',
    radius: r,
  };
  body.momentOfInertia = 0.5 * body.mass * r * r;
} else if (def.shape === 'rectangle') {
  const w = def.width;
  const h = def.height;
  body.collider = {
    type: 'rectangle',
    width: w,
    height: h,
  };
  body.momentOfInertia = (1 / 12) * body.mass * (w * w + h * h);
}
}

  advanceStates(bodies, dt) {
    const steps = 16;
    const subdt = dt / steps;

    for (let s = 0; s < steps; s++) {
      // Перевірка колізій перед переміщенням
      for (let i = 0; i < bodies.length; i++) {
        for (let j = i + 1; j < bodies.length; j++) {
          const bodyA = bodies[i];
          const bodyB = bodies[j];
          if (!bodyA || !bodyB) continue;

          if (this.checkCollision(bodyA, bodyB)) {
            this.resolveCollision(bodyA, bodyB);
          }
        }
      }

      // Потім рух
      for (const body of bodies) {
        // Velocity-Verlet
        body.position.x += body.velocity.x * subdt + 0.5 * body.acceleration.x * subdt * subdt;
        body.position.y += body.velocity.y * subdt + 0.5 * body.acceleration.y * subdt * subdt;

        body.velocity.x += body.acceleration.x * subdt;
        body.velocity.y += body.acceleration.y * subdt;

        body.rotation += body.angularVelocity * subdt + 0.5 * body.angularAcceleration * subdt * subdt;
        body.angularVelocity += body.angularAcceleration * subdt;

        body.position.x = (body.position.x + this.screenWidth) % this.screenWidth;
        body.position.y = (body.position.y + this.screenHeight) % this.screenHeight;

        body.x = body.position.x;
        body.y = body.position.y;

        body.momentum.x = body.velocity.x * body.mass;
        body.momentum.y = body.velocity.y * body.mass;
        body.angularMomentum = body.angularVelocity * body.momentOfInertia;
      }
    }
  }


  checkCollision(bodyA, bodyB) {

    const a = bodyA.collider;
    const b = bodyB.collider;

    if (a.type === 'circle' && b.type === 'circle') {

      const dx = bodyA.position.x - bodyB.position.x;
      const dy = bodyA.position.y - bodyB.position.y;
      const distSq = dx * dx + dy * dy;
      const rSum = a.radius + b.radius;

      return distSq <= rSum*rSum;
    }

    if (a.type === 'rectangle' && b.type === 'rectangle') {

      return !(

        bodyA.position.x + a.width / 2 < bodyB.position.x - b.width / 2 ||
        bodyA.position.x - a.width / 2 > bodyB.position.x + b.width / 2 ||
        bodyA.position.y + a.height / 2 < bodyB.position.y - b.height / 2 ||
        bodyA.position.y - a.height / 2 > bodyB.position.y + b.height / 2
      );
    }

    // Circle-Rectangle
    let circle, rect;
    if (a.type === 'circle' && b.type === 'rectangle') {

      circle = bodyA;
      rect = bodyB;
    } else if (b.type === 'circle' && a.type === 'rectangle') {

      circle = bodyB;
      rect = bodyA;
    } else {
      return false;
    }

    const closestX = Math.max(
      rect.position.x - rect.collider.width / 2,
      Math.min(circle.position.x, rect.position.x + rect.collider.width / 2)
    );
    const closestY = Math.max(
      rect.position.y - rect.collider.height / 2,
      Math.min(circle.position.y, rect.position.y + rect.collider.height / 2)
    );

    const dx = circle.position.x - closestX;
    const dy = circle.position.y - closestY;

    return dx * dx + dy * dy <= circle.collider.radius * circle.collider.radius;
  }
resolveCollision(bodyA, bodyB) {

//console.log("1colision"+bodyB.collider.x);
  const dx = bodyB.position.x - bodyA.position.x;
  const dy = bodyB.position.y - bodyA.position.y;

  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist === 0) return;

  const nx = dx / dist;
  const ny = dy / dist;

  const restitution = 0.8;

  const rvx = bodyB.velocity.x - bodyA.velocity.x;
  const rvy = bodyB.velocity.y - bodyA.velocity.y;
  const velAlongNormal = rvx * nx + rvy * ny;


  const invMassA = 1 / bodyA.mass;
  const invMassB = 1 / bodyB.mass;

  const j = -(1 + restitution) * velAlongNormal / (invMassA + invMassB);
  const impulseX = j * nx;
  const impulseY = j * ny;

  bodyA.velocity.x -= impulseX * invMassA;
  bodyA.velocity.y -= impulseY * invMassA;
  bodyB.velocity.x += impulseX * invMassB;
  bodyB.velocity.y += impulseY * invMassB;

  const contactX = (bodyA.position.x + bodyB.position.x) / 2;
  const contactY = (bodyA.position.y + bodyB.position.y) / 2;
//console.log("colision"+bodyB.name+" "+contactY);

  const rxA = contactX - bodyA.position.x;
  const ryA = contactY - bodyA.position.y;
  const rxB = contactX - bodyB.position.x;
  const ryB = contactY - bodyB.position.y;

  const torqueA = rxA * impulseY - ryA * impulseX;
  const torqueB = rxB * impulseY - ryB * impulseX;

  const invInertiaA = bodyA.momentOfInertia > 0 ? 1 / bodyA.momentOfInertia : 0;
  const invInertiaB = bodyB.momentOfInertia > 0 ? 1 / bodyB.momentOfInertia : 0;

  bodyA.angularVelocity -= torqueA * invInertiaA;
  bodyB.angularVelocity += torqueB * invInertiaB;

  const rA = bodyA.collider.radius || Math.min(bodyA.collider.width, bodyA.collider.height) / 2;
  const rB = bodyB.collider.radius || Math.min(bodyB.collider.width, bodyB.collider.height) / 2;
  const penetration = rA + rB - dist;

if (velAlongNormal > 0 && penetration <= 0) return;
  if (penetration > 0) {
    const percent = 0.6;
    const slop = 0.001;
    const correctionMag = Math.max(penetration - slop, 0) / (invMassA + invMassB) * percent;
    const correctionX = correctionMag * nx;
    const correctionY = correctionMag * ny;

    bodyA.position.x -= correctionX * invMassA;
    bodyA.position.y -= correctionY * invMassA;
    bodyB.position.x += correctionX * invMassB;
    bodyB.position.y += correctionY * invMassB;
  }
}

}
