import Link from 'next/link';
import { buildings } from '@/data/buildings';

export function BuildingList() {
  return (
    <div className="content-grid">
      {/* to do: implementar dados dinamicos */}
      {buildings.map((building) => (
        <article className="info-card" key={building.slug}>
          <p className="meta-line">
            {building.district} - {building.yearLabel}
          </p>
          <h3>{building.title}</h3>
          <p>{building.summary}</p>
          <Link className="text-link" href={`/edificacoes/${building.slug}`}>
            Ver página
          </Link>
        </article>
      ))}
    </div>
  );
}
