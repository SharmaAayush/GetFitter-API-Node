import BodyPartCategory from "@/models/bodypartcategory.model";
import MuscleGroup, { MuscleGroupCreationAttributes } from "@/models/musclegroup.model";
import { Optional, QueryInterface, Sequelize } from "sequelize";
import { NullishPropertiesOf } from "sequelize/lib/utils";

const seedData = [
  {
    "name": "abs",
    "bodyPartCategory": "waist",
    "description": "The rectus abdominis and obliques responsible for trunk flexion, rotation, and core stabilization."
  },
  {
    "name": "quads",
    "bodyPartCategory": "upper legs",
    "description": "The four-headed muscle group on the front of the thigh that extends the knee joint."
  },
  {
    "name": "lats",
    "bodyPartCategory": "back",
    "description": "The large, wing-shaped muscles of the mid-to-lower back that pull the arms down and back."
  },
  {
    "name": "calves",
    "bodyPartCategory": "lower legs",
    "description": "The lower leg muscles responsible for plantarflexion, helping you push off the ground when walking or jumping."
  },
  {
    "name": "pectorals",
    "bodyPartCategory": "chest",
    "description": "The primary chest muscles utilized for pushing objects away from the body and hugging motions."
  },
  {
    "name": "glutes",
    "bodyPartCategory": "upper legs",
    "description": "The powerful muscles of the buttocks responsible for hip extension, rotation, and pelvic stability."
  },
  {
    "name": "hamstrings",
    "bodyPartCategory": "upper legs",
    "description": "The muscle group located on the back of the thigh responsible for bending the knee."
  },
  {
    "name": "adductors",
    "bodyPartCategory": "upper legs",
    "description": "The inner thigh muscles responsible for drawing the legs inward toward the body's midline."
  },
  {
    "name": "triceps",
    "bodyPartCategory": "upper arms",
    "description": "The three-headed muscle group on the back of the upper arm responsible for extending the elbow."
  },
  {
    "name": "cardiovascular system",
    "bodyPartCategory": "cardio",
    "description": "The network of the heart and blood vessels that delivers oxygenated blood to working muscles."
  },
  {
    "name": "spine",
    "bodyPartCategory": "back",
    "description": "The deep erector spinae muscles along the vertebral column that support posture and trunk extension."
  },
  {
    "name": "upper back",
    "bodyPartCategory": "back",
    "description": "The muscular region containing the rhomboids and teres major, crucial for pulling the shoulder blades together."
  },
  {
    "name": "biceps",
    "bodyPartCategory": "upper arms",
    "description": "The two-headed muscle on the front of the upper arm responsible for flexing the elbow."
  },
  {
    "name": "delts",
    "bodyPartCategory": "shoulders",
    "description": "The shoulder muscles divided into front, side, and rear heads that lift and rotate the arms."
  },
  {
    "name": "forearms",
    "bodyPartCategory": "lower arms",
    "description": "The muscles of the lower arm responsible for controlling wrist movement and providing grip strength."
  },
  {
    "name": "traps",
    "bodyPartCategory": "back",
    "description": "The large triangular muscle extending from the neck to the mid-back that moves the shoulder blades."
  },
  {
    "name": "serratus anterior",
    "bodyPartCategory": "chest",
    "description": "The fan-shaped muscle along the side of the ribs that pulls the shoulder blade forward."
  },
  {
    "name": "abductors",
    "bodyPartCategory": "upper legs",
    "description": "The outer hip and thigh muscles responsible for moving the leg away from the body's midline."
  },
  {
    "name": "levator scapulae",
    "bodyPartCategory": "neck",
    "description": "The deep neck muscle responsible for elevating the shoulder blade and tilting the neck."
  }
];

module.exports = {
  async up(_queryInterface: QueryInterface, _Sequelize: Sequelize) {
    const bodyPartCategories = await BodyPartCategory.findAll();
    const mappedSeedData: readonly Optional<MuscleGroupCreationAttributes, NullishPropertiesOf<MuscleGroupCreationAttributes>>[] = seedData.map(data => ({
      name: data.name,
      description: data.description,
      bodyPartCategoryId: bodyPartCategories.find(bodyPartCategory => bodyPartCategory.name === data.bodyPartCategory)?.id || '',
    })).filter(data => data.bodyPartCategoryId !== '');
    await MuscleGroup.bulkCreate(mappedSeedData);
  },

  async down(_queryInterface: QueryInterface, _Sequelize: Sequelize) {
    await MuscleGroup.destroy({
      where: {
        name: [...seedData.map(data => data.name)],
      },
      // force is needed to bypass paranoid (soft delete) and permanently remove records from the database
      force: true,
    });
  }
};
