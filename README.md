# Metamon

A fully onchain virtual pet game bringing the nostalgic 90s Tamagotchi experience to Web3.

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