CREATE TABLE "public"."users" (
  id VARCHAR(255) PRIMARY KEY NOT NULL,
  name VARCHAR(255),
  phone VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE "public"."categories" (
  id SERIAL PRIMARY KEY NOT NULL,
  description VARCHAR(255)
);

CREATE TABLE "public"."lists" (
  id SERIAL PRIMARY KEY NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
  "ownerId" VARCHAR(255) NOT NULL,
  FOREIGN KEY ("ownerId") REFERENCES "public"."users"(id),
  "categoryId" INTEGER NOT NULL,
  FOREIGN KEY ("categoryId") REFERENCES "public"."categories"(id)
);

CREATE TABLE "public"."status" (
  id SERIAL PRIMARY KEY NOT NULL,
  description VARCHAR(255)
);

CREATE TABLE "public"."activities" (
  id SERIAL PRIMARY KEY NOT NULL,
  description TEXT,
  dt_prev DATE NOT NULL,
  dt_exec DATE,
  "statusId" INTEGER NOT NULL,
  FOREIGN KEY ("statusId") REFERENCES "public"."status"(id),
  "listId" INTEGER NOT NULL,
  FOREIGN KEY ("listId") REFERENCES "public"."lists"(id),
  "responsibleId" VARCHAR(255) NOT NULL,
  FOREIGN KEY ("responsibleId") REFERENCES "public"."users"(id)
);
