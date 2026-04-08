import uuid
from pathlib import Path

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

BASE_DIR = Path(__file__).resolve().parent
INPUT_FILE = BASE_DIR / 'cities5000.txt'
OUTPUT_FILES = [
    BASE_DIR.parent / 'database' / 'locations_seeder.sql',
]
BATCH_SIZE = 1000

# Columnas del archivo GeoNames
# 0:geonameid, 1:name, 4:lat, 5:lng, 8:country_code, 10:admin1_code, 14:population

seen = set()
rows = []

with INPUT_FILE.open(encoding='utf-8') as f:
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

for output_file in OUTPUT_FILES:
    output_file.parent.mkdir(parents=True, exist_ok=True)

    with output_file.open('w', encoding='utf-8') as f:
        f.write('-- Locations seeder (GeoNames cities5000)\n')
        for start in range(0, len(rows), BATCH_SIZE):
            batch = rows[start:start + BATCH_SIZE]
            f.write(
                'INSERT INTO locations (location_id, name, state, country, country_code)\n'
                'SELECT src.location_id::uuid, src.name, src.state, src.country, src.country_code\n'
                'FROM (\n'
                'VALUES\n'
            )

            for i, (name, state, country, country_code) in enumerate(batch):
                name = name.replace("'", "''")
                state = state.replace("'", "''")
                country = country.replace("'", "''")
                uid = str(uuid.uuid4())
                comma = ',' if i < len(batch) - 1 else ''
                country_code_sql = 'NULL' if not country_code else f"'{country_code}'"
                f.write(
                    f"  ('{uid}', '{name}', '{state}', '{country}', {country_code_sql}){comma}\n"
                )

            f.write(
                ') AS src(location_id, name, state, country, country_code)\n'
                'WHERE NOT EXISTS (\n'
                '  SELECT 1\n'
                '  FROM locations l\n'
                '  WHERE l.name = src.name\n'
                '    AND l.state = src.state\n'
                '    AND l.country = src.country\n'
                '    AND COALESCE(l.country_code, \'\') = COALESCE(src.country_code, \'\')\n'
                ');\n\n'
            )

    print(f"✅ Archivo generado: {output_file}")
