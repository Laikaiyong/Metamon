
# 🐲 Metamon - A Fully Onchain Virtual Pet Game

Metamon is a **fully onchain virtual pet game**, bringing the nostalgic **90s Tamagotchi** experience to Web3. Every interaction, pet state, and evolution process is stored and executed **directly on the blockchain**, ensuring **true ownership** and decentralization.

## 🚀 Features

### 🔗 **Onchain Pet Ownership & Management**
- Every **Metamon is fully onchain** with states (hunger, happiness, hygiene, energy) stored on **World Engine (ECS)**.
- Uses **Argus Labs’ onchain infrastructure** for **persistent pet state management**.
- **Smart contracts** handle pet attributes, evolution logic, and interactions.

### 🎮 **Fully Onchain Interactions**
- Actions like **feeding, washing, playing, and evolving** are recorded **onchain**, ensuring tamper-proof gameplay.
- **Backend: Nakama (Heroic Labs)** for authentication, multiplayer interactions, and user management.

### 💰 **Economy & Tokenization**
- **$META Token Integration**: Players use **$META** to buy food, wash items, and hatch eggs.
- **MetaSwap**: Seamless in-game **USDC to $META conversion** for an immersive onchain economy.
- **Onchain item transactions** ensure a decentralized **marketplace** for in-game assets.

### 🥚 **Decentralized Pet Hatching (Onchain Egg Mechanism)**
- Players can **purchase, hatch, and collect eggs** of varying rarities (**Common, Rare, Epic, Legendary**).
- **Hatching uses an onchain randomization mechanism**, ensuring **provably fair results**.
- **Minted NFTs**: Each hatched pet is **directly minted** to the player’s wallet.

### ⏳ **Tamagotchi-Like Lifecycle with Onchain Evolution**
- Pets **decay over time** (hunger increases, hygiene decreases, happiness fluctuates).
- When **happiness reaches 100%**, pets **evolve** into stronger forms **onchain**.
- **Evolution unlocks** new **appearances, attributes, and abilities**.

### 🎲 **Mini-Games & Onchain Game Logic**
- **Mini-games** (e.g., **Memory Card Game, Catch the Falling Items**) **increase pet happiness**.
- Completing a mini-game **updates pet states onchain**, impacting **evolution and growth**.
- **Argus Labs’ infrastructure** ensures **onchain state updates** for game mechanics.


## Setup

1. Clone the repository
```bash
git clone https://github.com/yourusername/metamon.git
cd metamon
```

2. Install dependencies
```bash
npm install
```

3. Configure environment variables
```bash
cp .env.example .env
# Edit .env with your settings
```

4. Run development server
```bash
npm run dev
```

## Project Structure

```
metamon/
├── contracts/     # Smart contracts
├── src/
│   ├── components/   # React components
│   ├── hooks/       # Custom hooks
│   ├── utils/       # Helper functions
│   └── pages/       # Page components
├── public/       # Static assets
└── test/         # Test files
```

## Key Features

- **Onchain Pet System**: Autonomous pet agents using World Engine
- **Pet Care Mechanics**: Feeding, playing, cleaning interactions
- **Evolution System**: Real-time aging and state transitions
- **Virtual Economy**: In-game items and breeding mechanics

## Technical Stack

- **Smart Contracts**: World Engine (ECS)
- **Frontend**: React
- **Testing**: Hardhat/Foundry
- **Blockchain**: Ethereum/L2

## Partner Technologies

### ArgusLab Integration
- Utilizing ArgusLab's AI capabilities for pet behavior modeling
- Implementing predictive analytics for pet state transitions
- Real-time monitoring and analytics dashboard

### Nakama Backend
- User authentication and account management
- Leaderboard and social features implementation
- Real-time multiplayer interactions
- Data persistence and state management

## Requirements

- Node.js 16+
- MetaMask or compatible Web3 wallet
- Modern web browser

## Contributing

1. Fork the repository
2. Create feature branch
3. Submit pull request

## License

MIT
