import csv
import uuid

# Códigos de país ISO -> nombre completo
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

INPUT_FILE = 'cities5000.txt'
OUTPUT_FILE = '../database/locations_seeder.sql'

# Columnas del archivo GeoNames
# 0:geonameid, 1:name, 4:lat, 5:lng, 8:country_code, 10:admin1_code, 14:population

seen = set()
rows = []

with open(INPUT_FILE, encoding='utf-8') as f:
    for line in f:
        cols = line.strip().split('\t')
        if len(cols) < 15:
            continue

        name        = cols[1].strip()
        country_code = cols[8].strip()
        state       = cols[10].strip() or 'N/A'
        country     = COUNTRY_NAMES.get(country_code, country_code)

        key = (name.lower(), state.lower(), country.lower())
        if key in seen:
            continue
        seen.add(key)

        rows.append((name, state, country, country_code))

print(f"✅ {len(rows)} locations parseadas")

with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
    f.write('-- Locations seeder (GeoNames cities5000)\n')
    f.write('INSERT INTO locations (location_id, name, state, country, country_code) VALUES\n')

    for i, (name, state, country, country_code) in enumerate(rows):
        # escapar comillas simples
        name    = name.replace("'", "''")
        state   = state.replace("'", "''")
        country = country.replace("'", "''")

        uid = str(uuid.uuid4())
        comma = ',' if i < len(rows) - 1 else ';'
        f.write(f"  ('{uid}', '{name}', '{state}', '{country}', '{country_code}'){comma}\n")

print(f"✅ Archivo generado: {OUTPUT_FILE}")