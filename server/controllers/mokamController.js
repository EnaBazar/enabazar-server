import Mokam from "../models/Mokam.js";
import { createCrudController } from "./crudFactory.js";

export const mokamController = createCrudController(Mokam, "Mokam");
