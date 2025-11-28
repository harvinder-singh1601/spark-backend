const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, '../spark-project-locations-csv.csv');
if (!fs.existsSync(csvPath)) {
  console.error(`CSV file not found at: ${csvPath}`);
  process.exit(1);
}
const csvContent = fs.readFileSync(csvPath, 'utf-8');
const lines = csvContent.split('\n');
const stores = [];
let currentBanner = null;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  if (!line || line === 'Table 1') continue;
  
  if (line.includes('ID') && line.includes('posID')) {
    continue;
  }
  
  if (line === '' || line.split(',').every(cell => cell.trim() === '')) {
    currentBanner = null;
    continue;
  }
  
  const parseCSVLine = (line) => {
    const result = [];
    let current = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  };
  
  const cells = parseCSVLine(line);
  
  if (cells.length < 13) continue;
  
  const [
    id,
    posID,
    bannerName,
    name,
    address,
    city,
    province,
    countryAbbr,
    postalCode,
    phoneNumber,
    latitude,
    longitude,
    url
  ] = cells;
  
  if (id === 'ID' || id === '' || !posID || !name || name === 'NAME') continue;
  
  if (bannerName && bannerName.trim() !== '') {
    currentBanner = bannerName.trim();
  }
  
  const banner = currentBanner || bannerName || 'Unknown';
  const shopName = name.trim();
  const storeAddress = address.trim() || '';
  
  let storeCity = city.trim();
  if (!storeCity && shopName) {
    const cityMatch = shopName.match(/^([^-]+?)(\s*-\s*|$)/);
    if (cityMatch) {
      storeCity = cityMatch[1].trim();
    }
  }
  
  const storeProvince = province.trim() || '';
  const storePostalCode = postalCode.trim() || '';
  const storeCountry = countryAbbr === 'CA' ? 'Canada' : (countryAbbr || 'Canada');
  
  let lat = parseFloat(latitude);
  let lng = parseFloat(longitude);
  
  if (isNaN(lat)) lat = 0;
  if (isNaN(lng)) lng = 0;
  
  const openingTimes = {
    monday: { open: '10:00', close: '21:00', closed: false },
    tuesday: { open: '10:00', close: '21:00', closed: false },
    wednesday: { open: '10:00', close: '21:00', closed: false },
    thursday: { open: '10:00', close: '21:00', closed: false },
    friday: { open: '10:00', close: '22:00', closed: false },
    saturday: { open: '10:00', close: '22:00', closed: false },
    sunday: { open: '11:00', close: '20:00', closed: false },
  };
  
  stores.push({
    shopName,
    banners: [banner],
    ownerName: 'Store Owner',
    ownerEmail: `owner@${banner.toLowerCase().replace(/\s+/g, '').replace(/&/g, '')}.ca`,
    ownerPhone: phoneNumber && phoneNumber.trim() ? phoneNumber.trim() : null,
    address: storeAddress,
    city: storeCity,
    state: storeProvince,
    zipCode: storePostalCode,
    country: storeCountry,
    lat: lat,
    lng: lng,
    openingTimes,
    status: 'active',
    description: null,
    posId: posID || null,
    websiteUrl: url || null,
  });
}

console.log(`Parsed ${stores.length} stores from CSV`);

const output = `const storeData = ${JSON.stringify(stores, null, 2)};

export default storeData;
`;

fs.writeFileSync(
  path.join(__dirname, '../prisma/store-data.ts'),
  output
);

console.log(`Generated store data file: prisma/store-data.ts`);
console.log(`Total stores: ${stores.length}`);
