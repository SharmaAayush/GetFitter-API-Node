import Equipment from "@/models/equipment.model";
import { QueryInterface, Sequelize, WhereOptions } from "sequelize";

const seedData = [
  {
    "name": "assisted",
    "description": "Exercises performed with the manual guidance, support, or physical aid of a training partner or spotter."
  },
  {
    "name": "band",
    "description": "An elastic loop or strip used to create progressive muscular resistance during strength or mobility training."
  },
  {
    "name": "barbell",
    "description": "A long metal bar onto which weight plates are loaded for heavy compound lifts."
  },
  {
    "name": "body weight",
    "description": "Exercises utilizing the individual's own weight against gravity, requiring no external apparatus."
  },
  {
    "name": "bosu ball",
    "description": "An inflated rubber hemisphere attached to a rigid platform, used for balance and instability training."
  },
  {
    "name": "cable",
    "description": "An adjustable pulley system providing continuous tension throughout a movement's entire range of motion."
  },
  {
    "name": "dumbbell",
    "description": "A short handheld bar with fixed or adjustable weights on each end, used for unilateral training."
  },
  {
    "name": "elliptical machine",
    "description": "A low-impact stationary cardio machine that simulates running, walking, or climbing without heavy joint impact."
  },
  {
    "name": "ez barbell",
    "description": "A curved, undulating lifting bar designed to reduce stress on wrists and elbows during arm curls."
  },
  {
    "name": "hammer",
    "description": "A heavy sledgehammer implement swung against large tires for building explosive rotational power."
  },
  {
    "name": "kettlebell",
    "description": "A cast-iron or steel ball with a top handle, ideal for swinging and ballistic exercises."
  },
  {
    "name": "leverage machine",
    "description": "Plate-loaded gym equipment utilizing mechanical levers and pivot points instead of cables or pulleys."
  },
  {
    "name": "medicine ball",
    "description": "A heavy, weighted sports ball used for rehabilitation, strength training, and explosive plyometric drills."
  },
  {
    "name": "olympic barbell",
    "description": "A standard 2.2-meter steel bar weighing 20kg, featuring rotating sleeves for Olympic lifts."
  },
  {
    "name": "resistance band",
    "description": "Elastic tubing or flat bands that provide variable tension to target specific muscle groups."
  },
  {
    "name": "roller",
    "description": "A dense foam cylinder used for self-myofascial release, muscle tissue massage, and flexibility work."
  },
  {
    "name": "rope",
    "description": "Heavy, thick cords used either as cable attachments or anchored for high-intensity battle rope conditioning."
  },
  {
    "name": "skierg machine",
    "description": "A vertical conditioning machine that simulates the Nordic skiing motion to build upper-body endurance."
  },
  {
    "name": "sled machine",
    "description": "A heavy plate-loaded sled designed to be pushed or pulled across turf for lower-body power."
  },
  {
    "name": "smith machine",
    "description": "A weight-training machine where the barbell is fixed within vertical or near-vertical steel guide rails."
  },
  {
    "name": "stability ball",
    "description": "A large, inflatable elastic ball designed to improve core strength, balance, and posture during exercise."
  },
  {
    "name": "stationary bike",
    "description": "An indoor cardio machine simulating bicycle riding, featuring adjustable resistance levels."
  },
  {
    "name": "stepmill machine",
    "description": "A cardio machine featuring a rotating staircase escalator that provides an intense lower-body workout."
  },
  {
    "name": "tire",
    "description": "A massive, heavy rubber tire utilized for functional flipping, dragging, and striking exercises."
  },
  {
    "name": "trap bar",
    "description": "A hexagonal-shaped barbell that allows the lifter to stand inside it, optimizing deadlift mechanics."
  },
  {
    "name": "upper body ergometer",
    "description": "An arm-powered stationary bicycle alternative designed to provide cardiovascular conditioning for the upper body."
  },
  {
    "name": "weighted",
    "description": "Wearable gear or simple handheld implements used to add extra load to standard movements."
  },
  {
    "name": "wheel roller",
    "description": "A small sturdy wheel with a central axle handle, designed for intense abdominal rollout exercises."
  }
];

module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: Sequelize) {
    await Equipment.bulkCreate([...seedData]);
  },

  async down(queryInterface: QueryInterface, Sequelize: Sequelize) {
    await Equipment.destroy({
      where: {
        name: [...seedData.map(item => item.name)]
      },
      // force is needed to bypass paranoid (soft delete) and permanently remove records from the database
      force: true,
    });
  }
};
