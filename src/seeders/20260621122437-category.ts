import exerciseData from '../../submodules/free-exercise-db/dist/exercises.json';
import Category from "@/models/category.model";

const categories = [...new Set(exerciseData.map(ex => ex.category))];

module.exports = {
  async up() {
    // seed categories
    await Category.bulkCreate(categories.map(names => ({
      name: names,
    })));
  },

  async down() {
    await Category.destroy({
      where: {
        name: [...categories],
      },
      force: true,
    });
  }
};
