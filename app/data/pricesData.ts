type propertiesProductsType = {
  id: string;
  width: number;
  height: number;
  price: number;
  priceFluo?: number;
  description?: string;
}

const propertiesBackdrops: Array<propertiesProductsType> = [
  { id: "S1520", width: 1.50, height: 2.0, price: 39000, priceFluo: 41000 },
  { id: "S1525", width: 1.50, height: 2.5, price: 44000, priceFluo: 46000 },
  { id: "S1530", width: 1.50, height: 3.0, price: 54000, priceFluo: 57000 },
  { id: "S1535", width: 1.50, height: 3.5, price: 60000, priceFluo: 62000 },
  { id: "S1540", width: 1.50, height: 4.0, price: 65000, priceFluo: 68000 },
  { id: "S1545", width: 1.50, height: 4.5, price: 70000, priceFluo: 73000 },
  { id: "S1550", width: 1.50, height: 5.0, price: 75000, priceFluo: 79000 },
  { id: "S2920", width: 2.90, height: 2.0, price: 61000, priceFluo: 65000 },
  { id: "S2925", width: 2.90, height: 2.5, price: 72000, priceFluo: 76000 },
  { id: "S2930", width: 2.90, height: 3.0, price: 87000, priceFluo: 92000 },
  { id: "S2935", width: 2.90, height: 3.5, price: 97000, priceFluo: 103000 },
  { id: "S2940", width: 2.90, height: 4.0, price: 108000, priceFluo: 113000 },
  { id: "S2945", width: 2.90, height: 4.5, price: 118000, priceFluo: 124000 },
  { id: "S2950", width: 2.90, height: 5.0, price: 128000, priceFluo: 135000 },
  { id: "S2960", width: 2.90, height: 6.0, price: 152000, priceFluo: 161000 },
  { id: "S2970", width: 2.90, height: 7.0, price: 173000, priceFluo: 183000 },
  { id: "S2980", width: 2.90, height: 8.0, price: 194000, priceFluo: 205000 }
];

const propertiesHybridBackdrops: Array<propertiesProductsType> = [
  { id: "SH1515", width: 1.50, height: 1.5, description: "Piso: 1,50 x 1,5", price: 49000 },
  { id: "SH1520", width: 1.50, height: 2.0, description: "Pared: 1,50 x 0,5m + Piso: 1,50 x 1,5", price: 55000 },
  { id: "SH1525", width: 1.50, height: 2.5, description: "Pared: 1,50 x 1,0m + Piso: 1,50 x 1,5", price: 60000 },
  { id: "SH1530", width: 1.50, height: 3.0, description: "Pared: 1,50 x 1,5m + Piso: 1,50 x 1,5", price: 70000 },
  { id: "SH1535", width: 1.50, height: 3.5, description: "Pared: 1,50 x 2,0m + Piso: 1,50 x 1,5", price: 75000 },
  { id: "SH1540", width: 1.50, height: 4.0, description: "Pared: 1,50 x 2,5m + Piso: 1,50 x 1,5", price: 80000 },
  { id: "SH2920", width: 2.90, height: 2.0, description: "Pared: 2,90 x 2,0m + Piso: 1,50 x 2,90", price: 96000 },
  { id: "SH2925", width: 2.90, height: 2.5, description: "Pared: 2,90 x 2,0m + Piso: 1,50 x 2,90", price: 106000 },
  { id: "SH2930", width: 2.90, height: 3.0, description: "Pared: 2,90 x 2,0m + Piso: 1,50 x 2,90", price: 121000 },
  { id: "SH2935", width: 2.90, height: 3.5, description: "Pared: 2,90 x 2,0m + Piso: 1,50 x 2,90", price: 131000 },
  { id: "SH2940", width: 2.90, height: 4.0, description: "Pared: 2,90 x 2,0m + Piso: 1,50 x 2,90", price: 141000 },
]

const propertiesFloor: Array<propertiesProductsType> = [
  { id: "SF1515", width: 1.5, height: 1.50, price: 51000 },
  { id: "SF1520", width: 2.0, height: 1.50, price: 61000 },
  { id: "SF1525", width: 2.5, height: 1.50, price: 71000 },
  { id: "SF1530", width: 3.0, height: 1.50, price: 85000 },
  { id: "SF1535", width: 3.5, height: 1.50, price: 95000 },
  { id: "SF1540", width: 4.0, height: 1.50, price: 105000 },
  { id: "SF1545", width: 4.5, height: 1.50, price: 115000 },
  { id: "SF1550", width: 5.0, height: 1.50, price: 125000 },
];

export {
  propertiesBackdrops,
  propertiesFloor,
  propertiesHybridBackdrops,
}