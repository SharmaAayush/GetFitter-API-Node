import MuscleGroup, { MuscleGroupCreationAttributes } from "@/models/musclegroup.model";
import { Optional } from "sequelize";
import { NullishPropertiesOf } from "sequelize/lib/utils";
import exerciseData from '../../submodules/free-exercise-db/dist/exercises.json';

const seedData = [
  ...new Set(
    exerciseData.map(
      ex => ex.primaryMuscles.concat(ex.secondaryMuscles)
    ).flat()
  )
];

module.exports = {
  async up() {
    const mappedSeedData: readonly Optional<MuscleGroupCreationAttributes, NullishPropertiesOf<MuscleGroupCreationAttributes>>[] = seedData.map(muscleGroup => ({
      name: muscleGroup,
    }));
    await MuscleGroup.bulkCreate(mappedSeedData);
  },

  async down() {
    await MuscleGroup.destroy({
      where: {
        name: [...seedData],
      },
      // force is needed to bypass paranoid (soft delete) and permanently remove records from the database
      force: true,
    });
  }
};
