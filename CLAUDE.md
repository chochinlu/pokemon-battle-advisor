# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server (http://localhost:3000)
- `npm run build` - Build production version
- `npm run start` - Start production server
- `npm run lint` - Run ESLint for code quality checks

## Project Architecture

This is a Next.js 15 Pokemon battle advisor application with a client-side React interface. The app helps users build Pokemon teams and analyze battle strategies.

### Core Structure

The application follows a two-phase workflow:
1. **Team Selection Phase**: Users select 3 Pokemon from a searchable database
2. **Battle Analysis Phase**: System analyzes team composition and provides strategic recommendations

### Key Components

- **src/app/page.tsx**: Main application orchestrator managing state transitions between team selection and battle analysis
- **src/components/TeamSelection.tsx**: Team building interface with 3 Pokemon slots
- **src/components/BattleAnalysis.tsx**: Analysis display showing team strengths and tactical recommendations
- **src/components/PokemonSlot.tsx**: Individual Pokemon selection interface with search functionality
- **src/components/PokemonCard.tsx**: Reusable Pokemon display component

### Data Layer

- **src/data/pokemon.ts**: Pokemon data access layer with type color mappings for both Chinese and English types
- **src/lib/pokemon_data_cleaned.json**: Cleaned Pokemon dataset with standardized structure
- **src/lib/pokemon-utils.ts**: Utility functions for type translations (Chinese ↔ English) and data conversion
- **src/types/pokemon.ts**: TypeScript definitions for Pokemon entities and component props

### API Layer

- **src/app/api/advisor/route.ts**: Next.js API route for battle analysis
  - Analyzes team weaknesses and resistances
  - Identifies major threats based on type matchups
  - Provides replacement Pokemon suggestions
  - Uses Chinese-English type translation for processing

### UI Framework

- Uses shadcn/ui components (Button, Card, Badge, Input)
- Tailwind CSS for styling with dark theme
- Lucide React for icons
- Responsive design with mobile-first approach

### Type System

Pokemon types are handled bilingually:
- Chinese types: 火, 水, 草, 電, 毒, 地面, 飛行, 蟲, 岩石, 鋼, 冰, 格鬥, 超能力, 妖精, 幽靈, 惡, 龍
- English types: Fire, Water, Grass, Electric, Poison, Ground, Flying, Bug, Rock, Steel, Ice, Fighting, Psychic, Fairy, Ghost, Dark, Dragon

### Data Scripts

- **scripts/convert-pokemon-data.js**: Converts raw Pokemon data to standardized format
- Located in project root, processes data from Chinese format to English-compatible structure

## Development Notes

- Application uses client-side rendering (`"use client"`)
- Pokemon data is statically imported and processed at build time
- Search functionality supports both Chinese and English Pokemon names
- Type effectiveness calculations use simplified type chart focusing on double damage relationships
- Image URLs use official Pokemon artwork from PokeAPI sprites repository