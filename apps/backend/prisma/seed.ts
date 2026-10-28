import bcrypt from "bcrypt";
import { OrganizationStatus, UserStatus } from "../src/generated/prisma/client";
import {
  assignPlatformRoleBySlug,
  seedDefaultRolesForOrg,
  seedPlatformRole,
} from "../src/lib/roleSeeding";
import { assignOrgMembershipBySlug } from "../src/lib/orgMembership";
import { seedDefaultModulesForOrg } from "../src/lib/seedOrganizationModules";
import { seedPermissions } from "../src/lib/seedPermissions";
import { disconnectPrisma, prisma } from "../src/lib/prisma";

const SALT_ROUNDS = 10;

const PLATFORM_ADMINS = [
  {
    email: "tandem.admin@yopmail.com",
    name: "Platform Admin",
    password: "Admin@123",
  },
  {
    email: "tandem.admin2@yopmail.com",
    name: "Platform Admin 2",
    password: "Tandem@123",
  },
] as const;

const ORGANIZATIONS = [
  {
    name: "Wayne Enterprises",
    code: "wayne-enterprises",
    description: "Gotham conglomerate spanning tech, real estate, and applied sciences",
    admin: {
      email: "wayne@yopmail.com",
      name: "Wayne Enterprises Admin",
      password: "Wayne@123",
    },
  },
  {
    name: "Daggett Industries",
    code: "daggett-industries",
    description: "Gotham construction and energy firm, rival to Wayne Enterprises",
    admin: {
      email: "daggett@yopmail.com",
      name: "Daggett Industries Admin",
      password: "Daggett@123",
    },
  },
  {
    name: "Ace Chemicals",
    code: "ace-chemicals",
    description: "Gotham industrial chemical manufacturer",
    admin: {
      email: "ace@yopmail.com",
      name: "Ace Chemicals Admin",
      password: "Ace@123",
    },
  },
  {
    name: "Janus Cosmetics",
    code: "janus-cosmetics",
    description: "Gotham cosmetics house from the Sionis family",
    admin: {
      email: "janus@yopmail.com",
      name: "Janus Cosmetics Admin",
      password: "Janus@123",
    },
  },
  {
    name: "LexCorp",
    code: "lexcorp",
    description: "Metropolis conglomerate spanning energy, tech, and defense",
    admin: {
      email: "lexcorp@yopmail.com",
      name: "LexCorp Admin",
      password: "Lex@123",
    },
  },
] as const;

const main = async () => {
  await prisma.$transaction(async (tx) => {
    await seedPermissions(tx);
    await seedPlatformRole(tx);

    for (const admin of PLATFORM_ADMINS) {
      const user = await tx.user.upsert({
        where: { email: admin.email },
        update: {},
        create: {
          email: admin.email,
          name: admin.name,
          passwordHash: await bcrypt.hash(admin.password, SALT_ROUNDS),
          status: UserStatus.ACTIVE,
        },
      });

      await assignPlatformRoleBySlug(tx, user.id, "platform_admin");
    }

    for (const org of ORGANIZATIONS) {
      const organization = await tx.organization.upsert({
        where: { code: org.code },
        update: {},
        create: {
          name: org.name,
          code: org.code,
          description: org.description,
          status: OrganizationStatus.ACTIVE,
        },
      });

      await seedDefaultRolesForOrg(tx, organization.id);
      await seedDefaultModulesForOrg(tx, organization.id);

      const orgAdmin = await tx.user.upsert({
        where: { email: org.admin.email },
        update: {},
        create: {
          email: org.admin.email,
          name: org.admin.name,
          passwordHash: await bcrypt.hash(org.admin.password, SALT_ROUNDS),
          status: UserStatus.ACTIVE,
        },
      });

      await assignOrgMembershipBySlug(
        tx,
        orgAdmin.id,
        organization.id,
        "org_admin",
      );
    }
  });

  console.log("Seed completed successfully");
};

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await disconnectPrisma();
  });
