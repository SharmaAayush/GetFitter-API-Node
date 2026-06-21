import exerciseData from '../../submodules/free-exercise-db/dist/exercises.json';
import Force from "@/models/force.model";
import Level from "@/models/level.model";
import Mechanic from "@/models/mechanic.model";
import ImagePath from "@/models/image-path.model";

const forces = [...new Set(exerciseData.map(ex => ex.force))].filter(force => force !== null);
const levels = [...new Set(exerciseData.map(ex => ex.level))];
const mechanics = [...new Set(exerciseData.map(ex => ex.mechanic))].filter(mechanic => mechanic !== null);
const imagePaths = [...new Set(exerciseData.map(ex => ex.images).flat())];

module.exports = {
  async up() {
    // seed forces
    await Force.bulkCreate(forces.map(names => ({
      name: names,
    })));
    // seed levels
    await Level.bulkCreate(levels.map(names => ({
      name: names,
    })));
    // seed mechanics
    await Mechanic.bulkCreate(mechanics.map(names => ({
      name: names,
    })));
    // seed image paths
    await ImagePath.bulkCreate(imagePaths.map(names => ({
      name: names,
    })));
  },

  async down() {
    await Force.destroy({
      where: {
        name: [...forces],
      },
      force: true,
    });
    await Level.destroy({
      where: {
        name: [...levels],
      },
      force: true,
    });
    await Mechanic.destroy({
      where: {
        name: [...mechanics],
      },
      force: true,
    });
    await ImagePath.destroy({
      where: {
        name: [...imagePaths],
      },
      force: true,
    });
  }
};
