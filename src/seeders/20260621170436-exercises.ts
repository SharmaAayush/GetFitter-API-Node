import Level from '@/models/level.model';
import exerciseData from '../../submodules/free-exercise-db/dist/exercises.json';
import Category from '@/models/category.model';
import Force from '@/models/force.model';
import Mechanic from '@/models/mechanic.model';
import Equipment from '@/models/equipment.model';
import Exercise, { ExerciseCreationAttributes } from '@/models/exercise.model';

module.exports = {
  async up() {
    // Prepare seed data
    const forces = await Force.findAll();
    const levels = await Level.findAll();
    const mechanics = await Mechanic.findAll();
    const equipments = await Equipment.findAll();
    const categories = await Category.findAll();

    const seedData = exerciseData
      .map<ExerciseCreationAttributes>(ex => {
        const exercise: ExerciseCreationAttributes = {
          name: ex.name,
          slug: ex.id,
        }
        const forceId = forces.find(record => record.name === ex.force)?.id;
        const levelId = levels.find(record => record.name === ex.level)?.id;
        const mechanicId = mechanics.find(record => record.name === ex.mechanic)?.id;
        const equipmentId = equipments.find(record => record.name === ex.equipment)?.id;
        const categoryId = categories.find(record => record.name === ex.category)?.id;
        if (forceId) exercise.forceId = forceId;
        if (levelId) exercise.levelId = levelId;
        if (mechanicId) exercise.mechanicId = mechanicId;
        if (equipmentId) exercise.equipmentId = equipmentId;
        if (categoryId) exercise.categoryId = categoryId;
        return {
          ...exercise,
        }
      })
      .filter(ex => ex.levelId && ex.categoryId);

    await Exercise.bulkCreate(seedData);
  },

  async down() {
    await Exercise.destroy({
      where: {
        slug: [...exerciseData.map(ex => ex.id)],
      },
      force: true,
    });
  }
};
