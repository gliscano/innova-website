type propertiesProductsType = {
  id: string;
  width: number;
  height: number;
  price: number;
  description?: string;
}

const propertiesBackdrops: Array<propertiesProductsType> = [
  { id: "S2950", width: 2.90, height: 5.0, price: 80146 },
  { id: "S2945", width: 2.90, height: 4.5, price: 73687 },
  { id: "S2940", width: 2.90, height: 4.0, price: 67104 },
  { id: "S2935", width: 2.90, height: 3.5, price: 60787 },
  { id: "S2930", width: 2.90, height: 3.0, price: 54347 },
  { id: "S2925", width: 2.90, height: 2.5, price: 47910 },
  { id: "S2920", width: 2.90, height: 2.0, price: 41699 },
  { id: "S1550", width: 1.50, height: 5.0, price: 44487 },
  { id: "S1545", width: 1.50, height: 4.5, price: 41257 },
  { id: "S1540", width: 1.50, height: 4.0, price: 37966 },
  { id: "S1535", width: 1.50, height: 3.5, price: 34807 },
  { id: "S1530", width: 1.50, height: 3.0, price: 31587 },
  { id: "S1525", width: 1.50, height: 2.5, price: 28369 },
  { id: "S1520", width: 1.50, height: 2.0, price: 25516 }
];

const propertiesHybridBackdrops: Array<propertiesProductsType> = [
  { id: "SH2935", width: 2.90, height: 3.5, description: "Pared: 2,90 x 2,0m + Piso: 1,50 x 3,0", price: 91325 },
  { id: "SH1540", width: 1.50, height: 4.0, description: "Pared: 1,50 x 2,5m + Piso: 1,50 x 1,5", price: 55248 },
  { id: "SH1530", width: 1.50, height: 3.0, description: "Pared: 1,50 x 1,5m + Piso: 1,50 x 1,5", price: 48869 }
]

const propertiesFloor: Array<propertiesProductsType> = [
  { id: "SF1535", width: 3.5, height: 1.50, price: 59777 },
  { id: "SF1530", width: 3.0, height: 1.50, price: 53164 },
  { id: "SF1525", width: 2.5, height: 1.50, price: 46552 },
  { id: "SF1520", width: 2.0, height: 1.50, price: 40039 },
  { id: "SF1515", width: 1.5, height: 1.50, price: 33596 },
];

const propertiesInnPets: Array<propertiesProductsType> = [
  { id: "SP0715", width: 0.70, height: 1.50, price: 36903 },
  { id: "SP1020", width: 1.0, height: 2.0, price: 45890 },
  { id: "SP1528", width: 1.5, height: 2.80, price: 60415 },
];

export {
  propertiesBackdrops,
  propertiesFloor,
  propertiesHybridBackdrops,
  propertiesInnPets
}