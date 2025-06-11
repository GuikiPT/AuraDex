# AuraDex - Comprehensive Pokémon Database

A modern, feature-rich Pokédex built with Next.js 15, TypeScript, and Tailwind CSS. Explore the world of Pokémon with comprehensive data, beautiful UI, and powerful search capabilities.

![Next.js](https://img.shields.io/badge/Next.js-15.3.3-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-cyan)

## ✨ Features

### 🔍 **Pokemon Discovery**
- **Pokemon List**: Browse all Pokémon with grid and list view options
- **Advanced Search**: Search by name, number, or type with real-time suggestions
- **Smart Filtering**: Filter by type and generation
- **Infinite Scroll**: Load more Pokémon seamlessly

### 📊 **Comprehensive Pokemon Data**
- **Description**: Official Pokémon descriptions and genus information
- **Official Artwork**: High-quality official artwork from PokéAPI
- **Pokédex Data**: Height, weight, base experience, and capture rate
- **Base Stats**: Interactive stat charts with color-coded values
- **Type Defenses**: Complete type effectiveness chart
- **Abilities**: Normal and hidden abilities

### 🧬 **Training & Breeding**
- **Training Data**: Growth rates, base experience, and effort values
- **Breeding Information**: Egg groups, gender ratios, egg cycles
- **Base Happiness**: Friendship and happiness values

### 🔄 **Evolution System**
- **Evolution Charts**: Complete evolution chains with requirements
- **Evolution Methods**: Level-up, stones, trading, and special conditions
- **Visual Evolution Tree**: Interactive evolution flow

### 🎮 **Moves & Combat**
- **Level-up Moves**: Moves learned by leveling up
- **TM/TR Moves**: Technical and Technical Record moves
- **Egg Moves**: Moves learned through breeding
- **Move Details**: Type, power, accuracy, and effects

### 🏷️ **Pokédex Entries**
- **Generation Data**: Pokédex entries by generation
- **Version Differences**: Different descriptions across games
- **Regional Information**: Habitat and regional data

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd auradex
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Built With

- **[Next.js 15](https://nextjs.org/)** - React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Tailwind CSS](https://tailwindcss.com/)** - Utility-first CSS framework
- **[PokéAPI](https://pokeapi.co/)** - Comprehensive Pokémon data
- **[Axios](https://axios-http.com/)** - HTTP client for API requests
- **[Lucide React](https://lucide.dev/)** - Beautiful icons

## 📁 Project Structure

```
src/
├── app/                 # Next.js App Router
│   ├── layout.tsx      # Root layout with metadata
│   ├── page.tsx        # Home page (Pokemon list)
│   └── pokemon/[id]/   # Dynamic Pokemon detail pages
├── components/         # Reusable React components
│   ├── PokemonList.tsx     # Main Pokemon grid/list
│   ├── PokemonDetail.tsx   # Detailed Pokemon page
│   ├── SearchBar.tsx       # Advanced search component
│   ├── TypeBadge.tsx       # Pokemon type badges
│   ├── StatChart.tsx       # Interactive stat visualization
│   └── ErrorBoundary.tsx   # Error handling
├── types/              # TypeScript type definitions
│   └── pokemon.ts      # Pokemon API types
├── utils/              # Utility functions
│   └── pokemon-api.ts  # API client and helpers
└── constants/          # Application constants
    └── pokemon.ts      # Pokemon types, colors, etc.
```

## 🎨 Key Features Explained

### Advanced Type System
Complete TypeScript definitions for all PokéAPI responses, ensuring type safety throughout the application.

### Responsive Design
Fully responsive design that works beautifully on desktop, tablet, and mobile devices.

### Performance Optimized
- Image optimization with Next.js Image component
- Lazy loading for Pokemon sprites
- Efficient API caching
- Static generation for popular Pokemon

### Error Handling
Comprehensive error boundaries and fallbacks for network issues or missing data.

### Accessibility
- Semantic HTML structure
- Keyboard navigation support
- Screen reader friendly
- High contrast color schemes

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🌟 Future Enhancements

- [ ] Pokemon comparison tool
- [ ] Team builder
- [ ] Favorite Pokemon system
- [ ] Advanced battle calculator
- [ ] Pokemon location maps
- [ ] Shiny Pokemon variants
- [ ] Audio for Pokemon cries
- [ ] Progressive Web App (PWA) support

## 📝 API Usage

This project uses the [PokéAPI](https://pokeapi.co/) which provides:
- 1000+ Pokemon with complete data
- Type effectiveness calculations
- Evolution chains and requirements
- Move data and descriptions
- High-quality official artwork

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [PokéAPI](https://pokeapi.co/) for the comprehensive Pokemon data
- [The Pokémon Company](https://www.pokemon.com/) for the amazing Pokemon universe
- [Next.js Team](https://nextjs.org/) for the excellent React framework

---

**Built with ❤️ for Pokemon fans everywhere!**
