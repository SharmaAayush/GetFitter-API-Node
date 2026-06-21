import Equipment from "@/models/equipment.model";
import exerciseData from '@/submodules/free-exercise-db/dist/exercises.json';

const seedData = [...new Set(exerciseData.map(ex => ex.equipment))].filter(eq => eq !== null);

module.exports = {
  async up() {
    await Equipment.bulkCreate(seedData.map(equipment => ({
      name: equipment,
    })));
  },

  async down() {
    await Equipment.destroy({
      where: {
        name: [...seedData]
      },
      // force is needed to bypass paranoid (soft delete) and permanently remove records from the database
      force: true,
    });
  }
};
