import { Stat } from "./Stat";
import { impactStats } from "../data/stats";

export function Impact() {
  return (
    <section id="impact" className="section impact">
      <div className="stats">
        {impactStats.map((stat, i) => (
          <Stat stat={stat} index={i} key={stat.id} />
        ))}
      </div>
    </section>
  );
}
