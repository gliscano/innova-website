type propertiesProductsType = {
  id: string;
  width: number;
  height: number;
  price: number;
  priceFluo?: number;
  description?: string;
}

const propertiesBackdrops: Array<propertiesProductsType> = [
  { id: "S1520", width: 1.50, height: 2.0, price: 32718, priceFluo: 39501 },
  { id: "S1525", width: 1.50, height: 2.5, price: 36285, priceFluo: 43214 },
  { id: "S1530", width: 1.50, height: 3.0, price: 40762, priceFluo: 48895 },
  { id: "S1535", width: 1.50, height: 3.5, price: 44776, priceFluo: 53944 },
  { id: "S1540", width: 1.50, height: 4.0, price: 48033, priceFluo: 57943 },
  { id: "S1545", width: 1.50, height: 4.5, price: 51485, priceFluo: 62170 },
  { id: "S1550", width: 1.50, height: 5.0, price: 54838, priceFluo: 67608 },
  { id: "S2920", width: 2.90, height: 2.0, price: 51307, priceFluo: 63303 },
  { id: "S2925", width: 2.90, height: 2.5, price: 59986, priceFluo: 77219 },
  { id: "S2930", width: 2.90, height: 3.0, price: 66783, priceFluo: 87985 },
  { id: "S2935", width: 2.90, height: 3.5, price: 74852, priceFluo: 97077 },
  { id: "S2940", width: 2.90, height: 4.0, price: 94625, priceFluo: 105921 },
  { id: "S2945", width: 2.90, height: 4.5, price: 102910, priceFluo: 139568 },
  { id: "S2950", width: 2.90, height: 5.0, price: 110958, priceFluo: 150605 },
  { id: "S2960", width: 2.90, height: 6.0, price: 138411, priceFluo: 189341 }
];

const propertiesHybridBackdrops: Array<propertiesProductsType> = [
  { id: "SH1530", width: 1.50, height: 3.0, description: "Pared: 1,50 x 1,5m + Piso: 1,50 x 1,5", price: 63658 },
  { id: "SH1540", width: 1.50, height: 4.0, description: "Pared: 1,50 x 2,5m + Piso: 1,50 x 1,5", price: 70185 },
  { id: "SH2920", width: 2.90, height: 2.0, description: "Pared: 2,90 x 2,0m + Piso: 2,00 x 1,5", price: 83773 },
  { id: "SH2930", width: 2.90, height: 3.0, description: "Pared: 2,90 x 2,0m + Piso: 2,50 x 1,5", price: 102994 },
  { id: "SH2935", width: 2.90, height: 3.5, description: "Pared: 2,90 x 2,0m + Piso: 1,50 x 3,0", price: 115886 }
]

const propertiesFloor: Array<propertiesProductsType> = [
  { id: "SF1515", width: 1.5, height: 1.50, price: 46651 },
  { id: "SF1520", width: 2.0, height: 1.50, price: 54328 },
  { id: "SF1525", width: 2.5, height: 1.50, price: 61879 },
  { id: "SF1530", width: 3.0, height: 1.50, price: 69561 },
  { id: "SF1535", width: 3.5, height: 1.50, price: 77236 },
  { id: "SF1540", width: 4.0, height: 1.50, price: 100264 },
  { id: "SF1545", width: 4.5, height: 1.50, price: 109462 },
  { id: "SF1550", width: 5.0, height: 1.50, price: 118553 },
];

const propertiesInnPets: Array<propertiesProductsType> = [
  { id: "SP0715", width: 0.70, height: 1.50, price: 43440 },
  { id: "SP1020", width: 1.0, height: 2.0, price: 50094 },
  { id: "SP1528", width: 1.5, height: 2.80, price: 66071 },
];

const propertiesRooms: Array<propertiesProductsType> = [  
  { id: "R4440-SP", width: 4.4, height: 2.50, price: 139331 },
  { id: "R5450-SP", width: 5.4, height: 5.0, price: 169170 },
  { id: "R4440-CP", width: 4.4, height: 4.0, price: 174132 },
  { id: "R5450-CP", width: 5.4, height: 5.0, price: 262228 },
];

export {
  propertiesBackdrops,
  propertiesFloor,
  propertiesHybridBackdrops,
  propertiesInnPets,
  propertiesRooms
}