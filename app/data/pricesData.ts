type propertiesProductsType = {
  id: string;
  width: number;
  height: number;
  price: number;
  priceFluo?: number;
  description?: string;
}

const propertiesBackdrops: Array<propertiesProductsType> = [
  { id: "S1520", width: 1.50, height: 2.0, price: 27704, priceFluo: 44785 },
  { id: "S1525", width: 1.50, height: 2.5, price: 30813, priceFluo: 49895 },
  { id: "S1530", width: 1.50, height: 3.0, price: 34311, priceFluo: 55196 },
  { id: "S1535", width: 1.50, height: 3.5, price: 37868, priceFluo: 60498 },
  { id: "S1540", width: 1.50, height: 4.0, price: 41415, priceFluo: 65699 },
  { id: "S1545", width: 1.50, height: 4.5, price: 44801, priceFluo: 71121 },
  { id: "S1550", width: 1.50, height: 5.0, price: 48171, priceFluo: 76437 },
  { id: "S2920", width: 2.90, height: 2.0, price: 45151, priceFluo: 80946 },
  { id: "S2925", width: 2.90, height: 2.5, price: 54945, priceFluo: 85096 },
  { id: "S2930", width: 2.90, height: 3.0, price: 61711, priceFluo: 91140 },
  { id: "S2935", width: 2.90, height: 3.5, price: 68480, priceFluo: 94491 },
  { id: "S2940", width: 2.90, height: 4.0, price: 75114, priceFluo: 108560 },
  { id: "S2945", width: 2.90, height: 4.5, price: 99434, priceFluo: 127548 },
  { id: "S2950", width: 2.90, height: 5.0, price: 107665, priceFluo: 138186 },
  { id: "S2960", width: 2.90, height: 6.0, price: 136713, priceFluo: 186008 }
];

const propertiesHybridBackdrops: Array<propertiesProductsType> = [
  { id: "SH1530", width: 1.50, height: 3.0, description: "Pared: 1,50 x 1,5m + Piso: 1,50 x 1,5", price: 60039 },
  { id: "SH2935", width: 2.90, height: 3.5, description: "Pared: 2,90 x 2,0m + Piso: 1,50 x 3,0", price: 109635 },
  { id: "SH1540", width: 1.50, height: 4.0, description: "Pared: 1,50 x 2,5m + Piso: 1,50 x 1,5", price: 66741 }
]

const propertiesFloor: Array<propertiesProductsType> = [
  { id: "SF1515", width: 1.5, height: 1.50, price: 43465 },
  { id: "SF1520", width: 2.0, height: 1.50, price: 50193 },
  { id: "SF1525", width: 2.5, height: 1.50, price: 56996 },
  { id: "SF1530", width: 3.0, height: 1.50, price: 63907 },
  { id: "SF1535", width: 3.5, height: 1.50, price: 70820 },
];

const propertiesInnPets: Array<propertiesProductsType> = [
  { id: "SP0715", width: 0.70, height: 1.50, price: 43440 },
  { id: "SP1020", width: 1.0, height: 2.0, price: 50094 },
  { id: "SP1528", width: 1.5, height: 2.80, price: 66071 },
];

export {
  propertiesBackdrops,
  propertiesFloor,
  propertiesHybridBackdrops,
  propertiesInnPets
}