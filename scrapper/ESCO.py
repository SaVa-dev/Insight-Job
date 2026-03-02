import pandas as pd

df = pd.read_csv('skills_en.csv')

# Normalizar
df = df[df['status'] == 'released'].copy()
df['name'] = df['preferredLabel'].str.strip().str.lower()
df['skill_type'] = df['skillType'].str.strip().replace('', 'knowledge')
df = df[['name', 'skill_type']].drop_duplicates(subset='name').reset_index(drop=True)

print(f"✅ {len(df)} skills cargadas")
print(f"   skill/competence: {len(df[df.skill_type == 'skill/competence'])}")
print(f"   knowledge:        {len(df[df.skill_type == 'knowledge'])}")
print()
print("Funciones disponibles:")
print("  buscar('python')         → busca en todos los skills")
print("  buscar('python', 'knowledge')  → filtra por tipo")
print("  muestra(20)              → muestra N skills random")
print()

def buscar(query, tipo=None):
    resultado = df[df['name'].str.contains(query.lower(), na=False)]
    if tipo:
        resultado = resultado[resultado['skill_type'] == tipo]
    print(f"🔍 '{query}' → {len(resultado)} resultados")
    print(resultado.to_string(index=False))
    print()

def muestra(n=10, tipo=None):
    sample = df if not tipo else df[df['skill_type'] == tipo]
    print(sample.sample(n).to_string(index=False))
    print()