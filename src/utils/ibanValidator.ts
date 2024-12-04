export function isValidIBAN(iban: string): boolean {
    // Remove spaces and convert to uppercase
    iban = iban.replace(/\s+/g, '').toUpperCase();
  
    // Basic format validation
    if (!/^[A-Z]{2}\d{2}[A-Z0-9]+$/.test(iban)) {
      return false;
    }
  
    // Check if IBAN length matches the country's requirements
    const ibanLength = iban.length;
    const countryCode = iban.substring(0, 2);
  
    // Define IBAN lengths for different countries
    const ibanLengths: { [key: string]: number } = {
      'AD': 24, // Andorra
      'AT': 20, // Austria
      'BE': 16, // Belgium
      'BG': 22, // Bulgaria
      'CH': 21, // Switzerland
      'CY': 28, // Cyprus
      'CZ': 24, // Czech Republic
      'DE': 22, // Germany
      'DK': 18, // Denmark
      'EE': 20, // Estonia
      'ES': 24, // Spain
      'FI': 18, // Finland
      'FR': 27, // France
      'GB': 22, // United Kingdom
      'GR': 27, // Greece
      'HR': 21, // Croatia
      'HU': 28, // Hungary
      'IE': 22, // Ireland
      'IT': 27, // Italy
      'LT': 20, // Lithuania
      'LU': 20, // Luxembourg
      'LV': 21, // Latvia
      'MT': 31, // Malta
      'NL': 18, // Netherlands
      'PL': 28, // Poland
      'PT': 25, // Portugal
      'RO': 24, // Romania
      'SE': 24, // Sweden
      'SI': 19, // Slovenia
      'SK': 24, // Slovakia
    };
  
    if (!(countryCode in ibanLengths) || ibanLength !== ibanLengths[countryCode]) {
      return false;
    }
  
    // Move the first four characters (country code and check digits) to the end
    const rearrangedIBAN = iban.substring(4) + iban.substring(0, 4);
  
    // Convert letters to numbers (A=10, B=11, ..., Z=35)
    const ibanWithNumbers = rearrangedIBAN.split('').map(char => {
      if (/[A-Z]/.test(char)) {
        return char.charCodeAt(0) - 55; // Convert letter to corresponding number
      } else {
        return char; // Keep digits as they are
      }
    }).join('');
  
    // Perform the modulo 97 check
    const remainder = BigInt(ibanWithNumbers) % BigInt(97);
    return remainder === BigInt(1);
  }
  