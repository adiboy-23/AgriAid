# 🌱 AgriAid - Empowering Agricultural Communities

[![Expo](https://img.shields.io/badge/Expo-000000?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Zustand](https://img.shields.io/badge/Zustand-764ABC?style=for-the-badge&logo=redux&logoColor=white)](https://github.com/pmndrs/zustand)

> **Revolutionizing agricultural assistance through technology, community, and blockchain innovation**

## 📱 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Screenshots](#-screenshots)
- [Tech Stack](#-tech-stack)
- [Installation](#-installation)
- [Usage](#-usage)
- [Architecture](#-architecture)
- [Contributing](#-contributing)
- [License](#-license)

## 🌟 Overview

AgriAid is a comprehensive mobile application designed to bridge the gap between agricultural surplus and need, while providing innovative solutions for farmers, communities, and organizations. The app leverages modern technology including blockchain integration, real-time location services, and community-driven features to create a sustainable agricultural ecosystem.

### 🎯 Mission
To create a world where no food goes to waste and every community has access to the agricultural resources they need through technology-driven solutions and community collaboration.

### 🚀 Vision
Become the leading platform for agricultural resource management, community building, and sustainable food distribution across the globe.

## ✨ Features

### 🍎 Food Hub
- **Surplus Management**: Share excess food with those in need
- **Need Requests**: Request specific food items for communities
- **Real-time Matching**: AI-powered matching system for optimal distribution
- **Location Services**: GPS-based proximity matching
- **Urgency Levels**: Priority-based food distribution system

### 💎 Crypto Donations
- **Multi-Currency Support**: ETH, BTC, USDC, MATIC
- **Transparent Tracking**: Blockchain-verified donation history
- **Campaign Management**: Structured fundraising for agricultural projects
- **Token Rewards**: Earn tokens for charitable contributions
- **Real-time Progress**: Live donation tracking and updates

### 🔍 Smart Scanner
- **Crop Analysis**: AI-powered plant identification and health assessment
- **Disease Detection**: Early warning system for crop diseases
- **Growth Monitoring**: Track plant development over time
- **Expert Recommendations**: Professional agricultural advice

### 💼 Job Marketplace
- **Seasonal Opportunities**: Agricultural work throughout the year
- **Skill Matching**: Connect workers with appropriate tasks
- **Community Building**: Local agricultural workforce development
- **Fair Compensation**: Transparent pricing and payment systems

### 📊 Impact Dashboard
- **Meals Saved**: Track food waste reduction
- **Community Impact**: Measure local agricultural improvements
- **Environmental Stats**: Carbon footprint reduction metrics
- **Economic Benefits**: Financial impact on communities

### 🎁 Reward System
- **Token Economy**: Earn and spend tokens for contributions
- **Achievement Badges**: Gamified community participation
- **Exclusive Benefits**: Access to premium features and services
- **Community Recognition**: Public acknowledgment of contributions

## 📸 Screenshots

> *Screenshots will be added here once the app is fully deployed*

## 🛠 Tech Stack

### Frontend
- **React Native**: Cross-platform mobile development
- **Expo**: Development platform and build tools
- **TypeScript**: Type-safe JavaScript development
- **React Navigation**: Screen navigation and routing

### State Management
- **Zustand**: Lightweight state management
- **AsyncStorage**: Local data persistence
- **Context API**: React context for global state

### UI/UX
- **React Native Elements**: Component library
- **Lucide React Native**: Icon system
- **Linear Gradient**: Beautiful gradient backgrounds
- **Custom Components**: Tailored UI components

### Backend & Services
- **Expo Location**: GPS and location services
- **Expo Camera**: Camera and scanning capabilities
- **Blockchain Integration**: Cryptocurrency donations
- **Real-time Updates**: Live data synchronization

### Development Tools
- **Expo CLI**: Development and build tools
- **Metro Bundler**: JavaScript bundler
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting

## 🚀 Installation

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn package manager
- Expo CLI (`npm install -g @expo/cli`)
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/adiboy-23/AgriAid.git
   cd AgriAid
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm start
   # or
   expo start
   ```

4. **Run on device/simulator**
   - Scan QR code with Expo Go app
   - Press `i` for iOS simulator
   - Press `a` for Android emulator
   - Press `w` for web development

### Environment Setup

1. **iOS Development**
   ```bash
   npx expo run:ios
   ```

2. **Android Development**
   ```bash
   npx expo run:android
   ```

3. **Web Development**
   ```bash
   npx expo start --web
   ```

## 📱 Usage

### Getting Started

1. **Launch the App**: Open AgriAid on your mobile device
2. **Grant Permissions**: Allow location and camera access for full functionality
3. **Create Account**: Sign up to access all features
4. **Explore Features**: Navigate through different tabs and discover capabilities

### Food Hub Usage

1. **Share Surplus Food**
   - Tap the "+" button in Food Hub
   - Fill in food details (type, quantity, location)
   - Set urgency level and contact information
   - Post listing for community access

2. **Request Food Help**
   - Switch to "Food Needed" tab
   - Create detailed requests for specific items
   - Connect with donors through the platform
   - Coordinate pickup or delivery

3. **Make Crypto Donations**
   - Navigate to "Donations" tab
   - Browse available campaigns
   - Select amount and cryptocurrency
   - Complete blockchain transaction
   - Earn tokens for contributions

### Scanner Usage

1. **Crop Analysis**
   - Point camera at plants
   - Capture clear images
   - Receive instant identification
   - Get health assessment and recommendations

2. **Disease Detection**
   - Scan affected plants
   - Identify common diseases
   - Receive treatment suggestions
   - Track recovery progress

### Job Marketplace

1. **Find Opportunities**
   - Browse available positions
   - Filter by location and skills
   - Apply for suitable positions
   - Track application status

2. **Post Jobs**
   - Create detailed job listings
   - Set compensation and requirements
   - Review applications
   - Manage hired workers

## 🏗 Architecture

### Project Structure
```
AgriAid/
├── app/                    # Main application screens
│   ├── (tabs)/            # Tab-based navigation
│   │   ├── index.tsx      # Home screen
│   │   ├── food-hub.tsx   # Food management
│   │   ├── scanner.tsx    # Crop scanning
│   │   ├── jobs.tsx       # Job marketplace
│   │   └── impact.tsx     # Impact dashboard
│   ├── _layout.tsx        # Root layout
│   └── +not-found.tsx     # 404 page
├── store/                  # State management
│   └── app-store.ts       # Zustand store
├── components/             # Reusable components
├── utils/                  # Utility functions
├── types/                  # TypeScript definitions
├── assets/                 # Images and static files
├── app.json               # Expo configuration
├── package.json           # Dependencies
└── tsconfig.json         # TypeScript configuration
```

### State Management
- **Zustand Store**: Centralized state management
- **Async Persistence**: Local data storage
- **Real-time Updates**: Live data synchronization
- **Offline Support**: Basic functionality without internet

### Data Flow
1. **User Input** → Component State
2. **Component State** → Zustand Store
3. **Store Updates** → AsyncStorage
4. **Data Persistence** → App Reload

## 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

### Contribution Guidelines

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Test thoroughly**
5. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
6. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Development Standards

- **Code Style**: Follow existing TypeScript/React Native patterns
- **Testing**: Ensure all new features are tested
- **Documentation**: Update README and code comments
- **Performance**: Optimize for mobile devices
- **Accessibility**: Ensure inclusive design

### Areas for Contribution

- **UI/UX Improvements**: Better designs and animations
- **Performance Optimization**: Faster loading and smoother interactions
- **New Features**: Additional agricultural tools
- **Testing**: Unit and integration tests
- **Documentation**: Better guides and examples
- **Localization**: Multi-language support

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Expo Team**: For the amazing development platform
- **React Native Community**: For continuous improvements
- **Agricultural Experts**: For domain knowledge and guidance
- **Open Source Contributors**: For the tools and libraries that make this possible

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/adiboy-23/AgriAid/issues)
- **Discussions**: [GitHub Discussions](https://github.com/adiboy-23/AgriAid/discussions)
- **Email**: [Contact Support](mailto:support@agriaid.app)

## 🌍 Community

- **Discord**: [Join our community](https://discord.gg/agriaid)
- **Twitter**: [Follow updates](https://twitter.com/agriaid)
- **LinkedIn**: [Professional network](https://linkedin.com/company/agriaid)

---

<div align="center">

**Made with ❤️ for the agricultural community**

[![GitHub stars](https://img.shields.io/github/stars/adiboy-23/AgriAid?style=social)](https://github.com/adiboy-23/AgriAid/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/adiboy-23/AgriAid?style=social)](https://github.com/adiboy-23/AgriAid/network)
[![GitHub issues](https://img.shields.io/github/issues/adiboy-23/AgriAid)](https://github.com/adiboy-23/AgriAid/issues)
[![GitHub pull requests](https://img.shields.io/github/issues-pr/adiboy-23/AgriAid)](https://github.com/adiboy-23/AgriAid/pulls)

</div>
