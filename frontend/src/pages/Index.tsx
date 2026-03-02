import { useState, useMemo } from "react";
import { Search, Briefcase, MapPin, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { JobCard } from "@/components/JobCard";
import { jobs } from "@/data/jobs";

const Index = () => {
  const [search, setSearch] = useState("");
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [selectedSource, setSelectedSource] = useState<string | null>(null);

  const locations = useMemo(() => [...new Set(jobs.map((j) => j.location))].sort(), []);
  const sources = useMemo(() => [...new Set(jobs.map((j) => j.source))].sort(), []);

  const filtered = useMemo(() => {
    return jobs.filter((job) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        job.title.toLowerCase().includes(q) ||
        job.company.toLowerCase().includes(q);
      const matchesLocation = !selectedLocation || job.location === selectedLocation;
      const matchesSource = !selectedSource || job.source === selectedSource;
      return matchesSearch && matchesLocation && matchesSource;
    });
  }, [search, selectedLocation, selectedSource]);

  const activeFilters = (selectedLocation ? 1 : 0) + (selectedSource ? 1 : 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container max-w-5xl py-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Briefcase className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="font-display text-3xl font-bold tracking-tight text-foreground">
              Bolsa de Trabajo
            </h1>
          </div>
          <p className="text-muted-foreground">
            {jobs.length} vacantes tech en México
          </p>
        </div>
      </header>

      <main className="container max-w-5xl py-6 space-y-6">
        {/* Search & Filters */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por título o empresa..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-11 bg-card"
            />
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-3.5 w-3.5" />
              <span>Ubicación</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {locations.map((loc) => (
                <button
                  key={loc}
                  onClick={() => setSelectedLocation(selectedLocation === loc ? null : loc)}
                  className={`rounded-full px-3 py-1 text-sm font-medium border transition-all ${
                    selectedLocation === loc
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  {loc}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Filter className="h-3.5 w-3.5" />
              <span>Fuente</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {sources.map((src) => (
                <button
                  key={src}
                  onClick={() => setSelectedSource(selectedSource === src ? null : src)}
                  className={`rounded-full px-3 py-1 text-sm font-medium border transition-all ${
                    selectedSource === src
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card text-muted-foreground border-border hover:border-primary/40 hover:text-foreground"
                  }`}
                >
                  {src}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            {filtered.length} resultado{filtered.length !== 1 ? "s" : ""}
            {activeFilters > 0 && (
              <button
                onClick={() => {
                  setSelectedLocation(null);
                  setSelectedSource(null);
                }}
                className="ml-2 text-primary hover:underline"
              >
                Limpiar filtros
              </button>
            )}
          </p>
        </div>

        {/* Job list */}
        <div className="space-y-3">
          {filtered.map((job, i) => (
            <JobCard key={job.id} job={job} index={i} />
          ))}
          {filtered.length === 0 && (
            <div className="py-16 text-center text-muted-foreground">
              <Briefcase className="mx-auto mb-3 h-10 w-10 opacity-40" />
              <p>No se encontraron vacantes con esos filtros.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
