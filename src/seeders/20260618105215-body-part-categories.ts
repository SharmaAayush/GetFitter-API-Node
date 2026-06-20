import BodyPartCategory from "@/models/bodypartcategory.model";
import { QueryInterface, Sequelize } from "sequelize";

const SeedData = [
  {
    "name": "waist",
    "description": "The central midsection of the body, encompassing the abdominal muscles, obliques, and lower back stability core."
  },
  {
    "name": "upper legs",
    "description": "The thigh region, including major powerful muscle groups such as the quadriceps, hamstrings, and gluteals."
  },
  {
    "name": "back",
    "description": "The posterior torso comprising the latissimus dorsi, rhomboids, trapezius, and erector spinae muscles for pulling and posture."
  },
  {
    "name": "lower legs",
    "description": "The lower extremity below the knee, primarily consisting of the gastrocnemius and soleus muscles of the calf."
  },
  {
    "name": "chest",
    "description": "The anterior upper torso, dominated by the pectoralis major and minor muscles used for pushing movements."
  },
  {
    "name": "upper arms",
    "description": "The segment between the shoulder and elbow, housing the biceps brachii, triceps brachii, and brachialis muscles."
  },
  {
    "name": "cardio",
    "description": "Not a structural muscle group, but refers to the cardiovascular system, focusing on heart and lung endurance training."
  },
  {
    "name": "shoulders",
    "description": "The deltoid muscles, including the anterior, lateral, and posterior heads that govern arm rotation and elevation."
  },
  {
    "name": "lower arms",
    "description": "The forearm region, containing the brachioradialis, flexors, and extensors responsible for wrist movement and grip strength."
  },
  {
    "name": "neck",
    "description": "The cervical region, supported by the sternocleidomastoid and upper trapezius muscles to control head movement and stabilization."
  }
];

module.exports = {
  async up(_queryInterface: QueryInterface, _Sequelize: Sequelize) {
    await BodyPartCategory.bulkCreate([...SeedData]);
  },

  async down(_queryInterface: QueryInterface, _Sequelize: Sequelize) {
    await BodyPartCategory.destroy({
      where: {
        name: [...SeedData.map(item => item.name)]
      },
      // force is needed to bypass paranoid (soft delete) and permanently remove records from the database
      force: true,
    });
  }
};
