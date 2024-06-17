db = db.getSiblingDB("selks");
db.createCollection("users");
db.createUser({
  user: "snortyUser",
  pwd: "snortyPassword",
  roles: [
    {
      role: "readWrite",
      db: "selks",
    },
  ],
});
