import { MapPin, Building2, Calendar, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Job } from "@/data/jobs";

const sourceStyles: Record<string, string> = {
  LinkedIn: "bg-linkedin/10 text-linkedin border-linkedin/20",
  Indeed: "bg-indeed/10 text-indeed border-indeed/20",
  CompuTrabajo: "bg-computrabajo/10 text-computrabajo border-computrabajo/20",
};

export function JobCard({ job, index }: { job: Job; index: number }) {
  const date = new Date(job.created_at).toLocaleDateString("es-MX", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div
      className="group relative rounded-lg border border-border bg-card p-5 transition-all duration-300 hover:shadow-lg hover:border-primary/30 hover:-translate-y-0.5 opacity-0 animate-fade-in-up"
      style={{ animationDelay: `${Math.min(index * 40, 600)}ms` }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1 space-y-2">
          <h3 className="font-display text-lg font-semibold leading-tight text-foreground group-hover:text-primary transition-colors truncate">
            {job.title}
          </h3>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <Building2 className="h-3.5 w-3.5" />
              {job.company}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5" />
              {job.location}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              {date}
            </span>
          </div>
        </div>

        <Badge
          variant="outline"
          className={`shrink-0 text-xs font-medium ${sourceStyles[job.source] || ""}`}
        >
          {job.source}
        </Badge>
      </div>

      <div className="absolute right-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <ExternalLink className="h-4 w-4 text-muted-foreground" />
      </div>
    </div>
  );
}
