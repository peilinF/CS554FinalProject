import { ObjectId } from "mongodb";
import { maps } from "../config/mongoCollections.js";

export const getRoute = async (id) => {
  const mapsCollection = await maps();
  const route = await mapsCollection.findOne({ _id: new ObjectId(id) });
  return route;
};

export const saveRoute = async (body) => {
  const mapsCollection = await maps();
  const insertInfo = await mapsCollection.insertOne(body);
  if (!insertInfo.acknowledged || !insertInfo.insertedId)
    throw { status: 400, message: "Could not add feed" };

  return await getRoute(insertInfo.insertedId);
};
