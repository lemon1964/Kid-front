"use client";

import Coloring from "./Coloring";
import Geometry from "./Geometry";
import ImagePixi from "./ImagePixi";

interface ClientPixiGameProps {
  task: PixiTask;
}

const ClientPixiGame: React.FC<ClientPixiGameProps> = ({ task }) => {
  switch (task.type.slug) {
    case "coloring":
      return <Coloring task={task} />;
    case "geometry":
      return <Geometry task={task} />;
    case "image":
      return <ImagePixi task={task} />;
    default:
      return <p>Unknown task type</p>;
  }
};

export default ClientPixiGame;
