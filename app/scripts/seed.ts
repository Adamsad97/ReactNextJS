import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import "dotenv/config";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Démarrage du seed...");

  // Nettoyage pour repartir de zéro à chaque run
  await prisma.task.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  // Création des utilisateurs de test
  const passwordAlice = await bcrypt.hash("password123", 10);
  const passwordBob = await bcrypt.hash("password123", 10);
  const passwordCarla = await bcrypt.hash("password123", 10);

  const alice = await prisma.user.create({
    data: {
      name: "Alice Martin",
      email: "alice@taskflow.dev",
      password: passwordAlice,
    },
  });

  const bob = await prisma.user.create({
    data: {
      name: "Bob Dupont",
      email: "bob@taskflow.dev",
      password: passwordBob,
    },
  });

  const carla = await prisma.user.create({
    data: {
      name: "Carla Diaz",
      email: "carla@taskflow.dev",
      password: passwordCarla,
    },
  });

  console.log(`Utilisateurs créés : ${alice.name}, ${bob.name}, ${carla.name}`);

  // Projet commun avec Alice comme propriétaire, Bob et Carla comme membres
  const projet = await prisma.category.create({
    data: {
      name: "Projet TaskFlow",
      color: "#3B82F6",
      userId: alice.id,
      members: {
        connect: [{ id: alice.id }, { id: bob.id }, { id: carla.id }],
      },
    },
  });

  console.log(`Projet créé : "${projet.name}"`);

  // Tâches assignées
  await prisma.task.createMany({
    data: [
      {
        title: "Configurer le CI/CD",
        description: "Mettre en place GitHub Actions pour les tests et le déploiement.",
        status: "TODO",
        priority: "HIGH",
        position: 0,
        userId: alice.id,
        categoryId: projet.id,
      },
      {
        title: "Créer les maquettes UI",
        description: "Réaliser les maquettes Figma des pages principales.",
        status: "IN_PROGRESS",
        priority: "MEDIUM",
        position: 1,
        userId: alice.id,
        categoryId: projet.id,
      },
      {
        title: "Rédiger la documentation API",
        description: "Documenter toutes les routes avec leurs paramètres et réponses.",
        status: "TODO",
        priority: "LOW",
        position: 2,
        userId: alice.id,
        categoryId: projet.id,
      },
    ],
  });

  // Assigner les tâches après création
  const tasks = await prisma.task.findMany({ where: { categoryId: projet.id } });

  await prisma.task.update({
    where: { id: tasks[0].id },
    data: { assignees: { connect: [{ id: bob.id }] } },
  });

  await prisma.task.update({
    where: { id: tasks[1].id },
    data: { assignees: { connect: [{ id: carla.id }, { id: bob.id }] } },
  });

  await prisma.task.update({
    where: { id: tasks[2].id },
    data: { assignees: { connect: [{ id: alice.id }] } },
  });

  console.log("Tâches créées et assignées.");
  console.log("\n--- Comptes de test ---");
  console.log("alice@taskflow.dev  /  password123  (propriétaire du projet)");
  console.log("bob@taskflow.dev    /  password123  (membre)");
  console.log("carla@taskflow.dev  /  password123  (membre)");
  console.log("--- Seed terminé ! ---");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
