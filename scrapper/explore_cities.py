import pandas as pd

COUNTRY_NAMES = {
    'AF': 'Afghanistan', 'AL': 'Albania', 'DZ': 'Algeria', 'AR': 'Argentina',
    'AU': 'Australia', 'AT': 'Austria', 'BE': 'Belgium', 'BR': 'Brazil',
    'CA': 'Canada', 'CL': 'Chile', 'CN': 'China', 'CO': 'Colombia',
    'HR': 'Croatia', 'CZ': 'Czech Republic', 'DK': 'Denmark', 'EG': 'Egypt',
    'FI': 'Finland', 'FR': 'France', 'DE': 'Germany', 'GR': 'Greece',
    'GT': 'Guatemala', 'HN': 'Honduras', 'HU': 'Hungary', 'IN': 'India',
    'ID': 'Indonesia', 'IE': 'Ireland', 'IL': 'Israel', 'IT': 'Italy',
    'JP': 'Japan', 'KE': 'Kenya', 'KR': 'South Korea', 'MX': 'Mexico',
    'MA': 'Morocco', 'NL': 'Netherlands', 'NZ': 'New Zealand', 'NG': 'Nigeria',
    'NO': 'Norway', 'PK': 'Pakistan', 'PE': 'Peru', 'PH': 'Philippines',
    'PL': 'Poland', 'PT': 'Portugal', 'RO': 'Romania', 'RU': 'Russia',
    'SA': 'Saudi Arabia', 'ZA': 'South Africa', 'ES': 'Spain', 'SE': 'Sweden',
    'CH': 'Switzerland', 'TW': 'Taiwan', 'TH': 'Thailand', 'TR': 'Turkey',
    'UA': 'Ukraine', 'GB': 'United Kingdom', 'US': 'United States',
    'UY': 'Uruguay', 'VE': 'Venezuela', 'VN': 'Vietnam',
}

cols = [0, 1, 8, 10, 14]  # geonameid, name, country_code, admin1, population
df = pd.read_csv(
    'cities5000.txt',
    sep='\t',
    header=None,
    usecols=cols,
    names=['id', 'name', 'country_code', 'state', 'population'],
    low_memory=False
)

df['country'] = df['country_code'].map(COUNTRY_NAMES).fillna(df['country_code'])
df['state'] = df['state'].fillna('N/A').astype(str)
df['name'] = df['name'].str.strip()
df = df[['name', 'state', 'country', 'population']].drop_duplicates(subset=['name', 'state', 'country']).reset_index(drop=True)

print(f"✅ {len(df)} ciudades cargadas")
print(f"   Países: {df['country'].nunique()}")
print()
print("Funciones disponibles:")
print("  buscar('guadalajara')             → busca por nombre de ciudad")
print("  buscar_pais('Mexico')             → todas las ciudades de un país")
print("  buscar_pais('Mexico', estado=True)→ agrupado por estado")
print("  muestra(10)                       → ciudades random")
print("  muestra(10, 'Mexico')             → ciudades random de un país")
print()

def buscar(query):
    resultado = df[df['name'].str.contains(query, case=False, na=False)]
    print(f"🔍 '{query}' → {len(resultado)} resultados")
    print(resultado.to_string(index=False))
    print()

def buscar_pais(pais, estado=False):
    resultado = df[df['country'].str.contains(pais, case=False, na=False)]
    if estado:
        print(resultado.groupby('state')['name'].count().sort_values(ascending=False).to_string())
    else:
        print(f"🌎 '{pais}' → {len(resultado)} ciudades")
        print(resultado.sort_values('population', ascending=False).to_string(index=False))
    print()

def muestra(n=10, pais=None):
    sample = df if not pais else df[df['country'].str.contains(pais, case=False, na=False)]
    print(sample.sample(n).to_string(index=False))
    print()