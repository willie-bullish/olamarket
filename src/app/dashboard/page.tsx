"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface User {
  id: string;
  email: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  rating: number;
  reviews: number;
  seller: string;
  inStock: boolean;
  freeShipping: boolean;
}

const categories = [
  "All",
  "Gold Bars",
  "Rings",
  "Necklaces",
  "Bangles",
  "Watches",
  "Jewelry Sets"
];

const products: Product[] = [
  {
    id: "1",
    name: "1kg 24 Karat Gold Bar - PAMP Suisse",
    description: "24 Karat 1kg gold bar with assay certificate, investment grade",
    price: 32999.99,
    originalPrice: 59988.12,
    image: "/goldimages/goldbar1.png",
    category: "Gold Bars",
    rating: 5.0,
    reviews: 892,
    seller: "GoldVault Direct",
    inStock: true,
    freeShipping: true
  },
  {
    id: "2",
    name: "Golden Solitaire Ring",
    description: "1.5 carat golden solitaire set in 24k gold, certified",
    price: 5499.99,
    originalPrice: 10999.98,
    image: "/goldimages/RingA.jpg",
    category: "Rings",
    rating: 4.9,
    reviews: 234,
    seller: "GoldVault Direct",
    inStock: true,
    freeShipping: true
  },
  {
    id: "4",
    name: "1kg 24 Karat Gold Bar - Valcambi",
    description: "24 Karat Swiss minted 1kg gold bar with serial number",
    price: 59999.99,
    originalPrice: 133332.20,
    image: "/goldimages/goldbar2.jpg",
    category: "Gold Bars",
    rating: 4.8,
    reviews: 423,
    seller: "Precious Metals Inc",
    inStock: true,
    freeShipping: true
  },
  {
    id: "5",
    name: "Pearl Drop Necklace",
    description: "Freshwater pearl necklace with 24k golden chain, 18 inches",
    price: 5799.99,
    originalPrice: 8989.98,
    image: "/goldimages/Necklace1.jpg",
    category: "Necklaces",
    rating: 4.6,
    reviews: 189,
    seller: "Luxe Pearls",
    inStock: true,
    freeShipping: false
  },
  {
    id: "6",
    name: "Tennis Bracelet",
    description: "3 carat total weight golden tennis bracelet in platinum",
    price: 3299.99,
    originalPrice: 7333.31,
    image: "/goldimages/bangles1.png",
    category: "Bangles",
    rating: 4.9,
    reviews: 156,
    seller: "Brilliant Gems",
    inStock: true,
    freeShipping: true
  },
  {
    id: "7",
    name: "Golden Chain Necklace",
    description: "24k golden chain necklace, 20 inches, 5mm thickness",
    price: 4899.99,
    originalPrice: 7594.98,
    image: "/goldimages/Necklace5.jpg",
    category: "Necklaces",
    rating: 4.5,
    reviews: 342,
    seller: "Gold Masters",
    inStock: true,
    freeShipping: true
  },
  {
    id: "8",
    name: "Sapphire Ring",
    description: "2 carat blue sapphire with golden accents in 24k gold",
    price: 2899.99,
    originalPrice: 4349.96,
    image: "/goldimages/MAN ringA.jpg",
    category: "Rings",
    rating: 4.8,
    reviews: 98,
    seller: "Gemstone Gallery",
    inStock: true,
    freeShipping: true
  },
  {
    id: "10",
    name: "Luxury Golden Watch",
    description: "24k golden automatic watch with sapphire crystal",
    price: 27999.99,
    originalPrice: 55888.87,
    image: "/goldimages/wrist watch1.jpg",
    category: "Watches",
    rating: 4.9,
    reviews: 445,
    seller: "Timepiece Luxury",
    inStock: true,
    freeShipping: true
  },
  {
    id: "11",
    name: "Golden Pendant",
    description: "24k golden heart pendant with golden accent",
    price: 32999.99,
    originalPrice: 65888.87,
    image: "/goldimages/jewelries1.jpg",
    category: "Jewelry Sets",
    rating: 4.6,
    reviews: 167,
    seller: "Golden Moments",
    inStock: true,
    freeShipping: true
  },
  {
    id: "12",
    name: "1.5kg 24 Karat Gold Bar - Perth Mint",
    description: "24 Karat Australian minted 1.5kg gold bar with security features",
    price: 89999.99,
    originalPrice: 199999.98,
    image: "/goldimages/goldbar3.jpg",
    category: "Gold Bars",
    rating: 5.0,
    reviews: 56,
    seller: "GoldVault Direct",
    inStock: true,
    freeShipping: true
  },
  {
    id: "13",
    name: "Men's Golden Ring A",
    description: "Elegant men's golden ring with intricate design",
    price: 3299.99,
    originalPrice: 6555.31,
    image: "/goldimages/Man ringB_.jpg",
    category: "Rings",
    rating: 4.7,
    reviews: 89,
    seller: "GoldVault Direct",
    inStock: true,
    freeShipping: true
  },
  {
    id: "14",
    name: "Men's Golden Ring B",
    description: "Classic men's golden ring with modern styling",
    price: 3899.99,
    originalPrice: 7777.76,
    image: "/goldimages/Man ringC.jpg",
    category: "Rings",
    rating: 4.8,
    reviews: 67,
    seller: "GoldVault Direct",
    inStock: true,
    freeShipping: true
  },
  {
    id: "15",
    name: "Men's Golden Ring C",
    description: "Premium men's golden ring with golden accents",
    price: 4299.99,
    originalPrice: 8555.31,
    image: "/goldimages/Man ringD.jpg",
    category: "Rings",
    rating: 4.9,
    reviews: 45,
    seller: "GoldVault Direct",
    inStock: true,
    freeShipping: true
  },
  {
    id: "16",
    name: "Golden Bangles Set",
    description: "Set of 4 golden bangles with traditional design",
    price: 5499.99,
    originalPrice: 10988.87,
    image: "/goldimages/bangles2.jpg",
    category: "Bangles",
    rating: 4.6,
    reviews: 123,
    seller: "Golden Glow",
    inStock: true,
    freeShipping: true
  },
  {
    id: "17",
    name: "Designer Golden Bangle",
    description: "Handcrafted golden bangle with filigree work",
    price: 5799.99,
    originalPrice: 11577.76,
    image: "/goldimages/bangles3.jpg",
    category: "Bangles",
    rating: 4.7,
    reviews: 87,
    seller: "Golden Glow",
    inStock: true,
    freeShipping: true
  },
  {
    id: "18",
    name: "Simple Golden Bangle",
    description: "Minimalist golden bangle for everyday wear",
    price: 5299.99,
    originalPrice: 10577.76,
    image: "/goldimages/bangles4.jpg",
    category: "Bangles",
    rating: 4.5,
    reviews: 156,
    seller: "Golden Glow",
    inStock: true,
    freeShipping: true
  },
  {
    id: "19",
    name: "Ornate Golden Bangle",
    description: "Elaborate golden bangle with gemstone accents",
    price: 6299.99,
    originalPrice: 12555.31,
    image: "/goldimages/bangles5.jpg",
    category: "Bangles",
    rating: 4.8,
    reviews: 92,
    seller: "Brilliant Gems",
    inStock: true,
    freeShipping: true
  },
  {
    id: "20",
    name: "500mg 24 Karat Gold Bar",
    description: "500mg 24 Karat gold bar for investment",
    price: 29999.99,
    originalPrice: 46498.45,
    image: "/goldimages/goldbar4.jpg",
    category: "Gold Bars",
    rating: 5.0,
    reviews: 34,
    seller: "GoldVault Direct",
    inStock: true,
    freeShipping: true
  },
  {
    id: "21",
    name: "1kg 24 Karat Gold Bar",
    description: "1kg 24 Karat gold bar with certificate",
    price: 59999.99,
    originalPrice: 133332.20,
    image: "/goldimages/goldbar5.jpg",
    category: "Gold Bars",
    rating: 4.9,
    reviews: 78,
    seller: "Precious Metals Inc",
    inStock: true,
    freeShipping: true
  },
  {
    id: "22",
    name: "1.5kg 24 Karat Gold Bar",
    description: "1.5kg 24 Karat gold bar, ideal for collectors",
    price: 89999.99,
    originalPrice: 199999.98,
    image: "/goldimages/goldbar6.jpg",
    category: "Gold Bars",
    rating: 4.8,
    reviews: 112,
    seller: "Precious Metals Inc",
    inStock: true,
    freeShipping: true
  },
  {
    id: "23",
    name: "500mg 24 Karat Gold Bar",
    description: "500mg 24 Karat gold bar, compact investment",
    price: 29999.99,
    originalPrice: 46498.45,
    image: "/goldimages/goldbar7.jpg",
    category: "Gold Bars",
    rating: 4.7,
    reviews: 145,
    seller: "Precious Metals Inc",
    inStock: true,
    freeShipping: true
  },
  {
    id: "24",
    name: "1kg 24 Karat Gold Bar",
    description: "1kg 24 Karat gold bar, affordable investment",
    price: 59999.99,
    originalPrice: 133332.20,
    image: "/goldimages/goldbar8.jpg",
    category: "Gold Bars",
    rating: 4.6,
    reviews: 234,
    seller: "Precious Metals Inc",
    inStock: true,
    freeShipping: true
  },
  {
    id: "25",
    name: "1.5kg 24 Karat Gold Bar",
    description: "1.5kg 24 Karat gold bar, starter investment",
    price: 89999.99,
    originalPrice: 199999.98,
    image: "/goldimages/goldbar9.jpg",
    category: "Gold Bars",
    rating: 4.5,
    reviews: 312,
    seller: "Precious Metals Inc",
    inStock: true,
    freeShipping: false
  },
  {
    id: "26",
    name: "Jewelry Set A",
    description: "Complete golden jewelry set with necklace and earrings",
    price: 31999.99,
    originalPrice: 63888.87,
    image: "/goldimages/jewelries2.webp",
    category: "Jewelry Sets",
    rating: 4.8,
    reviews: 67,
    seller: "Golden Moments",
    inStock: true,
    freeShipping: true
  },
  {
    id: "27",
    name: "Jewelry Set B",
    description: "Elegant golden jewelry set with bracelet and ring",
    price: 33999.99,
    originalPrice: 67888.87,
    image: "/goldimages/jewelries3.jpg",
    category: "Jewelry Sets",
    rating: 4.7,
    reviews: 45,
    seller: "Golden Moments",
    inStock: true,
    freeShipping: true
  },
  {
    id: "28",
    name: "Jewelry Set C",
    description: "Luxury golden jewelry set with multiple pieces",
    price: 35999.99,
    originalPrice: 71888.87,
    image: "/goldimages/jewelries4.jpg",
    category: "Jewelry Sets",
    rating: 4.9,
    reviews: 38,
    seller: "Golden Moments",
    inStock: true,
    freeShipping: true
  },
  {
    id: "29",
    name: "Jewelry Set D",
    description: "Traditional golden jewelry set for special occasions",
    price: 34999.99,
    originalPrice: 69888.87,
    image: "/goldimages/jewelries5.jpg",
    category: "Jewelry Sets",
    rating: 4.6,
    reviews: 89,
    seller: "Golden Moments",
    inStock: true,
    freeShipping: true
  },
  {
    id: "30",
    name: "Jewelry Set E",
    description: "Modern golden jewelry set with contemporary design",
    price: 32999.99,
    originalPrice: 65888.87,
    image: "/goldimages/jewelries6.jpg",
    category: "Jewelry Sets",
    rating: 4.7,
    reviews: 56,
    seller: "Golden Moments",
    inStock: true,
    freeShipping: true
  },
  {
    id: "31",
    name: "Jewelry Set F",
    description: "Bridal golden jewelry set with intricate details",
    price: 38999.99,
    originalPrice: 77888.87,
    image: "/goldimages/jewelries7.webp",
    category: "Jewelry Sets",
    rating: 4.9,
    reviews: 29,
    seller: "Golden Moments",
    inStock: true,
    freeShipping: true
  },
  {
    id: "32",
    name: "Jewelry Set G",
    description: "Festive golden jewelry set for celebrations",
    price: 36999.99,
    originalPrice: 73888.87,
    image: "/goldimages/jewelries8.webp",
    category: "Jewelry Sets",
    rating: 4.8,
    reviews: 41,
    seller: "Golden Moments",
    inStock: true,
    freeShipping: true
  },
  {
    id: "33",
    name: "Golden Necklace A",
    description: "Elegant golden necklace with pendant",
    price: 5499.99,
    originalPrice: 10988.87,
    image: "/goldimages/necklace2.jpg",
    category: "Necklaces",
    rating: 4.6,
    reviews: 178,
    seller: "Luxe Pearls",
    inStock: true,
    freeShipping: true
  },
  {
    id: "34",
    name: "Golden Necklace B",
    description: "Statement golden necklace with gemstones",
    price: 6799.99,
    originalPrice: 13555.31,
    image: "/goldimages/necklace3.jpg",
    category: "Necklaces",
    rating: 4.8,
    reviews: 92,
    seller: "Luxe Pearls",
    inStock: true,
    freeShipping: true
  },
  {
    id: "35",
    name: "Golden Necklace C",
    description: "Delicate golden necklace for everyday wear",
    price: 5199.99,
    originalPrice: 10377.76,
    image: "/goldimages/necklace4.jpg",
    category: "Necklaces",
    rating: 4.5,
    reviews: 234,
    seller: "Luxe Pearls",
    inStock: true,
    freeShipping: false
  },
  {
    id: "36",
    name: "Golden Necklace D",
    description: "Layered golden necklace set",
    price: 5899.99,
    originalPrice: 11777.76,
    image: "/goldimages/necklace6.jpg",
    category: "Necklaces",
    rating: 4.7,
    reviews: 145,
    seller: "Luxe Pearls",
    inStock: true,
    freeShipping: true
  },
  {
    id: "37",
    name: "Golden Necklace E",
    description: "Choker golden necklace with modern design",
    price: 5599.99,
    originalPrice: 11177.76,
    image: "/goldimages/necklace7.webp",
    category: "Necklaces",
    rating: 4.6,
    reviews: 123,
    seller: "Luxe Pearls",
    inStock: true,
    freeShipping: true
  },
  {
    id: "38",
    name: "Golden Necklace F",
    description: "Long golden necklace with tassel",
    price: 5799.99,
    originalPrice: 11555.31,
    image: "/goldimages/necklace8.jpg",
    category: "Necklaces",
    rating: 4.7,
    reviews: 87,
    seller: "Luxe Pearls",
    inStock: true,
    freeShipping: true
  },
  {
    id: "39",
    name: "Golden Necklace G",
    description: "Pendant golden necklace with golden gem",
    price: 6299.99,
    originalPrice: 12555.31,
    image: "/goldimages/necklace9.jpg",
    category: "Necklaces",
    rating: 4.8,
    reviews: 56,
    seller: "Luxe Pearls",
    inStock: true,
    freeShipping: true
  },
  {
    id: "40",
    name: "Golden Necklace H",
    description: "Vintage golden necklace with filigree",
    price: 6099.99,
    originalPrice: 12177.76,
    image: "/goldimages/necklace10.jpg",
    category: "Necklaces",
    rating: 4.9,
    reviews: 34,
    seller: "Luxe Pearls",
    inStock: true,
    freeShipping: true
  },
  {
    id: "41",
    name: "Golden Necklace I",
    description: "Simple golden chain necklace",
    price: 5299.99,
    originalPrice: 10577.76,
    image: "/goldimages/necklace11.jpg",
    category: "Necklaces",
    rating: 4.4,
    reviews: 267,
    seller: "Luxe Pearls",
    inStock: true,
    freeShipping: false
  },
  {
    id: "42",
    name: "Golden Necklace J",
    description: "Golden locket necklace",
    price: 5499.99,
    originalPrice: 10988.87,
    image: "/goldimages/necklace12.jpg",
    category: "Necklaces",
    rating: 4.6,
    reviews: 145,
    seller: "Luxe Pearls",
    inStock: true,
    freeShipping: true
  },
  {
    id: "43",
    name: "Golden Necklace K",
    description: "Golden necklace with pearl accents",
    price: 5699.99,
    originalPrice: 11377.76,
    image: "/goldimages/necklace13.png",
    category: "Necklaces",
    rating: 4.7,
    reviews: 98,
    seller: "Luxe Pearls",
    inStock: true,
    freeShipping: true
  },
  {
    id: "44",
    name: "Golden Necklace L",
    description: "Golden bib necklace",
    price: 6399.99,
    originalPrice: 12777.76,
    image: "/goldimages/necklace14.jpg",
    category: "Necklaces",
    rating: 4.8,
    reviews: 45,
    seller: "Luxe Pearls",
    inStock: true,
    freeShipping: true
  },
  {
    id: "45",
    name: "Golden Necklace M",
    description: "Golden collar necklace",
    price: 6199.99,
    originalPrice: 12377.76,
    image: "/goldimages/necklace15.jpg",
    category: "Necklaces",
    rating: 4.7,
    reviews: 67,
    seller: "Luxe Pearls",
    inStock: true,
    freeShipping: true
  },
  {
    id: "46",
    name: "Golden Necklace N",
    description: "Golden station necklace",
    price: 5899.99,
    originalPrice: 11777.76,
    image: "/goldimages/necklace16.jpg",
    category: "Necklaces",
    rating: 4.6,
    reviews: 89,
    seller: "Luxe Pearls",
    inStock: true,
    freeShipping: true
  },
  {
    id: "47",
    name: "Golden Necklace O",
    description: "Golden rope necklace",
    price: 5999.99,
    originalPrice: 11988.87,
    image: "/goldimages/necklace17.jpg",
    category: "Necklaces",
    rating: 4.7,
    reviews: 56,
    seller: "Luxe Pearls",
    inStock: true,
    freeShipping: true
  },
  {
    id: "48",
    name: "Golden Necklace P",
    description: "Golden link necklace",
    price: 5699.99,
    originalPrice: 11377.76,
    image: "/goldimages/necklace18.jpg",
    category: "Necklaces",
    rating: 4.5,
    reviews: 134,
    seller: "Luxe Pearls",
    inStock: true,
    freeShipping: true
  },
  {
    id: "49",
    name: "Golden Necklace Q",
    description: "Golden charm necklace",
    price: 5599.99,
    originalPrice: 11177.76,
    image: "/goldimages/necklace19.gif",
    category: "Necklaces",
    rating: 4.6,
    reviews: 112,
    seller: "Luxe Pearls",
    inStock: true,
    freeShipping: true
  },
  {
    id: "50",
    name: "Golden Necklace R",
    description: "Golden tennis necklace",
    price: 7999.99,
    originalPrice: 15988.87,
    image: "/goldimages/necklace20.jpg",
    category: "Necklaces",
    rating: 4.9,
    reviews: 28,
    seller: "Luxe Pearls",
    inStock: true,
    freeShipping: true
  },
  {
    id: "51",
    name: "Golden Necklace S",
    description: "Golden solitaire necklace",
    price: 6999.99,
    originalPrice: 13988.87,
    image: "/goldimages/necklace21.jpg",
    category: "Necklaces",
    rating: 4.8,
    reviews: 41,
    seller: "Luxe Pearls",
    inStock: true,
    freeShipping: true
  },
  {
    id: "52",
    name: "Golden Necklace T",
    description: "Golden pendant necklace with gemstone",
    price: 5799.99,
    originalPrice: 11555.31,
    image: "/goldimages/necklace22.jpg",
    category: "Necklaces",
    rating: 4.7,
    reviews: 73,
    seller: "Luxe Pearls",
    inStock: true,
    freeShipping: true
  },
  {
    id: "53",
    name: "Golden Necklace U",
    description: "Golden initial necklace",
    price: 5399.99,
    originalPrice: 10777.76,
    image: "/goldimages/necklace23.jpg",
    category: "Necklaces",
    rating: 4.5,
    reviews: 189,
    seller: "Luxe Pearls",
    inStock: true,
    freeShipping: false
  },
  {
    id: "54",
    name: "Golden Necklace V",
    description: "Golden bar necklace",
    price: 5699.99,
    originalPrice: 11377.76,
    image: "/goldimages/necklace24.jpg",
    category: "Necklaces",
    rating: 4.6,
    reviews: 124,
    seller: "Luxe Pearls",
    inStock: true,
    freeShipping: true
  },
  {
    id: "55",
    name: "Golden Necklace W",
    description: "Golden coin necklace",
    price: 5799.99,
    originalPrice: 11555.31,
    image: "/goldimages/necklace25.jpg",
    category: "Necklaces",
    rating: 4.7,
    reviews: 87,
    seller: "Luxe Pearls",
    inStock: true,
    freeShipping: true
  },
  {
    id: "56",
    name: "Golden Necklace X",
    description: "Golden cross necklace",
    price: 5299.99,
    originalPrice: 10577.76,
    image: "/goldimages/necklace26.jpg",
    category: "Necklaces",
    rating: 4.5,
    reviews: 201,
    seller: "Luxe Pearls",
    inStock: true,
    freeShipping: false
  },
  {
    id: "57",
    name: "Golden Necklace Y",
    description: "Golden heart necklace",
    price: 5499.99,
    originalPrice: 10988.87,
    image: "/goldimages/necklace27.png",
    category: "Necklaces",
    rating: 4.6,
    reviews: 156,
    seller: "Luxe Pearls",
    inStock: true,
    freeShipping: true
  },
  {
    id: "58",
    name: "Golden Necklace Z",
    description: "Golden star necklace",
    price: 5599.99,
    originalPrice: 11177.76,
    image: "/goldimages/necklace28.png",
    category: "Necklaces",
    rating: 4.7,
    reviews: 98,
    seller: "Luxe Pearls",
    inStock: true,
    freeShipping: true
  },
  {
    id: "59",
    name: "Men's Golden Ring D",
    description: "Bold men's golden ring with signet design",
    price: 3599.99,
    originalPrice: 7111.09,
    image: "/goldimages/Man ring_15.jpg",
    category: "Rings",
    rating: 4.8,
    reviews: 52,
    seller: "GoldVault Direct",
    inStock: true,
    freeShipping: true
  },
  {
    id: "60",
    name: "Men's Golden Ring E",
    description: "Classic men's golden signet ring",
    price: 3499.99,
    originalPrice: 6888.87,
    image: "/goldimages/Man ring_16_.jpg",
    category: "Rings",
    rating: 4.7,
    reviews: 61,
    seller: "GoldVault Direct",
    inStock: true,
    freeShipping: true
  },
  {
    id: "61",
    name: "Men's Golden Ring F",
    description: "Modern men's golden ring with brushed finish",
    price: 3199.99,
    originalPrice: 6333.31,
    image: "/goldimages/Man ring_E.jpg",
    category: "Rings",
    rating: 4.6,
    reviews: 78,
    seller: "GoldVault Direct",
    inStock: true,
    freeShipping: true
  },
  {
    id: "62",
    name: "Men's Golden Ring G",
    description: "Minimalist men's golden band ring",
    price: 3199.99,
    originalPrice: 6333.31,
    image: "/goldimages/Man ring_F.jpg",
    category: "Rings",
    rating: 4.5,
    reviews: 145,
    seller: "GoldVault Direct",
    inStock: true,
    freeShipping: false
  },
  {
    id: "63",
    name: "Men's Golden Ring H",
    description: "Textured men's golden ring with pattern",
    price: 3799.99,
    originalPrice: 7555.31,
    image: "/goldimages/Man ring_G.jpg",
    category: "Rings",
    rating: 4.6,
    reviews: 92,
    seller: "GoldVault Direct",
    inStock: true,
    freeShipping: true
  },
  {
    id: "64",
    name: "Men's Golden Ring I",
    description: "Men's golden ring with black enamel",
    price: 3999.99,
    originalPrice: 7888.87,
    image: "/goldimages/Man ring_H.jpg",
    category: "Rings",
    rating: 4.7,
    reviews: 67,
    seller: "GoldVault Direct",
    inStock: true,
    freeShipping: true
  },
  {
    id: "65",
    name: "Men's Golden Ring J",
    description: "Men's golden ring with golden inlay",
    price: 4499.99,
    originalPrice: 8888.87,
    image: "/goldimages/Man ring_I.png",
    category: "Rings",
    rating: 4.9,
    reviews: 34,
    seller: "GoldVault Direct",
    inStock: true,
    freeShipping: true
  },
  {
    id: "66",
    name: "Men's Golden Ring K",
    description: "Simple men's golden wedding band",
    price: 3399.99,
    originalPrice: 6777.76,
    image: "/goldimages/Man ring_J.jpg",
    category: "Rings",
    rating: 4.5,
    reviews: 234,
    seller: "GoldVault Direct",
    inStock: true,
    freeShipping: false
  },
  {
    id: "67",
    name: "Men's Golden Ring L",
    description: "Men's golden ring with milgrain detail",
    price: 3699.99,
    originalPrice: 7333.31,
    image: "/goldimages/Man ring_K.jpg",
    category: "Rings",
    rating: 4.6,
    reviews: 112,
    seller: "GoldVault Direct",
    inStock: true,
    freeShipping: true
  },
  {
    id: "68",
    name: "Men's Golden Ring M",
    description: "Men's golden ring with carved design",
    price: 3899.99,
    originalPrice: 7777.76,
    image: "/goldimages/Man ring_L.jpg",
    category: "Rings",
    rating: 4.7,
    reviews: 78,
    seller: "GoldVault Direct",
    inStock: true,
    freeShipping: true
  },
  {
    id: "69",
    name: "Men's Golden Ring N",
    description: "Men's golden ring with beveled edges",
    price: 3499.99,
    originalPrice: 6888.87,
    image: "/goldimages/Man ring_M.jpg",
    category: "Rings",
    rating: 4.6,
    reviews: 89,
    seller: "GoldVault Direct",
    inStock: true,
    freeShipping: true
  },
  {
    id: "70",
    name: "Golden Ring B",
    description: "Classic golden ring with golden solitaire",
    price: 2499.99,
    originalPrice: 4988.87,
    image: "/goldimages/Ring B.jpg",
    category: "Rings",
    rating: 4.8,
    reviews: 56,
    seller: "GoldVault Direct",
    inStock: true,
    freeShipping: true
  },
  {
    id: "71",
    name: "Golden Ring D",
    description: "Golden ring with cluster golden stones",
    price: 3299.99,
    originalPrice: 6555.31,
    image: "/goldimages/Ring D.jpg",
    category: "Rings",
    rating: 4.9,
    reviews: 38,
    seller: "GoldVault Direct",
    inStock: true,
    freeShipping: true
  },
  {
    id: "72",
    name: "Golden Ring E",
    description: "Golden eternity ring with golden stones",
    price: 3899.99,
    originalPrice: 7777.76,
    image: "/goldimages/RingE.png",
    category: "Rings",
    rating: 4.9,
    reviews: 29,
    seller: "GoldVault Direct",
    inStock: true,
    freeShipping: true
  },
  {
    id: "73",
    name: "Golden Ring C",
    description: "Golden ring with three golden stone design",
    price: 2799.99,
    originalPrice: 5555.31,
    image: "/goldimages/ring C.jpg",
    category: "Rings",
    rating: 4.8,
    reviews: 45,
    seller: "GoldVault Direct",
    inStock: true,
    freeShipping: true
  },
  {
    id: "74",
    name: "Golden Ring 1",
    description: "Simple golden band ring",
    price: 2199.99,
    originalPrice: 4377.76,
    image: "/goldimages/ring1.jpg",
    category: "Rings",
    rating: 4.5,
    reviews: 267,
    seller: "GoldVault Direct",
    inStock: true,
    freeShipping: false
  },
  {
    id: "75",
    name: "Golden Ring 2",
    description: "Golden ring with twisted design",
    price: 2399.99,
    originalPrice: 4777.76,
    image: "/goldimages/ring2.jpg",
    category: "Rings",
    rating: 4.6,
    reviews: 189,
    seller: "GoldVault Direct",
    inStock: true,
    freeShipping: true
  },
  {
    id: "76",
    name: "Golden Watch A",
    description: "Classic golden wrist watch with leather strap",
    price: 25999.99,
    originalPrice: 51888.87,
    image: "/goldimages/wrist watch2.jpg",
    category: "Watches",
    rating: 4.6,
    reviews: 134,
    seller: "Timepiece Luxury",
    inStock: true,
    freeShipping: true
  },
  {
    id: "77",
    name: "Golden Watch B",
    description: "Golden dress watch with minimalist design",
    price: 26999.99,
    originalPrice: 53888.87,
    image: "/goldimages/wrist watch3.jpg",
    category: "Watches",
    rating: 4.7,
    reviews: 89,
    seller: "Timepiece Luxury",
    inStock: true,
    freeShipping: true
  },
  {
    id: "78",
    name: "Golden Watch C",
    description: "Golden chronograph watch with complications",
    price: 28999.99,
    originalPrice: 57888.87,
    image: "/goldimages/wrist watch4.jpg",
    category: "Watches",
    rating: 4.8,
    reviews: 56,
    seller: "Timepiece Luxury",
    inStock: true,
    freeShipping: true
  },
  {
    id: "79",
    name: "Golden Watch D",
    description: "Golden sports watch with water resistance",
    price: 27999.99,
    originalPrice: 55888.87,
    image: "/goldimages/wrist watch5.jpg",
    category: "Watches",
    rating: 4.7,
    reviews: 67,
    seller: "Timepiece Luxury",
    inStock: true,
    freeShipping: true
  },
  {
    id: "80",
    name: "Golden Watch E",
    description: "Golden smart watch with modern features",
    price: 29999.99,
    originalPrice: 59888.87,
    image: "/goldimages/wrist watch6.webp",
    category: "Watches",
    rating: 4.6,
    reviews: 45,
    seller: "Timepiece Luxury",
    inStock: true,
    freeShipping: true
  },
  {
    id: "81",
    name: "Golden Watch F",
    description: "Golden pilot watch with aviation style",
    price: 26999.99,
    originalPrice: 53888.87,
    image: "/goldimages/wrist watch7.jpg",
    category: "Watches",
    rating: 4.7,
    reviews: 52,
    seller: "Timepiece Luxury",
    inStock: true,
    freeShipping: true
  },
  {
    id: "82",
    name: "Golden Watch G",
    description: "Golden diving watch with rotating bezel",
    price: 28999.99,
    originalPrice: 57888.87,
    image: "/goldimages/wrist watch8.jpg",
    category: "Watches",
    rating: 4.8,
    reviews: 38,
    seller: "Timepiece Luxury",
    inStock: true,
    freeShipping: true
  },
  {
    id: "83",
    name: "Golden Watch H",
    description: "Golden moonphase watch with calendar",
    price: 31999.99,
    originalPrice: 63888.87,
    image: "/goldimages/wrist watch9.jpg",
    category: "Watches",
    rating: 4.9,
    reviews: 29,
    seller: "Timepiece Luxury",
    inStock: true,
    freeShipping: true
  },
  {
    id: "84",
    name: "Golden Watch I",
    description: "Golden skeleton watch with exhibition back",
    price: 32999.99,
    originalPrice: 65888.87,
    image: "/goldimages/wrist watch10.jpg",
    category: "Watches",
    rating: 4.9,
    reviews: 23,
    seller: "Timepiece Luxury",
    inStock: true,
    freeShipping: true
  },
  {
    id: "85",
    name: "Golden Watch J",
    description: "Golden tourbillon watch with complications",
    price: 37999.99,
    originalPrice: 75888.87,
    image: "/goldimages/wrist watch11.jpg",
    category: "Watches",
    rating: 5.0,
    reviews: 12,
    seller: "Timepiece Luxury",
    inStock: true,
    freeShipping: true
  },
  {
    id: "86",
    name: "Golden Watch K",
    description: "Golden perpetual calendar watch",
    price: 34999.99,
    originalPrice: 69888.87,
    image: "/goldimages/wrist watch12.jpg",
    category: "Watches",
    rating: 4.9,
    reviews: 18,
    seller: "Timepiece Luxury",
    inStock: true,
    freeShipping: true
  },
  {
    id: "87",
    name: "Golden Bangle Set B",
    description: "Set of 6 golden bangles with engraved design",
    price: 5899.99,
    originalPrice: 11777.76,
    image: "/goldimages/bangles6.jpg",
    category: "Bangles",
    rating: 4.7,
    reviews: 78,
    seller: "Golden Glow",
    inStock: true,
    freeShipping: true
  },
  {
    id: "88",
    name: "Golden Bangle Set C",
    description: "Set of 8 golden bangles with kundan work",
    price: 6499.99,
    originalPrice: 12988.87,
    image: "/goldimages/bangles7.jpg",
    category: "Bangles",
    rating: 4.8,
    reviews: 52,
    seller: "Golden Glow",
    inStock: true,
    freeShipping: true
  },
  {
    id: "89",
    name: "Golden Bangle Set D",
    description: "Set of 4 golden bangles with meenakari",
    price: 6099.99,
    originalPrice: 12177.76,
    image: "/goldimages/bangles8.webp",
    category: "Bangles",
    rating: 4.7,
    reviews: 67,
    seller: "Golden Glow",
    inStock: true,
    freeShipping: true
  },
  {
    id: "90",
    name: "Golden Bangle Set E",
    description: "Set of 2 golden bangles with stones",
    price: 5599.99,
    originalPrice: 11177.76,
    image: "/goldimages/bangles9.jpg",
    category: "Bangles",
    rating: 4.6,
    reviews: 89,
    seller: "Golden Glow",
    inStock: true,
    freeShipping: true
  },
  {
    id: "91",
    name: "Golden Bangle Set F",
    description: "Set of 3 golden bangles antique finish",
    price: 5799.99,
    originalPrice: 11577.76,
    image: "/goldimages/bangles10.jpg",
    category: "Bangles",
    rating: 4.7,
    reviews: 73,
    seller: "Golden Glow",
    inStock: true,
    freeShipping: true
  },
  {
    id: "92",
    name: "Golden Bangle Set G",
    description: "Set of 5 golden bangles with polish",
    price: 5999.99,
    originalPrice: 11988.87,
    image: "/goldimages/bangles11.png",
    category: "Bangles",
    rating: 4.6,
    reviews: 61,
    seller: "Golden Glow",
    inStock: true,
    freeShipping: true
  },
  {
    id: "93",
    name: "1kg 24 Karat Gold Bar Special",
    description: "Limited edition 1kg 24 Karat gold bar with unique design",
    price: 59999.99,
    originalPrice: 133332.20,
    image: "/goldimages/goldbar10.webp",
    category: "Gold Bars",
    rating: 5.0,
    reviews: 19,
    seller: "GoldVault Direct",
    inStock: true,
    freeShipping: true
  },
  {
    id: "94",
    name: "1.5kg 24 Karat Gold Bar Premium",
    description: "Premium 1.5kg 24 Karat gold bar with enhanced security",
    price: 89999.99,
    originalPrice: 199999.98,
    image: "/goldimages/goldbar11.jpg",
    category: "Gold Bars",
    rating: 4.9,
    reviews: 15,
    seller: "GoldVault Direct",
    inStock: true,
    freeShipping: true
  },
  {
    id: "95",
    name: "500mg 24 Karat Gold Bar Collector",
    description: "Collector's 500mg 24 Karat gold bar with serial number",
    price: 29999.99,
    originalPrice: 46498.45,
    image: "/goldimages/goldbar12.jpg",
    category: "Gold Bars",
    rating: 5.0,
    reviews: 8,
    seller: "GoldVault Direct",
    inStock: true,
    freeShipping: true
  },
  {
    id: "96",
    name: "1kg 24 Karat Gold Bar Mini",
    description: "1kg 24 Karat gold bar for gifting",
    price: 59999.99,
    originalPrice: 133332.20,
    image: "/goldimages/goldbar13.jpg",
    category: "Gold Bars",
    rating: 4.5,
    reviews: 178,
    seller: "Precious Metals Inc",
    inStock: true,
    freeShipping: false
  },
  {
    id: "97",
    name: "1.5kg 24 Karat Gold Bar Artisan",
    description: "1.5kg 24 Karat gold bar artisan crafted with design",
    price: 89999.99,
    originalPrice: 199999.98,
    image: "/goldimages/goldbar14.jpg",
    category: "Gold Bars",
    rating: 4.7,
    reviews: 67,
    seller: "Precious Metals Inc",
    inStock: true,
    freeShipping: true
  },
  {
    id: "98",
    name: "500mg 24 Karat Gold Bar Heritage",
    description: "500mg 24 Karat gold bar with historical design",
    price: 29999.99,
    originalPrice: 46498.45,
    image: "/goldimages/goldbar15.jpg",
    category: "Gold Bars",
    rating: 4.9,
    reviews: 12,
    seller: "GoldVault Direct",
    inStock: true,
    freeShipping: true
  }
];

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [cart, setCart] = useState<Product[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [sortBy, setSortBy] = useState("featured");
  const [loading, setLoading] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/");
      return;
    }
    const userData = JSON.parse(storedUser);
    setUser(userData);
  }, [router]);

  function handleLogout() {
    localStorage.removeItem("user");
    router.push("/");
  }

  function addToCart(product: Product) {
    setCart(prev => [...prev, product]);
  }

  function removeFromCart(productId: string) {
    setCart(prev => prev.filter(p => p.id !== productId));
  }

  async function handleCheckout() {
    if (cart.length === 0) return;
    setLoading(true);

    try {
      const totalAmount = cart.reduce((sum, item) => sum + item.price, 0);
      const orderItems = cart.map(item => ({
        productId: item.id,
        name: item.name,
        price: item.price,
        originalPrice: item.originalPrice,
        image: item.image,
        category: item.category,
        quantity: 1
      }));

      const requestData = {
        investmentType: "marketplace-order",
        investmentName: `Order with ${cart.length} items`,
        amountToInvest: totalAmount,
        userId: user?.id,
        userName: user?.name,
        userEmail: user?.email,
        orderItems: orderItems
      };

      const res = await fetch("/api/winners", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to create order");
      }

      const data = await res.json();
      setCart([]);
      setShowCart(false);
      router.push(`/payment?investmentId=${data.id}`);

    } catch (error) {
      console.error("Error creating order:", error);
      alert("Failed to process checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const filteredProducts = products
    .filter(product => {
      const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "reviews":
          return b.reviews - a.reviews;
        default:
          return 0;
      }
    });

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="mx-auto max-w-7xl px-4 py-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 flex-shrink-0">
              <svg width="32" height="32" viewBox="0 0 40 40" className="w-8 h-8">
                <circle cx="20" cy="20" r="20" fill="#d4af37"/>
                <text x="20" y="25" fontFamily="Arial, sans-serif" fontSize="10" fontWeight="bold" textAnchor="middle" fill="white">
                  GOLD
                </text>
              </svg>
              <span className="text-xl font-bold text-gray-800 hidden sm:block">Amira Gold Store</span>
            </div>

            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="md:hidden p-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <button
              onClick={() => setShowCart(!showCart)}
              className="relative p-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-yellow-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>

            <div className="flex-1 max-w-2xl">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none text-sm"
                />
                <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="text-xs sm:text-sm text-gray-600 hover:text-gray-800 font-medium whitespace-nowrap"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col md:flex-row gap-4 md:gap-8">
          <aside className="hidden md:block w-64 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-800">Categories</h3>
              </div>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                      selectedCategory === category
                        ? "bg-yellow-100 text-yellow-700 font-medium"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <div className="mt-6">
                <h3 className="font-semibold text-gray-800 mb-4">Sort By</h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none"
                >
                  <option value="featured">Featured</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="reviews">Most Reviews</option>
                </select>
              </div>
            </div>
          </aside>

          {/* Mobile Sidebar */}
          {showMobileFilters && (
            <>
              <div
                className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                onClick={() => setShowMobileFilters(false)}
              />
              <aside className="fixed inset-y-0 left-0 w-64 bg-white z-50 md:hidden shadow-xl">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-800">Categories</h3>
                    <button
                      onClick={() => setShowMobileFilters(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <button
                        key={category}
                        onClick={() => {
                          setSelectedCategory(category);
                          setShowMobileFilters(false);
                        }}
                        className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                          selectedCategory === category
                            ? "bg-yellow-100 text-yellow-700 font-medium"
                            : "text-gray-600 hover:bg-gray-100"
                        }`}
                      >
                        {category}
                      </button>
                    ))}
                  </div>

                  <div className="mt-6">
                    <h3 className="font-semibold text-gray-800 mb-4">Sort By</h3>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 outline-none"
                    >
                      <option value="featured">Featured</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Highest Rated</option>
                      <option value="reviews">Most Reviews</option>
                    </select>
                  </div>
                </div>
              </aside>
            </>
          )}

          <div className="flex-1">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                {selectedCategory === "All" ? "All Products" : selectedCategory}
              </h1>
              <p className="text-gray-600">
                {filteredProducts.length} products found
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-48 object-cover cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => setPreviewImage(product.image)}
                    />
                    {product.originalPrice && (
                      <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                        {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        {product.category}
                      </span>
                      {product.freeShipping && (
                        <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">
                          Free Shipping
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`h-4 w-4 ${i < Math.floor(product.rating) ? "text-yellow-400" : "text-gray-300"}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">({product.reviews})</span>
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <span className="text-lg font-bold text-gray-800">
                          ${product.price.toFixed(2)}
                        </span>
                        {product.originalPrice && (
                          <span className="text-sm text-gray-500 line-through ml-2">
                            ${product.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => addToCart(product)}
                      disabled={!product.inStock}
                      className="w-full py-2 bg-yellow-600 text-white font-medium rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {product.inStock ? "Add to Cart" : "Out of Stock"}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <div className="text-6xl mb-4">🔍</div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  No Products Found
                </h2>
                <p className="text-gray-600">
                  Try adjusting your search or filters to find what you're looking for.
                </p>
              </div>
            )}
          </div>
        </div>

        {showCart && (
          <div className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-xl z-50 overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-800">Shopping Cart</h2>
                <button
                  onClick={() => setShowCart(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🛒</div>
                  <p className="text-gray-600">Your cart is empty</p>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {cart.map((item) => (
                      <div key={item.id} className="flex gap-4 border-b border-gray-200 pb-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-800 text-sm mb-1">
                            {item.name}
                          </h4>
                          <p className="text-yellow-600 font-semibold">
                            ${item.price.toFixed(2)}
                          </p>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-sm text-red-600 hover:text-red-700 mt-1"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between mb-4">
                      <span className="font-semibold text-gray-800">Total</span>
                      <span className="font-bold text-xl text-gray-800">
                        ${cartTotal.toFixed(2)}
                      </span>
                    </div>
                    <button
                      onClick={handleCheckout}
                      disabled={loading || cart.length === 0}
                      className="w-full py-3 bg-yellow-600 text-white font-medium rounded-lg hover:bg-yellow-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {loading ? "Processing..." : "Checkout"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {showCart && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setShowCart(false)}
          />
        )}

        {previewImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
            onClick={() => setPreviewImage(null)}
          >
            <div className="relative" onClick={(e) => e.stopPropagation()}>
              <button
                onClick={() => setPreviewImage(null)}
                className="absolute top-2 right-2 bg-pink-500 text-white px-3 py-1 rounded-lg hover:bg-pink-600 transition-colors z-10 font-medium"
              >
                close
              </button>
              <img
                src={previewImage}
                alt="Preview"
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <div className="text-center text-sm text-gray-500">
            <p>&copy; 2026 Amira Gold Store. All rights reserved.</p>
            <p className="mt-2">
              Your trusted destination for premium gold bars and fine jewelry.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}