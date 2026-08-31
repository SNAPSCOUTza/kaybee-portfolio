export interface ClientLogo {
  id: string;
  name: string;
  image: string;
  large?: boolean;
}

export const clientLogos: ClientLogo[] = [
  { id: "mini", name: "Mini", image: "/assets/img/clients/logos/mini.png" },
  { id: "playstation", name: "PlayStation", image: "/assets/img/clients/logos/playstation.png" },
  { id: "stella-artois", name: "Stella Artois", image: "/assets/img/clients/logos/stella-artois.png" },
  { id: "johnnie-walker", name: "Johnnie Walker", image: "/assets/img/clients/logos/johnnie-walker.png" },
  { id: "nyt", name: "The New York Times", image: "/assets/img/clients/logos/nyt.png" },
  { id: "les-creatifs", name: "Les Créatifs", image: "/assets/img/clients/logos/les-creatifs.png", large: true },
  { id: "michelin", name: "Michelin", image: "/assets/img/clients/logos/michelin.png" },
  { id: "bmw", name: "BMW", image: "/assets/img/clients/logos/bmw.png" },
  { id: "absa", name: "Absa", image: "/assets/img/clients/logos/absa.png" },
  { id: "pharoah", name: "Pharoah Auto Investments", image: "/assets/img/clients/logos/pharoah.png" }
];
