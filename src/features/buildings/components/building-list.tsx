import Link from "next/link";
import { buildings } from "@/data/buildings";

export function BuildingList() {
  return (
    <div className="content-grid">
      {buildings.map((building) => (
        <article className="info-card" key={building.id}>
          <p className="meta-line">
            {building.location} - {building.constructionPeriod}
          </p>
          <h3>{building.title}</h3>
          <p>{building.description}</p>
          <Link
            className="text-link"
            href={`/buildings/${building.slug ?? building.id}`}
          >
            Ver página
          </Link>
        </article>
      ))}
    </div>
  );
}
